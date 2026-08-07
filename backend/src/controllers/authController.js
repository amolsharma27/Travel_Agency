import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { generateOtp, otpExpiryDate, otpEmailTemplate } from '../utils/otp.js';

// @desc  Register a new customer or travel agency
// @route POST /api/auth/register
// @access Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, agencyName, agencyDescription } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const requestedRole = role === 'agency' ? 'agency' : 'customer'; // admin accounts are never self-registered

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: requestedRole,
    ...(requestedRole === 'agency' && {
      agencyName: agencyName || name,
      agencyDescription,
      agencyStatus: 'pending',
    }),
  });

  if (requestedRole === 'agency') {
    // Agencies need admin approval before they can list packages/hotels
    res.status(201).json({
      success: true,
      message: 'Agency account created. Your account is pending admin approval before you can publish listings.',
      user: user.toSafeObject(),
    });
    return;
  }

  res.status(201).json({
    success: true,
    token: generateToken(user._id, user.role),
    user: user.toSafeObject(),
  });
});

// @desc  Login
// @route POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.status === 'blocked') {
    res.status(403);
    throw new Error('Your account has been blocked. Please contact support.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    token: generateToken(user._id, user.role),
    user: user.toSafeObject(),
  });
});

// @desc  Get logged-in user's profile
// @route GET /api/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @desc  Request a password reset OTP via email
// @route POST /api/auth/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires');

  // Always respond success to avoid leaking which emails are registered
  if (!user) {
    res.json({ success: true, message: 'If that email is registered, an OTP has been sent.' });
    return;
  }

  const otp = generateOtp();
  user.resetOtp = otp;
  user.resetOtpExpires = otpExpiryDate();
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'Your password reset OTP',
    html: otpEmailTemplate(user.name, otp),
  });

  res.json({ success: true, message: 'If that email is registered, an OTP has been sent.' });
});

// @desc  Verify OTP (optional standalone check before showing reset form)
// @route POST /api/auth/verify-otp
// @access Public
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires');

  if (!user || user.resetOtp !== otp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  res.json({ success: true, message: 'OTP verified' });
});

// @desc  Reset password using a verified OTP
// @route POST /api/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires +password');

  if (!user || user.resetOtp !== otp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.password = newPassword;
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successful. Please log in with your new password.' });
});

// @desc  Update own profile (name, phone, avatar)
// @route PUT /api/auth/profile
// @access Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, agencyName, agencyDescription, agencyLogo } = req.body;

  if (name) req.user.name = name;
  if (phone) req.user.phone = phone;
  if (avatar) req.user.avatar = avatar;

  if (req.user.role === 'agency') {
    if (agencyName) req.user.agencyName = agencyName;
    if (agencyDescription) req.user.agencyDescription = agencyDescription;
    if (agencyLogo) req.user.agencyLogo = agencyLogo;
  }

  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @desc  Change password while logged in
// @route PUT /api/auth/change-password
// @access Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
});
