import express from 'express';
import {
  createHotelBooking, getMyHotelBookings, getOwnerHotelBookings,
  respondToHotelBooking, cancelHotelBooking,
} from '../controllers/hotelBookingController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createHotelBooking);
router.get('/my', protect, authorize('customer'), getMyHotelBookings);
router.get('/owner', protect, requireApprovedAgency, getOwnerHotelBookings);
router.put('/:id/respond', protect, requireApprovedAgency, respondToHotelBooking);
router.put('/:id/cancel', protect, authorize('customer'), cancelHotelBooking);

export default router;
