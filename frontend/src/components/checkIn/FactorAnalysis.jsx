import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';

const FACTOR_METRICS = [
  { label: '😴 Sleep Deficit', feat: 'sleep_quality', color: '#F2A7C3', inverted: true },
  { label: '📚 Study Load', feat: 'study_load', color: '#fb923c', inverted: false },
  { label: '😰 Anxiety Level', feat: 'anxiety_level', color: '#c084fc', inverted: false },
  { label: '💬 Social Support', feat: 'social_support', color: '#2dd4bf', inverted: true },
  { label: '🎓 Academic Strain', feat: 'academic_performance', color: '#4ade80', inverted: true },
  { label: '😔 Emotional Burden', feat: 'depression', color: '#f472b6', inverted: false }
];

export default function FactorAnalysis({ sliderValues = {} }) {
  const [showBars, setShowBars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBars(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-secondary" />
        <span>Holistic Factor Stress Impact</span>
      </div>

      <div className="space-y-3.5">
        {FACTOR_METRICS.map((metric) => {
          const raw = sliderValues[metric.feat] !== undefined ? sliderValues[metric.feat] : 5;
          const factorPct = metric.inverted
            ? Math.round((1 - raw / 10) * 100)
            : Math.round((raw / 10) * 100);

          return (
            <div key={metric.feat}>
              <div className="flex justify-between text-xs font-semibold text-text-primary mb-1.5">
                <span>{metric.label}</span>
                <span style={{ color: metric.color }} className="font-bold">{factorPct}%</span>
              </div>
              <div className="h-2.5 w-full bg-surface-input border border-surface-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out shadow-xs"
                  style={{
                    backgroundColor: metric.color,
                    width: showBars ? `${factorPct}%` : '0%'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
