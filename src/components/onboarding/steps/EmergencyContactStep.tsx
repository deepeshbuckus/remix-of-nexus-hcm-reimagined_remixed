import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmergencyContactInfo } from '@/types/onboarding';

interface EmergencyContactStepProps {
  data: EmergencyContactInfo;
  onUpdate: (updates: Partial<EmergencyContactInfo>) => void;
}

const relationships = [
  { value: 'partner', label: 'Partner / Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' },
];

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export function EmergencyContactStep({ data, onUpdate }: EmergencyContactStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Emergency Contact</h1>
        <p className="text-muted-foreground">Who should we contact in case of emergency?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">
            Contact name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactName"
            value={data.contactName}
            onChange={(e) => onUpdate({ contactName: e.target.value })}
            placeholder="Full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">
            Relationship <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={data.relationship} 
            onValueChange={(value) => onUpdate({ relationship: value })}
          >
            <SelectTrigger id="relationship">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map((rel) => (
                <SelectItem key={rel.value} value={rel.value}>
                  {rel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            Phone number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phoneNumber"
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => onUpdate({ phoneNumber: formatPhone(e.target.value) })}
              placeholder="(555) 555-5555"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternatePhone">Alternate phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="alternatePhone"
              type="tel"
              value={data.alternatePhone}
              onChange={(e) => onUpdate({ alternatePhone: formatPhone(e.target.value) })}
              placeholder="(555) 555-5555"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">Optional</p>
        </div>
      </div>
    </div>
  );
}
