import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 120
    },
    streak: {
      type: Number,
      default: 1
    },
    lastCheckInDate: {
      type: Date,
      default: Date.now
    },
    badges: [
      {
        badgeId: String,
        name: String,
        emoji: String,
        description: String,
        unlockedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    milestones: [
      {
        level: Number,
        title: String,
        status: {
          type: String,
          enum: ['completed', 'current', 'locked'],
          default: 'locked'
        },
        unlockedAt: Date
      }
    ],
    xpLog: [
      {
        amount: Number,
        reason: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Journey = mongoose.model('Journey', journeySchema);
