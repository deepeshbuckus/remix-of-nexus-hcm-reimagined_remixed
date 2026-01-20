import { Progress } from '@/components/ui/progress';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function OnboardingProgress({ currentStep, totalSteps, progress }: OnboardingProgressProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{progress}% complete</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
