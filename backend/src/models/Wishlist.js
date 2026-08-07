import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['package', 'hotel'], required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  },
  { timestamps: true }
);

WishlistSchema.index({ user: 1, package: 1 }, { unique: true, partialFilterExpression: { package: { $exists: true } } });
WishlistSchema.index({ user: 1, hotel: 1 }, { unique: true, partialFilterExpression: { hotel: { $exists: true } } });

export default mongoose.model('Wishlist', WishlistSchema);
