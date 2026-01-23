export interface PersonalInfo {
  firstName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string;
  sin: string;
  gender: string;
}

export interface ContactInfo {
  mobilePhone: string;
  personalEmail: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface EmploymentInfo {
  employeeId: string;
  workLocation: string;
  roleDepartment: string;
  manager: string;
  payType: string;
  standardWorkWeek: string;
}

export interface EmergencyContactInfo {
  contactName: string;
  relationship: string;
  phoneNumber: string;
  alternatePhone: string;
}

export interface PayrollInfo {
  bankName: string;
  institutionNumber: string;
  transitNumber: string;
  accountNumber: string;
  accountHolderName: string;
  taxProvince: string;
  td1FormOption: 'digital' | 'paper' | '';
}

export interface DocumentInfo {
  governmentId: File | null;
  directDepositProof: File | null;
  workEligibility: File | null;
  proofOfAddress: File | null;
}

export interface OnboardingData {
  personalInfo: PersonalInfo;
  contact: ContactInfo;
  employment: EmploymentInfo;
  emergencyContact: EmergencyContactInfo;
  payroll: PayrollInfo;
  documents: DocumentInfo;
}

export type OnboardingStep = 
  | 'welcome'
  | 'personal'
  | 'contact'
  | 'employment'
  | 'emergency'
  | 'documents'
  | 'review';

export const ONBOARDING_STEPS: { id: OnboardingStep; label: string; number: number }[] = [
  { id: 'welcome', label: 'Welcome', number: 1 },
  { id: 'personal', label: 'Personal', number: 2 },
  { id: 'contact', label: 'Contact', number: 3 },
  { id: 'employment', label: 'Employment', number: 4 },
  { id: 'emergency', label: 'Emergency', number: 5 },
  { id: 'documents', label: 'Documents', number: 6 },
  { id: 'review', label: 'Review', number: 7 },
];

export const initialOnboardingData: OnboardingData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    sin: '',
    gender: '',
  },
  contact: {
    mobilePhone: '',
    personalEmail: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
  },
  employment: {
    employeeId: '',
    workLocation: '',
    roleDepartment: '',
    manager: '',
    payType: '',
    standardWorkWeek: '',
  },
  emergencyContact: {
    contactName: '',
    relationship: '',
    phoneNumber: '',
    alternatePhone: '',
  },
  payroll: {
    bankName: '',
    institutionNumber: '',
    transitNumber: '',
    accountNumber: '',
    accountHolderName: '',
    taxProvince: '',
    td1FormOption: '',
  },
  documents: {
    governmentId: null,
    directDepositProof: null,
    workEligibility: null,
    proofOfAddress: null,
  },
};
