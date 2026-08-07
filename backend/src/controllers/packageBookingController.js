import asyncHandler from 'express-async-handler';
import PackageBooking from '../models/PackageBooking.js';
import Package from '../models/Package.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

// @desc  Book a tour package
// @route POST /api/package-bookings
// @access Private/Customer
export const createPackageBooking = asyncHandler(async (req, res) => {
  const { packageId, travelDate, travellers = [], seatsBooked, contactPhone, contactEmail, couponCode } = req.body;

  const pkg = await Package.findById(packageId);
  if (!pkg || pkg.status !== 'approved' || !pkg.isActive) {
    res.status(404);
    throw new Error('Package not available');
  }
  if (pkg.availableSeats < seatsBooked) {
    res.status(400);
    throw new Error(`Only ${pkg.availableSeats} seats available`);
  }

  const perSeatPrice = pkg.discountPrice || pkg.price;
  const subtotal = perSeatPrice * seatsBooked;

  let discountApplied = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isValidNow() && ['package', 'both'].includes(coupon.applicableTo) && subtotal >= coupon.minOrderAmount) {
      discountApplied = coupon.discountType === 'percent'
        ? Math.min(subtotal * (coupon.discountValue / 100), coupon.maxDiscount || Infinity)
        : coupon.discountValue;
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const totalAmount = Math.round(subtotal - discountApplied);

  const booking = await PackageBooking.create({
    customer: req.user._id,
    package: pkg._id,
    agency: pkg.agency,
    travelDate,
    travellers,
    seatsBooked,
    contactPhone,
    contactEmail,
    totalAmount,
    couponCode,
    discountApplied,
    status: 'pending_payment',
  });

  // Tentatively hold seats; payment confirmation finalizes, cancellation releases
  pkg.availableSeats -= seatsBooked;
  await pkg.save();

  res.status(201).json({ success: true, data: booking });
});

// @desc  Get logged-in customer's package bookings
// @route GET /api/package-bookings/my
// @access Private/Customer
export const getMyPackageBookings = asyncHandler(async (req, res) => {
  const bookings = await PackageBooking.find({ customer: req.user._id })
    .populate('package', 'title images destination')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc  Agency: get bookings for their packages
// @route GET /api/package-bookings/agency
// @access Private/Agency
export const getAgencyPackageBookings = asyncHandler(async (req, res) => {
  const bookings = await PackageBooking.find({ agency: req.user._id })
    .populate('package', 'title destination')
    .populate('customer', 'name email phone')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc  Agency: approve or reject a booking
// @route PUT /api/package-bookings/:id/respond
// @access Private/Agency
export const respondToPackageBooking = asyncHandler(async (req, res) => {
  const { action } = req.body;
  const booking = await PackageBooking.findById(req.params.id).populate('package', 'title');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.agency) !== String(req.user._id)) {
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
    await Package.findByIdAndUpdate(booking.package._id, { $inc: { availableSeats: booking.seatsBooked } });
  }
  await booking.save();

  await Notification.create({
    user: booking.customer,
    title: `Booking ${booking.status}`,
    message: `Your booking for "${booking.package.title}" was ${booking.status}.`,
    type: 'booking',
    link: `/dashboard/bookings/${booking._id}`,
  });

  await sendEmail({
    to: booking.contactEmail,
    subject: `Booking ${booking.status} - ${booking.package.title}`,
    text: `Your booking reference ${booking.bookingReference} has been ${booking.status}.`,
  });

  res.json({ success: true, data: booking });
});

// @desc  Cancel a package booking
// @route PUT /api/package-bookings/:id/cancel
// @access Private/Customer
export const cancelPackageBooking = asyncHandler(async (req, res) => {
  const booking = await PackageBooking.findById(req.params.id);
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

  await Package.findByIdAndUpdate(booking.package, { $inc: { availableSeats: booking.seatsBooked } });

  res.json({ success: true, data: booking, message: 'Booking cancelled.' });
});
