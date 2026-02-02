

## Add Payroll Back to Onboarding Flow

This plan restores the payroll step to the onboarding wizard, reversing the previous removal.

### Summary of Changes

The payroll step will be added back between Emergency Contact and Documents, restoring the original 8-step flow.

---

### Files to Modify

| File | Change |
|------|--------|
| `src/types/onboarding.ts` | Add `'payroll'` to step type and renumber steps |
| `src/components/onboarding/steps/WelcomeStep.tsx` | Add "Payroll info" to the "What we'll collect" list |
| `src/pages/Onboarding.tsx` | Import PayrollStep and add case to renderStep |
| `src/components/onboarding/steps/ReviewStep.tsx` | Add Payroll section and validation |

---

### Technical Details

#### 1. Update Step Configuration (`src/types/onboarding.ts`)

**Add to `OnboardingStep` type:**
```typescript
export type OnboardingStep = 
  | 'welcome'
  | 'personal'
  | 'contact'
  | 'employment'
  | 'emergency'
  | 'payroll'      // Add this back
  | 'documents'
  | 'review';
```

**Update `ONBOARDING_STEPS` array (8 steps):**
```typescript
export const ONBOARDING_STEPS = [
  { id: 'welcome', label: 'Welcome', number: 1 },
  { id: 'personal', label: 'Personal', number: 2 },
  { id: 'contact', label: 'Contact', number: 3 },
  { id: 'employment', label: 'Employment', number: 4 },
  { id: 'emergency', label: 'Emergency', number: 5 },
  { id: 'payroll', label: 'Payroll', number: 6 },   // Add back
  { id: 'documents', label: 'Documents', number: 7 },
  { id: 'review', label: 'Review', number: 8 },
];
```

#### 2. Update Welcome Step (`src/components/onboarding/steps/WelcomeStep.tsx`)

Add payroll info section and Wallet icon import:
```typescript
import { User, Phone, Users, Wallet, FileText } from 'lucide-react';

const sections = [
  { icon: User, title: 'Personal info', description: 'Name, date of birth, SIN' },
  { icon: Phone, title: 'Contact and Address', description: 'Phone, email, mailing address' },
  { icon: Users, title: 'Emergency contact', description: 'Who to contact in case of emergency' },
  { icon: Wallet, title: 'Payroll info', description: 'Bank details for direct deposit' },
  { icon: FileText, title: 'Documents', description: 'ID, void cheque, work permit' },
];
```

#### 3. Update Onboarding Page (`src/pages/Onboarding.tsx`)

Add import and case block:
```typescript
import { PayrollStep } from '@/components/onboarding/steps/PayrollStep';

// In renderStep():
case 'payroll':
  return (
    <PayrollStep
      data={data.payroll}
      onUpdate={(updates) => updateData('payroll', updates)}
    />
  );
```

#### 4. Update Review Step (`src/components/onboarding/steps/ReviewStep.tsx`)

**Add payroll validation:**
```typescript
const missingRequired = {
  personal: ...,
  contact: ...,
  emergency: ...,
  payroll: !data.payroll.institutionNumber || !data.payroll.transitNumber || 
           !data.payroll.accountNumber || !data.payroll.accountHolderName || 
           !data.payroll.taxProvince || !data.payroll.td1FormOption,
  documents: ...,
};
```

**Add Payroll section (after Emergency Contact, before Documents):**
```typescript
<Section title="Payroll" step="payroll" onEdit={() => onEditSection('payroll')}>
  <div className="space-y-0.5">
    <ReviewItem label="Bank name" value={data.payroll.bankName} />
    <ReviewItem label="Institution #" value={data.payroll.institutionNumber} />
    <ReviewItem label="Transit #" value={data.payroll.transitNumber} />
    <ReviewItem label="Account #" value={data.payroll.accountNumber ? 
      '****' + data.payroll.accountNumber.slice(-4) : undefined} />
    <ReviewItem label="Account holder" value={data.payroll.accountHolderName} />
    <Separator className="my-2" />
    <ReviewItem label="Tax province" value={data.payroll.taxProvince} />
    <ReviewItem label="TD1 form" value={
      data.payroll.td1FormOption === 'digital' ? 'Complete digitally' : 
      data.payroll.td1FormOption === 'paper' ? 'Paper form' : undefined
    } />
  </div>
  {missingRequired.payroll && (
    <div className="flex items-center gap-1.5 mt-3 text-destructive text-xs">
      <AlertCircle className="h-3 w-3" />
      Missing required fields
    </div>
  )}
</Section>
```

---

### Restored Onboarding Flow

```text
Current (7 steps):
Welcome -> Personal -> Contact -> Employment -> Emergency -> Documents -> Review

After (8 steps):
Welcome -> Personal -> Contact -> Employment -> Emergency -> Payroll -> Documents -> Review
```

---

### No Changes Needed

The following are already in place:

- `src/components/onboarding/steps/PayrollStep.tsx` - Component exists
- `PayrollInfo` interface in `src/types/onboarding.ts` - Already defined
- `payroll` field in `OnboardingData` - Already included
- `payroll` initial state in `initialOnboardingData` - Already configured

