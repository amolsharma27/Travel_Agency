import express from 'express';
import {
  // Customer
  getCustomerAnalytics,
  getCustomerBookings,
  // Agency
  getAgencyAnalytics,
  getAgencyBookings,
  getAgencyCustomers,
  getAgencyEarnings,
  // Admin
  getAdminAnalytics,
  getAllUsers,
  setUserStatus,
  setAgencyStatus,
  getAdminAgencies,
  updateAgencyCommission,
  getAdminListings,
  updateListingStatus,
  getAdminBookings,
  getAdminReports,
} from '../controllers/dashboardController.js';
import { protect, authorize, requireApprovedAgency } from '../middleware/auth.js';

const router = express.Router();

// Customer
router.get('/customer', protect, getCustomerAnalytics);
router.get('/customer/bookings', protect, getCustomerBookings);

// Agency
router.get('/agency', protect, requireApprovedAgency, getAgencyAnalytics);
router.get('/agency/bookings', protect, requireApprovedAgency, getAgencyBookings);
router.get('/agency/customers', protect, requireApprovedAgency, getAgencyCustomers);
router.get('/agency/earnings', protect, requireApprovedAgency, getAgencyEarnings);

// Admin
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);
router.get('/admin/bookings', protect, authorize('admin'), getAdminBookings);
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.put('/admin/users/:id/status', protect, authorize('admin'), setUserStatus);
router.get('/admin/agencies', protect, authorize('admin'), getAdminAgencies);
router.put('/admin/agencies/:id/status', protect, authorize('admin'), setAgencyStatus);
router.put('/admin/agencies/:id/commission', protect, authorize('admin'), updateAgencyCommission);
router.get('/admin/listings', protect, authorize('admin'), getAdminListings);
router.put('/admin/listings/:type/:id/status', protect, authorize('admin'), updateListingStatus);
router.get('/admin/reports', protect, authorize('admin'), getAdminReports);

export default router;
