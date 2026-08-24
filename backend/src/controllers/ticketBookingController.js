import asyncHandler from 'express-async-handler';
import TicketBooking from '../models/TicketBooking.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc  Create a ticket/transportation/service booking
// @route POST /api/ticket-bookings
// @access Private/Customer
export const createTicketBooking = asyncHandler(async (req, res) => {
  const {
    bookingType = 'transportation',
    transportType = 'buses',
    itemTitle,
    fromCity,
    toCity,
    destination,
    travelDate,
    returnDate,
    selectedOption,
    travellersCount = 1,
    passengers = [],
    contactName,
    contactPhone,
    contactEmail,
    totalAmount,
    specialNotes,
    pickupLocation,
    dropLocation,
    image,
    agencyId,
  } = req.body;

  let assignedAgency = agencyId;
  if (!assignedAgency) {
    const firstAgency = await User.findOne({ role: 'agency', agencyStatus: 'approved' });
    if (firstAgency) assignedAgency = firstAgency._id;
  }

  const booking = await TicketBooking.create({
    customer: req.user._id,
    agency: assignedAgency,
    bookingType,
    transportType,
    itemTitle: itemTitle || `${bookingType.toUpperCase()} Booking to ${destination || toCity}`,
    fromCity: fromCity || '',
    toCity: toCity || '',
    destination: destination || toCity || 'India',
    travelDate: travelDate ? new Date(travelDate) : new Date(),
    returnDate: returnDate ? new Date(returnDate) : undefined,
    selectedOption: selectedOption || 'Standard',
    travellersCount: Number(travellersCount) || 1,
    passengers,
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

  // Create notifications
  await Notification.create({
    user: req.user._id,
    title: 'Ticket Reserved',
    message: `Your booking for "${booking.itemTitle}" has been confirmed. Ref: ${booking.bookingReference}`,
    type: 'booking',
  });

  if (assignedAgency) {
    await Notification.create({
      user: assignedAgency,
      title: 'New Ticket Booking',
      message: `A new ticket booking for "${booking.itemTitle}" was placed by ${req.user.name}.`,
      type: 'booking',
    });
  }

  res.status(201).json({ success: true, data: booking });
});

// @desc  Get logged-in customer's ticket bookings
// @route GET /api/ticket-bookings/my
// @access Private/Customer
export const getMyTicketBookings = asyncHandler(async (req, res) => {
  const bookings = await TicketBooking.find({ customer: req.user._id })
    .populate('agency', 'name agencyName email phone')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc  Get agency's ticket bookings
// @route GET /api/ticket-bookings/agency
// @access Private/Agency
export const getAgencyTicketBookings = asyncHandler(async (req, res) => {
  const bookings = await TicketBooking.find({ agency: req.user._id })
    .populate('customer', 'name email phone')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc  Cancel ticket booking
// @route PUT /api/ticket-bookings/:id/cancel
// @access Private/Customer
export const cancelTicketBooking = asyncHandler(async (req, res) => {
  const booking = await TicketBooking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.customer) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by customer';
  await booking.save();

  res.json({ success: true, data: booking, message: 'Ticket booking cancelled successfully.' });
});

// @desc  Agency/Admin respond to ticket booking
// @route PUT /api/ticket-bookings/:id/respond
// @access Private/Agency or Admin
export const respondToTicketBooking = asyncHandler(async (req, res) => {
  const { status, action } = req.body;
  const booking = await TicketBooking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const newStatus = status || (action === 'approve' ? 'confirmed' : action === 'reject' ? 'rejected' : 'confirmed');
  booking.status = newStatus;
  await booking.save();

  res.json({ success: true, data: booking });
});
