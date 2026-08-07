import express from 'express';
import {
  createCoupon, getCoupons, updateCoupon, deleteCoupon, validateCoupon,
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/validate', protect, authorize('customer'), validateCoupon);

router.post('/', protect, authorize('admin', 'agency'), createCoupon);
router.get('/', protect, authorize('admin', 'agency'), getCoupons);
router.put('/:id', protect, authorize('admin', 'agency'), updateCoupon);
router.delete('/:id', protect, authorize('admin', 'agency'), deleteCoupon);

export default router;
