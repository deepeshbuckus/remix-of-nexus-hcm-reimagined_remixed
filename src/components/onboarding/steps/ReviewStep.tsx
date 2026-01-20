import { Edit2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OnboardingData, OnboardingStep } from '@/types/onboarding';

interface ReviewStepProps {
  data: OnboardingData;
  onEditSection: (step: OnboardingStep) => void;
}

interface SectionProps {
  title: string;
  step: OnboardingStep;
  onEdit: () => void;
  children: React.ReactNode;
}

function Section({ title, onEdit, children }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 gap-1">
            <Edit2 className="h-3 w-3" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

function ReviewItem({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium text-right">{value || '—'}</span>
    </div>
  );
}

export function ReviewStep({ data, onEditSection }: ReviewStepProps) {
  const missingRequired = {
    personal: !data.personalInfo.firstName || !data.personalInfo.lastName || !data.personalInfo.dateOfBirth,
    contact: !data.contact.mobilePhone || !data.contact.addressLine1 || !data.contact.city || !data.contact.province || !data.contact.postalCode,
    emergency: !data.emergencyContact.contactName || !data.emergencyContact.relationship || !data.emergencyContact.phoneNumber,
    payroll: !data.payroll.institutionNumber || !data.payroll.transitNumber || !data.payroll.accountNumber || !data.payroll.accountHolderName || !data.payroll.taxProvince || !data.payroll.td1FormOption,
    documents: !data.documents.governmentId || !data.documents.directDepositProof,
  };

  const hasAnyMissing = Object.values(missingRequired).some(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Review Your Information</h1>
        <p className="text-muted-foreground">Please review and confirm your details before submitting</p>
      </div>

      {hasAnyMissing && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Some required information is missing. Please complete all sections before submitting.</p>
        </div>
      )}

      <div className="space-y-4">
        <Section title="Personal Information" step="personal" onEdit={() => onEditSection('personal')}>
          <div className="space-y-0.5">
            <ReviewItem label="Legal name" value={`${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim()} />
            {data.personalInfo.preferredName && (
              <ReviewItem label="Preferred name" value={data.personalInfo.preferredName} />
            )}
            <ReviewItem label="Date of birth" value={data.personalInfo.dateOfBirth} />
            <ReviewItem label="SIN" value={data.personalInfo.sin ? '***-***-***' : undefined} />
            <ReviewItem label="Gender" value={data.personalInfo.gender} />
          </div>
          {missingRequired.personal && (
            <div className="flex items-center gap-1.5 mt-3 text-destructive text-xs">
              <AlertCircle className="h-3 w-3" />
              Missing required fields
            </div>
          )}
        </Section>

        <Section title="Contact & Address" step="contact" onEdit={() => onEditSection('contact')}>
          <div className="space-y-0.5">
            <ReviewItem label="Mobile phone" value={data.contact.mobilePhone} />
            <ReviewItem label="Personal email" value={data.contact.personalEmail} />
            <Separator className="my-2" />
            <ReviewItem 
              label="Address" 
              value={[
                data.contact.addressLine1,
                data.contact.addressLine2,
                [data.contact.city, data.contact.province, data.contact.postalCode].filter(Boolean).join(', ')
              ].filter(Boolean).join('\n')} 
            />
          </div>
          {missingRequired.contact && (
            <div className="flex items-center gap-1.5 mt-3 text-destructive text-xs">
              <AlertCircle className="h-3 w-3" />
              Missing required fields
            </div>
          )}
        </Section>

        <Section title="Employment Details" step="employment" onEdit={() => onEditSection('employment')}>
          <div className="space-y-0.5">
            <ReviewItem label="Employee ID" value={data.employment.employeeId} />
            <ReviewItem label="Work location" value={data.employment.workLocation} />
            <ReviewItem label="Role / Department" value={data.employment.roleDepartment} />
            <ReviewItem label="Manager" value={data.employment.manager} />
            <ReviewItem label="Pay type" value={data.employment.payType} />
            <ReviewItem label="Work week" value={data.employment.standardWorkWeek} />
          </div>
        </Section>

        <Section title="Emergency Contact" step="emergency" onEdit={() => onEditSection('emergency')}>
          <div className="space-y-0.5">
            <ReviewItem label="Contact name" value={data.emergencyContact.contactName} />
            <ReviewItem label="Relationship" value={data.emergencyContact.relationship} />
            <ReviewItem label="Phone" value={data.emergencyContact.phoneNumber} />
            {data.emergencyContact.alternatePhone && (
              <ReviewItem label="Alternate phone" value={data.emergencyContact.alternatePhone} />
            )}
          </div>
          {missingRequired.emergency && (
            <div className="flex items-center gap-1.5 mt-3 text-destructive text-xs">
              <AlertCircle className="h-3 w-3" />
              Missing required fields
            </div>
          )}
        </Section>

        <Section title="Payroll" step="payroll" onEdit={() => onEditSection('payroll')}>
          <div className="space-y-0.5">
            <ReviewItem label="Bank name" value={data.payroll.bankName} />
            <ReviewItem label="Institution #" value={data.payroll.institutionNumber} />
            <ReviewItem label="Transit #" value={data.payroll.transitNumber} />
            <ReviewItem label="Account #" value={data.payroll.accountNumber ? '****' + data.payroll.accountNumber.slice(-4) : undefined} />
            <ReviewItem label="Account holder" value={data.payroll.accountHolderName} />
            <Separator className="my-2" />
            <ReviewItem label="Tax province" value={data.payroll.taxProvince} />
            <ReviewItem label="TD1 form" value={data.payroll.td1FormOption === 'digital' ? 'Complete digitally' : data.payroll.td1FormOption === 'paper' ? 'Paper form' : undefined} />
          </div>
          {missingRequired.payroll && (
            <div className="flex items-center gap-1.5 mt-3 text-destructive text-xs">
              <AlertCircle className="h-3 w-3" />
              Missing required fields
            </div>
          )}
        </Section>

        <Section title="Documents" step="documents" onEdit={() => onEditSection('documents')}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {data.documents.governmentId ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm">Government Photo ID</span>
            </div>
            <div className="flex items-center gap-2">
              {data.documents.directDepositProof ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm">Direct Deposit Proof</span>
            </div>
            {data.documents.workEligibility && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Work Eligibility</span>
              </div>
            )}
            {data.documents.proofOfAddress && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Proof of Address</span>
              </div>
            )}
          </div>
          {missingRequired.documents && (
            <div className="flex items-center gap-1.5 mt-3 text-destructive text-xs">
              <AlertCircle className="h-3 w-3" />
              Missing required documents
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
