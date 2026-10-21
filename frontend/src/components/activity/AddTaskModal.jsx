import { useState, useEffect } from 'react';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Sparkles, AlertCircle } from 'lucide-react';

const EMOJI_CHOICES = ['🏃', '🧘', '📓', '🥤', '🫁', '🎧', '🎨', '🌿', '💤', '🍎', '✍️', '🐕'];
const GRADIENT_CHOICES = [
  { name: 'Forest Emerald', class: 'from-[#3D6B56] to-[#52936E]' },
  { name: 'Mystic Lavender', class: 'from-[#4A3580] to-[#7B6BC0]' },
  { name: 'Warm Blossom', class: 'from-[#6B3A5A] to-[#A05580]' },
  { name: 'Golden Sun', class: 'from-[#5A4A1A] to-[#9B7E3A]' },
  { name: 'Ocean Cyan', class: 'from-[#1A455A] to-[#2E7A9B]' },
  { name: 'Deep Cosmic', class: 'from-[#2A1F4E] to-[#453270]' }
];

export default function AddTaskModal({ isOpen, onClose, editingTask = null }) {
  const { addTask, updateTask } = useWellness();
  const { burstPetals } = useTheme();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState(15);
  const [selectedEmoji, setSelectedEmoji] = useState('🌿');
  const [selectedGradient, setSelectedGradient] = useState('from-[#3D6B56] to-[#52936E]');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name || '');
      setDesc(editingTask.desc || '');
      setDuration(editingTask.durationMinutes || 15);
      setSelectedEmoji(editingTask.emoji || '🌿');
      setSelectedGradient(editingTask.bgGradient || 'from-[#3D6B56] to-[#52936E]');
    } else {
      setName('');
      setDesc('');
      setDuration(15);
      setSelectedEmoji('🌿');
      setSelectedGradient('from-[#3D6B56] to-[#52936E]');
    }
    setErrors({});
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const cleanName = name.trim();

    if (!cleanName) {
      errs.name = 'Task name is required.';
    } else if (cleanName.length < 3) {
      errs.name = 'Task name must be at least 3 characters.';
    } else if (cleanName.length > 40) {
      errs.name = 'Task name cannot exceed 40 characters.';
    }

    if (desc && desc.length > 120) {
      errs.desc = 'Description cannot exceed 120 characters.';
    }

    const dur = Number(duration);
    if (isNaN(dur) || dur < 5 || dur > 60) {
      errs.duration = 'Duration must be between 5 and 60 minutes.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        name: name.trim(),
        desc: desc.trim() || 'Personal wellness goal.',
        durationMinutes: Number(duration),
        tag: `${duration} minutes`,
        emoji: selectedEmoji,
        bgGradient: selectedGradient
      });
    } else {
      addTask({
        name: name.trim(),
        desc: desc.trim() || 'Personal wellness goal.',
        durationMinutes: Number(duration),
        tag: `${duration} minutes`,
        emoji: selectedEmoji,
        bgGradient: selectedGradient
      });
    }

    burstPetals();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-card glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-border animate-scale-in text-text-primary max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-xl shadow-sm">
              {selectedEmoji}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-text-primary">
                {editingTask ? 'Edit Wellness Task' : 'Add Custom Wellness Task'}
              </h3>
              <p className="text-xs text-text-secondary">
                Tailor your daily relief routine to what works best for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-input text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Task Name / Goal *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Evening Journaling, 10-min Yoga, Screen detox..."
              maxLength={40}
              className={`w-full px-4 py-3 rounded-2xl bg-surface-input border text-sm text-text-primary focus:outline-none focus:ring-2 font-sans transition-all ${
                errors.name ? 'border-red-400 focus:ring-red-400' : 'border-surface-border focus:ring-primary'
              }`}
              required
            />
            {errors.name && (
              <p className="text-[11px] font-semibold text-red-500 mt-1 ml-2 animate-fade-in">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Gentle Guidance / Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                if (errors.desc) setErrors((prev) => ({ ...prev, desc: '' }));
              }}
              placeholder="Describe how this activity helps you unwind..."
              rows={2}
              maxLength={120}
              className={`w-full px-4 py-2.5 rounded-2xl bg-surface-input border text-xs text-text-primary focus:outline-none focus:ring-2 font-sans resize-none transition-all ${
                errors.desc ? 'border-red-400 focus:ring-red-400' : 'border-surface-border focus:ring-primary'
              }`}
            />
            {errors.desc && (
              <p className="text-[11px] font-semibold text-red-500 mt-1 ml-2 animate-fade-in">
                {errors.desc}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Duration (Minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="fancy-slider flex-1"
                style={{ '--pct': `${((duration - 5) / 55) * 100}%` }}
              />
              <span className="font-display font-bold text-sm text-primary px-3 py-1 bg-primary-soft rounded-xl min-w-[60px] text-center">
                {duration}m
              </span>
            </div>
            {errors.duration && (
              <p className="text-[11px] font-semibold text-red-500 mt-1 ml-2">
                {errors.duration}
              </p>
            )}
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Select Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_CHOICES.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer ${
                    selectedEmoji === emoji
                      ? 'bg-primary-soft border-2 border-primary scale-110 shadow-xs'
                      : 'bg-surface-input hover:scale-105 border border-surface-border'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Card Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Card Style Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRADIENT_CHOICES.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => setSelectedGradient(g.class)}
                  className={`h-9 rounded-xl bg-gradient-to-r ${g.class} text-[10px] font-bold text-white shadow-xs transition-all cursor-pointer ${
                    selectedGradient === g.class ? 'ring-2 ring-primary scale-102' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-4 border-t border-surface-border">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingTask ? 'Save Changes' : 'Add Task to Routine'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-full bg-primary-soft text-primary font-bold text-xs hover:bg-primary-soft/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
