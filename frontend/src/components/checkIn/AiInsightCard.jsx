import { Sparkles } from 'lucide-react';

export default function AiInsightCard({ confidence = 88, pred = 0, aiInsight, affirmation }) {
  let defaultText = '';
  if (pred === 2) {
    defaultText = `The model detected elevated stress with ${confidence}% confidence. Your top stressors are highlighted in your personalized recovery routine below — begin with just one small step today.`;
  } else if (pred === 1) {
    defaultText = `Moderate stress detected with ${confidence}% confidence. A restorative balance is within reach — focus on gentle boundaries and sleep recovery.`;
  } else {
    defaultText = `Low stress detected with ${confidence}% confidence. Your holistic wellbeing indicators are healthy — keep your daily mindfulness habits going strong.`;
  }

  const textToDisplay = aiInsight || defaultText;

  return (
    <div className="my-6 p-5 sm:p-6 rounded-3xl bg-surface-card border border-surface-border backdrop-blur-md shadow-md space-y-3 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-widest font-bold text-secondary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>WellNest AI Psychological Insight</span>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/30 shadow-2xs">
          {confidence}% Confidence
        </span>
      </div>

      <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-sans">
        "{textToDisplay}"
      </p>

      {affirmation && (
        <div className="pt-3 border-t border-surface-border/50 text-xs sm:text-sm font-serif italic text-primary font-medium flex items-center gap-2">
          <span>🌸</span>
          <span>"{affirmation}"</span>
        </div>
      )}
    </div>
  );
}
