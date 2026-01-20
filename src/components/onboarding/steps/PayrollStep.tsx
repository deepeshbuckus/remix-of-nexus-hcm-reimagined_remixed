import { HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PayrollInfo } from '@/types/onboarding';

interface PayrollStepProps {
  data: PayrollInfo;
  onUpdate: (updates: Partial<PayrollInfo>) => void;
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

export function PayrollStep({ data, onUpdate }: PayrollStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payroll Setup</h1>
        <p className="text-muted-foreground">Set up your direct deposit and tax information</p>
      </div>

      {/* Direct Deposit Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Direct Deposit</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-primary text-sm flex items-center gap-1 hover:underline">
                <HelpCircle className="h-4 w-4" />
                Where to find this
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>You can find your institution, transit, and account numbers on a void cheque or through your online banking.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName">Bank name</Label>
          <Input
            id="bankName"
            value={data.bankName}
            onChange={(e) => onUpdate({ bankName: e.target.value })}
            placeholder="e.g., TD Canada Trust"
          />
          <p className="text-xs text-muted-foreground">Optional</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionNumber">
              Institution # <span className="text-destructive">*</span>
            </Label>
            <Input
              id="institutionNumber"
              value={data.institutionNumber}
              onChange={(e) => onUpdate({ institutionNumber: e.target.value.replace(/\D/g, '').slice(0, 3) })}
              placeholder="3 digits"
              maxLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transitNumber">
              Transit # <span className="text-destructive">*</span>
            </Label>
            <Input
              id="transitNumber"
              value={data.transitNumber}
              onChange={(e) => onUpdate({ transitNumber: e.target.value.replace(/\D/g, '').slice(0, 5) })}
              placeholder="5 digits"
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">
              Account # <span className="text-destructive">*</span>
            </Label>
            <Input
              id="accountNumber"
              value={data.accountNumber}
              onChange={(e) => onUpdate({ accountNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
              placeholder="7-12 digits"
              maxLength={12}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountHolderName">
            Account holder name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="accountHolderName"
            value={data.accountHolderName}
            onChange={(e) => onUpdate({ accountHolderName: e.target.value })}
            placeholder="Name as it appears on your account"
          />
        </div>
      </div>

      {/* Tax Information Section */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">Tax Information</h2>

        <div className="space-y-2">
          <Label htmlFor="taxProvince">
            Province/territory for tax purposes <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={data.taxProvince} 
            onValueChange={(value) => onUpdate({ taxProvince: value })}
          >
            <SelectTrigger id="taxProvince">
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

        <div className="space-y-3">
          <Label>
            TD1 tax form <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={data.td1FormOption}
            onValueChange={(value: 'digital' | 'paper') => onUpdate({ td1FormOption: value })}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="digital" id="td1-digital" className="mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor="td1-digital" className="font-medium cursor-pointer">
                  I will complete my TD1 digitally
                </Label>
                <p className="text-sm text-muted-foreground">
                  Complete the form in-app after onboarding
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="paper" id="td1-paper" className="mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor="td1-paper" className="font-medium cursor-pointer">
                  I will provide a paper form to HR
                </Label>
                <p className="text-sm text-muted-foreground">
                  Submit physical TD1 to employer
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
