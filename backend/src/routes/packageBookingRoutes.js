import express from 'express';
import {
  createPackageBooking, getMyPackageBookings, getAgencyPackageBookings,
  respondToPackageBooking, cancelPackageBooking,
} from '../controllers/packageBookingController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createPackageBooking);
router.get('/my', protect, authorize('customer'), getMyPackageBookings);
router.get('/agency', protect, requireApprovedAgency, getAgencyPackageBookings);
router.put('/:id/respond', protect, requireApprovedAgency, respondToPackageBooking);
router.put('/:id/cancel', protect, authorize('customer'), cancelPackageBooking);

export default router;
