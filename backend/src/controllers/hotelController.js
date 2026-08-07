import asyncHandler from 'express-async-handler';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @desc  Search/list hotels with filters (city, price, rating, star, amenities, etc.)
// @route GET /api/hotels
// @access Public
// Supported query params:
//   q, city, minPrice, maxPrice, minRating, starRating, propertyType,
//   amenities (comma separated), breakfastIncluded, freeCancellation,
//   sort (price_asc|price_desc|rating_desc|newest|popular), page, limit
export const getHotels = asyncHandler(async (req, res) => {
  const filterQuery = { status: 'approved', isActive: true };
  if (req.query.city) filterQuery.city = new RegExp(req.query.city, 'i');
  if (req.query.starRating) filterQuery.starRating = { $gte: Number(req.query.starRating) };
  if (req.query.propertyType) filterQuery.propertyType = req.query.propertyType;
  if (req.query.breakfastIncluded === 'true') filterQuery['policies.breakfastIncluded'] = true;
  if (req.query.freeCancellation === 'true') filterQuery['policies.cancellationPolicy'] = 'Free Cancellation';
  if (req.query.amenities) {
    const amenitiesArr = req.query.amenities.split(',').map((a) => a.trim());
    filterQuery.amenities = { $all: amenitiesArr };
  }

  // remap startingPrice filter (Hotel uses startingPrice, not "price")
  const priceQuery = { ...req.query };
  if (priceQuery.minPrice || priceQuery.maxPrice) {
    filterQuery.startingPrice = {};
    if (priceQuery.minPrice) filterQuery.startingPrice.$gte = Number(priceQuery.minPrice);
    if (priceQuery.maxPrice) filterQuery.startingPrice.$lte = Number(priceQuery.maxPrice);
  }
  if (priceQuery.minRating) filterQuery.rating = { $gte: Number(priceQuery.minRating) };

  const baseQuery = Hotel.find(filterQuery);
  const features = new ApiFeatures(baseQuery, req.query).search(['name', 'city', 'address', 'landmark']).sort().paginate();

  const [hotels, total] = await Promise.all([
    features.query,
    Hotel.countDocuments(filterQuery),
  ]);

  res.json({
    success: true,
    count: hotels.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: hotels,
  });
});

// @desc  Get a single hotel with its room types
// @route GET /api/hotels/:idOrSlug
// @access Public
export const getHotelByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const hotel = await Hotel.findOne(query).populate('owner', 'agencyName agencyLogo');
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  const rooms = await Room.find({ hotel: hotel._id, isActive: true });

  res.json({ success: true, data: { hotel, rooms } });
});

// @desc  Similar hotels (same city, excluding current)
// @route GET /api/hotels/:id/similar
// @access Public
export const getSimilarHotels = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }
  const similar = await Hotel.find({
    _id: { $ne: hotel._id },
    city: hotel.city,
    status: 'approved',
    isActive: true,
  }).limit(6);
  res.json({ success: true, data: similar });
});

// @desc  Create a hotel listing (agency/owner)
// @route POST /api/hotels
// @access Private/Agency
export const createHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create({
    ...req.body,
    owner: req.user._id,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: hotel });
});

// @desc  Update a hotel listing
// @route PUT /api/hotels/:id
// @access Private/Agency
export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }
  if (String(hotel.owner) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to edit this hotel');
  }

  Object.assign(hotel, req.body);
  if (req.user.role !== 'admin') hotel.status = 'pending';
  await hotel.save();

  res.json({ success: true, data: hotel });
});

// @desc  Delete a hotel listing
// @route DELETE /api/hotels/:id
// @access Private/Agency
export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }
  if (String(hotel.owner) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this hotel');
  }
  await Room.deleteMany({ hotel: hotel._id });
  await hotel.deleteOne();
  res.json({ success: true, message: 'Hotel and its rooms deleted' });
});

// @desc  Owner: list own hotels (any status)
// @route GET /api/hotels/owner/mine
// @access Private/Agency
export const getMyHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ owner: req.user._id }).sort('-createdAt');
  res.json({ success: true, count: hotels.length, data: hotels });
});

// @desc  Admin: approve or reject a hotel listing
// @route PUT /api/hotels/:id/moderate
// @access Private/Admin
export const moderateHotel = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'approved' or 'rejected'");
  }
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }
  res.json({ success: true, data: hotel });
});

// @desc  Admin: list hotels pending approval
// @route GET /api/hotels/admin/pending
// @access Private/Admin
export const getPendingHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ status: 'pending' }).populate('owner', 'agencyName email');
  res.json({ success: true, count: hotels.length, data: hotels });
});

// @desc  Recompute a hotel's cached startingPrice from its active rooms
// Internal helper called by roomController after room create/update/delete.
export const recalculateStartingPrice = async (hotelId) => {
  const cheapest = await Room.find({ hotel: hotelId, isActive: true }).sort('basePrice').limit(1);
  await Hotel.findByIdAndUpdate(hotelId, {
    startingPrice: cheapest.length ? cheapest[0].basePrice : 0,
  });
};
