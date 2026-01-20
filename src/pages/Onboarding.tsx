import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { WelcomeStep } from '@/components/onboarding/steps/WelcomeStep';
import { PersonalInfoStep } from '@/components/onboarding/steps/PersonalInfoStep';
import { ContactAddressStep } from '@/components/onboarding/steps/ContactAddressStep';
import { EmploymentStep } from '@/components/onboarding/steps/EmploymentStep';
import { EmergencyContactStep } from '@/components/onboarding/steps/EmergencyContactStep';
import { PayrollStep } from '@/components/onboarding/steps/PayrollStep';
import { DocumentsStep } from '@/components/onboarding/steps/DocumentsStep';
import { ReviewStep } from '@/components/onboarding/steps/ReviewStep';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingStep } from '@/types/onboarding';

export default function Onboarding() {
  const navigate = useNavigate();
  const {
    currentStep,
    currentStepIndex,
    data,
    progress,
    completedSteps,
    goToStep,
    goToNext,
    goToPrevious,
    updateData,
    canNavigateToStep,
    submitOnboarding,
  } = useOnboarding();

  const handleSubmit = async () => {
    try {
      await submitOnboarding();
      toast.success('Onboarding completed successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };

  const handleEditSection = (step: OnboardingStep) => {
    goToStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'personal':
        return (
          <PersonalInfoStep
            data={data.personalInfo}
            onUpdate={(updates) => updateData('personalInfo', updates)}
          />
        );
      case 'contact':
        return (
          <ContactAddressStep
            data={data.contact}
            onUpdate={(updates) => updateData('contact', updates)}
          />
        );
      case 'employment':
        return (
          <EmploymentStep
            data={data.employment}
            onUpdate={(updates) => updateData('employment', updates)}
          />
        );
      case 'emergency':
        return (
          <EmergencyContactStep
            data={data.emergencyContact}
            onUpdate={(updates) => updateData('emergencyContact', updates)}
          />
        );
      case 'payroll':
        return (
          <PayrollStep
            data={data.payroll}
            onUpdate={(updates) => updateData('payroll', updates)}
          />
        );
      case 'documents':
        return (
          <DocumentsStep
            data={data.documents}
            onUpdate={(updates) => updateData('documents', updates)}
          />
        );
      case 'review':
        return <ReviewStep data={data} onEditSection={handleEditSection} />;
      default:
        return null;
    }
  };

  const getContinueLabel = () => {
    if (currentStep === 'welcome') return 'Start';
    if (currentStep === 'review') return 'Submit';
    return 'Continue';
  };

  const handleContinue = () => {
    if (currentStep === 'review') {
      handleSubmit();
    } else {
      goToNext();
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      currentStepIndex={currentStepIndex}
      progress={progress}
      completedSteps={completedSteps}
      onStepClick={goToStep}
      canNavigateToStep={canNavigateToStep}
      onContinue={handleContinue}
      onBack={goToPrevious}
      showBackButton={currentStepIndex > 0}
      continueLabel={getContinueLabel()}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}
