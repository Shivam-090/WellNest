import { Journey } from '../models/Journey.js';
import { User } from '../models/User.js';

// @desc    Get user journey, level, streak, and milestones
// @route   GET /api/journey
// @access  Private
export const getJourneyStatus = async (req, res) => {
  try {
    let journey = await Journey.findOne({ userId: req.user._id });

    if (!journey) {
      journey = await Journey.create({
        userId: req.user._id,
        level: req.user.level || 1,
        xp: req.user.xp || 120,
        streak: req.user.streak || 1,
        badges: [{ badgeId: 'seedling', name: 'Seedling', emoji: '🌱', description: 'Started your wellness journey' }],
        milestones: [
          { level: 1, title: 'Seedling: The Beginning', status: 'current', unlockedAt: new Date() },
          { level: 2, title: 'Sprout: Growing Awareness', status: 'locked' },
          { level: 3, title: 'Bloom: Finding Harmony', status: 'locked' },
          { level: 4, title: 'Flourish: Resilience Built', status: 'locked' },
          { level: 5, title: 'Radiance: Mindful Master', status: 'locked' },
          { level: 6, title: 'Zen Sanctuary: Inner Peace', status: 'locked' }
        ]
      });
    }

    res.json({
      success: true,
      journey
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Award XP and calculate levels
// @route   POST /api/journey/xp
// @access  Private
export const addXp = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const xpToAdd = Number(amount) || 20;

    let journey = await Journey.findOne({ userId: req.user._id });
    if (!journey) {
      journey = await Journey.create({ userId: req.user._id });
    }

    const currentXp = (journey.xp || 0) + xpToAdd;
    let newLevel = 1;
    if (currentXp >= 4000) newLevel = 6;
    else if (currentXp >= 2500) newLevel = 5;
    else if (currentXp >= 1500) newLevel = 4;
    else if (currentXp >= 750) newLevel = 3;
    else if (currentXp >= 300) newLevel = 2;

    journey.xp = currentXp;
    journey.level = newLevel;
    journey.xpLog.push({
      amount: xpToAdd,
      reason: reason || 'Activity Completion',
      timestamp: new Date()
    });

    await journey.save();
    await User.findByIdAndUpdate(req.user._id, { xp: currentXp, level: newLevel });

    res.json({
      success: true,
      xp: currentXp,
      level: newLevel,
      journey
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
