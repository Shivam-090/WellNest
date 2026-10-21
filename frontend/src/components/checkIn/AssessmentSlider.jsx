import { useWellness } from '../../contexts/WellnessContext';

export default function AssessmentSlider({ slider }) {
  const { sliderValues, updateSlider } = useWellness();
  const value = sliderValues[slider.feat] !== undefined ? sliderValues[slider.feat] : 5;

  const getValueColor = (val) => {
    if (val <= 3) return 'text-secondary';
    if (val <= 6) return 'text-primary';
    return 'text-accent';
  };

  return (
    <div className="bg-surface-card glass-panel border border-surface-border rounded-3xl p-5 sm:p-7 mb-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5 font-sans font-bold text-sm sm:text-base text-text-primary">
          <span className="text-xl">{slider.icon}</span>
          <span>{slider.label}</span>
        </div>
        <div className={`font-display text-2xl sm:text-3xl font-extrabold ${getValueColor(value)} transition-colors`}>
          {value}
        </div>
      </div>

      {/* Range Input */}
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(e) => updateSlider(slider.feat, e.target.value)}
        className="fancy-slider w-full"
        style={{ '--pct': `${value * 10}%` }}
        aria-label={slider.label}
      />

      {/* Bottom scale labels */}
      <div className="flex justify-between text-[11px] font-semibold text-text-secondary mt-2.5">
        <span>{slider.low}</span>
        <span>{slider.high}</span>
      </div>
    </div>
  );
}
