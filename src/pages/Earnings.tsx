import { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronRight,
  BarChart3,
  Filter,
  Download,
  Search,
  FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PayStatementDialog } from "@/components/earnings/PayStatementDialog";

interface TaxForm {
  id: string;
  formType: string;
  title: string;
  description: string;
  taxYear: string;
  issuedDate: string;
  status: "available" | "archived";
}

const taxForms: TaxForm[] = [
  {
    id: "1",
    formType: "T4",
    title: "T4 - Statement of Remuneration Paid",
    description: "Annual income and deductions statement",
    taxYear: "2024",
    issuedDate: "2/15/2024",
    status: "available",
  },
  {
    id: "2",
    formType: "T4A",
    title: "T4A - Statement of Pension",
    description: "Pension, retirement, and other income",
    taxYear: "2024",
    issuedDate: "2/15/2024",
    status: "available",
  },
  {
    id: "3",
    formType: "T4",
    title: "T4 - Statement of Remuneration Paid",
    description: "Annual income and deductions statement",
    taxYear: "2023",
    issuedDate: "2/15/2023",
    status: "archived",
  },
  {
    id: "4",
    formType: "RL-1",
    title: "RL-1 - Employment and Other Income",
    description: "Quebec provincial tax form",
    taxYear: "2024",
    issuedDate: "2/15/2024",
    status: "available",
  },
];

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

const payHistory: PayRecord[] = [
  {
    id: "1",
    period: "Sep 16-30, 2025",
    periodStart: "2025/09/16",
    periodEnd: "2025/09/30",
    payDate: "2025/10/04",
    hours: 80,
    netPay: 2320.00,
    grossPay: 2900.00,
    deductions: 580.00,
    deductionPercent: 20.0,
    employeeNumber: "0004",
    department: "0004 00",
    employer: "H602-9",
    sequence: "C0424659",
    earnings: [
      { type: "REGULAR", hours: 75, rate: 20.00, amount: 1500.00, ytd: 20873.84 },
      { type: "STAT 1.0", hours: undefined, rate: undefined, amount: 0, ytd: 315.63 },
      { type: "VAC.PAY", hours: undefined, rate: 150.00, amount: 150.00, ytd: 208972.35 },
      { type: "BONUS", hours: undefined, rate: undefined, amount: 0, ytd: 2969.00 },
    ],
    employeeDeductions: [
      { type: "FED.TAX", current: 179.91, ytd: 113682.37 },
      { type: "QUE.TAX", current: 0, ytd: 1432.36 },
      { type: "E.I.", current: 0, ytd: 1037.45 },
      { type: "Q.P.I.P", current: 0, ytd: 59.96 },
      { type: "C.P.P.", current: 0, ytd: 4482.28 },
      { type: "SOCIAL", current: 3.00, ytd: 33.00 },
      { type: "TDSD", current: 85.00, ytd: 935.00 },
      { type: "EX.DEDNS", current: 0, ytd: 34942.20 },
    ],
    employerContributions: [
      { type: "SOCIAL", current: 2.01, ytd: 22.11 },
    ],
    netPayAllocation: "DEPOSIT 003 04022 XXXXX974",
    ytdGrossPay: 233130.82,
    ytdDeductions: 156604.62,
    ytdNetPay: 76526.20,
  },
  {
    id: "2",
    period: "Sep 1-15, 2025",
    periodStart: "2025/09/01",
    periodEnd: "2025/09/15",
    payDate: "2025/09/19",
    hours: 85,
    netPay: 2480.00,
    grossPay: 3100.00,
    deductions: 620.00,
    deductionPercent: 20.0,
    employeeNumber: "0004",
    department: "0004 00",
    employer: "H602-9",
    sequence: "C0424658",
    earnings: [
      { type: "REGULAR", hours: 80, rate: 20.00, amount: 1600.00, ytd: 19373.84 },
      { type: "STAT 1.0", hours: undefined, rate: undefined, amount: 0, ytd: 315.63 },
      { type: "VAC.PAY", hours: undefined, rate: 160.00, amount: 160.00, ytd: 208822.35 },
      { type: "BONUS", hours: undefined, rate: undefined, amount: 500.00, ytd: 2969.00 },
    ],
    employeeDeductions: [
      { type: "FED.TAX", current: 195.00, ytd: 113502.46 },
      { type: "QUE.TAX", current: 0, ytd: 1432.36 },
      { type: "E.I.", current: 35.00, ytd: 1037.45 },
      { type: "Q.P.I.P", current: 0, ytd: 59.96 },
      { type: "C.P.P.", current: 120.00, ytd: 4482.28 },
      { type: "SOCIAL", current: 3.00, ytd: 30.00 },
      { type: "TDSD", current: 85.00, ytd: 850.00 },
      { type: "EX.DEDNS", current: 0, ytd: 34942.20 },
    ],
    employerContributions: [
      { type: "SOCIAL", current: 2.01, ytd: 20.10 },
    ],
    netPayAllocation: "DEPOSIT 003 04022 XXXXX974",
    ytdGrossPay: 230230.82,
    ytdDeductions: 155984.62,
    ytdNetPay: 74246.20,
  },
  {
    id: "3",
    period: "Aug 16-31, 2025",
    periodStart: "2025/08/16",
    periodEnd: "2025/08/31",
    payDate: "2025/09/05",
    hours: 78,
    netPay: 2280.00,
    grossPay: 2850.00,
    deductions: 570.00,
    deductionPercent: 20.0,
    employeeNumber: "0004",
    department: "0004 00",
    employer: "H602-9",
    sequence: "C0424657",
    earnings: [
      { type: "REGULAR", hours: 75, rate: 20.00, amount: 1500.00, ytd: 17773.84 },
      { type: "STAT 1.0", hours: undefined, rate: undefined, amount: 0, ytd: 315.63 },
      { type: "VAC.PAY", hours: undefined, rate: 145.00, amount: 145.00, ytd: 208662.35 },
      { type: "BONUS", hours: undefined, rate: undefined, amount: 0, ytd: 2469.00 },
    ],
    employeeDeductions: [
      { type: "FED.TAX", current: 165.00, ytd: 113307.46 },
      { type: "QUE.TAX", current: 0, ytd: 1432.36 },
      { type: "E.I.", current: 32.00, ytd: 1002.45 },
      { type: "Q.P.I.P", current: 0, ytd: 59.96 },
      { type: "C.P.P.", current: 115.00, ytd: 4362.28 },
      { type: "SOCIAL", current: 3.00, ytd: 27.00 },
      { type: "TDSD", current: 85.00, ytd: 765.00 },
      { type: "EX.DEDNS", current: 0, ytd: 34942.20 },
    ],
    employerContributions: [
      { type: "SOCIAL", current: 2.01, ytd: 18.09 },
    ],
    netPayAllocation: "DEPOSIT 003 04022 XXXXX974",
    ytdGrossPay: 227130.82,
    ytdDeductions: 155364.62,
    ytdNetPay: 71766.20,
  },
];

const Earnings = () => {
  const [showAmounts, setShowAmounts] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [periodFilter, setPeriodFilter] = useState("all");
  const [taxFormSearch, setTaxFormSearch] = useState("");
  const [selectedPayRecord, setSelectedPayRecord] = useState<PayRecord | null>(null);

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "";
    return num.toFixed(2);
  };

  const filteredTaxForms = taxForms.filter(form => 
    form.title.toLowerCase().includes(taxFormSearch.toLowerCase()) ||
    form.taxYear.includes(taxFormSearch) ||
    form.formType.toLowerCase().includes(taxFormSearch.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const formatCurrency = (amount: number, isNegative = false) => {
    if (!showAmounts) return "••••••";
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    return isNegative ? `-${formatted.replace('$', '$')}` : formatted;
  };

  const totals = payHistory.reduce(
    (acc, record) => ({
      netPay: acc.netPay + record.netPay,
      grossPay: acc.grossPay + record.grossPay,
      deductions: acc.deductions + record.deductions,
    }),
    { netPay: 0, grossPay: 0, deductions: 0 }
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pay & Earning</h1>
        <p className="text-muted-foreground text-sm">
          View your earnings and access tax forms
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
          <TabsTrigger 
            value="earnings" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Current Earnings
          </TabsTrigger>
          <TabsTrigger value="tax-forms">Tax Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="mt-6 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Earnings</h2>
              <p className="text-muted-foreground text-sm">
                Track your earnings, view pay history, and download pay stubs.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAmounts(!showAmounts)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showAmounts ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide amounts
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show amounts
                </>
              )}
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Period */}
            <Card className="border border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Period</p>
                    <p className="text-3xl font-bold text-foreground">
                      {showAmounts ? "$1,450.00" : "••••••"}
                    </p>
                    <p className="text-sm text-muted-foreground">Jan 1-21, 2025</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Year to Date */}
            <Card className="border border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Year to Date</p>
                    <p className="text-3xl font-bold text-foreground">
                      {showAmounts ? "$1,450.00" : "••••••"}
                    </p>
                    <p className="text-sm text-muted-foreground">January 2025</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Payment */}
            <Card className="border border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Payment</p>
                    <p className="text-3xl font-bold text-foreground">
                      {showAmounts ? "$2,900.00" : "••••••"}
                    </p>
                    <p className="text-sm text-muted-foreground">Paid on Dec 31, 2024</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pay History */}
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              {/* Pay History Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Pay History</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any row to see detailed breakdown
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={periodFilter} onValueChange={setPeriodFilter}>
                      <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="All Periods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Periods</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="q4">Q4 2024</SelectItem>
                        <SelectItem value="q3">Q3 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                      <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                      <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Pay History Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="font-medium">Period</TableHead>
                      <TableHead className="font-medium">
                        Net Pay (USD) <span className="text-muted-foreground">ⓘ</span>
                      </TableHead>
                      <TableHead className="font-medium">Gross Pay (USD)</TableHead>
                      <TableHead className="font-medium">
                        Deductions (USD) <span className="text-muted-foreground">ⓘ</span>
                      </TableHead>
                      <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payHistory.map((record) => (
                      <>
                        <TableRow 
                          key={record.id}
                          className="cursor-pointer hover:bg-secondary/20"
                          onClick={() => toggleRow(record.id)}
                        >
                          <TableCell>
                            {expandedRows.includes(record.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{record.period}</p>
                              <p className="text-sm text-muted-foreground">{record.hours} hours</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-emerald-600">
                            {formatCurrency(record.netPay)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatCurrency(record.grossPay)}
                          </TableCell>
                          <TableCell>
                            <span className="text-destructive">
                              {formatCurrency(record.deductions, true)}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {record.deductionPercent}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPayRecord(record);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.includes(record.id) && (
                          <TableRow key={`${record.id}-expanded`}>
                            <TableCell colSpan={6} className="bg-secondary/5 p-0">
                              <div className="px-6 py-5 space-y-5 border-t border-border/50">
                                {/* Payment Details Section */}
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground mb-3">Payment Details</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Gross Pay</p>
                                      <p className="text-base font-medium text-foreground">
                                        {showAmounts ? formatCurrency(record.grossPay) : "••••••"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Net Pay</p>
                                      <p className="text-base font-medium text-emerald-600">
                                        {showAmounts ? formatCurrency(record.netPay) : "••••••"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Deductions Section */}
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground mb-3">Deductions</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Federal Tax</p>
                                      <p className="text-base font-medium text-foreground">
                                        {showAmounts ? formatCurrency(record.deductions * 0.6) : "••••••"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">State Tax</p>
                                      <p className="text-base font-medium text-foreground">
                                        {showAmounts ? formatCurrency(record.deductions * 0.2) : "••••••"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Medicare</p>
                                      <p className="text-base font-medium text-foreground">
                                        {showAmounts ? formatCurrency(record.deductions * 0.072) : "••••••"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Social Security</p>
                                      <p className="text-base font-medium text-foreground">
                                        {showAmounts ? formatCurrency(record.deductions * 0.128) : "••••••"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                    {/* Total Row */}
                    <TableRow className="bg-secondary/40 hover:bg-secondary/40 font-semibold">
                      <TableCell></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          Total (All Periods)
                          <span className="text-muted-foreground text-sm">ⓘ</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-emerald-600">
                        {formatCurrency(totals.netPay)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(totals.grossPay)}
                      </TableCell>
                      <TableCell className="text-destructive">
                        {formatCurrency(totals.deductions, true)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-forms" className="mt-6 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by form type or year..." 
              className="pl-10"
              value={taxFormSearch}
              onChange={(e) => setTaxFormSearch(e.target.value)}
            />
          </div>

          {/* Tax Form Cards */}
          <div className="space-y-4">
            {filteredTaxForms.map((form) => (
              <Card key={form.id} className="border border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Document Icon */}
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    {/* Form Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{form.title}</h3>
                          <p className="text-sm text-muted-foreground">{form.description}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "shrink-0",
                            form.status === "available" 
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                              : "border-border bg-secondary text-muted-foreground"
                          )}
                        >
                          {form.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            Tax Year: {form.taxYear}
                          </div>
                          <span>Issued: {form.issuedDate}</span>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTaxForms.length === 0 && (
              <Card className="border border-border">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No tax forms found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pay Statement Detail Dialog */}
      <PayStatementDialog 
        payRecord={selectedPayRecord} 
        onClose={() => setSelectedPayRecord(null)} 
      />
    </div>
  );
};

export default Earnings;
