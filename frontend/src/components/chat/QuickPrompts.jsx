import { Sparkles } from 'lucide-react';

export const PROMPTS = [
  { text: "I'm feeling overwhelmed with my study load 📚", tag: "Study Stress" },
  { text: "Guide me through a 2-minute breathing reset 🫁", tag: "Calm Down" },
  { text: "I'm having trouble falling asleep tonight 🌙", tag: "Sleep Aid" },
  { text: "Give me an uplifting, gentle motivation boost ✨", tag: "Motivation" },
  { text: "How can I set better boundaries with peer pressure? 🛡️", tag: "Boundaries" },
  { text: "Let's do a quick gratitude reflection together 🌸", tag: "Gratitude" }
];

export default function QuickPrompts({ onSelectPrompt, disabled }) {
  return (
    <div className="w-full">
      <div className="text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-2 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>Quick Wellness Prompts</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelectPrompt(p.text)}
            className={`text-xs font-semibold text-text-primary bg-surface-chip border border-surface-border px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-2xs text-left ${
              disabled
                ? 'opacity-40 cursor-not-allowed pointer-events-none'
                : 'hover:bg-primary-soft/80 hover:border-primary/60 hover:scale-102 active:scale-98 cursor-pointer'
            }`}
          >
            {p.text}
          </button>
        ))}
      </div>
    </div>
  );
}
