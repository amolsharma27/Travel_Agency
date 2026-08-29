import express from 'express';
import {
  getHotelBookingInvoice,
  getPackageBookingInvoice,
  getTicketBookingInvoice,
  getUnifiedBookingInvoice,
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/hotel/:id', protect, getHotelBookingInvoice);
router.get('/package/:id', protect, getPackageBookingInvoice);
router.get('/ticket/:id', protect, getTicketBookingInvoice);
router.get('/any/:id', protect, getUnifiedBookingInvoice);

export default router;
