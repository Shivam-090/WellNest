import { DailyTask } from '../models/DailyTask.js';
import { User } from '../models/User.js';

// Default starter activities
const DEFAULT_TASKS = [
  {
    name: 'Mindful Breathing',
    desc: '4-4-4 Box Breathing. 4s inhale, 4s hold, 4s exhale to instantly reset your nervous system.',
    emoji: '🫁',
    tag: '5 minutes',
    durationMinutes: 5,
    bgGradient: 'from-[#3D6B56] to-[#52936E]',
    isCustom: false
  },
  {
    name: 'Academic Reset & Plan',
    desc: 'Pick your #1 heavy task and split it into three 15-minute micro-steps. Write only step 1.',
    emoji: '📚',
    tag: '10 minutes',
    durationMinutes: 10,
    bgGradient: 'from-[#4A3580] to-[#7B6BC0]',
    isCustom: false
  },
  {
    name: 'Restorative Sleep Prep',
    desc: 'Set devices aside 30 minutes before bed. Dim overhead lighting and do 5 deep shoulder rolls.',
    emoji: '🌙',
    tag: '15 minutes',
    durationMinutes: 15,
    bgGradient: 'from-[#6B3A5A] to-[#A05580]',
    isCustom: false
  },
  {
    name: 'Positive Self-Reflection',
    desc: 'Write 3 small things that went right today, no matter how tiny, plus one strength you showed.',
    emoji: '✨',
    tag: '5 minutes',
    durationMinutes: 5,
    bgGradient: 'from-[#5A4A1A] to-[#9B7E3A]',
    isCustom: false
  }
];

// @desc    Get all daily tasks for user (auto-resets completed tasks from previous days)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let tasks = await DailyTask.find({ userId: req.user._id }).sort({ createdAt: -1 });

    if (tasks.length === 0) {
      const seeded = DEFAULT_TASKS.map((t) => ({
        ...t,
        userId: req.user._id,
        completed: false,
        lastCompletedDate: null
      }));
      tasks = await DailyTask.insertMany(seeded);
    } else {
      // Auto-Reset Check: If a task was completed on a previous day, reset completed to false for today
      let modified = false;
      for (const task of tasks) {
        if (task.completed && task.lastCompletedDate && task.lastCompletedDate !== today) {
          task.completed = false;
          await task.save();
          modified = true;
        }
      }
      if (modified) {
        tasks = await DailyTask.find({ userId: req.user._id }).sort({ createdAt: -1 });
      }
    }

    res.json({
      success: true,
      count: tasks.length,
      today,
      tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a custom daily task (always starts active for today)
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { name, desc, emoji, tag, durationMinutes, bgGradient } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide task name' });
    }

    const task = await DailyTask.create({
      userId: req.user._id,
      name: name.trim(),
      desc: desc?.trim() || 'Personal wellness goal.',
      emoji: emoji || '✨',
      tag: tag || `${durationMinutes || 15} minutes`,
      durationMinutes: Number(durationMinutes) || 15,
      bgGradient: bgGradient || 'from-[#3D6B56] to-[#52936E]',
      isCustom: true,
      completed: false,
      completedAt: null,
      lastCompletedDate: null
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a daily task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await DailyTask.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.name = req.body.name || task.name;
    task.desc = req.body.desc !== undefined ? req.body.desc : task.desc;
    task.emoji = req.body.emoji || task.emoji;
    task.tag = req.body.tag || task.tag;
    task.durationMinutes = req.body.durationMinutes !== undefined ? req.body.durationMinutes : task.durationMinutes;
    task.bgGradient = req.body.bgGradient || task.bgGradient;

    const updated = await task.save();

    res.json({
      success: true,
      task: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle task completion & award XP once per day
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
export const toggleTaskComplete = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const task = await DailyTask.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const wasCompleted = task.completed;
    task.completed = !wasCompleted;

    if (task.completed) {
      task.completedAt = new Date();
      task.lastCompletedDate = today;
      // Award XP for completing task
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 25 } });
    } else {
      task.completedAt = null;
    }

    const updated = await task.save();

    res.json({
      success: true,
      task: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete custom task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await DailyTask.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
