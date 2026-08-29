import express from 'express';
import {
  register, login, getMe, forgotPassword, verifyOtp,
  resetPassword, updateProfile, changePassword,
  getAllUsersAdmin, verifyUserOrAgency, deleteUserAdmin, toggleUserStatus,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin user management & moderation
router.get('/users', protect, authorize('admin'), getAllUsersAdmin);
router.put('/users/:id/verify', protect, authorize('admin'), verifyUserOrAgency);
router.put('/users/:id/status', protect, authorize('admin'), toggleUserStatus);
router.delete('/users/:id', protect, authorize('admin'), deleteUserAdmin);

export default router;
