import { useWellness } from '../../contexts/WellnessContext';

export default function JourneyHero() {
  const { streak, xp, level } = useWellness();

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#F0EBF8] via-[#E2F4F4] to-[#FDF0F6] dark:from-white/5 dark:via-white/10 dark:to-white/5 p-6 sm:p-12 shadow-xl border border-surface-border flex flex-col md:flex-row items-center justify-between gap-8 mb-10 overflow-hidden">
      {/* Decorative background emoji */}
      <div className="absolute right-8 top-4 text-8xl opacity-10 pointer-events-none select-none">
        🌸
      </div>

      {/* Left Info */}
      <div className="relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-2">
          <span>✦</span>
          <span>Your Wellness Journey</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-3">
          Every day you show up,
          <em className="block font-serif text-primary not-italic italic font-normal">
            you level up 🌸
          </em>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Complete daily check-ins, finish your relief activities, and unlock new levels on your path to a calmer, healthier mind.
        </p>
      </div>

      {/* Right Stat Cards */}
      <div className="relative z-10 flex flex-wrap gap-3 sm:gap-4">
        <div className="bg-white/85 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center min-w-[100px] shadow-sm border border-surface-border">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            {streak}
          </div>
          <div className="text-[11px] font-bold text-text-secondary mt-0.5">
            🔥 Streak
          </div>
        </div>

        <div className="bg-white/85 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center min-w-[100px] shadow-sm border border-surface-border">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-secondary">
            {xp}
          </div>
          <div className="text-[11px] font-bold text-text-secondary mt-0.5">
            ⭐ XP
          </div>
        </div>

        <div className="bg-white/85 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center min-w-[100px] shadow-sm border border-surface-border">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-accent">
            Lv.{level}
          </div>
          <div className="text-[11px] font-bold text-text-secondary mt-0.5">
            🌱 Level
          </div>
        </div>
      </div>
    </div>
  );
}
