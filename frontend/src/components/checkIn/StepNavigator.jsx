import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export function StepProgressHeader({ currentStep, totalSteps, onStepClick }) {
  return (
    <div className="flex items-center justify-between py-4 px-4 sm:px-8 bg-surface-card/80 glass-nav sticky top-0 z-40 mb-6">
      {/* Progress Dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          return (
            <button
              key={idx}
              onClick={() => onStepClick && onStepClick(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-7 bg-primary shadow-sm'
                  : isDone
                  ? 'w-2.5 bg-secondary'
                  : 'w-2.5 bg-primary-light/30'
              }`}
              title={`Step ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Step Counter */}
      <div className="text-xs font-bold text-text-secondary tracking-wider uppercase font-sans">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
}

export function StepFooterButtons({
  isFirstStep,
  isLastStep,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting
}) {
  return (
    <div className="sticky bottom-0 z-40 bg-surface-card/90 glass-nav py-4 px-4 sm:px-8 mt-8 flex items-center justify-between border-t border-surface-border">
      <button
        type="button"
        onClick={onPrev}
        className="py-3 px-6 rounded-full bg-primary-soft text-primary font-bold text-xs sm:text-sm hover:bg-primary-soft/80 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isFirstStep ? 'Cancel' : 'Back'}</span>
      </button>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="py-3 px-7 rounded-full bg-gradient-to-r from-[#4EB694] to-secondary text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Reflecting with WellNest...</span>
            </div>
          ) : (
            <>
              <span>See My Results</span>
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="py-3 px-7 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
