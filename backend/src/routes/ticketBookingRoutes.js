import express from 'express';
import {
  createTicketBooking,
  getMyTicketBookings,
  getAgencyTicketBookings,
  cancelTicketBooking,
  respondToTicketBooking,
} from '../controllers/ticketBookingController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createTicketBooking);
router.get('/my', protect, getMyTicketBookings);
router.get('/agency', protect, requireApprovedAgency, getAgencyTicketBookings);
router.put('/:id/cancel', protect, cancelTicketBooking);
router.put('/:id/respond', protect, respondToTicketBooking);

export default router;
