import { LEVELS } from '../../data/levelsData';
import { useWellness } from '../../contexts/WellnessContext';
import { Lock, Sparkles, Check, Flame, Award } from 'lucide-react';

export default function LevelPath() {
  const { level: userLevel, streak } = useWellness();

  // Find the highest unlocked level based on streak
  const highestUnlockedLevel = LEVELS.reduce((acc, lvl) => {
    return streak >= lvl.requiredStreak ? Math.max(acc, lvl.level) : acc;
  }, 1);

  const activeLevel = Math.max(userLevel || 1, highestUnlockedLevel);

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span>Streak-Based Progression</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Your <em className="font-serif text-primary not-italic italic font-normal">Path to Bloom</em>
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Maintain your daily streak to sprout and blossom into higher wellness levels.
          </p>
        </div>

        {/* Current Active Streak Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-card border border-surface-border shadow-xs self-start sm:self-auto">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-xs font-bold text-text-primary">
            Current Streak: <strong className="text-primary font-black">{streak} Day{streak !== 1 ? 's' : ''}</strong>
          </span>
        </div>
      </div>

      {/* Stepped Track */}
      <div className="space-y-6 sm:space-y-8 relative">
        {LEVELS.map((lvl, index) => {
          const isUnlocked = streak >= lvl.requiredStreak;
          const isCurrent = isUnlocked && lvl.level === activeLevel;
          const isCompleted = isUnlocked && lvl.level < activeLevel;
          const isLocked = !isUnlocked;
          const isRight = index % 2 === 1;

          // Days remaining calculation
          const daysRemaining = Math.max(0, lvl.requiredStreak - streak);
          const streakPct = Math.min(100, Math.round((streak / lvl.requiredStreak) * 100));

          return (
            <div
              key={lvl.level}
              className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${
                isRight ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Level Card */}
              <div
                className={`w-full sm:w-[calc(50%-40px)] rounded-3xl p-6 sm:p-7 shadow-md transition-all duration-300 relative overflow-hidden border ${
                  isCurrent
                    ? 'ring-2 ring-primary/80 shadow-xl scale-[1.02] bg-gradient-to-br ' + lvl.colorClass + ' border-primary/30'
                    : isCompleted
                    ? 'bg-gradient-to-br ' + lvl.colorClass + ' opacity-95 border-surface-border/80'
                    : 'bg-surface-card/60 backdrop-blur-sm border-surface-border/80 opacity-70 cursor-not-allowed'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      isCurrent
                        ? 'bg-primary/20 text-primary'
                        : isCompleted
                        ? 'bg-secondary/30 text-[#1E5245]'
                        : 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Current Chapter</span>
                      </>
                    ) : isCompleted ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Unlocked & Sprouted</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Unlocks on Day {lvl.requiredStreak}</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs uppercase font-bold tracking-widest opacity-60">
                    Day {lvl.requiredStreak} Milestone
                  </span>
                </div>

                {/* Level Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2 text-text-primary">
                  <span>{lvl.emoji}</span>
                  <span>{lvl.name}</span>
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                  {lvl.desc}
                </p>

                {/* Locked Streak Progress Track */}
                {isLocked && (
                  <div className="mb-4 p-3 rounded-2xl bg-surface-input/70 border border-surface-border/50 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                        {streak} / {lvl.requiredStreak} Days
                      </span>
                      <span className="text-primary font-bold">{daysRemaining} day{daysRemaining > 1 ? 's' : ''} left</span>
                    </div>
                    <div className="h-2 w-full bg-surface-border/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-primary rounded-full transition-all duration-500"
                        style={{ width: `${streakPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Reward Badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-2 border-t border-surface-border/60">
                  <span className="opacity-70 flex items-center gap-1">
                    <Award className="w-3 h-3 text-secondary" />
                    <span>Reward:</span>
                  </span>
                  <span className="bg-white/40 dark:bg-white/15 px-2.5 py-1 rounded-full shadow-xs text-text-primary">
                    {lvl.reward}
                  </span>
                  <span className="bg-white/40 dark:bg-white/15 px-2.5 py-1 rounded-full shadow-xs text-text-primary">
                    {lvl.xpReward}
                  </span>
                </div>
              </div>

              {/* Node Circle in Center */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-primary to-secondary text-white animate-node-pulse scale-110 shadow-lg ring-4 ring-primary/20'
                      : isCompleted
                      ? 'bg-gradient-to-tr from-secondary to-sage text-white'
                      : 'bg-surface-card border-2 border-dashed border-primary/40 text-text-secondary'
                  }`}
                >
                  {isCurrent ? lvl.emoji : isCompleted ? '✓' : '🔒'}
                </div>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1.5">
                  Day {lvl.requiredStreak}
                </span>
              </div>

              {/* Balance Spacer for desktop stepped layout */}
              <div className="hidden sm:block sm:w-[calc(50%-40px)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
