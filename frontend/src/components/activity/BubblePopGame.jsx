import { useState } from 'react';
import { BUBBLES } from '../../data/activitiesData';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function BubblePopGame() {
  const [popped, setPopped] = useState({});
  const { addXp } = useWellness();
  const { burstPetals } = useTheme();

  const handlePop = (id) => {
    if (popped[id]) return;

    setPopped((prev) => {
      const next = { ...prev, [id]: true };
      if (Object.keys(next).length === BUBBLES.length) {
        burstPetals();
        addXp(30);
      }
      return next;
    });
  };

  const handleRespawn = () => {
    setPopped({});
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#2A1F4E] to-[#1A3A38] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border border-white/10">
      {/* Game Info */}
      <div className="flex-1 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-secondary mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Stress Relief</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          🫧 Bubble Pop — Release Your Tension
        </h3>
        <p className="text-xs sm:text-sm text-white/60 max-w-md">
          Tap the floating bubbles to release your stress. Each pop = one worry gone. Simple, soothing, and effective.
        </p>
      </div>

      {/* Interactive Bubbles */}
      <div className="flex items-center gap-3 sm:gap-4 py-2">
        {BUBBLES.map((bubble) => {
          const isPopped = !!popped[bubble.id];
          return (
            <button
              key={bubble.id}
              type="button"
              onClick={() => handlePop(bubble.id)}
              className={`rounded-full ${bubble.size} ${bubble.bg} backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 select-none shadow-sm ${
                isPopped
                  ? 'scale-0 opacity-0 pointer-events-none'
                  : 'animate-float-bubble hover:scale-125'
              }`}
              style={{
                animationDuration: bubble.duration,
                animationDelay: bubble.delay
              }}
              title="Pop to release stress!"
            >
              <span>{bubble.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* Respawn Button */}
      <div>
        <button
          type="button"
          onClick={handleRespawn}
          className="py-2.5 px-5 rounded-full bg-gradient-to-r from-primary-light to-secondary-light text-text-primary font-bold text-xs sm:text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Respawn ✦</span>
        </button>
      </div>
    </div>
  );
}
