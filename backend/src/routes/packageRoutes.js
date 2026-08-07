import express from 'express';
import {
  getPackages, getPackageByIdOrSlug, createPackage, updatePackage,
  deletePackage, getMyPackages, moderatePackage, getPendingPackages,
} from '../controllers/packageController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public
router.get('/', getPackages);

// Agency
router.get('/agency/mine', protect, requireApprovedAgency, getMyPackages);
router.post('/', protect, requireApprovedAgency, upload.array('images', 8), createPackage);
router.put('/:id', protect, requireApprovedAgency, upload.array('images', 8), updatePackage);
router.delete('/:id', protect, requireApprovedAgency, deletePackage);

// Admin
router.get('/admin/pending', protect, authorize('admin'), getPendingPackages);
router.put('/:id/moderate', protect, authorize('admin'), moderatePackage);

// Public (keep last so it doesn't shadow the specific routes above)
router.get('/:idOrSlug', getPackageByIdOrSlug);

export default router;
