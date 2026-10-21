/**
 * Profile & Authentication API Service
 * Handles user authentication, profile settings, and credential management
 */

import api, { getStoredUser, setStoredAuth, clearStoredAuth } from './api';

export const profileAPI = {
  /**
   * Log in user with email & password
   */
  async login({ email, password }) {
    const cleanEmail = email?.trim().toLowerCase();
    const response = await api.post('/auth/login', {
      email: cleanEmail,
      password
    });

    if (response.data?.token && response.data?.user) {
      setStoredAuth(response.data.token, response.data.user);
    }
    return response.data;
  },

  /**
   * Register a new user account
   */
  async signup({ name, email, password, character = '🦊' }) {
    const cleanEmail = email?.trim().toLowerCase();
    const cleanName = name?.trim();

    const response = await api.post('/auth/signup', {
      name: cleanName,
      email: cleanEmail,
      password,
      character
    });

    if (response.data?.token && response.data?.user) {
      setStoredAuth(response.data.token, response.data.user);
    }
    return response.data;
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        throw err;
      }
      const stored = getStoredUser();
      if (stored) {
        return { success: true, user: stored };
      }
      throw err;
    }
  },

  async getProfile() {
    return this.getMe();
  },

  /**
   * Update profile details (character, name, level, streak, xp)
   */
  async updateProfile(updates) {
    try {
      const response = await api.put('/auth/profile', updates);
      if (response.data?.user) {
        const current = getStoredUser() || {};
        setStoredAuth(undefined, { ...current, ...response.data.user });
      }
      return response.data;
    } catch {
      const current = getStoredUser() || {};
      const updated = { ...current, ...updates };
      setStoredAuth(undefined, updated);
      return { success: true, user: updated };
    }
  },

  /**
   * Update user password
   */
  async changePassword({ currentPassword, newPassword }) {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  /**
   * Log out user and clear stored tokens
   */
  logout() {
    clearStoredAuth();
  }
};

// Aliases
export const authAPI = profileAPI;
export const authService = profileAPI;
export default profileAPI;
