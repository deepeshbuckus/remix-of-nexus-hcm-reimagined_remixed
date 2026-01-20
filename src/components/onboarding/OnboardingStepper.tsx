import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingStep, ONBOARDING_STEPS } from '@/types/onboarding';

interface OnboardingStepperProps {
  currentStep: OnboardingStep;
  completedSteps: Set<OnboardingStep>;
  onStepClick?: (step: OnboardingStep) => void;
  canNavigateToStep: (step: OnboardingStep) => boolean;
}

export function OnboardingStepper({ 
  currentStep, 
  completedSteps, 
  onStepClick,
  canNavigateToStep 
}: OnboardingStepperProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center justify-between min-w-[600px] px-4">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = canNavigateToStep(step.id);

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className="flex items-center">
                {index > 0 && (
                  <div 
                    className={cn(
                      "h-0.5 w-8 md:w-12 -mr-1",
                      isCompleted || isCurrent ? "bg-primary" : "bg-muted"
                    )} 
                  />
                )}
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && !isCompleted && "border-primary bg-background text-primary",
                    !isCompleted && !isCurrent && "border-muted bg-muted/30 text-muted-foreground",
                    isClickable && "cursor-pointer hover:scale-105",
                    !isClickable && "cursor-not-allowed opacity-60"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </button>
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div 
                    className={cn(
                      "h-0.5 w-8 md:w-12 -ml-1",
                      completedSteps.has(ONBOARDING_STEPS[index + 1].id) || 
                      currentStep === ONBOARDING_STEPS[index + 1].id
                        ? "bg-primary" 
                        : "bg-muted"
                    )} 
                  />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs font-medium text-center",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
