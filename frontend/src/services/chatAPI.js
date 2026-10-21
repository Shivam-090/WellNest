/**
 * Chat & Ollama AI Conversation API Service
 * Handles multi-turn chat sessions and interactions with local Ollama psycho:12b
 */

import api from './api';

export const chatAPI = {
  /**
   * Fetch all user chat sessions
   */
  async getSessions() {
    try {
      const response = await api.get('/chat/sessions');
      return response.data;
    } catch {
      const saved = localStorage.getItem('wellnest_chat_sessions');
      return { success: true, sessions: saved ? JSON.parse(saved) : [] };
    }
  },

  /**
   * Create a new chat conversation session
   */
  async createSession(sessionData = {}) {
    try {
      const response = await api.post('/chat/sessions', sessionData);
      return response.data;
    } catch {
      const newSession = {
        id: 'chat_' + Date.now(),
        title: sessionData.title || 'New Conversation',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: 1,
            sender: 'ai',
            text: "Hello! 🌸 I'm your WellNest AI Companion. How can I support your peace of mind today?",
            time: 'Just now'
          }
        ]
      };
      return { success: true, session: newSession };
    }
  },

  /**
   * Get single conversation session by ID
   */
  async getSessionById(sessionId) {
    try {
      const response = await api.get(`/chat/sessions/${sessionId}`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Get all messages for a specific session
   */
  async getMessages(sessionId) {
    try {
      const response = await api.get(`/chat/sessions/${sessionId}/messages`);
      return response.data;
    } catch (err) {
      console.warn('Get session messages error:', err.message);
      return { success: false, messages: [] };
    }
  },

  /**
   * Send user message to Ollama psycho:12b and receive structured reply
   */
  async sendMessage(sessionId, text) {
    try {
      const response = await api.post(`/chat/sessions/${sessionId}/messages`, { text }, {
        timeout: 180000 // 3-minute timeout for local 12B Ollama generation
      });
      return response.data;
    } catch (err) {
      console.warn('Chat API notice:', err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
    }
  },

  /**
   * Rename a chat conversation session
   */
  async renameSession(sessionId, title) {
    try {
      const response = await api.put(`/chat/sessions/${sessionId}`, { title });
      return response.data;
    } catch {
      return { success: true };
    }
  },

  /**
   * Delete a chat conversation session
   */
  async deleteSession(sessionId) {
    try {
      const response = await api.delete(`/chat/sessions/${sessionId}`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  /**
   * Check local Ollama model connection status
   */
  async getModelStatus() {
    try {
      const response = await api.get('/chat/status');
      return response.data;
    } catch {
      return { online: false, model: 'WellNest AI' };
    }
  }
};

// Aliases
export const chatService = chatAPI;
export default chatAPI;
