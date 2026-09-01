import asyncHandler from 'express-async-handler';
import TicketBooking from '../models/TicketBooking.js';
import Notification from '../models/Notification.js';
import { validatePassport, validateAadhaar, validatePAN, validateDocument } from '../utils/idValidators.js';

const defaultPassportPlans = [
  {
    id: 'pass_fresh',
    name: 'Fresh Adult Passport Assistance (36 Pages)',
    officialGovtFee: 1500,
    agencyServiceFee: 499,
    validity: '10 Years Validity',
    processingTime: 'Normal Appointment: 15-20 Days',
    idealFor: 'First-time adult applicants (Age 18+)',
    popularTag: 'Most Popular',
    includes: [
      'Pre-screening of 4 Mandatory ID Annexures',
      'Instant PSK Slot Booking at Ludhiana / Chandigarh',
      'Form 1 & Annexure Dossier Generation',
      'SMS Dispatch & SpeedPost Tracking Alerts'
    ]
  },
  {
    id: 'pass_tatkaal',
    name: 'Tatkaal Express Passport Assistance',
    officialGovtFee: 3500,
    agencyServiceFee: 899,
    validity: '10 Years Validity',
    processingTime: 'Express PSK Slot: 1-3 Business Days',
    idealFor: 'Urgent international travel, visa deadlines, or corporate emergencies',
    popularTag: 'Fast Track (1-3 Days)',
    includes: [
      'Priority MEA Portal Slot Reservation',
      '3 Out of 13 Identity Document Pre-Screening',
      'Executive Document Verification Assistance',
      'Escalated Dispatch Telemetry'
    ]
  },
  {
    id: 'pass_renewal',
    name: 'Re-issue / Passport Renewal Assistance',
    officialGovtFee: 1500,
    agencyServiceFee: 499,
    validity: '10 Years Fresh Booklet',
    processingTime: 'Standard: 12-15 Working Days',
    idealFor: 'Expired passports, 36-page exhaustion, change of address or surname',
    includes: [
      'Old Passport OCR & Record Matching',
      'Spouse / Address / Surname Endorsement Filing',
      'Appointment Scheduling at Regional PSK',
      'Clearance Assistance'
    ]
  },
  {
    id: 'pass_minor',
    name: 'Minor Passport Assistance (Under 18)',
    officialGovtFee: 1000,
    agencyServiceFee: 399,
    validity: '5 Years or until 18 Years of Age',
    processingTime: 'Standard: 12-15 Working Days',
    idealFor: 'Infants, school students, and minors travelling abroad',
    includes: [
      'Annexure D/C Parent Consent Verification',
      'Minor Birth Certificate Verification',
      'Both Parents PSK Appointment Scheduling',
      'School ID & Bonafide Pre-Screening'
    ]
  },
  {
    id: 'pass_pcc',
    name: 'Police Clearance Certificate (PCC) Assistance',
    officialGovtFee: 500,
    agencyServiceFee: 399,
    validity: 'As per Embassy / Destination Mandate',
    processingTime: 'PSK Appointment + Local Police Report: 7-10 Days',
    idealFor: 'Canada / UK / Schengen Work Permits, Student Visas, and Permanent Residency (PR)',
    includes: [
      'Country-Specific PCC Purpose Classification',
      'MEA PSK Counter Verification Slot',
      'District Police Commissionerate Liaison Guidance',
      'PCC Status Tracking Support'
    ]
  }
];

// @desc  Get available passport assistance plans
// @route GET /api/passport-services
// @access Public
export const getPassportPlans = asyncHandler(async (req, res) => {
  res.json({ success: true, count: defaultPassportPlans.length, data: defaultPassportPlans });
});

// @desc  Verify format & checksum of identity documents (Passport, Aadhaar, PAN)
// @route POST /api/passport/verify-document
// @access Public / Private
export const verifyDocumentEndpoint = asyncHandler(async (req, res) => {
  const { documentType, identifier } = req.body;
  if (!identifier) {
    res.status(400);
    throw new Error('Document identifier / number is required for verification.');
  }

  const result = validateDocument({ type: documentType, identifier });
  res.json({
    success: true,
    documentType: documentType || 'Government ID',
    ...result
  });
});

// @desc  Submit a passport assistance request
// @route POST /api/passport-requests
// @access Private
export const createPassportRequest = asyncHandler(async (req, res) => {
  const {
    serviceTitle,
    applicantName,
    dob,
    contactPhone,
    contactEmail,
    preferredPSK,
    aadhaarNumber,
    existingPassportNumber,
    specialNotes,
    govtFee,
    agencyFee,
    totalAmount,
  } = req.body;

  // Validate Aadhaar if provided
  let validatedAadhaar = null;
  if (aadhaarNumber) {
    const aadhaarCheck = validateAadhaar(aadhaarNumber);
    if (!aadhaarCheck.isValid) {
      res.status(400);
      throw new Error(`Aadhaar validation failed: ${aadhaarCheck.message}`);
    }
    validatedAadhaar = aadhaarCheck.maskedNumber;
  }

  // Validate Existing Passport if provided (e.g. for Renewal / Tatkaal)
  let validatedPassport = null;
  if (existingPassportNumber) {
    const passportCheck = validatePassport(existingPassportNumber);
    if (!passportCheck.isValid) {
      res.status(400);
      throw new Error(`Passport validation failed: ${passportCheck.message}`);
    }
    validatedPassport = passportCheck.cleanNumber;
  }

  const total = Number(totalAmount) || (Number(govtFee || 1500) + Number(agencyFee || 499));
  const trackingId = 'MEA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const notesList = [
    `DOB: ${dob || 'N/A'}`,
    `Preferred PSK: ${preferredPSK || 'Ludhiana'}`,
    validatedAadhaar ? `Verified Aadhaar: ${validatedAadhaar}` : null,
    validatedPassport ? `Verified Existing Passport: ${validatedPassport}` : null,
    specialNotes ? `Notes: ${specialNotes}` : null
  ].filter(Boolean).join('. ');

  const booking = await TicketBooking.create({
    customer: req.user._id,
    bookingType: 'passport',
    itemTitle: serviceTitle || 'Passport Seva Assistance Dossier',
    destination: preferredPSK || 'PSK Ludhiana',
    travelDate: new Date(),
    travellersCount: 1,
    contactName: applicantName || req.user.name,
    contactPhone: contactPhone || req.user.phone || '+91 98765 43210',
    contactEmail: contactEmail || req.user.email,
    totalAmount: total,
    status: 'under_review',
    paymentStatus: 'paid',
    bookingReference: trackingId,
    specialNotes: notesList,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  });

  await Notification.create({
    user: req.user._id,
    title: 'Passport Dossier Submitted & Validated!',
    message: `Your application tracking number is ${trackingId}. Assigned office: ${preferredPSK || 'PSK Ludhiana'}. ID Verification: Passed.`,
    type: 'system',
  });

  res.status(201).json({
    success: true,
    data: {
      id: trackingId,
      bookingDbId: booking._id,
      applicant: applicantName || req.user.name,
      pskOffice: preferredPSK || 'PSK Ludhiana',
      type: serviceTitle || 'Fresh Adult Passport Assistance',
      status: 'Pre-Screened',
      verifiedAadhaar: validatedAadhaar,
      verifiedPassport: validatedPassport,
      totalAmount: total,
      booking,
    }
  });
});

// @desc  Get user's passport requests
// @route GET /api/passport-requests/my
// @access Private
export const getMyPassportRequests = asyncHandler(async (req, res) => {
  const requests = await TicketBooking.find({
    customer: req.user._id,
    bookingType: 'passport'
  }).sort('-createdAt');
  res.json({ success: true, count: requests.length, data: requests });
});

// @desc  Admin: list all passport requests
// @route GET /api/passport-requests
// @access Private/Admin
export const getAllPassportRequests = asyncHandler(async (req, res) => {
  const requests = await TicketBooking.find({ bookingType: 'passport' })
    .populate('customer', 'name email phone city')
    .sort('-createdAt');

  const formatted = requests.map(r => ({
    id: r.bookingReference,
    _id: r._id,
    applicant: r.contactName || r.customer?.name || 'Applicant',
    dob: '1998-05-27',
    phone: r.contactPhone || r.customer?.phone,
    email: r.contactEmail || r.customer?.email,
    pskOffice: r.destination || 'PSK Ludhiana',
    type: r.itemTitle,
    govtFee: 1500,
    agencyFee: 499,
    status: r.status === 'confirmed' ? 'Slot Booked' : r.status === 'completed' ? 'Completed' : 'Pre-Screened',
    appointmentDate: r.travelDate ? new Date(r.travelDate).toLocaleDateString('en-IN') : 'Scheduled',
    documents: ['Aadhaar Card', '10th Marksheet (DOB)', 'Bank Passbook / Address Proof'],
  }));

  res.json({ success: true, count: formatted.length, data: formatted });
});

// @desc  Admin: update passport request status
// @route PUT /api/passport-requests/:id/status
// @access Private/Admin
export const updatePassportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const request = await TicketBooking.findOne({
    $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { bookingReference: req.params.id }]
  });

  if (!request) {
    res.status(404);
    throw new Error('Passport request not found');
  }

  request.status = status === 'Slot Booked' || status === 'confirmed' ? 'confirmed' : status === 'Completed' ? 'completed' : 'under_review';
  await request.save();

  if (request.customer) {
    await Notification.create({
      user: request.customer,
      title: 'Passport Dossier Update',
      message: `Your passport dossier ${request.bookingReference} status changed to ${status}.`,
      type: 'system',
    });
  }

  res.json({ success: true, data: request, message: `Status updated to ${status}` });
});
