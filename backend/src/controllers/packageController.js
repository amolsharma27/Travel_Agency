import asyncHandler from 'express-async-handler';
import Package from '../models/Package.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @desc  List/search/filter packages (public, only approved+active shown)
// @route GET /api/packages
// @access Public
export const getPackages = asyncHandler(async (req, res) => {
  try {
    const baseQuery = Package.find({
      $or: [{ status: 'approved' }, { status: { $exists: false } }, { status: 'published' }],
    }).populate('agency', 'agencyName agencyLogo');

    const features = new ApiFeatures(baseQuery, req.query)
      .search(['title', 'destination'])
      .filter()
      .sort()
      .paginate();

    const [packages, total] = await Promise.all([features.query, features.countTotal()]);

    return res.json({
      success: true,
      count: packages.length,
      total: total || packages.length,
      page: features.pagination?.page || 1,
      pages: Math.ceil((total || packages.length) / (features.pagination?.limit || 12)) || 1,
      data: packages,
    });
  } catch (err) {
    console.error('Error in getPackages:', err.message);
    return res.json({
      success: true,
      count: 0,
      total: 0,
      page: 1,
      pages: 1,
      data: [],
    });
  }
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

// @desc  Admin: get all packages (all statuses)
// @route GET /api/packages/admin/all
// @access Private/Admin
export const getAllAdminPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find().sort('-createdAt');
  res.json({ success: true, count: packages.length, data: packages });
});

// @desc  Create a package (admin or agency)
// @route POST /api/packages
// @access Private/Admin/Agency
export const createPackage = asyncHandler(async (req, res) => {
  const totalSeats = Number(req.body.totalSeats) || 30;
  const availableSeats = Number(req.body.availableSeats) !== undefined ? Number(req.body.availableSeats) : totalSeats;

  const pkg = await Package.create({
    ...req.body,
    agency: req.user._id,
    totalSeats,
    availableSeats,
    status: 'approved',
    isActive: true,
  });
  res.status(201).json({ success: true, data: pkg });
});

// @desc  Update a package (admin or owning agency)
// @route PUT /api/packages/:id
// @access Private/Admin/Agency
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

  if (req.body.totalSeats !== undefined) pkg.totalSeats = Number(req.body.totalSeats);
  if (req.body.availableSeats !== undefined) pkg.availableSeats = Number(req.body.availableSeats);
  if (req.body.title !== undefined) pkg.title = req.body.title;
  if (req.body.destination !== undefined) pkg.destination = req.body.destination;
  if (req.body.price !== undefined) pkg.price = Number(req.body.price);
  if (req.body.discountPrice !== undefined) pkg.discountPrice = Number(req.body.discountPrice);
  if (req.body.durationDays !== undefined) pkg.durationDays = Number(req.body.durationDays);
  if (req.body.durationNights !== undefined) pkg.durationNights = Number(req.body.durationNights);
  if (req.body.category !== undefined) pkg.category = req.body.category;
  if (req.body.description !== undefined) pkg.description = req.body.description;
  if (req.body.images !== undefined) pkg.images = req.body.images;
  if (req.body.isActive !== undefined) pkg.isActive = req.body.isActive;
  if (req.body.status !== undefined) pkg.status = req.body.status;

  await pkg.save();
  res.json({ success: true, data: pkg });
});

// @desc  Delete a package (admin or owning agency)
// @route DELETE /api/packages/:id
// @access Private/Admin/Agency
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
  res.json({ success: true, message: 'Package deleted successfully' });
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
