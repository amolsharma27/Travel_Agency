import Enquiry from '../models/Enquiry.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create student enquiry or booking request & notify PCTE Travels by email
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res, next) => {
  try {
    const {
      studentName,
      rollNumber,
      email,
      phone,
      course,
      packageTitle,
      destination,
      requestType,
      tourDuration,
      tourPrice,
      notes,
    } = req.body;

    // Validate required fields
    if (!studentName || !rollNumber || !email || !phone || !course || !packageTitle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Student Name, Roll Number, Email, Phone, Course, and Package Title.',
      });
    }

    const now = new Date();
    const requestDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const requestTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const enquiry = await Enquiry.create({
      studentName,
      rollNumber,
      email,
      phone,
      course,
      packageTitle,
      destination: destination || 'North India Tour Circuit',
      requestType: requestType || 'On Request',
      tourDuration: tourDuration || 'Custom',
      tourPrice: tourPrice || 'On Request',
      requestDate,
      requestTime,
      notes: notes || '',
    });

    // Send email notification to pcte_travels@pcte.edu.in
    const emailSubject = `New Travel Package Enquiry - ${packageTitle}`;
    const emailText = `
PCTE Travels - New Student Tour Enquiry

Student Name: ${studentName}
Roll Number: ${rollNumber}
Email: ${email}
Phone: ${phone}
Course: ${course}

Interested Package: ${packageTitle}
Destination: ${destination || 'Not Specified'}
Request Type: ${requestType || 'On Request'}
Tour Duration: ${tourDuration || 'N/A'}
Tour Price: ${tourPrice || 'On Request'}

Request Date: ${requestDate}
Request Time: ${requestTime}

Notes: ${notes || 'None'}
    `.trim();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b;">
        <div style="border-bottom: 2px solid #E11D48; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #0F2942; margin: 0;">PCTE Travel Agency</h2>
          <p style="color: #E11D48; font-weight: bold; margin: 4px 0 0 0; text-transform: uppercase; font-size: 12px;">New Student Travel Enquiry Notification</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0; width: 40%;">Student Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Roll Number:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${rollNumber}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Phone Number:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Course:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${course}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Interested Package:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0F2942; font-weight: bold;">${packageTitle}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Destination:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${destination || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Request Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><span style="background-color: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${requestType || 'On Request'}</span></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Request Date & Time:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${requestDate} at ${requestTime}</td>
          </tr>
        </table>

        <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
          PCTE Travels Automated Notification System · pcte_travels@pcte.edu.in
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: 'pcte_travels@pcte.edu.in',
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (mailErr) {
      console.error('Email sending failed (non-blocking):', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been successfully recorded and sent to PCTE Travels.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all student enquiries
// @route   GET /api/enquiries
// @access  Public / Staff
export const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PATCH /api/enquiries/:id/status
// @access  Public / Staff
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};
