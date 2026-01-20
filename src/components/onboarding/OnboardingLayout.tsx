import { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingStepper } from './OnboardingStepper';
import { OnboardingStep, ONBOARDING_STEPS } from '@/types/onboarding';
import { Button } from '@/components/ui/button';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: OnboardingStep;
  currentStepIndex: number;
  progress: number;
  completedSteps: Set<OnboardingStep>;
  onStepClick: (step: OnboardingStep) => void;
  canNavigateToStep: (step: OnboardingStep) => boolean;
  onContinue: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  continueLabel?: string;
  continueDisabled?: boolean;
}

export function OnboardingLayout({
  children,
  currentStep,
  currentStepIndex,
  progress,
  completedSteps,
  onStepClick,
  canNavigateToStep,
  onContinue,
  onBack,
  showBackButton = false,
  continueLabel = 'Continue',
  continueDisabled = false,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          <OnboardingProgress 
            currentStep={currentStepIndex + 1}
            totalSteps={ONBOARDING_STEPS.length}
            progress={progress}
          />
          <OnboardingStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={onStepClick}
            canNavigateToStep={canNavigateToStep}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Your information is encrypted and stored securely</span>
            </div>
            <div className="flex gap-3">
              {showBackButton && onBack && (
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
              )}
              <Button onClick={onContinue} disabled={continueDisabled}>
                {continueLabel}
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
