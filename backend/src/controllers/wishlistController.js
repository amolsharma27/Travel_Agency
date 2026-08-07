import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';

// @desc  Toggle a package/hotel in the logged-in user's wishlist
// @route POST /api/wishlist/toggle
// @access Private/Customer
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { itemType, itemId } = req.body;
  if (!['package', 'hotel'].includes(itemType)) {
    res.status(400);
    throw new Error("itemType must be 'package' or 'hotel'");
  }

  const filter = { user: req.user._id, [itemType]: itemId };
  const existing = await Wishlist.findOne(filter);

  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, wishlisted: false, message: 'Removed from wishlist' });
  }

  await Wishlist.create({ user: req.user._id, itemType, [itemType]: itemId });
  res.json({ success: true, wishlisted: true, message: 'Added to wishlist' });
});

// @desc  Get logged-in user's wishlist
// @route GET /api/wishlist
// @access Private/Customer
export const getMyWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id })
    .populate('package', 'title images destination price rating')
    .populate('hotel', 'name images city startingPrice rating')
    .sort('-createdAt');
  res.json({ success: true, count: items.length, data: items });
});
