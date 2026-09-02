import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
} from '../controllers/enquiryController.js';

const router = express.Router();

router.route('/')
  .post(createEnquiry)
  .get(getEnquiries);

router.route('/:id/status')
  .patch(updateEnquiryStatus);

export default router;
