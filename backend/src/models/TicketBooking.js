import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    seatNumber: { type: String },
    idProofNumber: { type: String },
  },
  { _id: false }
);

const TicketBookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingType: {
      type: String,
      enum: ['flight', 'train', 'bus', 'cab', 'transportation', 'activity', 'passport', 'other'],
      default: 'transportation',
    },
    transportType: {
      type: String,
      default: 'buses',
    },
    itemTitle: {
      type: String,
      required: true,
    },
    fromCity: {
      type: String,
    },
    toCity: {
      type: String,
    },
    destination: {
      type: String,
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    selectedOption: {
      type: String,
    },
    travellersCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    passengers: {
      type: [passengerSchema],
      default: [],
    },
    contactName: {
      type: String,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid',
    },
    status: {
      type: String,
      enum: ['pending', 'pending_approval', 'under_review', 'confirmed', 'completed', 'cancelled', 'rejected'],
      default: 'confirmed',
    },
    cancellationReason: {
      type: String,
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    pickupLocation: {
      type: String,
    },
    dropLocation: {
      type: String,
    },
    specialNotes: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

TicketBookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    const prefix = this.bookingType ? this.bookingType.slice(0, 3).toUpperCase() : 'TKT';
    this.bookingReference = `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  }
  next();
});

export default mongoose.model('TicketBooking', TicketBookingSchema);
