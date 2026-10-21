import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWellness } from '../../contexts/WellnessContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ASSESSMENT_SECTIONS } from '../../data/assessmentData';
import CategoryHeader from '../../components/checkIn/CategoryHeader';
import AssessmentSlider from '../../components/checkIn/AssessmentSlider';
import { StepProgressHeader, StepFooterButtons } from '../../components/checkIn/StepNavigator';

export default function CheckInPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { calculateResults, addXp } = useWellness();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const totalSteps = ASSESSMENT_SECTIONS.length;
  const currentCategory = ASSESSMENT_SECTIONS[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/home');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log('🌸 [CheckIn] Starting assessment submission to Ollama backend...');
    try {
      const finalResult = await calculateResults();
      console.log('🌸 [CheckIn] Received AI assessment result:', finalResult);
      addXp(50, 'Completed Check-in Assessment');
      burstPetals();
      navigate('/checkin/results');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      navigate('/checkin/results');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between">
      {/* Top Navigator */}
      <StepProgressHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onStepClick={(stepIndex) => setCurrentStep(stepIndex)}
      />

      {/* Main Category Sliders Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-4 animate-fade-in">
        <CategoryHeader category={currentCategory} />

        <div className="space-y-4">
          {currentCategory.sliders.map((slider) => (
            <AssessmentSlider key={slider.feat} slider={slider} />
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <StepFooterButtons
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === totalSteps - 1}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Fullscreen Reflection Overlay while Ollama evaluates */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-card glass-panel border border-surface-border rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto text-primary">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-widest font-extrabold text-secondary px-3 py-1 rounded-full bg-secondary/15 inline-block">
                Psychometric Reflection
              </div>
              <h3 className="font-serif text-2xl font-bold text-text-primary">
                Evaluating Your Wellness 🌸
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed px-2">
                WellNest AI is analyzing all 20 dimensions of your check-in through your local intelligence model. Generating your personalized diagnostic report...
              </p>
            </div>

            <div className="w-full h-1.5 bg-surface-input rounded-full overflow-hidden border border-surface-border/50">
              <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary-light animate-pulse rounded-full w-3/4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
