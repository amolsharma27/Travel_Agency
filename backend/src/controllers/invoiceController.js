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
    title: booking.package.title,
    reference: booking.bookingReference,
    customerName: booking.travellers?.[0]?.name || 'Guest',
    contactEmail: booking.contactEmail,
    contactPhone: booking.contactPhone,
    totalAmount: booking.totalAmount,
    status: booking.status,
    lines: [
      ['Package', booking.package.title],
      ['Destination', booking.package.destination],
      ['Duration', `${booking.package.durationDays}D / ${booking.package.durationNights}N`],
      ['Travel Date', booking.travelDate.toDateString()],
      ['Seats Booked', booking.seatsBooked],
      ['Discount', `₹${booking.discountApplied}`],
    ],
  });
});
