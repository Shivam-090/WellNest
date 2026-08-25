import { useNavigate } from 'react-router-dom';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import MoodSelector from './MoodSelector';
import { Sparkles } from 'lucide-react';

export default function HeroBanner() {
  const { selectedMood } = useWellness();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const handleStartCheckin = () => {
    burstPetals();
    navigate('/assessment');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="relative rounded-3xl overflow-hidden bg-surface-card glass-panel shadow-2xl border border-surface-border grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Decorative Nature Background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 lg:opacity-70"
          viewBox="0 0 1200 580"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse cx="600" cy="560" rx="700" ry="60" fill="rgba(168,197,160,0.25)" />
          <path
            d="M900 580 Q895 480 910 400 Q920 340 900 280"
            stroke="#8B6F52"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M900 420 Q940 390 970 360"
            stroke="#8B6F52"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M905 360 Q860 320 840 280"
            stroke="#8B6F52"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M908 300 Q950 270 980 240"
            stroke="#8B6F52"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="900" cy="260" r="65" fill="rgba(242,167,195,0.55)" />
          <circle cx="850" cy="240" r="50" fill="rgba(253,220,235,0.6)" />
          <circle cx="950" cy="230" r="55" fill="rgba(242,167,195,0.5)" />
          <circle cx="970" cy="280" r="45" fill="rgba(253,220,235,0.55)" />
          <circle cx="840" cy="290" r="40" fill="rgba(242,167,195,0.45)" />
          <text x="750" y="180" fontSize="16" opacity="0.6">🌸</text>
          <text x="1040" y="200" fontSize="14" opacity="0.5">🌸</text>
          <text x="820" y="150" fontSize="12" opacity="0.4">🌸</text>
        </svg>

        {/* Left Content Area */}
        <div className="relative z-10 lg:col-span-7 p-6 sm:p-12 md:p-16 flex flex-col justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-soft/80 border border-primary-light/40 rounded-full px-4 py-1.5 text-xs font-bold text-primary tracking-wide mb-6 w-fit shadow-sm">
            <span>🌸</span>
            <span>Student Wellness Platform</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.15] mb-4">
            Balance your mind,
            <em className="block font-serif text-primary not-italic italic font-normal">
              bloom every day
            </em>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-md mb-6 font-sans">
            WellNest AI gently checks in with you, understands your stress patterns, and guides you back to calm — in just a few minutes.
          </p>

          {/* Mood Prompt */}
          <div className="mb-2">
            <p className="font-serif text-base sm:text-lg italic text-text-primary font-medium">
              How are you feeling today?
            </p>
            <MoodSelector />
          </div>

          {/* CTA */}
          <div className="mt-4">
            <button
              onClick={handleStartCheckin}
              className={`inline-flex items-center gap-2.5 bg-gradient-to-r from-primary to-secondary text-white font-sans font-bold text-sm sm:text-base px-8 py-4 rounded-full shadow-lg transition-all duration-200 cursor-pointer ${
                selectedMood
                  ? 'hover:shadow-xl hover:-translate-y-1 scale-102 ring-2 ring-primary/30'
                  : 'hover:shadow-md'
              }`}
            >
              <span>Begin My Wellness Check</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Decorative Space */}
        <div className="hidden lg:flex lg:col-span-5 relative z-10 items-center justify-center p-8">
          <div className="text-center bg-surface-card backdrop-blur-md p-6 rounded-3xl border border-surface-border shadow-xl max-w-xs animate-logo-drift">
            <div className="text-5xl mb-3">🌿</div>
            <h4 className="font-display font-bold text-lg text-text-primary">
              Gentle &amp; Science-backed
            </h4>
            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
              20 holistic indicators analyzed through AI to offer real actionable recovery routines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
