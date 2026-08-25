import { useNavigate } from 'react-router-dom';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import CelebrationSummary from '../../components/activity/CelebrationSummary';
import StatsCounter from '../../components/activity/StatsCounter';
import { MapPin, RotateCcw } from 'lucide-react';

export default function DonePage() {
  const { resetAssessment } = useWellness();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const handleGoJourney = () => {
    burstPetals();
    navigate('/journey');
  };

  const handleStartOver = () => {
    resetAssessment();
    burstPetals();
    navigate('/home');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in relative">
      <div className="w-full max-w-2xl bg-white/70 dark:bg-white/10 glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl border border-surface-border text-center">
        {/* Celebration Header */}
        <CelebrationSummary />

        {/* Stats Cards */}
        <StatsCounter />

        {/* Action CTAs */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleGoJourney}
            className="w-full sm:w-auto py-4 px-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <MapPin className="w-5 h-5" />
            <span>View My Journey 🗺️</span>
          </button>

          <button
            onClick={handleStartOver}
            className="text-xs text-text-secondary hover:text-primary font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Fresh Check-in</span>
          </button>
        </div>
      </div>
    </div>
  );
}
