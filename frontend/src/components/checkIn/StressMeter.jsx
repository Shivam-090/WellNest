import { useEffect, useState } from 'react';

export default function StressMeter({ stressPct = 35, pred = 0 }) {
  const [animatedPct, setAnimatedPct] = useState(0);

  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPct / 100) * circumference;

  const getMeterColor = (predClass) => {
    if (predClass === 2) return '#F2A7C3'; // High (Blossom)
    if (predClass === 1) return '#FFD166'; // Moderate (Yellow/Gold)
    return '#4EB694'; // Low (Mint/Sage)
  };

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(Math.round(stressPct * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [stressPct]);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center my-6">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-surface-border opacity-40"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={getMeterColor(pred)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-serif text-4xl font-bold text-text-primary tracking-tight">
          {animatedPct}%
        </span>
        <span className="text-xs uppercase tracking-widest text-text-secondary font-extrabold mt-0.5">
          Stress
        </span>
      </div>
    </div>
  );
}
