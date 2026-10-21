import express from 'express';
import {
  saveAssessment,
  getLatestAssessment,
  getAssessmentHistory
} from '../controllers/checkInController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, saveAssessment)
  .get(protect, getAssessmentHistory);

router.get('/latest', protect, getLatestAssessment);

export default router;
