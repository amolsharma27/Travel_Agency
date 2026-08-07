import mongoose from 'mongoose';
import slugify from 'slugify';

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const PackageSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: [true, 'Please add a package title'], trim: true },
    slug: { type: String, unique: true },
    destination: { type: String, required: [true, 'Please add a destination'], trim: true },
    description: { type: String, required: [true, 'Please add a description'] },
    images: { type: [String], default: [] },
    price: { type: Number, required: [true, 'Please add a price'] },
    discountPrice: { type: Number },
    durationDays: { type: Number, required: true },
    durationNights: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    startDates: [{ type: Date }],
    meetingPoint: { type: String },
    travelMode: { type: String, enum: ['Bus', 'Train', 'Flight', 'Cab', 'Cruise', 'Mixed'], default: 'Bus' },
    itinerary: [itineraryDaySchema],
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    category: {
      type: String,
      enum: ['Adventure', 'Historical', 'Beach', 'Nature', 'Cultural', 'Honeymoon', 'Family', 'Pilgrimage'],
      default: 'Adventure',
    },
    gpsLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    bookingsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending', // Admin approves packages before they go public
    },
    isActive: { type: Boolean, default: true }, // agency can pause a package without deleting it
  },
  { timestamps: true }
);

PackageSchema.index({ destination: 'text', title: 'text' });

PackageSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString().slice(-5)}`;
  }
  next();
});

export default mongoose.model('Package', PackageSchema);
