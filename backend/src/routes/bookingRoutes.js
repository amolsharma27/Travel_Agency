import express from 'express';
import {
  createUnifiedBooking,
  getMyAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createUnifiedBooking);
router.get('/my', protect, getMyAllBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, (req, res, next) => {
  req.body.status = 'cancelled';
  updateBookingStatus(req, res, next);
});

export default router;
