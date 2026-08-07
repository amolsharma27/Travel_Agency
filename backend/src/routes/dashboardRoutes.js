import express from 'express';
import {
  getAdminAnalytics, getAllUsers, setUserStatus, setAgencyStatus, getAgencyAnalytics,
} from '../controllers/dashboardController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';

const router = express.Router();

// Admin
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.put('/admin/users/:id/status', protect, authorize('admin'), setUserStatus);
router.put('/admin/agencies/:id/status', protect, authorize('admin'), setAgencyStatus);

// Agency
router.get('/agency', protect, requireApprovedAgency, getAgencyAnalytics);

export default router;
