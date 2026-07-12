const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema(
  {
    toolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool',
      required: true,
      index: true,
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    pickupLocation: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    responseMessage: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'borrowRequests',
  }
);

borrowRequestSchema.index({ startDate: 1, endDate: 1 });
borrowRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
