import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    }
  },
  {
    timestamps: true
  }
);

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
