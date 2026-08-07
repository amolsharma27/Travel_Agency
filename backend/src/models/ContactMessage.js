import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional, guest contacts allowed
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
    },
    adminReply: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', ContactMessageSchema);
