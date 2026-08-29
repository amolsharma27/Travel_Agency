import express from 'express';
import {
  getActivities,
  getActivityById,
  getTransportation,
  getGetaways,
} from '../controllers/serviceController.js';

const router = express.Router();

// Activities
router.get('/activities', getActivities);
router.get('/activities/:id', getActivityById);

// Transportation
router.get('/transportation', getTransportation);

// Nearby Getaways
router.get('/getaways', getGetaways);

export default router;
