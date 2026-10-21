import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Sparkles, 
  LogOut, 
  User, 
  Mail, 
  Lock, 
  Edit3, 
  KeyRound, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const CHARACTERS = [
  { emoji: '🦊', name: 'Aero the Fox' },
  { emoji: '🐼', name: 'Zen the Panda' },
  { emoji: '🦉', name: 'Hoot the Owl' },
  { emoji: '🐱', name: 'Milo the Cat' },
  { emoji: '🐰', name: 'Pip the Bunny' },
  { emoji: '🐻', name: 'Barnaby the Bear' },
  { emoji: '🐨', name: 'Koa the Koala' },
  { emoji: '🦄', name: 'Nova the Unicorn' }
];

const THEMES = [
  { id: 'pastel', name: 'Pastel Meadow', emoji: '🌸', swatchClass: 'bg-gradient-to-br from-[#FAF7F2] via-[#EDE6F8] to-[#FAF7F2] text-[#3A3250]' },
  { id: 'forest', name: 'Enchanted Forest', emoji: '🌲', swatchClass: 'bg-gradient-to-br from-[#132413] via-[#223b22] to-[#172d20] text-white' },
  { id: 'ocean', name: 'Ocean Twilight', emoji: '🌊', swatchClass: 'bg-gradient-to-br from-[#091a2c] via-[#122b46] to-[#0a2334] text-white' },
  { id: 'sunset', name: 'Sunset Glow', emoji: '🌅', swatchClass: 'bg-gradient-to-br from-[#25140b] via-[#3e1b0d] to-[#2f1414] text-white' },
  { id: 'aurora', name: 'Cosmic Aurora', emoji: '🌌', swatchClass: 'bg-gradient-to-br from-[#090924] via-[#160829] to-[#06151b] text-white' },
  { id: 'cherry', name: 'Cherry Blossom', emoji: '🌺', swatchClass: 'bg-gradient-to-br from-[#240817] via-[#3d1325] to-[#2f0714] text-white' },
];

export default function ProfileModal() {
  const { isProfileOpen, closeProfile, theme, setTheme, burstPetals } = useTheme();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { character, nickname, level, xp, streak, resetAssessment } = useWellness();
  const navigate = useNavigate();

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || nickname);
  const [nameError, setNameError] = useState('');

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  if (!isProfileOpen) return null;

  const handleSaveName = async () => {
    const cleanName = nameInput.trim();
    if (!cleanName) {
      setNameError('Name cannot be empty.');
      return;
    }
    if (cleanName.length < 2) {
      setNameError('Name must be at least 2 characters.');
      return;
    }
    if (cleanName.length > 50) {
      setNameError('Name cannot exceed 50 characters.');
      return;
    }

    setNameError('');
    await updateProfile({ name: cleanName });
    setIsEditingName(false);
    burstPetals();
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPwdMsg({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setPwdLoading(true);
    setPwdMsg({ text: '', type: '' });

    const res = await changePassword(newPassword);
    setPwdLoading(false);

    if (res?.success) {
      setPwdMsg({ text: 'Password changed successfully! ✨', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
      burstPetals();
      setTimeout(() => setShowPasswordChange(false), 2000);
    } else {
      setPwdMsg({ text: res?.message || 'Failed to update password.', type: 'error' });
    }
  };

  const handleThemeSelect = (themeId) => {
    setTheme(themeId);
    burstPetals();
  };

  const handleCharSelect = async (charEmoji) => {
    await updateProfile({ character: charEmoji });
    burstPetals();
  };

  const startNewCheckin = () => {
    resetAssessment();
    closeProfile();
    burstPetals();
    navigate('/assessment');
  };

  const handleLogout = () => {
    closeProfile();
    logout();
    navigate('/login');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfile();
      }}
    >
      <div className="bg-surface-card glass-panel w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-surface-border animate-scale-in text-text-primary max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header with Avatar & Details */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-inner shrink-0">
              {user?.character || character}
            </div>
            <div>
              {/* Editable Name */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => {
                          setNameInput(e.target.value);
                          if (nameError) setNameError('');
                        }}
                        className={`text-sm font-bold text-text-primary px-2.5 py-1 rounded-lg bg-surface-input border outline-none max-w-[140px] ${
                          nameError ? 'border-red-400' : 'border-primary'
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1 text-primary hover:text-primary-deep cursor-pointer"
                        title="Save name"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-xl text-text-primary">
                        {user?.name || nickname}
                      </h3>
                      <button
                        onClick={() => {
                          setNameInput(user?.name || nickname);
                          setIsEditingName(true);
                        }}
                        className="p-1 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                        title="Edit display name"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                {nameError && (
                  <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                    {nameError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                <span className="font-bold text-primary">Lv.{user?.level || level}</span>
                <span>•</span>
                <span>{user?.xp || xp} XP</span>
                <span>•</span>
                <span>🔥 {user?.streak || streak}d Streak</span>
              </div>
            </div>
          </div>

          <button
            onClick={closeProfile}
            className="p-1.5 rounded-full hover:bg-surface-input text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Details & Security Section */}
        <div className="mb-5 bg-surface/60 rounded-2xl p-4 border border-surface-border">
          <div className="text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>Account &amp; Security</span>
          </div>

          <div className="space-y-2.5 text-xs text-text-primary">
            {/* Email */}
            <div className="flex items-center justify-between py-1 border-b border-surface-border/50">
              <span className="flex items-center gap-1.5 text-text-secondary font-medium">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <span className="font-semibold">{user?.email || 'hero@wellnest.ai'}</span>
            </div>

            {/* Password Field */}
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-text-secondary font-medium">
                <Lock className="w-3.5 h-3.5" /> Password
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-text-secondary font-bold">••••••••</span>
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="text-primary hover:text-primary-deep font-bold text-[11px] flex items-center gap-0.5 underline cursor-pointer"
                >
                  <span>{showPasswordChange ? 'Cancel' : 'Change'}</span>
                  {showPasswordChange ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Change Password Dropdown Form */}
            {showPasswordChange && (
              <form onSubmit={handlePasswordSubmit} className="mt-3 pt-3 border-t border-surface-border space-y-2 animate-fade-in">
                {pwdMsg.text && (
                  <div
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                      pwdMsg.type === 'success'
                        ? 'bg-secondary/20 text-secondary border border-secondary/40'
                        : 'bg-red-500/10 text-red-500 border border-red-500/30'
                    }`}
                  >
                    {pwdMsg.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{pwdMsg.text}</span>
                  </div>
                )}

                <div>
                  <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-input border border-surface-border text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-input border border-surface-border text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="w-full py-2 px-3 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary-deep shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {pwdLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Theme Vibe Selector */}
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-text-secondary mb-2.5 flex items-center gap-1.5">
            <span>🌈</span> Background Vibe
          </div>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeSelect(t.id)}
                  className={`h-14 rounded-xl ${t.swatchClass} p-1.5 flex flex-col items-center justify-center text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'ring-3 ring-primary scale-105 shadow-md'
                      : 'hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                >
                  <span className="text-sm drop-shadow-sm">{t.emoji}</span>
                  <span className="text-[10px] font-semibold drop-shadow-md">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Change Character */}
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-widest font-bold text-text-secondary mb-2.5 flex items-center gap-1.5">
            <span>🎭</span> Spirit Character
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CHARACTERS.map((c) => {
              const isSelected = (user?.character || character) === c.emoji;
              return (
                <button
                  key={c.name}
                  onClick={() => handleCharSelect(c.emoji)}
                  className={`p-2 rounded-xl text-center text-2xl transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-primary-soft border-2 border-primary scale-105 shadow-sm'
                      : 'bg-surface/50 border border-surface-border hover:bg-primary-soft/30 hover:scale-102'
                  }`}
                  title={c.name}
                >
                  {c.emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons & Logout */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <div className="flex gap-2">
            <button
              onClick={startNewCheckin}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>New Check-in</span>
            </button>
            <button
              onClick={closeProfile}
              className="py-3 px-4 rounded-xl bg-primary-soft text-primary font-bold text-xs sm:text-sm hover:bg-primary-soft/80 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Logout Option Button inside Profile */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:text-red-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
