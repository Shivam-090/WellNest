import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/password', protect, changePassword);

export default router;
