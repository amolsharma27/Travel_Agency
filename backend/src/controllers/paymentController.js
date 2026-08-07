import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import razorpayInstance, { razorpayEnabled } from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import HotelBooking from '../models/HotelBooking.js';
import PackageBooking from '../models/PackageBooking.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

const getBookingAndModel = async (bookingType, bookingId) => {
  if (bookingType === 'hotel') {
    return { Model: HotelBooking, booking: await HotelBooking.findById(bookingId) };
  }
  return { Model: PackageBooking, booking: await PackageBooking.findById(bookingId) };
};

// @desc  Create a Razorpay order for a booking (or a mock order if keys aren't configured)
// @route POST /api/payments/create-order
// @access Private/Customer
export const createOrder = asyncHandler(async (req, res) => {
  const { bookingType, bookingId } = req.body; // bookingType: 'hotel' | 'package'
  if (!['hotel', 'package'].includes(bookingType)) {
    res.status(400);
    throw new Error("bookingType must be 'hotel' or 'package'");
  }

  const { booking } = await getBookingAndModel(bookingType, bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.customer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized for this booking');
  }
  if (booking.status !== 'pending_payment') {
    res.status(400);
    throw new Error('This booking is not awaiting payment');
  }

  const amountInPaise = Math.round(booking.totalAmount * 100);

  let order;
  let isMock = false;

  if (razorpayEnabled) {
    order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: booking.bookingReference,
    });
  } else {
    // Mock order so the full frontend booking + payment UI can be built and
    // tested before real Razorpay keys are available.
    isMock = true;
    order = {
      id: `order_mock_${crypto.randomBytes(8).toString('hex')}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt: booking.bookingReference,
    };
  }

  const payment = await Payment.create({
    user: req.user._id,
    bookingType,
    [bookingType === 'hotel' ? 'hotelBooking' : 'packageBooking']: booking._id,
    amount: booking.totalAmount,
    razorpayOrderId: order.id,
    isMock,
    status: 'created',
  });

  booking.payment = payment._id;
  await booking.save();

  res.json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayEnabled ? process.env.RAZORPAY_KEY_ID : 'mock_key_id',
      isMock,
      paymentDbId: payment._id,
    },
  });
});

// @desc  Verify a completed Razorpay payment and confirm the booking
// @route POST /api/payments/verify
// @access Private/Customer
export const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentDbId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const payment = await Payment.findById(paymentDbId);
  if (!payment) {
    res.status(404);
    throw new Error('Payment record not found');
  }
  if (String(payment.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized for this payment');
  }

  if (payment.isMock) {
    // Dev/sandbox mode: accept without cryptographic verification
    payment.status = 'paid';
    payment.razorpayPaymentId = `pay_mock_${Date.now()}`;
  } else {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      payment.status = 'failed';
      payment.failureReason = 'Signature mismatch';
      await payment.save();
      res.status(400);
      throw new Error('Payment verification failed');
    }

    payment.status = 'paid';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
  }
  await payment.save();

  // Move the booking to pending_approval (agency now reviews it) and notify
  const BookingModel = payment.bookingType === 'hotel' ? HotelBooking : PackageBooking;
  const bookingRef = payment.bookingType === 'hotel' ? payment.hotelBooking : payment.packageBooking;
  const booking = await BookingModel.findById(bookingRef).populate(
    payment.bookingType === 'hotel' ? 'hotel' : 'package',
    'name title'
  );

  booking.status = 'pending_approval';
  await booking.save();

  const itemName = payment.bookingType === 'hotel' ? booking.hotel?.name : booking.package?.title;
  const ownerId = payment.bookingType === 'hotel' ? booking.owner : booking.agency;

  await Notification.create({
    user: ownerId,
    title: 'New booking received',
    message: `A new booking for "${itemName}" is awaiting your approval.`,
    type: 'booking',
  });

  await sendEmail({
    to: req.user.email,
    subject: 'Payment successful - Booking confirmation pending',
    text: `Your payment of ₹${payment.amount} was successful. Booking reference: ${booking.bookingReference}. It is now awaiting confirmation.`,
  });

  res.json({ success: true, data: { payment, booking } });
});

// @desc  Get logged-in user's payment history
// @route GET /api/payments/my
// @access Private
export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, count: payments.length, data: payments });
});
