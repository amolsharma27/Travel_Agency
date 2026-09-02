import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student Name is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll Number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    packageTitle: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true,
    },
    destination: {
      type: String,
      default: '',
    },
    requestType: {
      type: String,
      enum: ['On Request', 'Booking Request'],
      default: 'On Request',
    },
    tourDuration: {
      type: String,
      default: '',
    },
    tourPrice: {
      type: String,
      default: 'On Request',
    },
    requestDate: {
      type: String,
    },
    requestTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Confirmed', 'Closed'],
      default: 'New',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Enquiry', enquirySchema);
