import express from 'express';
import {
  getPackages, getPackageByIdOrSlug, createPackage, updatePackage,
  deletePackage, getMyPackages, moderatePackage, getPendingPackages,
  getAllAdminPackages
} from '../controllers/packageController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public
router.get('/', getPackages);

// Admin / Management
router.get('/admin/all', protect, authorize('admin'), getAllAdminPackages);
router.get('/admin/pending', protect, authorize('admin'), getPendingPackages);
router.put('/:id/moderate', protect, authorize('admin'), moderatePackage);

// Package CRUD (Admin or Agency)
router.get('/agency/mine', protect, getMyPackages);
router.post('/', protect, authorize('admin', 'agency'), upload.array('images', 8), createPackage);
router.put('/:id', protect, authorize('admin', 'agency'), upload.array('images', 8), updatePackage);
router.delete('/:id', protect, authorize('admin', 'agency'), deletePackage);

// Public single package (keep last)
router.get('/:idOrSlug', getPackageByIdOrSlug);

export default router;

