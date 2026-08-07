import express from 'express';
import { getHotelBookingInvoice, getPackageBookingInvoice } from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/hotel/:id', protect, getHotelBookingInvoice);
router.get('/package/:id', protect, getPackageBookingInvoice);

export default router;
