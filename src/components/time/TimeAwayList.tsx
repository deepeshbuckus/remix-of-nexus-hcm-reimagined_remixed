import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Plus, MoreVertical, Umbrella, Heart, Home, Calendar as CalendarIconLucide, CheckCircle2, Clock, AlertCircle, X, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isFuture, isPast, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const mockTimeAwayData = [
  { id: 1, type: "Vacation", durationType: "Full Day", startDate: "2025-10-15", endDate: "2025-10-19", amount: "5 days", status: "Approved" },
  { id: 2, type: "Sick Leave", durationType: "Full Day", startDate: "2025-09-28", endDate: "2025-09-28", amount: "1 day", status: "Approved" },
  { id: 3, type: "Personal", durationType: "Hours", startDate: "2025-11-01", endDate: "2025-11-01", amount: "4 hours", status: "Pending" },
  { id: 4, type: "Vacation", durationType: "Full Day", startDate: "2025-12-20", endDate: "2025-12-24", amount: "5 days", status: "Pending" },
  { id: 5, type: "Sick Leave", durationType: "Hours", startDate: "2025-08-10", endDate: "2025-08-10", amount: "3 hours", status: "Rejected" },
];

const entitlements = {
  "Vacation": { total: 20, used: 5, pending: 5 },
  "Sick Leave": { total: 10, used: 1, pending: 0 },
  "Personal": { total: 5, used: 0, pending: 0.5 }, // 4 hours = 0.5 days
};

const leaveTypeIcons: Record<string, typeof Umbrella> = {
  "Vacation": Umbrella,
  "Sick Leave": Heart,
  "Personal": Home,
};

const leaveTypeColors: Record<string, { bg: string; icon: string; border: string }> = {
  "Vacation": { bg: "bg-blue-50 dark:bg-blue-950/30", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  "Sick Leave": { bg: "bg-purple-50 dark:bg-purple-950/30", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  "Personal": { bg: "bg-orange-50 dark:bg-orange-950/30", icon: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
};

const leaveTypeInfo: Record<string, { accrualRate: string; carryOver: string }> = {
  "Vacation": { accrualRate: "Accrues 1.67 days/month", carryOver: "Max 5 days carry-over" },
  "Sick Leave": { accrualRate: "Accrues 0.83 days/month", carryOver: "No carry-over limit" },
  "Personal": { accrualRate: "Accrues 0.42 days/month", carryOver: "No carry-over" },
};

type FilterType = "All" | "Pending" | "Approved" | "Rejected";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Approved":
      return "default";
    case "Pending":
      return "warning";
    case "Rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

export const TimeAwayList = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [durationType, setDurationType] = useState("Full Day");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [comments, setComments] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [selectedLeaveTypeFilter, setSelectedLeaveTypeFilter] = useState<string | null>(null);

  const handleSubmitRequest = () => {
    if (!leaveType || !startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request Submitted",
      description: "Your time off request has been submitted for approval",
    });
    setOpen(false);
    // Reset form
    setLeaveType("");
    setDurationType("Full Day");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("");
    setEndTime("");
    setComments("");
  };

  const filteredRequests = mockTimeAwayData.filter((request) => {
    const matchesStatus = activeFilter === "All" || request.status === activeFilter;
    const matchesLeaveType = !selectedLeaveTypeFilter || request.type === selectedLeaveTypeFilter;
    return matchesStatus && matchesLeaveType;
  });

  const handleLeaveTypeClick = (type: string) => {
    setSelectedLeaveTypeFilter(selectedLeaveTypeFilter === type ? null : type);
    setActiveFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Time Away</h1>
          <p className="text-muted-foreground mt-1">Manage your time off requests and balances</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Time Off</DialogTitle>
              <DialogDescription>
                Submit a new time off request. Select the type and duration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="leave-type">Leave Type *</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacation">Vacation</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {leaveType && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Entitlement Balance</p>
                  <div className="flex gap-4 text-sm">
                    <span>Total: <strong>{entitlements[leaveType as keyof typeof entitlements].total} days</strong></span>
                    <span>Used: <strong>{entitlements[leaveType as keyof typeof entitlements].used} days</strong></span>
                    <span>Pending: <strong>{entitlements[leaveType as keyof typeof entitlements].pending} days</strong></span>
                    <span>Available: <strong>{entitlements[leaveType as keyof typeof entitlements].total - entitlements[leaveType as keyof typeof entitlements].used - entitlements[leaveType as keyof typeof entitlements].pending} days</strong></span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="duration-type">Duration Type *</Label>
                <Select value={durationType} onValueChange={setDurationType}>
                  <SelectTrigger id="duration-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Day">Full Day</SelectItem>
                    <SelectItem value="Partial Day">Partial Day</SelectItem>
                    <SelectItem value="Hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {durationType === "Full Day" && (
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {(durationType === "Partial Day" || durationType === "Hours") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time *</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time *</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Add any additional information..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest}>
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Entitlements - Visual Cards */}
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(entitlements).map(([type, balance]) => {
            const Icon = leaveTypeIcons[type];
            const colors = leaveTypeColors[type];
            const info = leaveTypeInfo[type];
            const available = balance.total - balance.used - balance.pending;
            const percentageRemaining = (available / balance.total) * 100;
            const isLowBalance = available < 2;
            const isSelected = selectedLeaveTypeFilter === type;
            
            return (
              <Card 
                key={type} 
                className={cn(
                  "relative transition-all duration-300 cursor-pointer overflow-hidden border-2",
                  "hover:shadow-lg hover:-translate-y-1",
                  isSelected && "ring-4 ring-primary/30 shadow-xl scale-105 border-primary",
                  !isSelected && "hover:border-primary/50"
                )}
                onClick={() => handleLeaveTypeClick(type)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-3 rounded-xl", colors.bg, "border", colors.border)}>
                        <Icon className={cn("h-6 w-6", colors.icon)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{type}</h3>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <Info className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="space-y-1 text-sm">
                                <p className="font-semibold">{type} Details</p>
                                <p>{info.accrualRate}</p>
                                <p>{info.carryOver}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {isLowBalance && (
                          <Badge variant="warning" className="mt-1 text-xs gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Only {available} days remaining
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-semibold">{balance.total} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Used</span>
                      <span className="font-semibold">{balance.used} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-semibold">{balance.pending} days</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-primary font-medium">Available</span>
                      <button 
                        className="font-bold text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveTypeClick(type);
                        }}
                      >
                        {available} days
                      </button>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Progress value={percentageRemaining} className="h-2.5" />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          {available} available • {balance.pending} pending • {balance.used} used
                        </span>
                        <span className="font-medium text-primary">
                          {percentageRemaining.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Requests Table with Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Time Off Requests</CardTitle>
            {selectedLeaveTypeFilter && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedLeaveTypeFilter(null)}
              >
                Clear filter
              </Button>
            )}
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(["All", "Pending", "Approved", "Rejected"] as FilterType[]).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveFilter(filter);
                  setSelectedLeaveTypeFilter(null);
                }}
                className="transition-all"
              >
                {filter}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
                <Plane className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No requests found</p>
                <p className="text-sm mt-1">Try adjusting your filters or create a new request</p>
              </div>
            ) : (
              filteredRequests.map((request) => {
                const startDateObj = new Date(request.startDate);
                const endDateObj = new Date(request.endDate);
                const today = new Date();
                const isUpcoming = isFuture(startDateObj);
                const isPastRequest = isPast(endDateObj) && !isUpcoming;
                const daysUntil = isUpcoming ? differenceInDays(startDateObj, today) : 0;
                const colors = leaveTypeColors[request.type];
                const Icon = leaveTypeIcons[request.type];
                
                return (
                  <Card 
                    key={request.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-md border-l-4",
                      colors.border,
                      isPastRequest && "opacity-60",
                      isUpcoming && "bg-primary/5"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={cn("p-2 rounded-lg mt-1", colors.bg)}>
                            <Icon className={cn("h-5 w-5", colors.icon)} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{request.type}</h4>
                              {isUpcoming && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="default" className="gap-1 text-xs">
                                        <CalendarIconLucide className="h-3 w-3" />
                                        Upcoming
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Starts in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <CalendarIconLucide className="h-4 w-4" />
                              <button 
                                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                                aria-label={`View details for ${request.type} from ${format(startDateObj, "MMM d")} to ${format(endDateObj, "MMM d")}`}
                              >
                                {format(startDateObj, "MMM d, yyyy")}
                                {request.startDate !== request.endDate && (
                                  <> – {format(endDateObj, "MMM d, yyyy")}</>
                                )}
                              </button>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-medium">{request.durationType}</span>
                              <span className="text-muted-foreground">({request.amount})</span>
                            </div>
                            
                            <Badge variant={getStatusVariant(request.status)} className="gap-1">
                              {request.status === "Approved" && (
                                <>
                                  <CheckCircle2 className="h-3 w-3" />
                                  Approved
                                </>
                              )}
                              {request.status === "Pending" && (
                                <>
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </>
                              )}
                              {request.status === "Rejected" && (
                                <>
                                  <X className="h-3 w-3" />
                                  Rejected
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              aria-label="Actions menu"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {request.status === "Pending" && (
                              <>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Cancel Request
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
