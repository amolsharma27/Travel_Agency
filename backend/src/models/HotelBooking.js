import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
  },
  { _id: false }
);

const HotelBookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // hotel owner/agency

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    roomsBooked: { type: Number, required: true, min: 1, default: 1 },
    adults: { type: Number, required: true, default: 2 },
    children: { type: Number, default: 0 },
    guests: { type: [guestSchema], default: [] },

    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },

    pricePerNight: { type: Number, required: true }, // snapshot at time of booking
    subtotal: { type: Number, required: true },
    couponCode: { type: String },
    discountApplied: { type: Number, default: 0 },
    taxesAndFees: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },

    status: {
      type: String,
      enum: ['pending_payment', 'pending_approval', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending_payment',
    },
    cancellationPolicySnapshot: { type: String },
    cancellationReason: { type: String },
    bookingReference: { type: String, unique: true },
  },
  { timestamps: true }
);

HotelBookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = `HTL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model('HotelBooking', HotelBookingSchema);
