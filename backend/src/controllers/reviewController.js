import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';

const recalcRating = async (targetType, targetId) => {
  const filter = targetType === 'package' ? { package: targetId, status: 'visible' } : { hotel: targetId, status: 'visible' };
  const reviews = await Review.find(filter);
  const count = reviews.length;
  const avg = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  const Model = targetType === 'package' ? Package : Hotel;
  await Model.findByIdAndUpdate(targetId, { rating: Math.round(avg * 10) / 10, reviewsCount: count });
};

// @desc  Add a review for a package or hotel
// @route POST /api/reviews
// @access Private/Customer
export const createReview = asyncHandler(async (req, res) => {
  const { targetType, targetId, rating, title, comment, images } = req.body;
  if (!['package', 'hotel'].includes(targetType)) {
    res.status(400);
    throw new Error("targetType must be 'package' or 'hotel'");
  }

  const review = await Review.create({
    user: req.user._id,
    targetType,
    [targetType]: targetId,
    rating,
    title,
    comment,
    images,
  });

  await recalcRating(targetType, targetId);

  res.status(201).json({ success: true, data: review });
});

// @desc  List reviews for a package or hotel
// @route GET /api/reviews?targetType=hotel&targetId=...
// @access Public
export const getReviews = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;
  const filter = { status: 'visible' };
  if (targetType === 'package') filter.package = targetId;
  if (targetType === 'hotel') filter.hotel = targetId;

  const reviews = await Review.find(filter).populate('user', 'name avatar').sort('-createdAt');
  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc  Owner/agency replies to a review
// @route PUT /api/reviews/:id/reply
// @access Private/Agency
export const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  review.ownerReply = { text: req.body.text, repliedAt: new Date() };
  await review.save();
  res.json({ success: true, data: review });
});

// @desc  Admin: moderate (flag/remove) a review
// @route PUT /api/reviews/:id/moderate
// @access Private/Admin
export const moderateReview = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'visible' | 'flagged' | 'removed'
  const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await recalcRating(review.targetType, review.package || review.hotel);
  res.json({ success: true, data: review });
});
