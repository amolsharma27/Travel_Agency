import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import PackageBooking from '../models/PackageBooking.js';
import HotelBooking from '../models/HotelBooking.js';
import Payment from '../models/Payment.js';
import ContactMessage from '../models/ContactMessage.js';

// @desc  Admin analytics overview
// @route GET /api/dashboard/admin
// @access Private/Admin
export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [
    totalCustomers, totalAgencies, pendingAgencies,
    totalPackages, pendingPackages, totalHotels, pendingHotels,
    totalPackageBookings, totalHotelBookings,
    revenueAgg, openTickets,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'agency' }),
    User.countDocuments({ role: 'agency', agencyStatus: 'pending' }),
    Package.countDocuments(),
    Package.countDocuments({ status: 'pending' }),
    Hotel.countDocuments(),
    Hotel.countDocuments({ status: 'pending' }),
    PackageBooking.countDocuments({ status: { $in: ['confirmed', 'completed'] } }),
    HotelBooking.countDocuments({ status: { $in: ['confirmed', 'completed'] } }),
    Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ContactMessage.countDocuments({ status: 'open' }),
  ]);

  res.json({
    success: true,
    data: {
      users: { totalCustomers, totalAgencies, pendingAgencies },
      packages: { total: totalPackages, pending: pendingPackages },
      hotels: { total: totalHotels, pending: pendingHotels },
      bookings: { totalPackageBookings, totalHotelBookings },
      revenue: revenueAgg[0]?.total || 0,
      support: { openTickets },
    },
  });
});

// @desc  Admin: list/manage users (customers + agencies)
// @route GET /api/dashboard/admin/users
// @access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).sort('-createdAt');
  res.json({ success: true, count: users.length, data: users });
});

// @desc  Admin: block/unblock a user
// @route PUT /api/dashboard/admin/users/:id/status
// @access Private/Admin
export const setUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'active' | 'blocked'
  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, data: user });
});

// @desc  Admin: approve/reject an agency account
// @route PUT /api/dashboard/admin/agencies/:id/status
// @access Private/Admin
export const setAgencyStatus = asyncHandler(async (req, res) => {
  const { agencyStatus } = req.body; // 'approved' | 'rejected'
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'agency' },
    { agencyStatus },
    { new: true }
  );
  if (!user) {
    res.status(404);
    throw new Error('Agency not found');
  }
  res.json({ success: true, data: user });
});

// @desc  Agency revenue dashboard (packages + hotels)
// @route GET /api/dashboard/agency
// @access Private/Agency
export const getAgencyAnalytics = asyncHandler(async (req, res) => {
  const agencyId = req.user._id;

  const [
    myPackagesCount, myHotelsCount,
    packageBookingsCount, hotelBookingsCount,
    packageRevenueAgg, hotelRevenueAgg,
    pendingPackageBookings, pendingHotelBookings,
  ] = await Promise.all([
    Package.countDocuments({ agency: agencyId }),
    Hotel.countDocuments({ owner: agencyId }),
    PackageBooking.countDocuments({ agency: agencyId, status: { $in: ['confirmed', 'completed'] } }),
    HotelBooking.countDocuments({ owner: agencyId, status: { $in: ['confirmed', 'completed'] } }),
    PackageBooking.aggregate([
      { $match: { agency: agencyId, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    HotelBooking.aggregate([
      { $match: { owner: agencyId, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    PackageBooking.countDocuments({ agency: agencyId, status: 'pending_approval' }),
    HotelBooking.countDocuments({ owner: agencyId, status: 'pending_approval' }),
  ]);

  res.json({
    success: true,
    data: {
      listings: { packages: myPackagesCount, hotels: myHotelsCount },
      bookings: { packageBookings: packageBookingsCount, hotelBookings: hotelBookingsCount },
      pendingApprovals: { packageBookings: pendingPackageBookings, hotelBookings: pendingHotelBookings },
      revenue: {
        fromPackages: packageRevenueAgg[0]?.total || 0,
        fromHotels: hotelRevenueAgg[0]?.total || 0,
        total: (packageRevenueAgg[0]?.total || 0) + (hotelRevenueAgg[0]?.total || 0),
      },
    },
  });
});
