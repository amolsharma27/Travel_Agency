import mongoose from 'mongoose';
import slugify from 'slugify';

const HotelSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // agency/hotel owner account
    name: { type: String, required: [true, 'Please add a hotel name'], trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ['Hotel', 'Resort', 'Villa', 'Apartment', 'Homestay', 'Hostel'],
      default: 'Hotel',
    },
    starRating: { type: Number, min: 1, max: 5, default: 3 },

    images: { type: [String], default: [] },

    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    landmark: { type: String },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    amenities: { type: [String], default: [] }, // e.g. Free WiFi, Pool, Gym, Parking, Spa
    nearbyAttractions: [
      {
        name: { type: String },
        distanceKm: { type: Number },
      },
    ],

    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },

    policies: {
      cancellationPolicy: {
        type: String,
        enum: ['Free Cancellation', 'Partial Refund', 'Non-Refundable'],
        default: 'Free Cancellation',
      },
      cancellationWindowHours: { type: Number, default: 24 },
      childrenAllowed: { type: Boolean, default: true },
      petsAllowed: { type: Boolean, default: false },
      smokingAllowed: { type: Boolean, default: false },
      breakfastIncluded: { type: Boolean, default: false },
      houseRules: { type: [String], default: [] },
    },

    // Cached/rollup fields for fast search & sort (kept in sync by controllers)
    startingPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    bookingsCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending', // admin approves new hotel listings
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

HotelSchema.index({ city: 'text', name: 'text', address: 'text', landmark: 'text' });

HotelSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now().toString().slice(-5)}`;
  }
  next();
});

export default mongoose.model('Hotel', HotelSchema);
