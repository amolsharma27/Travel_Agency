import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'agency', 'admin'],
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },

    // --- Customer-specific profile fields ---
    dob: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    city: { type: String },
    state: { type: String },
    address: { type: String },
    passportNumber: { type: String },
    passportExpiry: { type: String },
    aadhaarLast4: { type: String },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String }
    },
    coTravelers: [{
      name: { type: String },
      relation: { type: String },
      phone: { type: String },
      passport: { type: String }
    }],

    // --- Agency-specific fields (only relevant when role === 'agency') ---
    agencyName: { type: String, trim: true },
    agencyDescription: { type: String },
    agencyLogo: { type: String },
    agencyDocuments: [{ type: String }], // e.g. business license uploads for verification
    agencyStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    commissionRate: { type: Number, default: 8.5 },
    licenseNo: { type: String },
    website: { type: String },
    bankAccountName: { type: String },
    bankAccountNumber: { type: String },
    bankIfsc: { type: String },
    bankName: { type: String },
    kycStatus: {
      type: String,
      enum: ['pending', 'under_review', 'verified', 'rejected'],
      default: 'verified',
    },

    // --- Password reset via OTP ---
    resetOtp: { type: String, select: false },
    resetOtpExpires: { type: Date, select: false },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetOtp;
  delete obj.resetOtpExpires;
  return obj;
};

export default mongoose.model('User', UserSchema);
