import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PersonalInfo } from '@/types/onboarding';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onUpdate: (updates: Partial<PersonalInfo>) => void;
}

export function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  const [showSin, setShowSin] = useState(false);

  const formatSin = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Personal Information</h1>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              Legal first name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              placeholder="Enter your legal first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Legal last name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
              placeholder="Enter your legal last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredName">Preferred name</Label>
          <Input
            id="preferredName"
            value={data.preferredName}
            onChange={(e) => onUpdate({ preferredName: e.target.value })}
            placeholder="What should we call you?"
          />
          <p className="text-xs text-muted-foreground">Optional - if different from legal name</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of birth <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sin">Social Insurance Number</Label>
          <div className="relative">
            <Input
              id="sin"
              type={showSin ? 'text' : 'password'}
              value={data.sin}
              onChange={(e) => onUpdate({ sin: formatSin(e.target.value) })}
              placeholder="XXX-XXX-XXX"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowSin(!showSin)}
            >
              {showSin ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Optional - required for payroll</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={data.gender} onValueChange={(value) => onUpdate({ gender: value })}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Optional</p>
        </div>
      </div>
    </div>
  );
}
