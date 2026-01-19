import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  Users,
  DollarSign,
  CreditCard,
  FileText,
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  Heart,
  Globe,
  Cake,
  UserCheck,
  Clock,
  BadgeCheck,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import profileAvatar from "@/assets/profile-avatar.jpg";

// Mock employee data
const employeeData = {
  name: "Anoushka Patel",
  preferredName: "Anoushka",
  employeeId: "EMP-000010",
  jobTitle: "Senior Software Engineer",
  department: "Engineering",
  workLocation: "Toronto, ON",
  email: "anoushka.patel@company.com",
  employmentType: "Full-time",
  startDate: "January 15, 2023",
  birthDate: "April 11, 1990",
  languagePreference: "English",

  // Contact Information
  personalPhone: "(416) 555-0123",
  personalEmail: "anoushka.personal@email.com",
  homeAddress: {
    street: "19 Lakeview Ave",
    city: "Dartmouth",
    province: "Nova Scotia",
    postalCode: "B3A 3S8",
    country: "Canada",
  },
  mailingAddress: null, // Same as home

  // Emergency Contacts
  emergencyContacts: [
    {
      name: "Raj Patel",
      relationship: "Spouse",
      phone: "(416) 555-0456",
    },
  ],

  // Work Information
  manager: {
    name: "Sarah Chen",
    avatar: null,
    title: "Engineering Manager",
  },

  // Pay & Compensation
  basePay: "••••••",
  directDeposit: "TD Bank ••••4521",
  lastPayDate: "November 29, 2025",

  // Payroll & Tax Details
  taxation: {
    provinceOfEmployment: "Ontario",
    federalTax: "Subject to Federal Tax",
    provincialTax: "Subject to Provincial Tax",
    cppQppStatus: "Subject to CPP",
    qpip: "Not Applicable",
    yearEndFormLanguage: "English",
    exemptions: "None",
  },
};

function InfoItem({
  icon: Icon,
  label,
  value,
  masked = false,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  masked?: boolean;
}) {
  const [showValue, setShowValue] = useState(!masked);

  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm font-medium text-foreground">
            {showValue ? value : "••••••••"}
          </p>
          {masked && (
            <button
              onClick={() => setShowValue(!showValue)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showValue ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function MyInfo() {
  const [taxDetailsOpen, setTaxDetailsOpen] = useState(false);

  const fullAddress = `${employeeData.homeAddress.street}, ${employeeData.homeAddress.city}, ${employeeData.homeAddress.province} ${employeeData.homeAddress.postalCode}`;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-24" />
        <CardContent className="relative pt-0 pb-6 px-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={profileAvatar} alt={employeeData.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                {employeeData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 md:pb-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {employeeData.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {employeeData.jobTitle}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {employeeData.workLocation}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck className="h-4 w-4" />
                      {employeeData.employeeId}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-fit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <SectionCard
          title="Personal Information"
          icon={User}
          action={
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoItem
              icon={User}
              label="Full Legal Name"
              value={employeeData.name}
            />
            <InfoItem
              icon={Heart}
              label="Preferred Name"
              value={employeeData.preferredName}
            />
            <InfoItem
              icon={Cake}
              label="Date of Birth"
              value={employeeData.birthDate}
              masked
            />
            <InfoItem
              icon={Globe}
              label="Language Preference"
              value={employeeData.languagePreference}
            />
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard
          title="Contact Information"
          icon={Phone}
          action={
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoItem
              icon={Phone}
              label="Personal Phone"
              value={employeeData.personalPhone}
            />
            <InfoItem
              icon={Mail}
              label="Personal Email"
              value={employeeData.personalEmail}
            />
            <div className="sm:col-span-2">
              <InfoItem
                icon={MapPin}
                label="Home Address"
                value={fullAddress}
              />
            </div>
            {employeeData.mailingAddress && (
              <div className="sm:col-span-2">
                <InfoItem
                  icon={MapPin}
                  label="Mailing Address"
                  value="Different mailing address"
                />
              </div>
            )}
          </div>
        </SectionCard>

        {/* Emergency Contacts */}
        <SectionCard
          title="Emergency Contacts"
          icon={Users}
          action={
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          }
        >
          {employeeData.emergencyContacts.length > 0 ? (
            <div className="space-y-4">
              {employeeData.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {contact.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.relationship} • {contact.phone}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Primary
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No emergency contacts added yet.
            </p>
          )}
        </SectionCard>

        {/* Work Information */}
        <SectionCard title="Work Information" icon={Briefcase}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoItem
                icon={Briefcase}
                label="Job Title"
                value={employeeData.jobTitle}
              />
              <InfoItem
                icon={Building2}
                label="Department"
                value={employeeData.department}
              />
              <InfoItem
                icon={Calendar}
                label="Start Date"
                value={employeeData.startDate}
              />
              <InfoItem
                icon={Clock}
                label="Employment Type"
                value={employeeData.employmentType}
              />
              <InfoItem
                icon={MapPin}
                label="Work Location"
                value={employeeData.workLocation}
              />
            </div>

            {/* Manager */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">
                Reports To
              </p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {employeeData.manager.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employeeData.manager.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Pay & Compensation - Full Width */}
      <SectionCard title="Pay & Compensation Summary" icon={DollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem
            icon={DollarSign}
            label="Base Pay"
            value={employeeData.basePay}
            masked
          />
          <InfoItem
            icon={CreditCard}
            label="Direct Deposit"
            value={employeeData.directDeposit}
          />
          <InfoItem
            icon={Calendar}
            label="Last Pay Date"
            value={employeeData.lastPayDate}
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border/50">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Pay Statements
          </Button>
          <Button variant="outline" size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            View Year-to-Date Earnings
          </Button>
        </div>
      </SectionCard>

      {/* Payroll & Tax Details - Collapsible */}
      <Collapsible open={taxDetailsOpen} onOpenChange={setTaxDetailsOpen}>
        <Card className="border-border/50 shadow-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Payroll & Tax Details
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Technical tax and payroll information
                    </p>
                  </div>
                </div>
                {taxDetailsOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Province of Employment
                  </p>
                  <p className="text-sm font-medium">
                    {employeeData.taxation.provinceOfEmployment}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Federal Tax Status
                  </p>
                  <p className="text-sm font-medium">
                    {employeeData.taxation.federalTax}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Provincial Tax Status
                  </p>
                  <p className="text-sm font-medium">
                    {employeeData.taxation.provincialTax}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    CPP/QPP Status
                  </p>
                  <p className="text-sm font-medium">
                    {employeeData.taxation.cppQppStatus}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    QPIP Status
                  </p>
                  <p className="text-sm font-medium">
                    {employeeData.taxation.qpip}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Year-End Form Language
                  </p>
                  <p className="text-sm font-medium">
                    {employeeData.taxation.yearEndFormLanguage}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Exemptions
                  </p>
                  <p className="text-sm font-medium">
                    {employeeData.taxation.exemptions}
                  </p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
