import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWellness } from '../../contexts/WellnessContext';
import { CHARACTERS, THEMES } from '../../data/characters';
import { X, Sparkles, UserCheck } from 'lucide-react';

export default function ProfileModal() {
  const { isProfileOpen, closeProfile, theme, setTheme, burstPetals } = useTheme();
  const { user, updateProfile } = useAuth();
  const { character, nickname, xp, streak, level } = useWellness();
  const navigate = useNavigate();

  if (!isProfileOpen) return null;

  const handleCharSelect = (charEmoji) => {
    updateProfile({ character: charEmoji });
    burstPetals();
  };

  const handleThemeSelect = (themeId) => {
    setTheme(themeId);
    updateProfile({ themePreference: themeId });
  };

  const startNewCheckin = () => {
    closeProfile();
    burstPetals();
    navigate('/assessment');
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] flex items-start justify-end p-4 sm:p-6 sm:pt-20 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfile();
      }}
    >
      <div className="bg-surface-card glass-panel w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-surface-border animate-slide-in-right max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl p-2 rounded-2xl bg-primary-soft/40 border border-primary-light/30 shadow-inner">
              {user?.character || character}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-text-primary">
                {user?.name || nickname}
              </h3>
              <p className="text-xs text-text-secondary">
                Level {user?.level || level} Explorer · {user?.streak || streak}d Streak 🔥
              </p>
            </div>
          </div>
          <button
            onClick={closeProfile}
            className="p-1.5 rounded-full hover:bg-black/5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Vibe Selector */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-3 flex items-center gap-1.5">
            <span>🌈</span> Background Vibe
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {THEMES.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeSelect(t.id)}
                  className={`h-16 rounded-xl ${t.swatchClass} p-2 flex flex-col items-center justify-center text-xs font-bold text-white shadow-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'ring-3 ring-primary scale-105 shadow-md'
                      : 'hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                >
                  <span className="text-base drop-shadow-sm">{t.emoji}</span>
                  <span className="text-[11px] font-semibold drop-shadow-md text-white">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Change Character */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-3 flex items-center gap-1.5">
            <span>🎭</span> Change Character
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CHARACTERS.map((c) => {
              const isSelected = (user?.character || character) === c.emoji;
              return (
                <button
                  key={c.name}
                  onClick={() => handleCharSelect(c.emoji)}
                  className={`p-2.5 rounded-xl text-center text-2xl transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-primary-soft/80 border-2 border-primary scale-110 shadow-sm'
                      : 'bg-surface/50 border border-surface-border hover:bg-primary-soft/30 hover:scale-105'
                  }`}
                  title={c.name}
                >
                  {c.emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={startNewCheckin}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Check-in</span>
          </button>
          <button
            onClick={closeProfile}
            className="py-3 px-4 rounded-xl bg-primary-soft/70 text-primary font-bold text-xs sm:text-sm hover:bg-primary-soft transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
