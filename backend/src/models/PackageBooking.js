import mongoose from 'mongoose';

const travellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    idProofNumber: { type: String },
  },
  { _id: false }
);

const PackageBookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    travelDate: { type: Date, required: true },
    travellers: { type: [travellerSchema], default: [] },
    seatsBooked: { type: Number, required: true, min: 1 },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },
    discountApplied: { type: Number, default: 0 },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    status: {
      type: String,
      enum: ['pending_payment', 'pending_approval', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending_payment',
    },
    cancellationReason: { type: String },
    bookingReference: { type: String, unique: true },
  },
  { timestamps: true }
);

PackageBookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = `PKG-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model('PackageBooking', PackageBookingSchema);
