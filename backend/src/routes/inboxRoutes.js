import express from 'express';
import {
  getMessages,
  getStats,
  getTemplates,
  getMessageById,
  sendMessage,
  replyMessage,
  updateMessageStatus,
  batchUpdateMessages,
  deleteMessage,
} from '../controllers/inboxController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/templates', getTemplates);
router.post('/send', sendMessage);
router.post('/batch', batchUpdateMessages);

router.route('/')
  .get(getMessages);

router.route('/:id')
  .get(getMessageById)
  .delete(deleteMessage);

router.post('/:id/reply', replyMessage);
router.patch('/:id/status', updateMessageStatus);

export default router;
