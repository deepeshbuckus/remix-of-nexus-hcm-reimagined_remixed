import { 
  DollarSign, 
  Calendar, 
  Download, 
  Printer,
  Building2,
  User,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  FileText,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EarningsLine {
  type: string;
  hours?: number;
  rate?: number;
  amount: number;
  ytd: number;
}

interface DeductionLine {
  type: string;
  current: number;
  ytd: number;
}

interface EmployerContribution {
  type: string;
  current: number;
  ytd: number;
}

interface PayRecord {
  id: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  hours: number;
  netPay: number;
  grossPay: number;
  deductions: number;
  deductionPercent: number;
  employeeNumber: string;
  department: string;
  employer: string;
  sequence: string;
  earnings: EarningsLine[];
  employeeDeductions: DeductionLine[];
  employerContributions: EmployerContribution[];
  netPayAllocation: string;
  ytdGrossPay: number;
  ytdDeductions: number;
  ytdNetPay: number;
}

interface PayStatementDialogProps {
  payRecord: PayRecord | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === 0) return "—";
  return num.toFixed(2);
};

export const PayStatementDialog = ({ payRecord, onClose }: PayStatementDialogProps) => {
  if (!payRecord) return null;

  const totalEarnings = payRecord.earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductions = payRecord.employeeDeductions.reduce((sum, d) => sum + d.current, 0);
  const totalContributions = payRecord.employerContributions.reduce((sum, c) => sum + c.current, 0);

  return (
    <Dialog open={!!payRecord} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 gap-0">
        {/* Tier 1: Hero - Net Pay Summary */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 md:p-8 rounded-t-lg">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-emerald-100 text-sm font-medium uppercase tracking-wide">Net Pay</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {formatCurrency(payRecord.netPay)}
                </h1>
                <p className="text-emerald-100 text-sm">
                  Pay Date: {payRecord.payDate}
                </p>
              </div>
              
              {/* Deposit Info */}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 w-fit">
                <CreditCard className="h-4 w-4 text-emerald-200" />
                <span className="text-sm">{payRecord.netPayAllocation}</span>
              </div>
            </div>

            {/* Gross/Deductions Summary */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="bg-white/10 rounded-xl p-4 min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-200" />
                  <span className="text-emerald-100 text-xs uppercase tracking-wide">Gross Pay</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(payRecord.grossPay)}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-orange-300" />
                  <span className="text-emerald-100 text-xs uppercase tracking-wide">Deductions</span>
                </div>
                <p className="text-2xl font-bold text-orange-200">-{formatCurrency(payRecord.deductions)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-white/90 flex-1 sm:flex-none">
              <Printer className="h-4 w-4 mr-2" />
              Print Statement
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-white/20 flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8 space-y-6 bg-background">
          {/* Tier 2: Pay Period & Employee Details */}
          <Card className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Pay Period Details</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">Period Start</span>
                  </div>
                  <p className="font-semibold text-foreground">{payRecord.periodStart}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">Period End</span>
                  </div>
                  <p className="font-semibold text-foreground">{payRecord.periodEnd}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs">Employee #</span>
                  </div>
                  <p className="font-semibold text-foreground">{payRecord.employeeNumber}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="text-xs">Department</span>
                  </div>
                  <p className="font-semibold text-foreground">{payRecord.department}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="text-xs">Employer #</span>
                  </div>
                  <p className="font-semibold text-foreground">{payRecord.employer}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Hash className="h-3.5 w-3.5" />
                    <span className="text-xs">Sequence</span>
                  </div>
                  <p className="font-semibold text-foreground">{payRecord.sequence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier 3: Earnings & Deductions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Card */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">Earnings</h3>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {formatCurrency(totalEarnings)}
                  </Badge>
                </div>
                
                {/* Earnings Table */}
                <div className="divide-y divide-border">
                  {/* Header */}
                  <div className="grid grid-cols-4 px-5 py-2 bg-secondary/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <span>Type</span>
                    <span className="text-right">Hours</span>
                    <span className="text-right">Rate</span>
                    <span className="text-right">Amount</span>
                  </div>
                  
                  {/* Rows */}
                  {payRecord.earnings.map((earning, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "grid grid-cols-4 px-5 py-3 text-sm",
                        idx % 2 === 1 && "bg-secondary/20"
                      )}
                    >
                      <span className="font-medium text-foreground">{earning.type}</span>
                      <span className="text-right text-muted-foreground">{formatNumber(earning.hours)}</span>
                      <span className="text-right text-muted-foreground">{earning.rate ? `$${formatNumber(earning.rate)}` : "—"}</span>
                      <span className={cn(
                        "text-right font-semibold",
                        earning.amount > 0 ? "text-emerald-600" : "text-muted-foreground"
                      )}>
                        {earning.amount > 0 ? formatCurrency(earning.amount) : "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* YTD Footer */}
                <div className="px-5 py-3 bg-secondary/50 border-t border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Year-to-Date Total</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(payRecord.earnings.reduce((sum, e) => sum + e.ytd, 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deductions & Contributions Card */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-0">
                <Tabs defaultValue="deductions" className="w-full">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <TabsList className="bg-secondary/50 h-9">
                      <TabsTrigger value="deductions" className="text-xs data-[state=active]:bg-background">
                        Employee Deductions
                      </TabsTrigger>
                      <TabsTrigger value="contributions" className="text-xs data-[state=active]:bg-background">
                        Employer
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="deductions" className="mt-0">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-orange-50/50">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                          <TrendingDown className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-medium text-foreground">Total Deductions</span>
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        -{formatCurrency(totalDeductions)}
                      </Badge>
                    </div>
                    
                    <div className="divide-y divide-border">
                      {/* Header */}
                      <div className="grid grid-cols-3 px-5 py-2 bg-secondary/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        <span>Type</span>
                        <span className="text-right">Current</span>
                        <span className="text-right">YTD</span>
                      </div>
                      
                      {/* Rows */}
                      {payRecord.employeeDeductions.map((deduction, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "grid grid-cols-3 px-5 py-3 text-sm",
                            idx % 2 === 1 && "bg-secondary/20"
                          )}
                        >
                          <span className="font-medium text-foreground">{deduction.type}</span>
                          <span className={cn(
                            "text-right",
                            deduction.current > 0 ? "text-orange-600 font-medium" : "text-muted-foreground"
                          )}>
                            {deduction.current > 0 ? `-${formatCurrency(deduction.current)}` : "—"}
                          </span>
                          <span className="text-right text-muted-foreground">
                            {formatCurrency(deduction.ytd)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="contributions" className="mt-0">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-primary/5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">Employer Contributions</span>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {formatCurrency(totalContributions)}
                      </Badge>
                    </div>
                    
                    <div className="divide-y divide-border">
                      {/* Header */}
                      <div className="grid grid-cols-3 px-5 py-2 bg-secondary/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        <span>Type</span>
                        <span className="text-right">Current</span>
                        <span className="text-right">YTD</span>
                      </div>
                      
                      {/* Rows */}
                      {payRecord.employerContributions.map((contribution, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "grid grid-cols-3 px-5 py-3 text-sm",
                            idx % 2 === 1 && "bg-secondary/20"
                          )}
                        >
                          <span className="font-medium text-foreground">{contribution.type}</span>
                          <span className="text-right text-primary font-medium">
                            {formatCurrency(contribution.current)}
                          </span>
                          <span className="text-right text-muted-foreground">
                            {formatCurrency(contribution.ytd)}
                          </span>
                        </div>
                      ))}
                      
                      {payRecord.employerContributions.length === 0 && (
                        <div className="px-5 py-8 text-center text-muted-foreground text-sm">
                          No employer contributions this period
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <Card className="border border-border shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-secondary/30">
                <Banknote className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Pay Summary</h3>
              </div>
              
              <div className="divide-y divide-border">
                {/* Gross Pay Row */}
                <div className="grid grid-cols-3 px-5 py-4">
                  <span className="font-medium text-foreground">Gross Pay</span>
                  <span className="text-right text-foreground font-semibold">{formatCurrency(payRecord.grossPay)}</span>
                  <div className="text-right">
                    <span className="text-muted-foreground text-sm">YTD: </span>
                    <span className="text-foreground font-medium">{formatCurrency(payRecord.ytdGrossPay)}</span>
                  </div>
                </div>
                
                {/* Deductions Row */}
                <div className="grid grid-cols-3 px-5 py-4">
                  <span className="font-medium text-foreground">Total Deductions</span>
                  <span className="text-right text-orange-600 font-semibold">-{formatCurrency(payRecord.deductions)}</span>
                  <div className="text-right">
                    <span className="text-muted-foreground text-sm">YTD: </span>
                    <span className="text-orange-600 font-medium">-{formatCurrency(payRecord.ytdDeductions)}</span>
                  </div>
                </div>
                
                {/* Net Pay Row - Highlighted */}
                <div className="grid grid-cols-3 px-5 py-4 bg-emerald-50">
                  <span className="font-bold text-emerald-700 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Net Pay
                  </span>
                  <span className="text-right text-emerald-700 font-bold text-lg">{formatCurrency(payRecord.netPay)}</span>
                  <div className="text-right">
                    <span className="text-emerald-600 text-sm">YTD: </span>
                    <span className="text-emerald-700 font-bold">{formatCurrency(payRecord.ytdNetPay)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Information */}
          <div className="flex items-center justify-center gap-3 py-4 px-5 bg-secondary/30 rounded-lg border border-border">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Deposited to:</span>
            <span className="font-semibold text-foreground">{payRecord.netPayAllocation}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
