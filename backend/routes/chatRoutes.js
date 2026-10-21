import express from 'express';
import {
  getModelStatus,
  getChatSessions,
  createChatSession,
  getSessionMessages,
  sendMessageToSession,
  renameChatSession,
  deleteChatSession
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Model Health & Status (Public)
router.get('/status', getModelStatus);

// Sessions CRUD (Protected)
router.route('/sessions')
  .get(protect, getChatSessions)
  .post(protect, createChatSession);

router.route('/sessions/:id')
  .put(protect, renameChatSession)
  .delete(protect, deleteChatSession);

router.route('/sessions/:id/messages')
  .get(protect, getSessionMessages)
  .post(protect, sendMessageToSession);

export default router;
