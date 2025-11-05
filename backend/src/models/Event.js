const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startTime: {
      type: Date,
      required: [true, 'Please provide a start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Please provide an end time'],
    },
    status: {
      type: String,
      enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
      default: 'BUSY',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

eventSchema.pre('save', function (next) {
  if (this.endTime <= this.startTime) {
    throw new Error('End time must be after start time');
  }
  next();
});

eventSchema.index({ owner: 1, status: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);