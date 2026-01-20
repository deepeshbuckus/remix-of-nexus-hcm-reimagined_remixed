import { useState, useCallback } from 'react';
import { 
  OnboardingData, 
  OnboardingStep, 
  ONBOARDING_STEPS, 
  initialOnboardingData 
} from '@/types/onboarding';

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set());

  const currentStepIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStep);
  const progress = Math.round((currentStepIndex / (ONBOARDING_STEPS.length - 1)) * 100);

  const goToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
  }, []);

  const goToNext = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1].id);
    }
  }, [currentStep]);

  const goToPrevious = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex - 1].id);
    }
  }, [currentStep]);

  const updateData = useCallback(<K extends keyof OnboardingData>(
    section: K,
    updates: Partial<OnboardingData[K]>
  ) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  }, []);

  const isStepCompleted = useCallback((step: OnboardingStep) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  const canNavigateToStep = useCallback((step: OnboardingStep) => {
    const stepIndex = ONBOARDING_STEPS.findIndex(s => s.id === step);
    const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStep);
    
    // Can always go back or to current step
    if (stepIndex <= currentIndex) return true;
    
    // Can only go forward if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.has(ONBOARDING_STEPS[i].id)) {
        return false;
      }
    }
    return true;
  }, [currentStep, completedSteps]);

  const submitOnboarding = useCallback(async () => {
    // Here you would submit to the API
    console.log('Submitting onboarding data:', data);
    // For now, just mark as complete
    setCompletedSteps(prev => new Set([...prev, 'review']));
  }, [data]);

  return {
    currentStep,
    currentStepIndex,
    data,
    progress,
    completedSteps,
    goToStep,
    goToNext,
    goToPrevious,
    updateData,
    isStepCompleted,
    canNavigateToStep,
    submitOnboarding,
  };
}
