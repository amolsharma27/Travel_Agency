import express from 'express';
import {
  getPassportPlans,
  createPassportRequest,
  getMyPassportRequests,
  getAllPassportRequests,
  updatePassportStatus,
} from '../controllers/passportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Plans
router.get('/plans', getPassportPlans);
router.get('/services', getPassportPlans);

// Requests
router.post('/requests', protect, createPassportRequest);
router.get('/requests/my', protect, getMyPassportRequests);
router.get('/requests', protect, authorize('admin'), getAllPassportRequests);
router.put('/requests/:id/status', protect, authorize('admin'), updatePassportStatus);

export default router;
