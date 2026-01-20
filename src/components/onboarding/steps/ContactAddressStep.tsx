import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContactInfo } from '@/types/onboarding';

interface ContactAddressStepProps {
  data: ContactInfo;
  onUpdate: (updates: Partial<ContactInfo>) => void;
}

const provinces = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const formatPostalCode = (value: string) => {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

export function ContactAddressStep({ data, onUpdate }: ContactAddressStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contact & Address</h1>
        <p className="text-muted-foreground">How can we reach you?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mobilePhone">
            Mobile phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobilePhone"
            type="tel"
            value={data.mobilePhone}
            onChange={(e) => onUpdate({ mobilePhone: formatPhone(e.target.value) })}
            placeholder="(555) 555-5555"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="personalEmail">Personal email</Label>
          <Input
            id="personalEmail"
            type="email"
            value={data.personalEmail}
            onChange={(e) => onUpdate({ personalEmail: e.target.value })}
            placeholder="your.email@example.com"
          />
          <p className="text-xs text-muted-foreground">
            Optional - we'll use this for important updates if you leave the company
          </p>
        </div>

        <div className="border-t pt-4 mt-6">
          <h2 className="text-lg font-semibold mb-4">Mailing Address</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine1">
            Address line 1 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="addressLine1"
            value={data.addressLine1}
            onChange={(e) => onUpdate({ addressLine1: e.target.value })}
            placeholder="Street address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address line 2</Label>
          <Input
            id="addressLine2"
            value={data.addressLine2}
            onChange={(e) => onUpdate({ addressLine2: e.target.value })}
            placeholder="Apartment, suite, unit, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">
              Province <span className="text-destructive">*</span>
            </Label>
            <Select value={data.province} onValueChange={(value) => onUpdate({ province: value })}>
              <SelectTrigger id="province">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 md:w-1/2">
          <Label htmlFor="postalCode">
            Postal code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postalCode"
            value={data.postalCode}
            onChange={(e) => onUpdate({ postalCode: formatPostalCode(e.target.value) })}
            placeholder="A1A 1A1"
          />
        </div>
      </div>
    </div>
  );
}
