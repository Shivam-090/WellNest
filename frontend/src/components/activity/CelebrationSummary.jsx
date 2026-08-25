import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useWellness } from '../../contexts/WellnessContext';

export default function CelebrationSummary() {
  const { character, nickname } = useWellness();

  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7ECECA', '#9B86CC', '#F2A7C3', '#A8C5A0', '#FFD166']
    });
  }, []);

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-8 animate-fade-in">
      <div className="text-7xl sm:text-8xl mb-5 animate-done-bounce select-none">
        {character}
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-3">
        Well done,{' '}
        <em className="font-serif text-primary not-italic italic font-normal">
          you did it!
        </em>
      </h1>
      <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-md font-sans">
        You took intentional time for yourself today, {nickname}. That's the most important step towards a healthier, calmer mind. See you tomorrow! 🌿
      </p>
    </div>
  );
}
