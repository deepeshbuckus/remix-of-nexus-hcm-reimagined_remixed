import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { NewRequestDialog } from "./NewRequestDialog";
import {
  Plane,
  Heart,
  Home,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarDays,
  List,
  Plus,
  TrendingUp,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Briefcase,
  Baby,
  GraduationCap,
  Timer,
} from "lucide-react";
import { format, isBefore, startOfDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, isToday, isWeekend } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Leave Balance Data
interface LeaveType {
  id: string;
  name: string;
  icon: typeof Plane;
  total: number;
  used: number;
  pending: number;
  color: string;
  progressColor: string;
  pendingColor: string;
  category: "primary" | "secondary";
}

const leaveTypes: LeaveType[] = [
  // Primary entitlements (always visible)
  {
    id: "vacation",
    name: "Vacation",
    icon: Plane,
    total: 20,
    used: 5,
    pending: 0,
    color: "text-primary",
    progressColor: "bg-primary",
    pendingColor: "bg-amber-500",
    category: "primary",
  },
  {
    id: "sick",
    name: "Sick Leave",
    icon: Heart,
    total: 10,
    used: 1,
    pending: 0,
    color: "text-rose-500",
    progressColor: "bg-rose-500",
    pendingColor: "bg-amber-500",
    category: "primary",
  },
  {
    id: "personal",
    name: "Personal",
    icon: Home,
    total: 5,
    used: 0,
    pending: 4,
    color: "text-orange-500",
    progressColor: "bg-orange-500",
    pendingColor: "bg-orange-400",
    category: "primary",
  },
  // Secondary entitlements (collapsible)
  {
    id: "bereavement",
    name: "Bereavement",
    icon: Heart,
    total: 5,
    used: 0,
    pending: 0,
    color: "text-purple-500",
    progressColor: "bg-purple-500",
    pendingColor: "bg-amber-500",
    category: "secondary",
  },
  {
    id: "parental",
    name: "Parental Leave",
    icon: Baby,
    total: 12,
    used: 0,
    pending: 0,
    color: "text-pink-500",
    progressColor: "bg-pink-500",
    pendingColor: "bg-amber-500",
    category: "secondary",
  },
  {
    id: "jury",
    name: "Jury Duty",
    icon: Briefcase,
    total: 10,
    used: 0,
    pending: 0,
    color: "text-slate-500",
    progressColor: "bg-slate-500",
    pendingColor: "bg-amber-500",
    category: "secondary",
  },
  {
    id: "study",
    name: "Study Leave",
    icon: GraduationCap,
    total: 5,
    used: 2,
    pending: 0,
    color: "text-indigo-500",
    progressColor: "bg-indigo-500",
    pendingColor: "bg-amber-500",
    category: "secondary",
  },
  {
    id: "comp",
    name: "Comp Time",
    icon: Timer,
    total: 16,
    used: 4,
    pending: 2,
    color: "text-teal-500",
    progressColor: "bg-teal-500",
    pendingColor: "bg-teal-400",
    category: "secondary",
  },
];

const primaryLeaves = leaveTypes.filter(l => l.category === "primary");
const secondaryLeaves = leaveTypes.filter(l => l.category === "secondary");

// Time off requests data
const mockTimeAwayData = [
  { id: 1, type: "Vacation", startDate: "2025-10-15", endDate: "2025-10-19", durationType: "Full Day", amount: "5 days", status: "Approved" },
  { id: 2, type: "Sick Leave", startDate: "2025-09-28", endDate: "2025-09-28", durationType: "Full Day", amount: "1 day", status: "Approved" },
  { id: 3, type: "Personal", startDate: "2025-11-01", endDate: "2025-11-01", durationType: "Hours", amount: "4 hours", status: "Pending" },
  { id: 4, type: "Vacation", startDate: "2025-12-20", endDate: "2025-12-27", durationType: "Full Day", amount: "8 days", status: "Pending" },
  { id: 5, type: "Personal", startDate: "2025-08-15", endDate: "2025-08-15", durationType: "Full Day", amount: "1 day", status: "Rejected" },
];

// Entitlements for NewRequestDialog
const entitlements: Record<string, { total: number; used: number; pending: number }> = {};
leaveTypes.forEach(l => {
  entitlements[l.name] = { total: l.total, used: l.used, pending: l.pending };
});

type FilterType = "All" | "Pending" | "Approved" | "Rejected";

const getLeaveIcon = (type: string) => {
  const leave = leaveTypes.find(l => l.name === type);
  return leave?.icon || Plane;
};

const getLeaveColor = (type: string) => {
  const leave = leaveTypes.find(l => l.name === type);
  return leave?.color || "text-primary";
};

// View All Balances Dialog
function ViewAllBalancesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          View All Balances
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>All Leave Balances</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entitlement</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead className="text-right">Pending</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="w-[120px]">Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveTypes.map((leave) => {
              const available = leave.total - leave.used - leave.pending;
              const usagePercentage = ((leave.used + leave.pending) / leave.total) * 100;
              const Icon = leave.icon;

              return (
                <TableRow key={leave.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded", "bg-muted/50")}>
                        <Icon className={cn("h-4 w-4", leave.color)} />
                      </div>
                      <span className="font-medium">{leave.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{leave.total}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{leave.used}</TableCell>
                  <TableCell className="text-right text-amber-600 dark:text-amber-400">{leave.pending}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{available}</TableCell>
                  <TableCell>
                    <Progress value={usagePercentage} className="h-2" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

// Summary Card Component
function SummaryCard({
  label, 
  value, 
  sublabel, 
  icon: Icon 
}: { 
  label: string; 
  value: number; 
  sublabel: string; 
  icon: typeof Clock;
}) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
          </div>
          <div className="p-2 rounded-full bg-background">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Leave Balance Card Component
function LeaveBalanceCard({ leave }: { leave: LeaveType }) {
  const available = leave.total - leave.used - leave.pending;
  const usedPercentage = (leave.used / leave.total) * 100;
  const pendingPercentage = (leave.pending / leave.total) * 100;
  const availablePercentage = (available / leave.total) * 100;
  const remainingPercentage = Math.round(availablePercentage);
  const isLowBalance = available <= 1 && leave.total > 2;
  const Icon = leave.icon;

  return (
    <Card>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl bg-muted/50")}>
              <Icon className={cn("h-5 w-5", leave.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{leave.name}</h3>
                {isLowBalance && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-xs">
                    Low Balance
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {leave.used} used · {leave.total} total
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={cn("text-2xl font-bold", isLowBalance ? "text-orange-500" : "text-primary")}>
              {available}
            </p>
            <p className="text-xs text-muted-foreground">days available</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
          {/* Used portion */}
          <div
            className={cn("absolute h-full rounded-full", leave.progressColor)}
            style={{ width: `${usedPercentage}%` }}
          />
          {/* Pending portion */}
          {leave.pending > 0 && (
            <div
              className={cn("absolute h-full", leave.pendingColor)}
              style={{ left: `${usedPercentage}%`, width: `${pendingPercentage}%` }}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", leave.progressColor)} />
            <span>{leave.used}</span>
          </div>
          {leave.pending > 0 && (
            <div className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", leave.pendingColor)} />
              <span>{leave.pending}</span>
            </div>
          )}
          <div className="ml-auto text-right">
            <span className={cn(isLowBalance ? "text-orange-500" : "")}>{remainingPercentage}% remaining</span>
          </div>
        </div>

        {/* Low balance warning */}
        {isLowBalance && (
          <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Running low — consider planning your remaining days</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Request Card Component
function RequestCard({ 
  request, 
  onCancel 
}: { 
  request: typeof mockTimeAwayData[0];
  onCancel: (id: number) => void;
}) {
  const Icon = getLeaveIcon(request.type);
  const color = getLeaveColor(request.type);
  const isPast = isBefore(new Date(request.endDate), startOfDay(new Date()));
  const isUpcoming = !isPast && request.status === "Pending";

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b last:border-b-0",
      isUpcoming && "bg-orange-50/50 dark:bg-orange-950/10 border-l-4 border-l-orange-400"
    )}>
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-muted/50">
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{request.type}</h4>
            {isPast && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Past</span>
            )}
            {isUpcoming && (
              <CalendarIcon className="h-3.5 w-3.5 text-orange-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(request.startDate), "MMM d, yyyy")}
            {request.startDate !== request.endDate && ` - ${format(new Date(request.endDate), "MMM d, yyyy")}`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {request.durationType} · {request.amount}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {request.status === "Approved" && (
          <Badge className="bg-primary hover:bg-primary text-primary-foreground gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        )}
        {request.status === "Pending" && (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )}
        {request.status === "Rejected" && (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {request.status === "Pending" && (
              <DropdownMenuItem onClick={() => onCancel(request.id)} className="text-destructive">
                Cancel Request
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Calendar Request Dialog Component
function CalendarRequestDialog({ 
  selectedDates, 
  onClose, 
  onSubmit 
}: { 
  selectedDates: Date[];
  onClose: () => void;
  onSubmit: (leaveType: string) => void;
}) {
  const [leaveType, setLeaveType] = useState("");
  
  const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];
  
  // Calculate working days only
  const workingDays = sortedDates.filter(d => !isWeekend(d)).length;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Request Time Off
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Selected Dates Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm font-medium text-muted-foreground mb-1">Selected Dates</p>
            <p className="font-semibold text-foreground">
              {format(startDate, "MMM d, yyyy")}
              {startDate.getTime() !== endDate.getTime() && ` - ${format(endDate, "MMM d, yyyy")}`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {workingDays} working day{workingDays !== 1 ? 's' : ''} selected
              {selectedDates.length !== workingDays && ` (${selectedDates.length - workingDays} weekend day${selectedDates.length - workingDays !== 1 ? 's' : ''} excluded)`}
            </p>
          </div>

          {/* Leave Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Leave Type</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.filter(l => l.category === "primary").map(leave => (
                  <SelectItem key={leave.id} value={leave.name}>
                    <div className="flex items-center gap-2">
                      <leave.icon className={cn("h-4 w-4", leave.color)} />
                      {leave.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Balance Info */}
          {leaveType && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              {(() => {
                const leave = leaveTypes.find(l => l.name === leaveType);
                if (!leave) return null;
                const available = leave.total - leave.used - leave.pending;
                const remaining = available - workingDays;
                return (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Balance after request:</span>
                    <span className={cn("font-semibold", remaining < 0 ? "text-destructive" : "text-primary")}>
                      {remaining} days
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={() => onSubmit(leaveType)} 
            disabled={!leaveType || workingDays === 0}
          >
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Calendar View Component
interface PendingRequest {
  id: number;
  dates: Date[];
  leaveType: string;
  status: "Pending";
}

function CalendarView({ 
  requests, 
  pendingRequests,
  onRequestSubmit 
}: { 
  requests: typeof mockTimeAwayData;
  pendingRequests: PendingRequest[];
  onRequestSubmit: (dates: Date[], leaveType: string) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // Track Ctrl key press/release
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.metaKey) {
        setIsCtrlPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setIsCtrlPressed(false);
        // Open dialog when Ctrl is released if dates are selected
        if (selectedDates.length > 0 && !showRequestDialog) {
          setShowRequestDialog(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedDates, showRequestDialog]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day offset for first day of month
  const startDayOfWeek = getDay(monthStart);
  
  // Calculate days to show from previous month
  const prevMonthDays = startDayOfWeek;
  const prevMonthStart = subMonths(monthStart, 1);
  const prevMonthEnd = endOfMonth(prevMonthStart);
  const prevDays = Array.from({ length: prevMonthDays }).map((_, i) => {
    const day = new Date(prevMonthEnd);
    day.setDate(prevMonthEnd.getDate() - (prevMonthDays - 1 - i));
    return day;
  });

  // Calculate days to show from next month
  const totalCells = 42; // 6 weeks
  const nextMonthDays = totalCells - days.length - prevMonthDays;
  const nextDays = Array.from({ length: nextMonthDays }).map((_, i) => {
    const day = addMonths(monthStart, 1);
    day.setDate(i + 1);
    return day;
  });

  const allDays = [...prevDays, ...days, ...nextDays];

  // Get requests for each day (including pending ones)
  const getRequestsForDay = (day: Date) => {
    const existingRequests = requests.filter(r => {
      const start = startOfDay(new Date(r.startDate));
      const end = startOfDay(new Date(r.endDate));
      const dayStart = startOfDay(day);
      return dayStart >= start && dayStart <= end;
    });
    
    // Check pending requests
    const pendingForDay = pendingRequests.filter(pr => 
      pr.dates.some(d => isSameDay(d, day))
    ).map(pr => ({
      id: pr.id,
      type: pr.leaveType,
      startDate: format(pr.dates[0], "yyyy-MM-dd"),
      endDate: format(pr.dates[pr.dates.length - 1], "yyyy-MM-dd"),
      status: "Pending" as const,
      days: pr.dates.length,
      notes: ""
    }));
    
    return [...existingRequests, ...pendingForDay];
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isDateSelected = (day: Date) => {
    return selectedDates.some(d => isSameDay(d, day));
  };

  const toggleDateSelection = (day: Date, e: React.MouseEvent) => {
    const today = startOfDay(new Date());
    // Can't select past dates
    if (isBefore(day, today)) return;
    // Can't select days that already have requests
    if (getRequestsForDay(day).length > 0) return;
    // Only allow selection in current month view
    if (!isSameMonth(day, currentMonth)) return;

    const isMultiSelect = e.ctrlKey || e.metaKey;

    if (isDateSelected(day)) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, day)));
    } else {
      const newDates = [...selectedDates, day];
      setSelectedDates(newDates);
      // Only auto-open dialog if NOT holding Ctrl (single select mode)
      if (!isMultiSelect) {
        setShowRequestDialog(true);
      }
    }
  };

  const handleSubmitRequest = (leaveType: string) => {
    onRequestSubmit(selectedDates, leaveType);
    setSelectedDates([]);
    setShowRequestDialog(false);
  };

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <h3 className="text-lg font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Selection Action Bar */}
      {selectedDates.length > 0 && (
        <div className="flex items-center justify-between p-3 mb-4 rounded-lg bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedDates([])}>
              Clear
            </Button>
            <Button size="sm" onClick={() => setShowRequestDialog(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              Request Leave
            </Button>
          </div>
        </div>
      )}

      {/* Instruction */}
      {selectedDates.length === 0 && (
        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Click on dates to select and request time off
        </p>
      )}

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-muted/30">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-3 border-b">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days - 6 rows */}
        <div className="grid grid-cols-7">
          {allDays.map((day, idx) => {
            const dayRequests = getRequestsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const todayHighlight = isToday(day);
            const isPast = isBefore(day, startOfDay(new Date()));
            const isSelected = isDateSelected(day);
            const hasRequests = dayRequests.length > 0;
            const canSelect = isCurrentMonth && !isPast && !hasRequests;

            return (
              <div 
                key={idx} 
                onClick={(e) => canSelect && toggleDateSelection(day, e)}
                className={cn(
                  "min-h-[80px] sm:min-h-[100px] border-b border-r p-1 sm:p-2 transition-colors",
                  !isCurrentMonth && "bg-muted/20",
                  idx % 7 === 6 && "border-r-0",
                  idx >= 35 && "border-b-0",
                  canSelect && "cursor-pointer hover:bg-primary/5",
                  isSelected && "bg-primary/10 ring-2 ring-inset ring-primary",
                  isPast && isCurrentMonth && "bg-muted/30"
                )}
              >
                <div className={cn(
                  "text-sm mb-1",
                  !isCurrentMonth && "text-muted-foreground/50",
                  isPast && isCurrentMonth && "text-muted-foreground/60",
                  todayHighlight && "inline-flex items-center justify-center w-7 h-7 rounded bg-primary/10 ring-2 ring-primary font-semibold text-primary",
                  isSelected && !todayHighlight && "font-semibold text-primary"
                )}>
                  {format(day, "d")}
                </div>
                {dayRequests.length > 0 && isCurrentMonth && (
                  <div className="space-y-1">
                    {dayRequests.map(req => (
                      <div
                        key={req.id}
                        className={cn(
                          "text-[10px] sm:text-xs px-1.5 py-1 rounded text-white truncate",
                          req.status === "Approved" && "bg-primary",
                          req.status === "Pending" && "bg-orange-500",
                          req.status === "Rejected" && "bg-red-400"
                        )}
                      >
                        {req.type}
                      </div>
                    ))}
                  </div>
                )}
                {isSelected && !hasRequests && (
                  <div className="mt-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-400" />
          <span>Rejected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-primary bg-primary/10" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-primary bg-transparent" />
          <span>Today</span>
        </div>
      </div>

      {/* Request Dialog */}
      {showRequestDialog && selectedDates.length > 0 && (
        <CalendarRequestDialog
          selectedDates={selectedDates}
          onClose={() => {
            setShowRequestDialog(false);
            setSelectedDates([]);
          }}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  );
}

export function MyTimeAwaySection() {
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Calculate summary values
  const totalAvailable = leaveTypes.reduce((sum, l) => sum + (l.total - l.used - l.pending), 0);
  const totalPending = leaveTypes.reduce((sum, l) => sum + l.pending, 0);
  const totalUsed = leaveTypes.reduce((sum, l) => sum + l.used, 0);

  const filteredRequests = mockTimeAwayData.filter((request) => {
    return activeFilter === "All" || request.status === activeFilter;
  });

  const pendingCount = mockTimeAwayData.filter(r => r.status === "Pending").length;
  const approvedCount = mockTimeAwayData.filter(r => r.status === "Approved").length;
  const rejectedCount = mockTimeAwayData.filter(r => r.status === "Rejected").length;

  const handleCancelRequest = (id: number) => {
    toast({
      title: "Request Cancelled",
      description: "Your time off request has been cancelled.",
    });
  };

  const handleCalendarRequestSubmit = (dates: Date[], leaveType: string) => {
    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    const workingDays = dates.filter(d => !isWeekend(d)).length;
    
    // Add to pending requests
    const newPendingRequest: PendingRequest = {
      id: Date.now(),
      dates: sortedDates,
      leaveType,
      status: "Pending"
    };
    setPendingRequests(prev => [...prev, newPendingRequest]);
    
    toast({
      title: "Request Submitted",
      description: `Your ${leaveType.toLowerCase()} request for ${workingDays} day${workingDays !== 1 ? 's' : ''} (${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}) has been submitted for approval.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Available Days"
          value={totalAvailable}
          sublabel="Ready to use"
          icon={CheckCircle2}
        />
        <SummaryCard
          label="Pending Approval"
          value={totalPending}
          sublabel="Awaiting response"
          icon={Clock}
        />
        <SummaryCard
          label="Days Used"
          value={totalUsed}
          sublabel="This year"
          icon={TrendingUp}
        />
      </div>

      {/* My Time Off Requests Section */}
      <Card>
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">My Time Off Requests</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className={cn("rounded-none gap-1.5", viewMode !== "list" && "hover:bg-muted")}
                  onClick={() => setViewMode("list")}
                >
                  <Plane className="h-4 w-4" />
                  List
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  className={cn("rounded-none gap-1.5", viewMode !== "calendar" && "hover:bg-muted")}
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarDays className="h-4 w-4" />
                  Calendar
                </Button>
              </div>
              <NewRequestDialog entitlements={entitlements} />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b">
            {(["All", "Pending", "Approved", "Rejected"] as FilterType[]).map((filter) => {
              const count = filter === "All" 
                ? mockTimeAwayData.length 
                : filter === "Pending" ? pendingCount 
                : filter === "Approved" ? approvedCount 
                : rejectedCount;
              
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                    activeFilter === filter 
                      ? "text-foreground bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    {filter}
                    {filter !== "All" && count > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "h-5 min-w-5 px-1.5 text-xs",
                          filter === "Pending" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                          filter === "Approved" && "bg-primary/10 text-primary",
                          filter === "Rejected" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {count}
                      </Badge>
                    )}
                  </span>
                  {activeFilter === filter && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          {viewMode === "list" ? (
            <div>
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Plane className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No requests found</p>
                </div>
              ) : (
                filteredRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onCancel={handleCancelRequest}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="p-5">
              <CalendarView 
                requests={mockTimeAwayData} 
                pendingRequests={pendingRequests}
                onRequestSubmit={handleCalendarRequestSubmit}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Your Leave Balance Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Leave Balance</h2>
          <div className="flex items-center gap-2">
            <ViewAllBalancesDialog />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your leave balances reset annually on Jan 1</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Primary Leave Types - Always visible */}
        <div className="space-y-3">
          {primaryLeaves.map(leave => (
            <LeaveBalanceCard key={leave.id} leave={leave} />
          ))}
        </div>

        {/* Secondary Leave Types - Collapsible */}
        {secondaryLeaves.length > 0 && (
          <Collapsible className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between py-3 h-auto text-muted-foreground hover:text-foreground group">
                <span className="text-sm font-medium">
                  {secondaryLeaves.length} more entitlements
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {secondaryLeaves.map(leave => (
                <LeaveBalanceCard key={leave.id} leave={leave} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
