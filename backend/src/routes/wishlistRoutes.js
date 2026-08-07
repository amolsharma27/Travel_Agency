import express from 'express';
import { toggleWishlist, getMyWishlist } from '../controllers/wishlistController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('customer'), getMyWishlist);
router.post('/toggle', protect, authorize('customer'), toggleWishlist);

export default router;
