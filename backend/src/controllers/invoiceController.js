import asyncHandler from 'express-async-handler';
import PDFDocument from 'pdfkit';
import HotelBooking from '../models/HotelBooking.js';
import PackageBooking from '../models/PackageBooking.js';

const drawInvoice = (res, { title, reference, lines, customerName, contactEmail, contactPhone, totalAmount, status }) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${reference}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text('Travel & Stay', { align: 'left' });
  doc.fontSize(10).fillColor('#666').text('Booking Invoice / Receipt', { align: 'left' });
  doc.moveDown();
  doc.strokeColor('#ddd').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc.fillColor('#000').fontSize(14).text(title);
  doc.fontSize(10).fillColor('#666').text(`Booking Reference: ${reference}`);
  doc.text(`Status: ${status}`);
  doc.moveDown();

  doc.fillColor('#000').fontSize(11).text(`Customer: ${customerName}`);
  doc.text(`Email: ${contactEmail}`);
  doc.text(`Phone: ${contactPhone}`);
  doc.moveDown();

  doc.fontSize(12).text('Details', { underline: true });
  doc.moveDown(0.5);
  lines.forEach(([label, value]) => {
    doc.fontSize(10).fillColor('#333').text(`${label}: `, { continued: true }).fillColor('#000').text(String(value));
  });

  doc.moveDown();
  doc.strokeColor('#ddd').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
  doc.fontSize(13).fillColor('#000').text(`Total Paid: ₹${totalAmount}`, { align: 'right' });

  doc.moveDown(2);
  doc.fontSize(8).fillColor('#999').text('This is a system-generated receipt and does not require a signature.', { align: 'center' });

  doc.end();
};

// @desc  Download PDF invoice for a hotel booking
// @route GET /api/invoices/hotel/:id
// @access Private
export const getHotelBookingInvoice = asyncHandler(async (req, res) => {
  const booking = await HotelBooking.findById(req.params.id).populate('hotel', 'name city').populate('room', 'name');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.customer) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  drawInvoice(res, {
    title: `${booking.hotel.name} - ${booking.room.name}`,
    reference: booking.bookingReference,
    customerName: booking.contactName,
    contactEmail: booking.contactEmail,
    contactPhone: booking.contactPhone,
    totalAmount: booking.totalAmount,
    status: booking.status,
    lines: [
      ['Hotel', booking.hotel.name],
      ['City', booking.hotel.city],
      ['Room Type', booking.room.name],
      ['Check-in', booking.checkIn.toDateString()],
      ['Check-out', booking.checkOut.toDateString()],
      ['Nights', booking.nights],
      ['Rooms Booked', booking.roomsBooked],
      ['Guests', `${booking.adults} Adults, ${booking.children} Children`],
      ['Subtotal', `₹${booking.subtotal}`],
      ['Discount', `₹${booking.discountApplied}`],
      ['Taxes & Fees', `₹${booking.taxesAndFees}`],
    ],
  });
});

// @desc  Download PDF invoice for a package booking
// @route GET /api/invoices/package/:id
// @access Private
export const getPackageBookingInvoice = asyncHandler(async (req, res) => {
  const booking = await PackageBooking.findById(req.params.id).populate('package', 'title destination durationDays durationNights');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.customer) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  drawInvoice(res, {
    title: booking.package?.title || 'Tour Package Booking',
    reference: booking.bookingReference,
    customerName: booking.travellers?.[0]?.name || req.user.name || 'Guest',
    contactEmail: booking.contactEmail || req.user.email,
    contactPhone: booking.contactPhone || req.user.phone || '+91 98765 43210',
    totalAmount: booking.totalAmount,
    status: booking.status,
    lines: [
      ['Package', booking.package?.title || 'Tour Package'],
      ['Destination', booking.package?.destination || 'India'],
      ['Duration', `${booking.package?.durationDays || 3}D / ${booking.package?.durationNights || 2}N`],
      ['Travel Date', booking.travelDate ? new Date(booking.travelDate).toDateString() : 'Confirmed'],
      ['Seats Booked', booking.seatsBooked],
      ['Discount Applied', `₹${booking.discountApplied || 0}`],
    ],
  });
});

// @desc  Download PDF invoice for a ticket / transport / activity / passport booking
// @route GET /api/invoices/ticket/:id
// @access Private
export const getTicketBookingInvoice = asyncHandler(async (req, res) => {
  const TicketBooking = (await import('../models/TicketBooking.js')).default;
  const booking = await TicketBooking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (String(booking.customer) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  drawInvoice(res, {
    title: booking.itemTitle,
    reference: booking.bookingReference,
    customerName: booking.contactName || req.user.name,
    contactEmail: booking.contactEmail || req.user.email,
    contactPhone: booking.contactPhone || req.user.phone,
    totalAmount: booking.totalAmount,
    status: booking.status,
    lines: [
      ['Service Item', booking.itemTitle],
      ['Category', booking.bookingType ? booking.bookingType.toUpperCase() : 'TRANSPORTATION'],
      ['Destination', booking.destination],
      ['Option / Class', booking.selectedOption || 'Standard'],
      ['Travel Date', booking.travelDate ? new Date(booking.travelDate).toDateString() : 'N/A'],
      ['Passengers / Units', booking.travellersCount || 1],
    ],
  });
});

// @desc  Download generic invoice by booking id or reference
// @route GET /api/invoices/any/:id
// @access Private
export const getUnifiedBookingInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const TicketBooking = (await import('../models/TicketBooking.js')).default;

  const pkg = await PackageBooking.findById(id).populate('package');
  if (pkg) {
    req.params.id = pkg._id;
    return getPackageBookingInvoice(req, res);
  }

  const htl = await HotelBooking.findById(id).populate('hotel').populate('room');
  if (htl) {
    req.params.id = htl._id;
    return getHotelBookingInvoice(req, res);
  }

  const tkt = await TicketBooking.findById(id);
  if (tkt) {
    req.params.id = tkt._id;
    return getTicketBookingInvoice(req, res);
  }

  res.status(404);
  throw new Error('Invoice not found');
});
