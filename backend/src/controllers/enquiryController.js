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

    // 1. Send admin notification email to pcte_travels@pcte.edu.in
    const adminRecipient = process.env.NOTIFICATION_EMAIL || 'pcte_travels@pcte.edu.in';
    const emailSubject = `🚨 New Student Tour Registration: ${studentName} (Roll: ${rollNumber}) - ${packageTitle}`;

    const emailText = `
=== NEW STUDENT TOUR REGISTRATION ===
Student Name: ${studentName}
Roll Number: ${rollNumber}
Email: ${email}
Phone: ${phone}
Course: ${course}

Interested Package: ${packageTitle}
Destination: ${destination || 'North India Tour Circuit'}
Request Type: ${requestType || 'On Request'}
Tour Duration: ${tourDuration || '1 Night / 2 Days'}
Tour Price: ${tourPrice || 'On Request'}
Request Date: ${requestDate} at ${requestTime}
Notes: ${notes || 'None'}
======================================
    `.trim();

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; color: #1e293b; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0F2942 0%, #1B1464 100%); padding: 22px; color: #ffffff;">
          <span style="background-color: #E11D48; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 3px 8px; border-radius: 4px;">Student Registration Desk</span>
          <h2 style="margin: 10px 0 2px 0; font-size: 20px; font-weight: 800; color: #ffffff;">New Tour Registration</h2>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1;">A student has submitted a booking request on the PCTE Travel Agency portal.</p>
        </div>

        <div style="padding: 22px;">
          <div style="background: #f8fafc; border-left: 4px solid #E11D48; padding: 12px 16px; border-radius: 6px; margin-bottom: 18px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Selected Tour Package</div>
            <div style="font-size: 18px; font-weight: 800; color: #0F2942;">${packageTitle}</div>
            <div style="font-size: 12px; color: #E11D48; font-weight: bold; margin-top: 2px;">${tourPrice} · ${tourDuration}</div>
          </div>

          <h3 style="font-size: 14px; font-weight: 700; color: #0F2942; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Student Credentials</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 18px;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 38%;">Student Full Name:</td><td style="padding: 8px 0; font-weight: 700; color: #0F2942;">${studentName}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">College Roll No:</td><td style="padding: 8px 0; font-weight: 700; color: #0F2942;">${rollNumber}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Course / Branch:</td><td style="padding: 8px 0; font-weight: 600; color: #0F2942;">${course}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Student Email:</td><td style="padding: 8px 0; font-weight: 600;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">WhatsApp / Phone:</td><td style="padding: 8px 0; font-weight: 600;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Submission Time:</td><td style="padding: 8px 0; font-weight: 500; color: #334155;">${requestDate} at ${requestTime}</td></tr>
            ${notes ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Special Notes / Group:</td><td style="padding: 8px 0; font-weight: 500; color: #334155;">${notes}</td></tr>` : ''}
          </table>
        </div>

        <div style="background-color: #0F2942; color: #94a3b8; padding: 12px 20px; text-align: center; font-size: 11px;">
          PCTE Travels Automated Registration Alert · Delivered to: <b>${adminRecipient}</b>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: adminRecipient,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (mailErr) {
      console.error('Admin email notification failed:', mailErr.message);
    }

    // 2. Send student confirmation email
    if (email && email.includes('@')) {
      const studentSubject = `✈️ Tour Registration Confirmation: ${packageTitle}`;
      const studentHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b;">
          <div style="background: linear-gradient(135deg, #0F2942 0%, #1B1464 100%); padding: 20px; border-radius: 8px; color: #ffffff; text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px;">Tour Registration Received!</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #e2e8f0;">Thank you for registering, <b>${studentName}</b>.</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #64748b;">Tour Package:</td><td style="padding: 8px 0; font-weight: bold; color: #0F2942;">${packageTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Roll Number:</td><td style="padding: 8px 0; font-weight: bold;">${rollNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Course / Dept:</td><td style="padding: 8px 0; font-weight: bold;">${course}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Estimated Price:</td><td style="padding: 8px 0; font-weight: bold; color: #E11D48;">${tourPrice}</td></tr>
          </table>
          <div style="background: #f8fafc; border-radius: 8px; padding: 14px; font-size: 12px; color: #64748b;">
            Our PCTE tour coordinator will contact you shortly on <b>${phone}</b> to finalize seat allocations.<br/>
            Direct Helpline: <b>+91 99881 10021</b> | Email: <a href="mailto:amolsharma2705@gmail.com">amolsharma2705@gmail.com</a>
          </div>
        </div>
      `;

      try {
        await sendEmail({
          to: email,
          subject: studentSubject,
          text: `Hi ${studentName},\n\nYour registration for ${packageTitle} (Roll No: ${rollNumber}) has been received. Our team will contact you shortly.\n\nPCTE Travel Agency`,
          html: studentHtml,
        });
      } catch (err) {
        console.error('Student confirmation email failed:', err.message);
      }
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
