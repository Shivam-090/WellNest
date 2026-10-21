import { useNavigate } from 'react-router-dom';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import ActivityGrid from '../../components/activity/ActivityGrid';
import BubblePopGame from '../../components/activity/BubblePopGame';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function ActivityPage() {
  const { streak } = useWellness();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const handleFinishDay = () => {
    burstPetals();
    navigate('/activity/done');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Relief Routine</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
            Your Relief Plan{' '}
            <em className="font-serif text-primary not-italic italic font-normal">
              today
            </em>{' '}
            🌸
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-lg">
            Gentle activities based on your stress profile · Takes less than 30 mins total.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md w-fit">
          <span>✦</span>
          <span>Day {streak} of Your Journey</span>
        </div>
      </div>

      {/* 4 Relief Cards */}
      <ActivityGrid />

      {/* Stress Relief Bubble Game */}
      <BubblePopGame />

      {/* Done CTA */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleFinishDay}
          className="py-4 px-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2.5 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>I'm Done for Today! 🎉</span>
        </button>
      </div>
    </div>
  );
}
