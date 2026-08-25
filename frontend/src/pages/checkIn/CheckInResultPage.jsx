import { useNavigate } from 'react-router-dom';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import StressMeter from '../../components/checkIn/StressMeter';
import FactorAnalysis from '../../components/checkIn/FactorAnalysis';
import AiInsightCard from '../../components/checkIn/AiInsightCard';
import RecommendationsList from '../../components/checkIn/RecommendationsList';
import { ArrowRight, Sparkles, Brain } from 'lucide-react';

export default function CheckInResultPage() {
  const { mlResult, sliderValues } = useWellness();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const result = mlResult || {
    pred: 0,
    label: 'Low',
    stressPct: 25,
    confidence: 90,
    recommendations: []
  };

  const { pred, stressPct, confidence, recommendations, aiInsight, affirmation } = result;

  let levelBadge = "🟢 Low Stress";
  let defaultTitle = 'Wonderful balance 🌿';
  let defaultDesc =
    "Your lifestyle looks healthy! You're managing stress well. Keep nurturing these habits — they're your superpower.";
  let defaultChips = ['😊 Well Balanced', '🌙 Rested', '💬 Connected', '✨ Focused'];

  if (pred === 2) {
    levelBadge = '🔴 High Stress Detected';
    defaultTitle = 'You need a break 💛';
    defaultDesc =
      'Your responses show significant pressure across multiple areas. Please be kind to yourself — rest matters more than productivity today.';
    defaultChips = ['😴 Sleep Deficit', '📚 Overloaded', '🧠 Mental Load', '🫂 Needs Support'];
  } else if (pred === 1) {
    levelBadge = '🟡 Moderate Stress';
    defaultTitle = "You're carrying quite a bit 🌸";
    defaultDesc =
      'Some areas need gentle attention. Small, consistent actions today can shift the balance significantly.';
    defaultChips = ['😴 Light Fatigue', '📚 Academic Pressure', '💬 Mild Strain', '🌱 High Potential'];
  }

  const titleText = result.titleText || defaultTitle;
  const descText = result.descText || defaultDesc;
  const factorChips = (result.factorChips && result.factorChips.length > 0) ? result.factorChips : defaultChips;

  const handleViewPlan = () => {
    burstPetals();
    navigate('/activity');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 md:px-12 animate-fade-in relative transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10 items-start">
        {/* Left Column: Stress Meter & Summary */}
        <div className="lg:col-span-6 flex flex-col justify-center bg-surface-card glass-panel border border-surface-border rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] uppercase tracking-[3px] text-primary font-bold flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-secondary" />
              <span>Psychological Assessment</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30">
              {result.modelUsed ? 'WellNest AI' : 'WellNest AI'}
            </span>
          </div>

          <div className="flex justify-center sm:justify-start my-2">
            <StressMeter stressPct={stressPct} pred={pred} />
          </div>

          <div className="text-xs uppercase tracking-widest font-extrabold text-secondary mb-2 mt-2">
            {levelBadge}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            {titleText}
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mb-6 font-sans">
            {descText}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {factorChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface-chip border border-surface-border text-text-primary shadow-2xs"
              >
                {chip}
              </span>
            ))}
          </div>

          <button
            onClick={handleViewPlan}
            className="w-full sm:w-fit py-3.5 px-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>🌿 View My Relief Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Column: Factor Analysis, AI Insight, Recommendations */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-surface-card glass-panel border border-surface-border rounded-3xl p-6 sm:p-8 shadow-xl">
            <FactorAnalysis sliderValues={sliderValues} />
            <AiInsightCard
              confidence={confidence}
              pred={pred}
              aiInsight={aiInsight}
              affirmation={affirmation}
            />
            <RecommendationsList recommendations={recommendations} />
          </div>
        </div>
      </div>
    </div>
  );
}
