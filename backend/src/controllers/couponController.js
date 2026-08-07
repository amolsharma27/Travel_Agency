import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

// @desc  Admin/Agency: create a coupon
// @route POST /api/coupons
// @access Private/Admin/Agency
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: coupon });
});

// @desc  List coupons (admin sees all, agency sees own)
// @route GET /api/coupons
// @access Private/Admin/Agency
export const getCoupons = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
  const coupons = await Coupon.find(filter).sort('-createdAt');
  res.json({ success: true, count: coupons.length, data: coupons });
});

// @desc  Update a coupon
// @route PUT /api/coupons/:id
// @access Private/Admin/Agency
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  if (req.user.role !== 'admin' && String(coupon.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to edit this coupon');
  }
  Object.assign(coupon, req.body);
  await coupon.save();
  res.json({ success: true, data: coupon });
});

// @desc  Delete a coupon
// @route DELETE /api/coupons/:id
// @access Private/Admin/Agency
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  if (req.user.role !== 'admin' && String(coupon.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete this coupon');
  }
  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted' });
});

// @desc  Validate a coupon code against an order amount (used by the frontend at checkout)
// @route GET /api/coupons/validate?code=SAVE10&amount=5000&applicableTo=hotel
// @access Private/Customer
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, amount, applicableTo } = req.query;
  const coupon = await Coupon.findOne({ code: (code || '').toUpperCase() });

  if (!coupon || !coupon.isValidNow()) {
    res.status(400);
    throw new Error('Invalid or expired coupon code');
  }
  if (!['both', applicableTo].includes(coupon.applicableTo)) {
    res.status(400);
    throw new Error('This coupon is not applicable to this booking type');
  }
  if (Number(amount) < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
  }

  const discount = coupon.discountType === 'percent'
    ? Math.min(Number(amount) * (coupon.discountValue / 100), coupon.maxDiscount || Infinity)
    : coupon.discountValue;

  res.json({ success: true, data: { code: coupon.code, discount: Math.round(discount) } });
});
