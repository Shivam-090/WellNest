import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/toggle', protect, toggleTaskComplete);

export default router;
