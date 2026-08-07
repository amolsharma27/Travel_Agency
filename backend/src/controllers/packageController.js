import asyncHandler from 'express-async-handler';
import Package from '../models/Package.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @desc  List/search/filter packages (public, only approved+active shown)
// @route GET /api/packages
// @access Public
export const getPackages = asyncHandler(async (req, res) => {
  const baseQuery = Package.find({ status: 'approved', isActive: true }).populate('agency', 'agencyName agencyLogo');

  const features = new ApiFeatures(baseQuery, req.query)
    .search(['title', 'destination'])
    .filter()
    .sort()
    .paginate();

  const [packages, total] = await Promise.all([features.query, features.countTotal()]);

  res.json({
    success: true,
    count: packages.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: packages,
  });
});

// @desc  Get single package by slug or id
// @route GET /api/packages/:idOrSlug
// @access Public
export const getPackageByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const pkg = await Package.findOne(query).populate('agency', 'agencyName agencyLogo agencyDescription');
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  res.json({ success: true, data: pkg });
});

// @desc  Create a package (agency only)
// @route POST /api/packages
// @access Private/Agency
export const createPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.create({
    ...req.body,
    agency: req.user._id,
    availableSeats: req.body.totalSeats,
    status: 'pending', // requires admin approval
  });
  res.status(201).json({ success: true, data: pkg });
});

// @desc  Update a package (owning agency only)
// @route PUT /api/packages/:id
// @access Private/Agency
export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  if (String(pkg.agency) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to edit this package');
  }

  Object.assign(pkg, req.body);
  // Any material edit sends it back for re-approval
  if (req.user.role !== 'admin') pkg.status = 'pending';
  await pkg.save();

  res.json({ success: true, data: pkg });
});

// @desc  Delete a package
// @route DELETE /api/packages/:id
// @access Private/Agency
export const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  if (String(pkg.agency) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this package');
  }
  await pkg.deleteOne();
  res.json({ success: true, message: 'Package deleted' });
});

// @desc  Agency: list own packages (any status)
// @route GET /api/packages/agency/mine
// @access Private/Agency
export const getMyPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find({ agency: req.user._id }).sort('-createdAt');
  res.json({ success: true, count: packages.length, data: packages });
});

// @desc  Admin: approve or reject a package
// @route PUT /api/packages/:id/moderate
// @access Private/Admin
export const moderatePackage = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'approved' or 'rejected'");
  }
  const pkg = await Package.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  res.json({ success: true, data: pkg });
});

// @desc  Admin: list all packages pending approval
// @route GET /api/packages/admin/pending
// @access Private/Admin
export const getPendingPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find({ status: 'pending' }).populate('agency', 'agencyName email');
  res.json({ success: true, count: packages.length, data: packages });
});
