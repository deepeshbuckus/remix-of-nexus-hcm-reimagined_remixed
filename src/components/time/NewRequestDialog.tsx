import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  CalendarIcon, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Upload,
  Palmtree,
  Stethoscope,
  User,
  CalendarDays,
  Info,
  Sparkles
} from "lucide-react";
import { format, differenceInBusinessDays, isWeekend, addDays, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { LeaveBalance } from "./LeaveBalanceCard";

interface NewRequestDialogProps {
  entitlements: Record<string, LeaveBalance>;
  trigger?: React.ReactNode;
}

type DurationType = "full-day" | "half-day-am" | "half-day-pm" | "hours";

const leaveTypeConfig: Record<string, { 
  icon: React.ReactNode; 
  color: string;
  requiresDocument?: boolean;
  requiresReason?: boolean;
  blackoutDates?: Date[];
}> = {
  "Vacation": { 
    icon: <Palmtree className="h-4 w-4" />, 
    color: "text-emerald-600",
    blackoutDates: [new Date(2025, 11, 24), new Date(2025, 11, 25), new Date(2025, 11, 31)]
  },
  "Sick Leave": { 
    icon: <Stethoscope className="h-4 w-4" />, 
    color: "text-rose-600",
    requiresDocument: true
  },
  "Personal": { 
    icon: <User className="h-4 w-4" />, 
    color: "text-violet-600",
    requiresReason: true
  },
};

// Mock holidays
const holidays = [
  new Date(2025, 0, 1),   // New Year's Day
  new Date(2025, 11, 25), // Christmas
  new Date(2025, 11, 26), // Boxing Day
];

const isHoliday = (date: Date) => holidays.some(h => 
  h.getDate() === date.getDate() && 
  h.getMonth() === date.getMonth() && 
  h.getFullYear() === date.getFullYear()
);

export function NewRequestDialog({ entitlements, trigger }: NewRequestDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [durationType, setDurationType] = useState<DurationType>("full-day");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [comments, setComments] = useState("");
  const [reason, setReason] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  const selectedBalance = leaveType ? entitlements[leaveType] : null;
  const config = leaveType ? leaveTypeConfig[leaveType] : null;

  // Calculate days requested
  const daysRequested = useMemo(() => {
    if (!startDate) return 0;
    
    if (durationType === "half-day-am" || durationType === "half-day-pm") {
      return 0.5;
    }
    
    if (durationType === "hours" && startTime && endTime) {
      const [startH, startM] = startTime.split(":").map(Number);
      const [endH, endM] = endTime.split(":").map(Number);
      const hours = (endH + endM/60) - (startH + startM/60);
      return Math.round((hours / 8) * 100) / 100; // Assuming 8-hour workday
    }
    
    // Full day(s) - calculate range if end date is provided
    if (durationType === "full-day") {
      const effectiveEndDate = endDate || startDate;
      let count = 0;
      let current = new Date(startDate);
      while (current <= effectiveEndDate) {
        if (!isWeekend(current) && !isHoliday(current)) {
          count++;
        }
        current = addDays(current, 1);
      }
      return count;
    }
    
    return 1;
  }, [startDate, endDate, durationType, startTime, endTime]);

  // Check for warnings
  const warnings = useMemo(() => {
    const result: string[] = [];
    
    if (startDate && isWeekend(startDate)) {
      result.push("Start date falls on a weekend");
    }
    if (endDate && isWeekend(endDate)) {
      result.push("End date falls on a weekend");
    }
    if (startDate && isHoliday(startDate)) {
      result.push("Start date falls on a holiday");
    }
    if (selectedBalance && daysRequested > (selectedBalance.total - selectedBalance.used - selectedBalance.pending)) {
      result.push("Request exceeds available balance");
    }
    
    return result;
  }, [startDate, endDate, selectedBalance, daysRequested]);

  const balanceAfterRequest = selectedBalance 
    ? selectedBalance.total - selectedBalance.used - selectedBalance.pending - daysRequested 
    : 0;

  const handleSubmitRequest = () => {
    if (!leaveType || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please select a leave type and start date",
        variant: "destructive",
      });
      return;
    }

    if (config?.requiresReason && !reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for your personal leave",
        variant: "destructive",
      });
      return;
    }

    if (warnings.some(w => w.includes("exceeds"))) {
      toast({
        title: "Insufficient Balance",
        description: "Your request exceeds your available leave balance",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request Submitted",
      description: `Your ${leaveType.toLowerCase()} request for ${daysRequested} day${daysRequested !== 1 ? 's' : ''} has been submitted for approval`,
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setLeaveType("");
    setDurationType("full-day");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("09:00");
    setEndTime("17:00");
    setComments("");
    setReason("");
    setDocument(null);
  };

  const getBalanceColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.5) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (ratio > 0.2) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-rose-100 text-rose-700 border-rose-200";
  };

  const disabledDates = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;
    
    // Check blackout dates for vacation
    if (leaveType === "Vacation" && config?.blackoutDates) {
      return config.blackoutDates.some(bd => 
        bd.getDate() === date.getDate() && 
        bd.getMonth() === date.getMonth() && 
        bd.getFullYear() === date.getFullYear()
      );
    }
    
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Request Time Off</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Submit a new leave request
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Two-column layout on desktop */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Leave Type Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Leave Type <span className="text-destructive">*</span>
                </Label>
                <Select value={leaveType} onValueChange={(val) => {
                  setLeaveType(val);
                  // Reset duration type when changing leave type
                  setDurationType("full-day");
                }}>
                  <SelectTrigger className="h-11 rounded-lg bg-background">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(leaveTypeConfig).map(([type, cfg]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <span className={cfg.color}>{cfg.icon}</span>
                          {type}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Balance Summary Section - Shows after selecting leave type */}
              {selectedBalance && (
                <div className="p-4 rounded-xl bg-muted/50 border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Balance Summary
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={cn(
                      "p-2.5 rounded-lg border text-center",
                      getBalanceColor(selectedBalance.total - selectedBalance.used - selectedBalance.pending, selectedBalance.total)
                    )}>
                      <div className="text-lg font-bold">
                        {selectedBalance.total - selectedBalance.used - selectedBalance.pending}
                      </div>
                      <div className="text-xs opacity-80">Available</div>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-amber-50 text-amber-700 border-amber-200 text-center">
                      <div className="text-lg font-bold">{selectedBalance.pending}</div>
                      <div className="text-xs opacity-80">Pending</div>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-muted text-muted-foreground text-center">
                      <div className="text-lg font-bold">{selectedBalance.used}</div>
                      <div className="text-xs opacity-80">Used</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Duration Type - Intelligent Selector */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Duration <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "full-day", label: "Full Day(s)", desc: "1+ days" },
                    { value: "half-day-am", label: "Half Day (AM)", desc: "0.5 day" },
                    { value: "half-day-pm", label: "Half Day (PM)", desc: "0.5 day" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDurationType(opt.value as DurationType)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all",
                        durationType === opt.value 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                {/* Hours option - show only if hourly tracking enabled */}
                <button
                  type="button"
                  onClick={() => setDurationType("hours")}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    durationType === "hours" 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="font-medium text-sm">Hours-Based</div>
                  <div className="text-xs text-muted-foreground">Specify exact hours</div>
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {durationType === "full-day" ? "Date Range" : "Date"} <span className="text-destructive">*</span>
                </Label>
                
                <div className={cn(
                  "grid gap-3",
                  durationType === "full-day" ? "grid-cols-2" : "grid-cols-1"
                )}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-11 justify-start text-left font-normal rounded-lg",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={disabledDates}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  {durationType === "full-day" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-11 justify-start text-left font-normal rounded-lg",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "MMM d, yyyy") : "End date (optional)"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => disabledDates(date) || (startDate ? isBefore(date, startDate) : false)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Auto-calculated days */}
                {startDate && daysRequested > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>
                      {daysRequested} {daysRequested === 1 ? "day" : "days"} will be deducted
                    </span>
                  </div>
                )}
              </div>

              {/* Time Selection for Hours-based */}
              {durationType === "hours" && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Start Time</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">End Time</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Fields by Leave Type */}
              {config?.requiresDocument && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    Supporting Document
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => setDocument(e.target.files?.[0] || null)}
                      className="hidden"
                      id="document-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {document ? document.name : "Click to upload medical certificate"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 5MB</p>
                    </label>
                  </div>
                </div>
              )}

              {config?.requiresReason && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Reason <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    placeholder="Please provide a reason for your personal leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="rounded-lg resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Vacation blackout dates notice */}
              {leaveType === "Vacation" && config?.blackoutDates && config.blackoutDates.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Blackout Dates</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        The following dates are restricted: {config.blackoutDates.map(d => format(d, "MMM d")).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Additional Comments
                </Label>
                <Textarea
                  placeholder="Any additional information for your manager..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="rounded-lg resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2 animate-in fade-in">
              {warnings.map((warning, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  {warning}
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* Request Summary Card */}
          {leaveType && startDate && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Request Summary</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Leave Type</div>
                  <div className="font-medium flex items-center gap-1.5 mt-0.5">
                    {config && <span className={config.color}>{config.icon}</span>}
                    {leaveType}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Duration</div>
                  <div className="font-medium mt-0.5">
                    {daysRequested} {daysRequested === 1 ? "day" : "days"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Dates</div>
                  <div className="font-medium mt-0.5">
                    {format(startDate, "MMM d")}
                    {endDate && durationType === "full-day" && ` - ${format(endDate, "MMM d")}`}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Balance After</div>
                  <div className={cn(
                    "font-medium mt-0.5",
                    balanceAfterRequest < 0 ? "text-destructive" : balanceAfterRequest < 3 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {balanceAfterRequest.toFixed(1)} days
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRequest}
              className="rounded-lg gap-2"
              disabled={!leaveType || !startDate || warnings.some(w => w.includes("exceeds"))}
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
