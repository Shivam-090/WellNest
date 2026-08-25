/**
 * Check-in & AI Assessment API Service
 * Handles submitting 20-dimension check-in assessments to Ollama and retrieving reports
 */

import api from './api';

export const checkInAPI = {
  /**
   * Submit complete check-in test to backend & Ollama maxwell1500/psycho:12b
   */
  async saveAssessment(assessmentData) {
    try {
      const response = await api.post('/checkins', assessmentData, {
        timeout: 180000 // 3-minute timeout for local 12B Ollama evaluation
      });
      return response.data;
    } catch (err) {
      console.warn('Check-in API notice:', err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
        assessment: assessmentData
      };
    }
  },

  /**
   * Get latest check-in assessment report
   */
  async getLatestAssessment() {
    try {
      const response = await api.get('/checkins/latest');
      return response.data;
    } catch {
      const saved = localStorage.getItem('wellnest_latest_result');
      return { success: true, assessment: saved ? JSON.parse(saved) : null };
    }
  },

  /**
   * Get historical check-in assessments
   */
  async getAssessmentHistory() {
    try {
      const response = await api.get('/checkins/history');
      return response.data;
    } catch {
      return { success: true, history: [] };
    }
  }
};

// Aliases
export const assessmentService = checkInAPI;
export const checkInService = checkInAPI;
export default checkInAPI;
