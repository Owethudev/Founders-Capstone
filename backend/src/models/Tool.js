const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      enum: ['new', 'excellent', 'good', 'fair', 'poor'],
      default: 'good',
    },
    priceType: {
      type: String,
      enum: ['free', 'hourly', 'daily', 'negotiable'],
      default: 'free',
      index: true,
    },
    priceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      formattedAddress: {
        type: String,
        trim: true,
      },
    },
    availabilityStart: {
      type: Date,
      default: null,
    },
    availabilityEnd: {
      type: Date,
      default: null,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'tools',
  }
);

toolSchema.index({ 'location.coordinates': '2dsphere' });
toolSchema.index({ category: 1, isActive: 1, priceType: 1 });
toolSchema.index({ title: 'text', description: 'text', category: 'text' });
toolSchema.index({ ownerId: 1, isActive: 1, createdAt: -1 });
toolSchema.index({ isActive: 1, createdAt: -1 });
toolSchema.index({ isActive: 1, priceAmount: 1 });

module.exports = mongoose.model('Tool', toolSchema);
