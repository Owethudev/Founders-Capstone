const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    borrowRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BorrowRequest',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'messages',
  }
);

messageSchema.index({ borrowRequestId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
