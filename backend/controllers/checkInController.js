import { CheckIn } from '../models/CheckIn.js';
import { User } from '../models/User.js';
import { analyzeCheckInWithOllama } from '../services/ollamaService.js';

// @desc    Process & save a new check-in assessment test with Ollama AI
// @route   POST /api/checkins
// @access  Private
export const saveAssessment = async (req, res) => {
  try {
    const { mood, sliderValues } = req.body;

    console.log(`🌸 Processing check-in assessment with Ollama maxwell1500/psycho:12b for user: ${req.user.name}...`);

    // Run deep clinical evaluation using Ollama
    const aiResult = await analyzeCheckInWithOllama({
      mood: mood || 'Okay',
      sliderValues: sliderValues || {},
      userName: req.user.name || 'Student'
    });

    const checkIn = await CheckIn.create({
      userId: req.user._id,
      mood: mood || null,
      sliderValues: sliderValues || {},
      mlResult: aiResult
    });

    // Reward XP for completing check-in
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 50 } });

    res.status(201).json({
      success: true,
      checkIn
    });
  } catch (error) {
    console.error('Check-in processing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get latest check-in result
// @route   GET /api/checkins/latest
// @access  Private
export const getLatestAssessment = async (req, res) => {
  try {
    const latest = await CheckIn.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      checkIn: latest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all check-in test history
// @route   GET /api/checkins
// @access  Private
export const getAssessmentHistory = async (req, res) => {
  try {
    const history = await CheckIn.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
