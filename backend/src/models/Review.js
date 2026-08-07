import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['package', 'hotel'], required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    images: { type: [String], default: [] },
    ownerReply: {
      text: { type: String },
      repliedAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['visible', 'flagged', 'removed'],
      default: 'visible',
    },
  },
  { timestamps: true }
);

// A customer can only review a given package/hotel once
ReviewSchema.index({ user: 1, package: 1 }, { unique: true, partialFilterExpression: { package: { $exists: true } } });
ReviewSchema.index({ user: 1, hotel: 1 }, { unique: true, partialFilterExpression: { hotel: { $exists: true } } });

export default mongoose.model('Review', ReviewSchema);
