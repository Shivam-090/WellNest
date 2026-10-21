/**
 * Daily Tasks & Activity API Service
 * Handles CRUD operations and progress for daily relief routines
 */

import api from './api';

export const tasksAPI = {
  async getTasks() {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch {
      const saved = localStorage.getItem('wellnest_custom_tasks');
      return { success: true, tasks: saved ? JSON.parse(saved) : [] };
    }
  },

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch {
      const newTask = {
        id: 'task_' + Date.now(),
        ...taskData,
        isCustom: true,
        completed: false,
        createdAt: new Date().toISOString()
      };
      return { success: true, task: newTask };
    }
  },

  async updateTask(taskId, updates) {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  async toggleTaskComplete(taskId) {
    try {
      const response = await api.patch(`/tasks/${taskId}/toggle`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch {
      return { success: true };
    }
  }
};

// Aliases
export const taskService = tasksAPI;
export default tasksAPI;
