import asyncHandler from 'express-async-handler';
import PackageBooking from '../models/PackageBooking.js';
import HotelBooking from '../models/HotelBooking.js';
import TicketBooking from '../models/TicketBooking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

// @desc  Unified booking creation (hotel, package, transportation, activity, passport)
// @route POST /api/bookings
// @access Private
export const createUnifiedBooking = asyncHandler(async (req, res) => {
  const {
    bookingType = 'transportation',
    packageId,
    hotelId,
    roomId,
    travelDate,
    returnDate,
    travellersCount = 1,
    contactPhone,
    contactEmail,
    contactName,
    totalAmount,
    itemTitle,
    destination,
    fromCity,
    toCity,
    selectedOption,
    specialNotes,
    pickupLocation,
    dropLocation,
    image,
    agencyId,
  } = req.body;

  // 1. If it's a package booking
  if (bookingType === 'package' || packageId) {
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      res.status(404);
      throw new Error('Package not found');
    }
    const booking = await PackageBooking.create({
      customer: req.user._id,
      package: pkg._id,
      agency: pkg.agency,
      travelDate: travelDate ? new Date(travelDate) : new Date(),
      seatsBooked: Number(travellersCount) || 1,
      contactPhone: contactPhone || req.user.phone || '+91 98765 43210',
      contactEmail: contactEmail || req.user.email,
      totalAmount: totalAmount || (pkg.discountPrice || pkg.price) * (Number(travellersCount) || 1),
      status: 'confirmed',
    });
    return res.status(201).json({ success: true, data: booking });
  }

  // 2. If it's a hotel booking
  if (bookingType === 'hotel' || hotelId) {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404);
      throw new Error('Hotel not found');
    }
    const checkInDate = travelDate ? new Date(travelDate) : new Date();
    const checkOutDate = returnDate ? new Date(returnDate) : new Date(Date.now() + 86400000 * 2);
    const booking = await HotelBooking.create({
      customer: req.user._id,
      hotel: hotel._id,
      room: roomId || (await import('../models/Room.js')).default.findOne({ hotel: hotel._id }).then(r => r?._id),
      owner: hotel.owner,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: 2,
      roomsBooked: 1,
      adults: Number(travellersCount) || 2,
      contactName: contactName || req.user.name,
      contactPhone: contactPhone || req.user.phone || '+91 98765 43210',
      contactEmail: contactEmail || req.user.email,
      pricePerNight: hotel.startingPrice || 3999,
      subtotal: totalAmount || 7998,
      totalAmount: totalAmount || 7998,
      status: 'confirmed',
    });
    return res.status(201).json({ success: true, data: booking });
  }

  // 3. Otherwise Ticket / Transportation / Activity / Passport booking
  let assignedAgency = agencyId;
  if (!assignedAgency) {
    const defaultAgency = await User.findOne({ role: 'agency', agencyStatus: 'approved' });
    if (defaultAgency) assignedAgency = defaultAgency._id;
  }

  const booking = await TicketBooking.create({
    customer: req.user._id,
    agency: assignedAgency,
    bookingType: bookingType || 'transportation',
    itemTitle: itemTitle || `Booking: ${fromCity || ''} ${toCity ? 'to ' + toCity : destination || 'India'}`,
    destination: destination || toCity || 'India',
    fromCity: fromCity || '',
    toCity: toCity || '',
    travelDate: travelDate ? new Date(travelDate) : new Date(),
    returnDate: returnDate ? new Date(returnDate) : undefined,
    selectedOption: selectedOption || 'Standard',
    travellersCount: Number(travellersCount) || 1,
    contactName: contactName || req.user.name,
    contactPhone: contactPhone || req.user.phone || '+91 98765 43210',
    contactEmail: contactEmail || req.user.email,
    totalAmount: Number(totalAmount) || 2999,
    status: 'confirmed',
    paymentStatus: 'paid',
    specialNotes,
    pickupLocation,
    dropLocation,
    image: image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
  });

  return res.status(201).json({ success: true, data: booking });
});

// @desc  Get logged-in user's all bookings unified
// @route GET /api/bookings/my
// @access Private
export const getMyAllBookings = asyncHandler(async (req, res) => {
  const [packages, hotels, tickets] = await Promise.all([
    PackageBooking.find({ customer: req.user._id }).populate('package').populate('agency', 'name agencyName email phone').sort('-createdAt'),
    HotelBooking.find({ customer: req.user._id }).populate('hotel').populate('room').populate('owner', 'name agencyName email phone').sort('-createdAt'),
    TicketBooking.find({ customer: req.user._id }).populate('agency', 'name agencyName email phone').sort('-createdAt'),
  ]);

  const formatted = [
    ...packages.map(p => ({
      _id: p._id,
      bookingRef: p.bookingReference,
      type: 'package',
      bookingType: 'package',
      itemTitle: p.package?.title || 'Tour Package Booking',
      destination: p.package?.destination || 'India',
      travelDate: p.travelDate,
      bookingDate: p.createdAt,
      guestsCount: p.seatsBooked,
      totalAmount: p.totalAmount,
      status: p.status === 'pending_approval' ? 'pending' : p.status,
      paymentStatus: 'paid',
      image: p.package?.images?.[0] || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
      operator: p.agency?.agencyName || p.agency?.name || 'PCTE Travel Partner',
      agency: p.agency,
      raw: p,
    })),
    ...hotels.map(h => ({
      _id: h._id,
      bookingRef: h.bookingReference,
      type: 'hotel',
      bookingType: 'hotel',
      itemTitle: `${h.hotel?.name || 'Hotel Stay'} (${h.room?.name || 'Deluxe Room'})`,
      destination: h.hotel?.city || 'India',
      travelDate: h.checkIn,
      bookingDate: h.createdAt,
      guestsCount: h.adults + (h.children || 0),
      totalAmount: h.totalAmount,
      status: h.status === 'pending_approval' ? 'pending' : h.status,
      paymentStatus: 'paid',
      image: h.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      operator: h.owner?.agencyName || h.owner?.name || 'PCTE Hotel Partner',
      agency: h.owner,
      raw: h,
    })),
    ...tickets.map(t => ({
      _id: t._id,
      bookingRef: t.bookingReference,
      type: t.bookingType || 'transportation',
      bookingType: t.bookingType || 'transportation',
      itemTitle: t.itemTitle,
      destination: t.destination,
      travelDate: t.travelDate,
      bookingDate: t.createdAt,
      guestsCount: t.travellersCount,
      totalAmount: t.totalAmount,
      status: t.status,
      paymentStatus: t.paymentStatus || 'paid',
      image: t.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      operator: t.agency?.agencyName || t.agency?.name || 'PCTE Mobility Desk',
      agency: t.agency,
      raw: t,
    })),
  ];

  formatted.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

  res.json({ success: true, count: formatted.length, data: formatted });
});

// @desc  Update status or cancel any booking
// @route PUT /api/bookings/:id/status
// @access Private
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, cancellationReason } = req.body;
  const { id } = req.params;

  // Try finding in all 3 models
  let booking = await PackageBooking.findById(id);
  let type = 'package';

  if (!booking) {
    booking = await HotelBooking.findById(id);
    type = 'hotel';
  }
  if (!booking) {
    booking = await TicketBooking.findById(id);
    type = 'ticket';
  }

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (status) booking.status = status;
  if (cancellationReason) booking.cancellationReason = cancellationReason;

  await booking.save();

  res.json({ success: true, data: booking, message: `Booking status updated to ${status || 'updated'}` });
});
