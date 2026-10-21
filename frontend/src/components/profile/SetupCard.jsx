import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import CharacterGrid from './CharacterGrid';
import { ArrowRight } from 'lucide-react';

export default function SetupCard() {
  const { user, updateProfile } = useAuth();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.name || '');
  const [selectedChar, setSelectedChar] = useState(user?.character || '🦊');

  const isReady = nickname.trim().length > 0 && selectedChar;

  const handleFinish = () => {
    if (!isReady) return;
    updateProfile({
      name: nickname.trim(),
      character: selectedChar
    });
    burstPetals();
    navigate('/home');
  };

  return (
    <div className="w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 text-white animate-fade-in">
      {/* Title & Tagline */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          ✨ Welcome to WellNest AI
        </h2>
        <p className="text-xs sm:text-sm text-white/70 font-sans">
          Before we begin, let's create your wellness character &amp; alias!
        </p>
      </div>

      {/* Nickname Input */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
          Your Nickname
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="e.g. StarGazer, Moonbeam..."
          maxLength={20}
          className="w-full px-5 py-3.5 rounded-2xl bg-white/15 border border-white/25 text-white placeholder-white/40 text-base font-semibold focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/40 transition-all font-sans"
        />
      </div>

      {/* Pick Character Grid */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
          Pick Your Spirit Character
        </label>
        <CharacterGrid
          selectedChar={selectedChar}
          onSelectChar={(emoji) => setSelectedChar(emoji)}
        />
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={!isReady}
        onClick={handleFinish}
        className={`w-full py-4 px-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-display font-bold text-base sm:text-lg shadow-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
          isReady
            ? 'opacity-100 hover:shadow-2xl hover:-translate-y-1'
            : 'opacity-40 cursor-not-allowed'
        }`}
      >
        <span>Begin My Journey ✦</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
