import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingType: { type: String, enum: ['package', 'hotel'], required: true },
    packageBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'PackageBooking' },
    hotelBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelBooking' },

    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    isMock: { type: Boolean, default: false }, // true when Razorpay keys aren't configured yet
    method: { type: String }, // card, upi, netbanking, etc. (from Razorpay webhook/verify)
    failureReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', PaymentSchema);
