

## Integrate Compensation API Data into MyInfo Profile Page

This plan replaces the hardcoded `payData` mock object with real backend data by extending the profile API response and updating the frontend to consume it.

---

### Summary of Changes

| Area | Change |
|------|--------|
| Types | Add `Compensation` interface to `ProfileResponse` |
| Service | No changes (same endpoint returns extended data) |
| Transformers | Add `formatCurrency` and `formatPayFrequency` utilities |
| MyInfo Page | Replace `payData` mock with API data from `profile.compensation` |

---

### API Contract Extension

The existing `GET /api/v1/employees/{id}/profile` endpoint will be extended to include a `compensation` object:

```json
{
  "id": "...",
  "employeeNumber": 1004,
  "personalInfo": { ... },
  "contact": { ... },
  "workAssignment": { ... },
  "emergencyContacts": [ ... ],
  "compensation": {
    "basePay": "85000.00",
    "payFrequency": "Bi-weekly",
    "currency": "CAD",
    "lastPayDate": "2025-11-29",
    "directDeposit": {
      "bankName": "TD Bank",
      "accountLast4": "4521"
    },
    "taxation": {
      "provinceOfEmployment": "ON",
      "federalTaxStatus": "Subject to Federal Tax",
      "provincialTaxStatus": "Subject to Provincial Tax",
      "cppQppStatus": "Subject to CPP",
      "qpipStatus": "Not Applicable",
      "yearEndFormLanguage": "EN",
      "exemptions": "None"
    }
  }
}
```

---

### Technical Details

#### 1. Extend Type Definitions (`src/types/profile.ts`)

Add new interfaces for compensation data:

```typescript
export interface Compensation {
  basePay: string;           // Decimal string for precision
  payFrequency: string;      // "Weekly", "Bi-weekly", "Semi-monthly", "Monthly"
  currency: string;          // "CAD", "USD"
  lastPayDate: string;       // ISO date: "2025-11-29"
  directDeposit: DirectDeposit;
  taxation: Taxation;
}

export interface DirectDeposit {
  bankName: string;
  accountLast4: string;      // Masked: only last 4 digits
}

export interface Taxation {
  provinceOfEmployment: string;    // Province code: "ON"
  federalTaxStatus: string;
  provincialTaxStatus: string;
  cppQppStatus: string;
  qpipStatus: string;
  yearEndFormLanguage: string;     // Language code: "EN"
  exemptions: string;
}
```

Update `ProfileResponse` to include the new field:

```typescript
export interface ProfileResponse {
  id: string;
  employeeNumber: number;
  personalInfo: PersonalInfo;
  contact: Contact;
  workAssignment: WorkAssignment;
  emergencyContacts: EmergencyContact[];
  compensation: Compensation;  // Add this
}
```

#### 2. Add Transformer Utilities (`src/utils/profileTransformers.ts`)

Add new formatting functions:

```typescript
/**
 * Format currency amount for display
 * @example formatCurrency("85000.00", "CAD") -> "$85,000.00 CAD"
 */
export function formatCurrency(
  amount: string | null | undefined,
  currency: string = "CAD"
): string {
  if (!amount) return "";
  
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency,
  }).format(num);
}

/**
 * Format direct deposit display string
 * @example formatDirectDeposit("TD Bank", "4521") -> "TD Bank ••••4521"
 */
export function formatDirectDeposit(
  bankName: string | null | undefined,
  accountLast4: string | null | undefined
): string {
  if (!bankName && !accountLast4) return "";
  if (!accountLast4) return bankName || "";
  return `${bankName || "Bank"} ••••${accountLast4}`;
}
```

#### 3. Update MyInfo Page (`src/pages/MyInfo.tsx`)

**Remove mock data** (lines 236-250):

```typescript
// DELETE THIS ENTIRE BLOCK
const payData = {
  basePay: "••••••",
  directDeposit: "TD Bank ••••4521",
  ...
};
```

**Add new imports:**

```typescript
import {
  // ... existing imports
  formatCurrency,
  formatDirectDeposit,
} from "@/utils/profileTransformers";
```

**Update Pay & Compensation section** (lines 580-610):

Replace hardcoded `payData` references with API data:

```tsx
<SectionCard title="Pay & Compensation Summary" icon={DollarSign}>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <InfoItem
      icon={DollarSign}
      label="Base Pay"
      value={formatCurrency(profile.compensation.basePay, profile.compensation.currency)}
      masked
    />
    <InfoItem
      icon={CreditCard}
      label="Direct Deposit"
      value={formatDirectDeposit(
        profile.compensation.directDeposit.bankName,
        profile.compensation.directDeposit.accountLast4
      )}
    />
    <InfoItem
      icon={Calendar}
      label="Last Pay Date"
      value={formatDisplayDate(profile.compensation.lastPayDate)}
    />
  </div>
  {/* ... buttons remain unchanged */}
</SectionCard>
```

**Update Payroll & Tax Details section** (lines 639-698):

Replace `payData.taxation` with `profile.compensation.taxation`:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 rounded-lg bg-muted/30">
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      Province of Employment
    </p>
    <p className="text-sm font-medium">
      {mapProvinceCode(profile.compensation.taxation.provinceOfEmployment, "CA")}
    </p>
  </div>
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      Federal Tax Status
    </p>
    <p className="text-sm font-medium">
      {profile.compensation.taxation.federalTaxStatus}
    </p>
  </div>
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      Provincial Tax Status
    </p>
    <p className="text-sm font-medium">
      {profile.compensation.taxation.provincialTaxStatus}
    </p>
  </div>
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      CPP/QPP Status
    </p>
    <p className="text-sm font-medium">
      {profile.compensation.taxation.cppQppStatus}
    </p>
  </div>
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      QPIP Status
    </p>
    <p className="text-sm font-medium">
      {profile.compensation.taxation.qpipStatus}
    </p>
  </div>
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      Year-End Form Language
    </p>
    <p className="text-sm font-medium">
      {mapLanguageCode(profile.compensation.taxation.yearEndFormLanguage)}
    </p>
  </div>
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      Exemptions
    </p>
    <p className="text-sm font-medium">
      {profile.compensation.taxation.exemptions}
    </p>
  </div>
</div>
```

---

### Data Flow After Implementation

```text
Backend API
    │
    ▼
GET /api/v1/employees/{id}/profile
    │
    ├─► personalInfo
    ├─► contact
    ├─► workAssignment
    ├─► emergencyContacts
    └─► compensation (NEW)
           │
           ├─► basePay, payFrequency, currency, lastPayDate
           ├─► directDeposit { bankName, accountLast4 }
           └─► taxation { provinceOfEmployment, federalTaxStatus, ... }
                   │
                   ▼
              MyInfo Page
              (formatCurrency, formatDirectDeposit, mapProvinceCode)
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/types/profile.ts` | Add `Compensation`, `DirectDeposit`, `Taxation` interfaces |
| `src/utils/profileTransformers.ts` | Add `formatCurrency`, `formatDirectDeposit` functions |
| `src/pages/MyInfo.tsx` | Remove `payData` mock, use `profile.compensation` |

---

### No Changes Needed

- `src/services/profileService.ts` - Same endpoint, just extended response
- `src/hooks/useEmployeeProfile.ts` - Already returns `ProfileResponse`
- React Query caching - Already configured with 5-minute stale time

