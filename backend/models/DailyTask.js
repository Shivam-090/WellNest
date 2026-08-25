import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide task name'],
      trim: true
    },
    desc: {
      type: String,
      default: 'Personal wellness goal.'
    },
    emoji: {
      type: String,
      default: '✨'
    },
    tag: {
      type: String,
      default: '15 minutes'
    },
    durationMinutes: {
      type: Number,
      default: 15
    },
    bgGradient: {
      type: String,
      default: 'from-[#3D6B56] to-[#52936E]'
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    },
    lastCompletedDate: {
      type: String, // 'YYYY-MM-DD'
      default: null
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    timestamps: true
  }
);

export const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);
