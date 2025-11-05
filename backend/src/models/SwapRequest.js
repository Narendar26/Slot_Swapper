const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    requesterUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requesterSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

swapRequestSchema.index({ status: 1 });
swapRequestSchema.index({ recipientUser: 1, status: 1 });
swapRequestSchema.index({ requesterUser: 1, status: 1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);