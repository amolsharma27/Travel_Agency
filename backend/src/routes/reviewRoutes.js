import express from 'express';
import { createReview, getReviews, replyToReview, moderateReview } from '../controllers/reviewController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, authorize('customer'), createReview);
router.put('/:id/reply', protect, requireApprovedAgency, replyToReview);
router.put('/:id/moderate', protect, authorize('admin'), moderateReview);

export default router;
