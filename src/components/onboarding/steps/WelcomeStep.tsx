import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, Users, Wallet, FileText } from 'lucide-react';

const sections = [
  {
    icon: User,
    title: 'Personal info',
    description: 'Name, date of birth, SIN',
  },
  {
    icon: Phone,
    title: 'Contact and Address',
    description: 'Phone, email, mailing address',
  },
  {
    icon: Users,
    title: 'Emergency contact',
    description: 'Who to contact in case of emergency',
  },
  {
    icon: Wallet,
    title: 'Payroll info',
    description: 'Bank details for direct deposit',
  },
  {
    icon: FileText,
    title: 'Documents',
    description: 'ID, void cheque, work permit',
  },
];

export function WelcomeStep() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Set up your profile</h1>
        <p className="text-muted-foreground">Takes about 3-5 minutes</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">What we'll collect</h2>
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
