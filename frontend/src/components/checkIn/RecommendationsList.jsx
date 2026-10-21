import { HeartHandshake } from 'lucide-react';

export default function RecommendationsList({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-3.5 flex items-center gap-2">
        <HeartHandshake className="w-4 h-4 text-primary" />
        <span>Personalized Actionable Recovery Routine</span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-primary/50 transition-all duration-200 shadow-2xs space-y-1.5"
          >
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              {rec.factor || rec.name || `Focus Area ${idx + 1}`}
            </div>
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-sans">
              {rec.advice || rec.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
