import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmploymentInfo } from '@/types/onboarding';

interface EmploymentStepProps {
  data: EmploymentInfo;
  onUpdate: (updates: Partial<EmploymentInfo>) => void;
}

export function EmploymentStep({ data, onUpdate }: EmploymentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Employment Details</h1>
        <p className="text-muted-foreground">Review your work information</p>
      </div>

      <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          Some details may be missing - Fill in what you know or ask HR to update
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={data.employeeId}
              onChange={(e) => onUpdate({ employeeId: e.target.value })}
              placeholder="e.g., EMP-12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workLocation">Work location</Label>
            <Input
              id="workLocation"
              value={data.workLocation}
              onChange={(e) => onUpdate({ workLocation: e.target.value })}
              placeholder="e.g., Toronto Office"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="roleDepartment">Role / Department</Label>
          <Input
            id="roleDepartment"
            value={data.roleDepartment}
            onChange={(e) => onUpdate({ roleDepartment: e.target.value })}
            placeholder="e.g., Software Developer / Engineering"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager">Manager</Label>
          <Input
            id="manager"
            value={data.manager}
            onChange={(e) => onUpdate({ manager: e.target.value })}
            placeholder="e.g., John Smith"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payType">Pay type</Label>
            <Select value={data.payType} onValueChange={(value) => onUpdate({ payType: value })}>
              <SelectTrigger id="payType">
                <SelectValue placeholder="Select pay type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="standardWorkWeek">Standard work week</Label>
            <Input
              id="standardWorkWeek"
              value={data.standardWorkWeek}
              onChange={(e) => onUpdate({ standardWorkWeek: e.target.value })}
              placeholder="e.g., 40 hours/week"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
