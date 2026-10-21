import mongoose from 'mongoose';
import { ChatSession } from '../models/ChatSession.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { generateOllamaChat, checkOllamaStatus } from '../services/ollamaService.js';

// Helper to safely resolve a session or create a valid one
const resolveSession = async (sessionIdParam, userId, defaultTitle = 'New Conversation') => {
  if (sessionIdParam && mongoose.Types.ObjectId.isValid(sessionIdParam)) {
    const existing = await ChatSession.findOne({ _id: sessionIdParam, userId });
    if (existing) return existing;
  }

  // If not valid ObjectId or not found, try to find user's latest session
  let session = await ChatSession.findOne({ userId }).sort({ updatedAt: -1 });
  if (!session) {
    session = await ChatSession.create({
      userId,
      title: defaultTitle
    });
  }
  return session;
};

// @desc    Check Ollama and local model status
// @route   GET /api/chat/status
// @access  Public
export const getModelStatus = async (req, res) => {
  try {
    const status = await checkOllamaStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all chat sessions for user with their message histories
// @route   GET /api/chat/sessions
// @access  Private
export const getChatSessions = async (req, res) => {
  try {
    let sessions = await ChatSession.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    if (sessions.length === 0) {
      const defaultSession = await ChatSession.create({
        userId: req.user._id,
        title: 'Welcome & Check-in'
      });

      await ChatMessage.create({
        sessionId: defaultSession._id,
        userId: req.user._id,
        sender: 'ai',
        text: `Hello ${req.user.name}! 🌸 I'm your WellNest AI Companion. Whether you're feeling stressed about school, need a quick calming breath, or just want to reflect, I'm here for you. How are you feeling today?`
      });

      sessions = [defaultSession];
    }

    // Populate all messages for each session
    const populatedSessions = await Promise.all(
      sessions.map(async (sess) => {
        const messages = await ChatMessage.find({ sessionId: sess._id }).sort({ createdAt: 1 });
        return {
          _id: sess._id,
          id: sess._id.toString(),
          title: sess.title,
          userId: sess.userId,
          createdAt: sess.createdAt,
          updatedAt: sess.updatedAt,
          messages: messages.map((m) => ({
            id: m._id ? m._id.toString() : m.id,
            _id: m._id ? m._id.toString() : m.id,
            sender: m.sender,
            text: m.text,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: m.createdAt
          }))
        };
      })
    );

    res.json({
      success: true,
      count: populatedSessions.length,
      sessions: populatedSessions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new chat session
// @route   POST /api/chat/sessions
// @access  Private
export const createChatSession = async (req, res) => {
  try {
    const { title, initialMessage } = req.body;

    const session = await ChatSession.create({
      userId: req.user._id,
      title: title || 'New Conversation'
    });

    // Seed welcoming AI message
    const welcomeMsg = await ChatMessage.create({
      sessionId: session._id,
      userId: req.user._id,
      sender: 'ai',
      text: `Hi ${req.user.name} 🌸 New session started. What's on your mind?`
    });

    const messages = [
      {
        id: welcomeMsg._id.toString(),
        sender: 'ai',
        text: welcomeMsg.text,
        time: new Date(welcomeMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: welcomeMsg.createdAt
      }
    ];

    if (initialMessage) {
      const userMsg = await ChatMessage.create({
        sessionId: session._id,
        userId: req.user._id,
        sender: 'user',
        text: initialMessage
      });
      messages.push({
        id: userMsg._id.toString(),
        sender: 'user',
        text: userMsg.text,
        time: new Date(userMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: userMsg.createdAt
      });

      // Generate AI Reply using local Ollama model
      const aiResult = await generateOllamaChat(
        [{ sender: 'user', text: initialMessage }],
        { name: req.user.name }
      );

      const aiMsg = await ChatMessage.create({
        sessionId: session._id,
        userId: req.user._id,
        sender: 'ai',
        text: aiResult.text
      });
      messages.push({
        id: aiMsg._id.toString(),
        sender: 'ai',
        text: aiMsg.text,
        time: new Date(aiMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: aiMsg.createdAt
      });
    }

    res.status(201).json({
      success: true,
      session: {
        _id: session._id,
        id: session._id.toString(),
        title: session.title,
        userId: session.userId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages for a specific session
// @route   GET /api/chat/sessions/:id/messages
// @access  Private
export const getSessionMessages = async (req, res) => {
  try {
    const session = await resolveSession(req.params.id, req.user._id);
    const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });

    res.json({
      success: true,
      sessionId: session._id.toString(),
      count: messages.length,
      messages: messages.map((m) => ({
        id: m._id ? m._id.toString() : m.id,
        _id: m._id ? m._id.toString() : m.id,
        sender: m.sender,
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: m.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message to a session & receive AI response from Ollama
// @route   POST /api/chat/sessions/:id/messages
// @access  Private
export const sendMessageToSession = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const session = await resolveSession(req.params.id, req.user._id, text.slice(0, 26));

    // Save user message
    const userMessage = await ChatMessage.create({
      sessionId: session._id,
      userId: req.user._id,
      sender: 'user',
      text
    });

    // Auto-update session title if it's default
    const userMsgCount = await ChatMessage.countDocuments({ sessionId: session._id, sender: 'user' });
    if (userMsgCount <= 1 && (session.title === 'New Conversation' || session.title === 'Welcome & Check-in')) {
      session.title = text.slice(0, 26) + (text.length > 26 ? '...' : '');
    }
    session.updatedAt = new Date();
    await session.save();

    // Fetch previous conversation history for multi-turn context (last 8 messages)
    const previousMessages = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: 1 })
      .limit(8);

    const historyForAi = previousMessages.map((m) => ({
      sender: m.sender,
      text: m.text
    }));

    // Generate AI response with Ollama maxwell1500/psycho:12b
    const aiResult = await generateOllamaChat(historyForAi, {
      name: req.user.name
    });

    // Save AI response
    const aiMessage = await ChatMessage.create({
      sessionId: session._id,
      userId: req.user._id,
      sender: 'ai',
      text: aiResult.text
    });

    session.updatedAt = new Date();
    await session.save();

    res.json({
      success: true,
      sessionId: session._id.toString(),
      sessionTitle: session.title,
      userMessage: {
        id: userMessage._id.toString(),
        _id: userMessage._id.toString(),
        sender: 'user',
        text: userMessage.text,
        time: new Date(userMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: userMessage.createdAt
      },
      aiMessage: {
        id: aiMessage._id.toString(),
        _id: aiMessage._id.toString(),
        sender: 'ai',
        text: aiMessage.text,
        time: new Date(aiMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: aiMessage.createdAt
      },
      modelUsed: aiResult.model,
      provider: aiResult.provider
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rename a chat session
// @route   PUT /api/chat/sessions/:id
// @access  Private
export const renameChatSession = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide new session title' });
    }

    const session = await ChatSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, updatedAt: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a chat session and its messages
// @route   DELETE /api/chat/sessions/:id
// @access  Private
export const deleteChatSession = async (req, res) => {
  try {
    const session = await ChatSession.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    await ChatMessage.deleteMany({ sessionId: session._id });

    res.json({
      success: true,
      message: 'Chat session and its messages deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
