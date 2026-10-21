import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Journey } from '../models/Journey.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'wellnest_secret_key', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user & profile
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, character, theme } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      character: character || '🦊',
      theme: theme || 'pastel',
      level: 1,
      xp: 120,
      streak: 1
    });

    // Initialize journey
    await Journey.create({
      userId: user._id,
      level: 1,
      xp: 120,
      streak: 1,
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

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        character: user.character,
        theme: user.theme,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        bio: user.bio
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    // Seed demo user automatically if requested
    if (!user && email === 'hero@wellnest.ai' && password === 'demo123') {
      user = await User.create({
        name: 'Hero Student',
        email: 'hero@wellnest.ai',
        password: 'demo123',
        character: '🦊',
        theme: 'pastel',
        level: 1,
        xp: 120,
        streak: 1,
        bio: 'Student striving for daily mindfulness.'
      });
      await Journey.create({
        userId: user._id,
        level: 1,
        xp: 120,
        streak: 1,
        badges: [{ badgeId: 'seedling', name: 'Seedling', emoji: '🌱', description: 'Started your wellness journey' }]
      });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          character: user.character,
          theme: user.theme,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          bio: user.bio
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.character = req.body.character || user.character;
      user.theme = req.body.theme || user.theme;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.level = req.body.level !== undefined ? req.body.level : user.level;
      user.xp = req.body.xp !== undefined ? req.body.xp : user.xp;
      user.streak = req.body.streak !== undefined ? req.body.streak : user.streak;

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          character: updatedUser.character,
          theme: updatedUser.theme,
          level: updatedUser.level,
          xp: updatedUser.xp,
          streak: updatedUser.streak,
          bio: updatedUser.bio
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.password = newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
