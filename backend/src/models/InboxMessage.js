import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema(
  {
    sender: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, default: 'admin' },
      avatar: { type: String },
    },
    message: { type: String, required: true },
    messageHtml: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const AttachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String },
  url: { type: String, required: true },
  type: { type: String },
});

const InboxMessageSchema = new mongoose.Schema(
  {
    sender: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String },
      role: {
        type: String,
        enum: ['student', 'customer', 'agency', 'admin', 'system'],
        default: 'customer',
      },
    },
    recipient: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, default: 'admin' },
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    bodyText: {
      type: String,
      required: true,
    },
    bodyHtml: {
      type: String,
    },
    folder: {
      type: String,
      enum: ['inbox', 'sent', 'drafts', 'trash'],
      default: 'inbox',
      index: true,
    },
    category: {
      type: String,
      enum: [
        'student_registration',
        'booking',
        'passport',
        'support',
        'custom_tour',
        'system',
        'general',
      ],
      default: 'general',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrash: {
      type: Boolean,
      default: false,
      index: true,
    },
    threadId: {
      type: String,
      index: true,
    },
    replies: [ReplySchema],
    tags: [
      {
        type: String,
      },
    ],
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    attachments: [AttachmentSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search & filtering
InboxMessageSchema.index({ createdAt: -1 });
InboxMessageSchema.index({ 'sender.email': 1 });
InboxMessageSchema.index({ 'recipient.email': 1 });
InboxMessageSchema.index({ subject: 'text', bodyText: 'text' });

export default mongoose.model('InboxMessage', InboxMessageSchema);
