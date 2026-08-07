import mongoose from 'mongoose';

const seasonalPriceSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    name: { type: String, required: [true, 'Please add a room type name'] }, // e.g. "Deluxe King Room"
    images: { type: [String], default: [] },
    description: { type: String },

    maxAdults: { type: Number, required: true, default: 2 },
    maxChildren: { type: Number, default: 1 },
    bedType: { type: String, default: 'Queen' },
    sizeSqft: { type: Number },

    basePrice: { type: Number, required: [true, 'Please add a base price per night'] },
    seasonalPricing: { type: [seasonalPriceSchema], default: [] },

    totalRooms: { type: Number, required: true, default: 1 }, // total inventory of this room type
    amenities: { type: [String], default: [] }, // AC, TV, minibar, balcony, etc.

    breakfastIncluded: { type: Boolean, default: false },
    freeCancellation: { type: Boolean, default: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Returns the effective per-night price for a given date, accounting for
// seasonal pricing overrides.
RoomSchema.methods.priceForDate = function (date) {
  const d = new Date(date);
  const season = this.seasonalPricing.find((s) => d >= s.startDate && d <= s.endDate);
  return season ? season.price : this.basePrice;
};

export default mongoose.model('Room', RoomSchema);
