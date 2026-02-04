import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Hash,
  AlertCircle,
} from "lucide-react";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import {
  extractMiddleInitial,
  formatDisplayDate,
  formatEmployeeId,
  mapLanguageCode,
  mapCountryCode,
  mapProvinceCode,
  formatFullName,
  buildProfilePictureUrl,
  formatCurrency,
  formatDirectDeposit,
} from "@/utils/profileTransformers";

// Re-export the API types for external consumers
export type { ProfileResponse as EmployeeProfile } from "@/types/profile";

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

  if (!value) return null;

  return (
    <div className="flex items-start gap-3 min-w-0">
      {Icon && (
        <div className="mt-0.5 p-2 rounded-lg bg-primary/10 shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="flex items-center gap-2 mt-0.5 min-w-0">
          <p className="text-sm font-medium text-foreground truncate" title={showValue ? value : undefined}>
            {showValue ? value : "••••••••"}
          </p>
          {masked && (
            <button
              onClick={() => setShowValue(!showValue)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
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

function SimpleInfoItem({
  label,
  value,
  masked = false,
}: {
  label: string;
  value: string;
  masked?: boolean;
}) {
  const [showValue, setShowValue] = useState(!masked);

  if (!value) return null;

  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-center gap-2 mt-0.5 min-w-0">
        <p className="text-sm font-medium text-foreground truncate" title={showValue ? value : undefined}>
          {showValue ? value : "••••••••"}
        </p>
        {masked && (
          <button
            onClick={() => setShowValue(!showValue)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
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

function ProfileSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-24" />
        <CardContent className="relative pt-0 pb-6 px-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 md:pb-1 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfileError({ message }: { message: string }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      <Card className="border-destructive/50 shadow-sm">
        <CardContent className="flex items-center gap-4 py-8">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Unable to load profile
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function MyInfo() {
  const [taxDetailsOpen, setTaxDetailsOpen] = useState(false);
  const { data: profile, isLoading, error } = useEmployeeProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return <ProfileError message={error?.message || "Profile data not found"} />;
  }

  // Transform API data for display
  const middleInitial = extractMiddleInitial(profile.personalInfo.middleName);
  const fullName = `${profile.personalInfo.firstName} ${middleInitial ? middleInitial + ". " : ""}${profile.personalInfo.lastName}`;
  const employeeId = formatEmployeeId(profile.employeeNumber);
  const birthDate = formatDisplayDate(profile.personalInfo.birthDate);
  const hireDate = formatDisplayDate(profile.workAssignment.hireDate);
  const preferredLanguage = mapLanguageCode(profile.personalInfo.languagePreference);
  const country = mapCountryCode(profile.contact.address.countryCode);
  const provinceState = mapProvinceCode(
    profile.contact.address.provinceCode,
    profile.contact.address.countryCode
  );
  const managerName = formatFullName(
    profile.workAssignment.reportsTo.firstName,
    profile.workAssignment.reportsTo.lastName
  );
  const avatarUrl = buildProfilePictureUrl(
    profile.personalInfo.profilePicture,
    profile.personalInfo.profilePictureMediaType
  );
  const managerAvatarUrl = buildProfilePictureUrl(
    profile.workAssignment.reportsTo.profilePicture,
    profile.workAssignment.reportsTo.profilePictureMediaType
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-24" />
        <CardContent className="relative pt-0 pb-6 px-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                {profile.personalInfo.firstName[0]}
                {profile.personalInfo.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 md:pb-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {profile.workAssignment.position.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {profile.workAssignment.workLocation.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck className="h-4 w-4" />
                      {employeeId}
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
              label="First Name"
              value={profile.personalInfo.firstName}
            />
            <InfoItem
              icon={Hash}
              label="Middle Initial"
              value={middleInitial}
            />
            <InfoItem
              icon={User}
              label="Last Name"
              value={profile.personalInfo.lastName}
            />
            <InfoItem
              icon={Heart}
              label="Preferred Name"
              value={profile.personalInfo.preferredName}
            />
            <InfoItem
              icon={Globe}
              label="Preferred Language"
              value={preferredLanguage}
            />
            <InfoItem
              icon={Cake}
              label="Birthdate"
              value={birthDate}
              masked
            />
            <div className="sm:col-span-2">
              <InfoItem
                icon={CreditCard}
                label="Payee Name"
                value={profile.personalInfo.payeeName}
              />
            </div>
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
          <div className="space-y-5">
            {/* Address Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <InfoItem
                  icon={MapPin}
                  label="Street"
                  value={profile.contact.address.street}
                />
              </div>
              <SimpleInfoItem label="City" value={profile.contact.address.city} />
              <SimpleInfoItem
                label="Province/State"
                value={provinceState}
              />
              <SimpleInfoItem
                label="Postal/Zip Code"
                value={profile.contact.address.postalCode}
              />
              <SimpleInfoItem label="Country" value={country} />
            </div>

            {/* Phone Numbers */}
            <div className="pt-3 border-t border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <InfoItem
                  icon={Phone}
                  label="Phone 1"
                  value={profile.contact.phones.primary}
                />
                {profile.contact.phones.secondary && (
                  <SimpleInfoItem label="Phone 2" value={profile.contact.phones.secondary} />
                )}
                {profile.contact.phones.mobile && (
                  <SimpleInfoItem label="Phone 3" value={profile.contact.phones.mobile} />
                )}
              </div>
            </div>

            {/* Email Addresses */}
            <div className="pt-3 border-t border-border/50">
              <div className="space-y-4">
                <InfoItem
                  icon={Mail}
                  label="Email 1"
                  value={profile.contact.emails.primary}
                />
                {profile.contact.emails.secondary && (
                  <InfoItem
                    icon={Mail}
                    label="Email 2"
                    value={profile.contact.emails.secondary}
                  />
                )}
              </div>
            </div>
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
          {profile.emergencyContacts.length > 0 ? (
            <div className="space-y-4">
              {profile.emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
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
                        {contact.relationship} • {contact.phoneNumber}
                      </p>
                    </div>
                  </div>
                  {contact.isPrimary && (
                    <Badge variant="secondary" className="text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No emergency contacts added yet.
            </p>
          )}
        </SectionCard>

        {/* Work Assignment */}
        <SectionCard title="Work Assignment" icon={Briefcase}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoItem
                icon={Calendar}
                label="Hire Date"
                value={hireDate}
              />
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Employment Type
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        profile.workAssignment.employmentType === "Full Time"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {profile.workAssignment.employmentType}
                    </Badge>
                  </div>
                </div>
              </div>
              <InfoItem
                icon={Briefcase}
                label="Position"
                value={profile.workAssignment.position.name}
              />
              <InfoItem
                icon={Building2}
                label="Department"
                value={profile.workAssignment.department.name}
              />
              <InfoItem
                icon={MapPin}
                label="Work Location"
                value={profile.workAssignment.workLocation.name}
              />
            </div>

            {/* Manager */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">
                Reports To
              </p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={managerAvatarUrl ?? undefined}
                    alt={managerName}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {profile.workAssignment.reportsTo.firstName[0]}
                    {profile.workAssignment.reportsTo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {managerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.workAssignment.reportsTo.positionTitle}
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
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
