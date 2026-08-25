import { useWellness } from '../../contexts/WellnessContext';

export default function StatsCounter() {
  const { completedCount, totalMinutesSpent, streak } = useWellness();
  const count = completedCount || 4;
  const minutes = totalMinutesSpent || 35;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
      <div className="bg-surface-card glass-panel rounded-3xl p-6 text-center shadow-md border border-surface-border min-w-[130px] hover:scale-105 transition-transform">
        <div className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-1">
          {count}
        </div>
        <div className="text-xs uppercase tracking-wider font-bold text-text-secondary">
          Activities Done
        </div>
      </div>

      <div className="bg-surface-card glass-panel rounded-3xl p-6 text-center shadow-md border border-surface-border min-w-[130px] hover:scale-105 transition-transform">
        <div className="font-serif text-3xl sm:text-4xl font-bold text-secondary mb-1">
          {minutes}
        </div>
        <div className="text-xs uppercase tracking-wider font-bold text-text-secondary">
          Minutes Spent
        </div>
      </div>

      <div className="bg-surface-card glass-panel rounded-3xl p-6 text-center shadow-md border border-surface-border min-w-[130px] hover:scale-105 transition-transform">
        <div className="font-serif text-3xl sm:text-4xl font-bold text-accent mb-1 flex items-center justify-center gap-1">
          <span>🔥</span>
          <span>{streak}</span>
        </div>
        <div className="text-xs uppercase tracking-wider font-bold text-text-secondary">
          Day Streak
        </div>
      </div>
    </div>
  );
}
