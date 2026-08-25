import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mood: {
      type: String,
      default: null
    },
    sliderValues: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    mlResult: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export const CheckIn = mongoose.model('CheckIn', checkInSchema);
