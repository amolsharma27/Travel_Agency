import express from 'express';
import { submitContactMessage, getContactMessages, respondToContactMessage } from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public: anyone (including guests) can submit a support message.
// If a valid token is present we still want req.user available, but we
// don't want to hard-require auth here, so this stays unprotected and
// the controller reads req.user optionally.
router.post('/', submitContactMessage);

router.get('/', protect, authorize('admin'), getContactMessages);
router.put('/:id', protect, authorize('admin'), respondToContactMessage);

export default router;
