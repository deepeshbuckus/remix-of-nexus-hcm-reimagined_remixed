
## Remove Payroll Section from Onboarding (Temporary)

This plan removes the payroll step from the onboarding wizard while preserving the code for future reintegration.

### Summary of Changes

The payroll step will be removed from the active onboarding flow, but the `PayrollStep.tsx` component and `PayrollInfo` type will remain in the codebase for later use.

---

### Files to Modify

| File | Change |
|------|--------|
| `src/types/onboarding.ts` | Remove `'payroll'` from step sequence and update step numbers |
| `src/components/onboarding/steps/WelcomeStep.tsx` | Remove "Payroll info" from the "What we'll collect" list |
| `src/pages/Onboarding.tsx` | Remove the PayrollStep import and case from renderStep |
| `src/components/onboarding/steps/ReviewStep.tsx` | Remove the Payroll section and its validation |

---

### Technical Details

#### 1. Update Step Configuration (`src/types/onboarding.ts`)

**Remove from `OnboardingStep` type:**
```typescript
// Before
export type OnboardingStep = 
  | 'welcome'
  | 'personal'
  | 'contact'
  | 'employment'
  | 'emergency'
  | 'payroll'      // Remove this
  | 'documents'
  | 'review';

// After
export type OnboardingStep = 
  | 'welcome'
  | 'personal'
  | 'contact'
  | 'employment'
  | 'emergency'
  | 'documents'
  | 'review';
```

**Update `ONBOARDING_STEPS` array:**
```typescript
// Before: 8 steps
// After: 7 steps (remove payroll, renumber documents and review)
export const ONBOARDING_STEPS = [
  { id: 'welcome', label: 'Welcome', number: 1 },
  { id: 'personal', label: 'Personal', number: 2 },
  { id: 'contact', label: 'Contact', number: 3 },
  { id: 'employment', label: 'Employment', number: 4 },
  { id: 'emergency', label: 'Emergency', number: 5 },
  { id: 'documents', label: 'Documents', number: 6 },  // Was 7
  { id: 'review', label: 'Review', number: 7 },        // Was 8
];
```

> Note: `PayrollInfo` interface and `payroll` in `OnboardingData` will be kept for future use

#### 2. Update Welcome Step (`src/components/onboarding/steps/WelcomeStep.tsx`)

Remove the "Payroll info" section from the preview list:
```typescript
const sections = [
  { icon: User, title: 'Personal info', description: 'Name, date of birth, SIN' },
  { icon: Phone, title: 'Contact and Address', description: 'Phone, email, mailing address' },
  { icon: Users, title: 'Emergency contact', description: 'Who to contact in case of emergency' },
  // Remove: { icon: Wallet, title: 'Payroll info', ... }
  { icon: FileText, title: 'Documents', description: 'ID, void cheque, work permit' },
];
```

#### 3. Update Onboarding Page (`src/pages/Onboarding.tsx`)

- Remove the `PayrollStep` import
- Remove the `case 'payroll':` block from `renderStep()`

#### 4. Update Review Step (`src/components/onboarding/steps/ReviewStep.tsx`)

- Remove `payroll` from `missingRequired` validation object
- Remove the entire Payroll `<Section>` block (lines 141-158)

---

### What Will Be Preserved

The following will remain in the codebase for future reintegration:

- `src/components/onboarding/steps/PayrollStep.tsx` - Full component
- `PayrollInfo` interface in `src/types/onboarding.ts`
- `payroll` field in `OnboardingData` interface
- `payroll` initial state in `initialOnboardingData`

---

### Updated Onboarding Flow

```text
Current (8 steps):
Welcome -> Personal -> Contact -> Employment -> Emergency -> Payroll -> Documents -> Review

After (7 steps):
Welcome -> Personal -> Contact -> Employment -> Emergency -> Documents -> Review
```

---

### Updated API Specification

With payroll removed, the submit API payload will exclude payroll data:

```json
{
  "personalInfo": { ... },
  "contact": { ... },
  "employment": { ... },
  "emergencyContact": { ... }
}
```
