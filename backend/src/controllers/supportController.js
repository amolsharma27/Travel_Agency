import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import InboxMessage from '../models/InboxMessage.js';
import sendEmail from '../utils/sendEmail.js';

// @desc  Submit a contact/support message / student question
// @route POST /api/support
// @access Public
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message, phone } = req.body;
  let contact = null;
  try {
    contact = await ContactMessage.create({
      user: req.user?._id,
      name,
      email,
      subject,
      message,
    });

    // Also record in InboxMessage
    await InboxMessage.create({
      sender: {
        name: name || 'Student / Visitor',
        email,
        role: 'customer',
      },
      recipient: {
        name: 'PCTE Support Desk',
        email: process.env.NOTIFICATION_EMAIL || 'admin@pctetravels.com',
        role: 'admin',
      },
      subject: subject || 'Website Support Inquiry',
      bodyText: message,
      category: 'support',
      folder: 'inbox',
      isRead: false,
      tags: ['Support', 'Website Form'],
      meta: {
        phone,
        contactMessageId: contact?._id,
      },
    });
  } catch (dbErr) {
    console.warn('MongoDB write buffer delayed, dispatching email notification directly:', dbErr.message);
  }

  // Send instant email notification to amolsharma2705@gmail.com
  const adminRecipient = process.env.NOTIFICATION_EMAIL || 'amolsharma2705@gmail.com';
  const emailSubject = `❓ New Question / Inquiry from ${name}: "${subject || 'General Inquiry'}"`;

  const emailText = `
=== NEW QUESTION / SUPPORT INQUIRY ===
From: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject || 'General Question'}
Date: ${new Date().toLocaleString('en-IN')}

Message:
${message}
======================================
  `.trim();

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; color: #1e293b; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #0F2942 0%, #1B1464 100%); padding: 22px; color: #ffffff;">
        <span style="background-color: #0284c7; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 3px 8px; border-radius: 4px;">Student Support & Inquiry Desk</span>
        <h2 style="margin: 10px 0 2px 0; font-size: 20px; font-weight: 800; color: #ffffff;">New Question Received</h2>
        <p style="margin: 0; font-size: 12px; color: #cbd5e1;">A visitor or student has submitted a new inquiry on the website.</p>
      </div>

      <div style="padding: 22px;">
        <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; border-radius: 6px; margin-bottom: 18px;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #0F2942;">Subject: ${subject || 'General Question'}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; color: #64748b; width: 35%;">Sender Name</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; color: #64748b;">Email Address</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0284c7;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
          </tr>
          ${phone ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; color: #64748b;">Phone</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${phone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Submitted At</td>
            <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 18px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase;">Message Content:</p>
          <p style="margin: 0; font-size: 13px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Inquiry Response')}" style="background-color: #0F2942; color: #ffffff; padding: 10px 20px; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">Reply to ${name}</a>
        </div>
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
  } catch (emailErr) {
    console.error('Failed to send question email notification:', emailErr.message);
  }

  res.status(201).json({ success: true, data: contact, message: 'Your message has been received. Our team will get back to you soon.' });
});

// @desc  Admin: list all support messages
// @route GET /api/support
// @access Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const messages = await ContactMessage.find(filter).sort('-createdAt');
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc  Customer: list own support messages
// @route GET /api/support/my
// @access Private
export const getMySupportMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({
    $or: [{ user: req.user._id }, { email: req.user.email }]
  }).sort('-createdAt');
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc  Admin: respond to / update status of a support message
// @route PUT /api/support/:id
// @access Private/Admin
export const respondToContactMessage = asyncHandler(async (req, res) => {
  const { status, adminReply } = req.body;
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(adminReply && { adminReply }) },
    { new: true }
  );
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.user) {
    try {
      const Notification = (await import('../models/Notification.js')).default;
      await Notification.create({
        user: message.user,
        title: 'Support Request Update',
        message: `Your inquiry "${message.subject}" has been updated: ${adminReply || status}`,
        type: 'system',
      });
    } catch (e) {
      console.error('Failed to create notification:', e);
    }
  }

  res.json({ success: true, data: message });
});
