/**
 * Journey & Gamification API Service
 * Handles user progression, XP gain, level metrics, and achievements
 */

import api from './api';

export const journeyAPI = {
  async getStats() {
    try {
      const response = await api.get('/journey/stats');
      return response.data;
    } catch {
      return { success: true, streak: 1, xp: 120, level: 1 };
    }
  },

  async addXp(amount, reason = 'Activity Completion') {
    try {
      const response = await api.post('/journey/xp', { amount, reason });
      return response.data;
    } catch {
      return { success: true };
    }
  }
};

// Aliases
export const journeyService = journeyAPI;
export default journeyAPI;
