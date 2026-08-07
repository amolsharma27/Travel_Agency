import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number }, // cap for percent-based discounts
    minOrderAmount: { type: Number, default: 0 },
    applicableTo: { type: String, enum: ['package', 'hotel', 'both'], default: 'both' },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin or agency
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CouponSchema.methods.isValidNow = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (this.usageLimit === 0 || this.usedCount < this.usageLimit)
  );
};

export default mongoose.model('Coupon', CouponSchema);
