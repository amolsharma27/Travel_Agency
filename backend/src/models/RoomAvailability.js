import mongoose from 'mongoose';

// One document per room + date. bookedCount is incremented/decremented as
// bookings are confirmed/cancelled. Lets us answer "is this room available
// for these dates" and "how many rooms are left" without scanning bookings.
const RoomAvailabilitySchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    date: { type: Date, required: true }, // normalized to midnight UTC
    bookedCount: { type: Number, default: 0 },
    blockedCount: { type: Number, default: 0 }, // manually blocked by owner (maintenance etc.)
  },
  { timestamps: true }
);

RoomAvailabilitySchema.index({ room: 1, date: 1 }, { unique: true });

export default mongoose.model('RoomAvailability', RoomAvailabilitySchema);
