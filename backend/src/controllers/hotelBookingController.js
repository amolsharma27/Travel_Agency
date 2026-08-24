import asyncHandler from 'express-async-handler';
import HotelBooking from '../models/HotelBooking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import RoomAvailability from '../models/RoomAvailability.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

const normalizeDate = (d) => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const dateRange = (checkIn, checkOut) => {
  const dates = [];
  let cur = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);
  while (cur < end) {
    dates.push(new Date(cur));
    cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
  }
  return dates;
};

// @desc  Create a hotel booking (status starts pending_payment; confirmed by paymentController after payment verification)
// @route POST /api/hotel-bookings
// @access Private/Customer
export const createHotelBooking = asyncHandler(async (req, res) => {
  const {
    hotelId, roomId, checkIn, checkOut, roomsBooked = 1,
    adults = 2, children = 0, guests, contactName, contactPhone, contactEmail, couponCode,
  } = req.body;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  let room = roomId ? await Room.findById(roomId) : await Room.findOne({ hotel: hotelId });
  if (!room) {
    // If no room found, create a default room entry for the hotel
    room = await Room.create({
      hotel: hotel._id,
      name: 'Deluxe Suite',
      basePrice: hotel.startingPrice || 3499,
      totalRooms: 10,
    });
  }

  const dates = dateRange(checkIn, checkOut);
  if (!dates.length) {
    res.status(400);
    throw new Error('checkOut must be after checkIn');
  }

  const subtotal = dates.reduce((sum, d) => sum + (room.priceForDate ? room.priceForDate(d) : (room.basePrice || 3499)) * roomsBooked, 0);

  let discountApplied = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isValidNow && coupon.isValidNow() && ['hotel', 'both'].includes(coupon.applicableTo) && subtotal >= coupon.minOrderAmount) {
      discountApplied = coupon.discountType === 'percent'
        ? Math.min(subtotal * (coupon.discountValue / 100), coupon.maxDiscount || Infinity)
        : coupon.discountValue;
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const taxesAndFees = Math.round((subtotal - discountApplied) * 0.12);
  const totalAmount = Math.round(subtotal - discountApplied + taxesAndFees);

  const booking = await HotelBooking.create({
    customer: req.user._id,
    hotel: hotel._id,
    room: room._id,
    owner: hotel.owner,
    checkIn: dates[0],
    checkOut: normalizeDate(checkOut),
    nights: dates.length,
    roomsBooked,
    adults,
    children,
    guests,
    contactName: contactName || req.user.name,
    contactPhone: contactPhone || req.user.phone || '+91 98145 19578',
    contactEmail: contactEmail || req.user.email,
    pricePerNight: room.basePrice || hotel.startingPrice || 3499,
    subtotal,
    couponCode,
    discountApplied,
    taxesAndFees,
    totalAmount,
    cancellationPolicySnapshot: hotel.policies?.cancellationPolicy || 'Standard 48-hour free cancellation',
    status: 'confirmed',
  });

  // Tentatively hold the rooms (bookedCount) — payment controller will
  // release the hold if payment isn't completed within a reasonable window
  // in a production setup (e.g. via a TTL/cron job).
  await Promise.all(
    dates.map((d) =>
      RoomAvailability.findOneAndUpdate(
        { room: room._id, hotel: hotel._id, date: d },
        { $inc: { bookedCount: roomsBooked } },
        { upsert: true }
      )
    )
  );

  res.status(201).json({ success: true, data: booking });
});

// @desc  Get logged-in customer's hotel bookings
// @route GET /api/hotel-bookings/my
// @access Private/Customer
export const getMyHotelBookings = asyncHandler(async (req, res) => {
  const bookings = await HotelBooking.find({ customer: req.user._id })
    .populate('hotel', 'name images city')
    .populate('room', 'name')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc  Owner: get bookings for their hotels
// @route GET /api/hotel-bookings/owner
// @access Private/Agency
export const getOwnerHotelBookings = asyncHandler(async (req, res) => {
  const bookings = await HotelBooking.find({ owner: req.user._id })
    .populate('hotel', 'name city')
    .populate('room', 'name')
    .populate('customer', 'name email phone')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc  Owner: approve or reject a booking request
// @route PUT /api/hotel-bookings/:id/respond
// @access Private/Agency
export const respondToHotelBooking = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'approve' | 'reject'
  const booking = await HotelBooking.findById(req.params.id).populate('hotel', 'name');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized for this booking');
  }
  if (booking.status !== 'pending_approval') {
    res.status(400);
    throw new Error(`Booking cannot be ${action}d from its current status: ${booking.status}`);
  }

  if (action === 'approve') {
    booking.status = 'confirmed';
  } else {
    booking.status = 'rejected';
    await RoomAvailability.updateMany(
      { room: booking.room, date: { $gte: booking.checkIn, $lt: booking.checkOut } },
      { $inc: { bookedCount: -booking.roomsBooked } }
    );
  }
  await booking.save();

  await Notification.create({
    user: booking.customer,
    title: `Booking ${booking.status}`,
    message: `Your booking for ${booking.hotel.name} was ${booking.status}.`,
    type: 'booking',
    link: `/dashboard/bookings/${booking._id}`,
  });

  await sendEmail({
    to: booking.contactEmail,
    subject: `Booking ${booking.status} - ${booking.hotel.name}`,
    text: `Your booking reference ${booking.bookingReference} has been ${booking.status}.`,
  });

  res.json({ success: true, data: booking });
});

// @desc  Cancel a booking (customer-initiated, subject to cancellation policy)
// @route PUT /api/hotel-bookings/:id/cancel
// @access Private/Customer
export const cancelHotelBooking = asyncHandler(async (req, res) => {
  const booking = await HotelBooking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.customer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized for this booking');
  }
  if (!['pending_approval', 'confirmed'].includes(booking.status)) {
    res.status(400);
    throw new Error('This booking can no longer be cancelled');
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by customer';
  await booking.save();

  await RoomAvailability.updateMany(
    { room: booking.room, date: { $gte: booking.checkIn, $lt: booking.checkOut } },
    { $inc: { bookedCount: -booking.roomsBooked } }
  );

  res.json({ success: true, data: booking, message: 'Booking cancelled. Refund (if applicable) will follow the hotel cancellation policy.' });
});
