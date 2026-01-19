// API Response Types for Employee Profile

export interface ProfileResponse {
  id: string;
  employeeNumber: number;
  personalInfo: PersonalInfo;
  contact: Contact;
  workAssignment: WorkAssignment;
  emergencyContacts: EmergencyContact[];
}

export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  languagePreference: string;
  birthDate: string; // ISO format: "1990-05-15"
  payeeName: string;
}

export interface Contact {
  address: Address;
  phones: Phones;
  emails: Emails;
}

export interface Address {
  street: string;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
}

export interface Phones {
  primary: string;
  secondary: string;
  mobile: string;
}

export interface Emails {
  primary: string;
  secondary: string;
}

export interface WorkAssignment {
  hireDate: string; // ISO format: "2020-01-15"
  employmentType: string;
  position: NamedEntity;
  department: NamedEntity;
  workLocation: NamedEntity;
  reportsTo: ReportsTo;
}

export interface NamedEntity {
  id: string;
  name: string;
}

export interface ReportsTo {
  id: string;
  firstName: string;
  lastName: string;
  positionTitle: string;
  avatarUrl: string | null;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}
