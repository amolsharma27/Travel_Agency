import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';

// @desc  Submit a contact/support message
// @route POST /api/support
// @access Public
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const contact = await ContactMessage.create({
    user: req.user?._id,
    name,
    email,
    subject,
    message,
  });
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
