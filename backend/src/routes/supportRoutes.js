import express from 'express';
import { submitContactMessage, getContactMessages, getMySupportMessages, respondToContactMessage } from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/my', protect, getMySupportMessages);
router.get('/', protect, authorize('admin'), getContactMessages);
router.put('/:id', protect, authorize('admin'), respondToContactMessage);

export default router;
