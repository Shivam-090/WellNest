import express from 'express';
import {
  getJourneyStatus,
  addXp
} from '../controllers/journeyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getJourneyStatus);
router.post('/xp', protect, addXp);

export default router;
