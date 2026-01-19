import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
  X,
  Clock,
  Users,
  Umbrella,
  Heart,
  Home,
  AlertTriangle,
  CalendarDays,
  List,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Zap,
  Filter,
  Eye,
  UserCheck,
  CalendarRange,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ManagerCalendarView } from "./ManagerCalendarView";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const mockTeamMembers = [
  {
    id: 1, name: "Sarah Johnson", avatar: "", role: "Senior Developer", department: "Engineering",
    vacation: { total: 20, used: 8, pending: 5, available: 7 },
    sick: { total: 10, used: 2, pending: 0, available: 8 },
    personal: { total: 5, used: 1, pending: 0, available: 4 },
    upcomingLeave: { type: "Vacation", startDate: "2025-12-15", days: 5 },
    pendingRequests: 1, hasConflict: true,
  },
  {
    id: 2, name: "Michael Chen", avatar: "", role: "Product Designer", department: "Design",
    vacation: { total: 20, used: 12, pending: 0, available: 8 },
    sick: { total: 10, used: 5, pending: 0, available: 5 },
    personal: { total: 5, used: 3, pending: 1, available: 1 },
    upcomingLeave: null, pendingRequests: 1,
  },
  {
    id: 3, name: "Emily Rodriguez", avatar: "", role: "Marketing Manager", department: "Marketing",
    vacation: { total: 20, used: 15, pending: 3, available: 2 },
    sick: { total: 10, used: 1, pending: 0, available: 9 },
    personal: { total: 5, used: 2, pending: 0, available: 3 },
    upcomingLeave: { type: "Vacation", startDate: "2025-12-20", days: 3 },
    pendingRequests: 1, lowBalance: true,
  },
  {
    id: 4, name: "David Kim", avatar: "", role: "Backend Engineer", department: "Engineering",
    vacation: { total: 20, used: 10, pending: 0, available: 10 },
    sick: { total: 10, used: 0, pending: 0, available: 10 },
    personal: { total: 5, used: 0, pending: 0, available: 5 },
    upcomingLeave: null, pendingRequests: 0,
  },
];

const mockPendingRequests = [
  {
    id: 1, employeeId: 1, employeeName: "Sarah Johnson", employeeRole: "Senior Developer",
    department: "Engineering", leaveType: "Vacation", durationType: "Full Day", 
    startDate: "2025-12-15", endDate: "2025-12-19", days: 5, 
    reason: "Family vacation to Hawaii - annual trip with extended family",
    status: "Pending", submittedDate: "2025-11-28", balanceAfter: 2,
    conflicts: [
      { name: "David Kim", dates: "Dec 15-17", type: "Vacation" },
    ],
    teamImpact: { availabilityDrop: 42, othersOff: 2 },
    urgent: true, lowBalance: false, exceedsAvailability: false,
  },
  {
    id: 2, employeeId: 3, employeeName: "Emily Rodriguez", employeeRole: "Marketing Manager",
    department: "Marketing", leaveType: "Vacation", durationType: "Full Day",
    startDate: "2025-12-20", endDate: "2025-12-22", days: 3,
    reason: "Holiday break with family",
    status: "Pending", submittedDate: "2025-11-30", balanceAfter: -1,
    conflicts: [
      { name: "Sarah Johnson", dates: "Dec 20", type: "Vacation" },
      { name: "Michael Chen", dates: "Dec 21-22", type: "Personal" },
    ],
    teamImpact: { availabilityDrop: 35, othersOff: 2 },
    urgent: false, lowBalance: true, exceedsAvailability: true,
    warning: "Request exceeds available balance by 1 day",
  },
  {
    id: 3, employeeId: 2, employeeName: "Michael Chen", employeeRole: "Product Designer",
    department: "Design", leaveType: "Personal", durationType: "Hours",
    startDate: "2025-12-10", endDate: "2025-12-10", hours: 4,
    reason: "Doctor's appointment - routine checkup",
    status: "Pending", submittedDate: "2025-12-01", balanceAfter: 0.5,
    conflicts: [], teamImpact: { availabilityDrop: 92, othersOff: 0 },
    urgent: false, lowBalance: false, exceedsAvailability: false,
  },
];

const leaveTypeIcons: Record<string, typeof Umbrella> = {
  Vacation: Umbrella, "Sick Leave": Heart, Personal: Home,
};

const leaveTypeColors: Record<string, { bg: string; text: string; badge: string }> = {
  Vacation: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  "Sick Leave": { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" },
  Personal: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
};

// Smart Filter type
type SmartFilter = "lowBalance" | "conflicts" | "urgent" | "overlapping";

export function TeamTimeAwaySection() {
  const { toast } = useToast();
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("30");
  const [activeSmartFilters, setActiveSmartFilters] = useState<SmartFilter[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockPendingRequests[0] | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedRequest && !reviewModalOpen && !confirmModalOpen) {
        if (e.key.toLowerCase() === "a") {
          e.preventDefault();
          handleQuickApprove(expandedRequest);
        } else if (e.key.toLowerCase() === "r") {
          e.preventDefault();
          const request = mockPendingRequests.find(r => r.id === expandedRequest);
          if (request) openReviewModal(request);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedRequest, reviewModalOpen, confirmModalOpen]);

  // Smart filter counts
  const smartFilterCounts = {
    lowBalance: mockPendingRequests.filter(r => r.lowBalance || r.exceedsAvailability).length,
    conflicts: mockPendingRequests.filter(r => r.conflicts.length > 0).length,
    urgent: mockPendingRequests.filter(r => r.urgent).length,
    overlapping: mockPendingRequests.filter(r => r.teamImpact.othersOff > 0).length,
  };

  const toggleSmartFilter = (filter: SmartFilter) => {
    setActiveSmartFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  // Filter requests
  const filteredRequests = mockPendingRequests.filter(request => {
    if (activeSmartFilters.includes("lowBalance") && !request.lowBalance && !request.exceedsAvailability) return false;
    if (activeSmartFilters.includes("conflicts") && request.conflicts.length === 0) return false;
    if (activeSmartFilters.includes("urgent") && !request.urgent) return false;
    if (activeSmartFilters.includes("overlapping") && request.teamImpact.othersOff === 0) return false;
    if (employeeFilter !== "all" && String(request.employeeId) !== employeeFilter) return false;
    if (departmentFilter !== "all" && request.department.toLowerCase() !== departmentFilter) return false;
    if (leaveTypeFilter !== "all" && request.leaveType.toLowerCase().replace(" ", "") !== leaveTypeFilter) return false;
    return true;
  });

  const handleQuickApprove = (requestId: number) => {
    setConfirmAction("approve");
    setSelectedRequests([requestId]);
    setConfirmModalOpen(true);
  };

  const handleApprove = () => {
    toast({
      title: selectedRequests.length > 1 ? "Requests Approved" : "Request Approved",
      description: `${selectedRequests.length} request(s) have been approved successfully.`,
    });
    setReviewModalOpen(false);
    setConfirmModalOpen(false);
    setSelectedRequest(null);
    setActionNote("");
    setSelectedRequests([]);
    setExpandedRequest(null);
  };

  const handleReject = () => {
    if (!actionNote.trim() && !confirmModalOpen) {
      toast({ title: "Note Required", description: "Please provide a reason for rejection.", variant: "destructive" });
      return;
    }
    toast({ title: "Request Rejected", description: `Request has been rejected.` });
    setReviewModalOpen(false);
    setConfirmModalOpen(false);
    setSelectedRequest(null);
    setActionNote("");
    setSelectedRequests([]);
    setExpandedRequest(null);
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    setConfirmAction(action);
    setConfirmModalOpen(true);
  };

  const toggleSelectRequest = (id: number) => {
    setSelectedRequests(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const selectAllRequests = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(r => r.id));
    }
  };

  const openReviewModal = (request: typeof mockPendingRequests[0]) => {
    setSelectedRequest(request);
    setReviewModalOpen(true);
  };

  const selectedConflictCount = selectedRequests.filter(id => 
    mockPendingRequests.find(r => r.id === id)?.conflicts.length
  ).length;
  const selectedLowBalanceCount = selectedRequests.filter(id => {
    const req = mockPendingRequests.find(r => r.id === id);
    return req?.lowBalance || req?.exceedsAvailability;
  }).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Team Time Away</h2>
        <p className="text-muted-foreground mt-1">Review requests, manage approvals, and monitor team availability</p>
      </div>

      {/* View Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6 space-y-6">
          {/* Smart KPI Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group"
              onClick={() => {/* scroll to list */}}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Upcoming Leaves</p>
                    <p className="text-3xl font-bold text-foreground">8</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Next 30 days</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CalendarRange className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all hover:border-warning/50 group border-warning/20 bg-warning/5"
              onClick={() => document.getElementById("requests-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Pending Approvals</p>
                    <p className="text-3xl font-bold text-warning">{mockPendingRequests.length}</p>
                    <p className="text-xs text-warning/80 mt-0.5 font-medium">Requires action</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center group-hover:bg-warning/30 transition-colors">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all hover:border-success/50 group"
              onClick={() => {/* open insight dialog */}}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Team Availability</p>
                    <p className="text-3xl font-bold text-success">87%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">This month avg</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                    <UserCheck className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={cn(
                "cursor-pointer hover:shadow-md transition-all group",
                smartFilterCounts.conflicts > 0 
                  ? "border-destructive/30 bg-destructive/5 hover:border-destructive/50" 
                  : "hover:border-primary/30"
              )}
              onClick={() => toggleSmartFilter("conflicts")}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">High-Risk Overlaps</p>
                    <p className={cn("text-3xl font-bold", smartFilterCounts.conflicts > 0 ? "text-destructive" : "text-foreground")}>
                      {smartFilterCounts.conflicts}
                    </p>
                    <p className={cn("text-xs mt-0.5", smartFilterCounts.conflicts > 0 ? "text-destructive/80 font-medium" : "text-muted-foreground")}>
                      {smartFilterCounts.conflicts > 0 ? "Review conflicts" : "No conflicts"}
                    </p>
                  </div>
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                    smartFilterCounts.conflicts > 0 
                      ? "bg-destructive/20 group-hover:bg-destructive/30" 
                      : "bg-muted group-hover:bg-muted/80"
                  )}>
                    <AlertTriangle className={cn("h-6 w-6", smartFilterCounts.conflicts > 0 ? "text-destructive" : "text-muted-foreground")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Bar */}
          <Card>
            <CardContent className="py-4">
              <div className="space-y-4">
                {/* Standard Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Employees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {mockTeamMembers.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="sickleave">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Next 7 days</SelectItem>
                      <SelectItem value="30">Next 30 days</SelectItem>
                      <SelectItem value="90">Next 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Smart Filters */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
                    <Filter className="h-3 w-3" /> Quick filters:
                  </span>
                  {smartFilterCounts.urgent > 0 && (
                    <Badge
                      variant={activeSmartFilters.includes("urgent") ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all text-xs",
                        activeSmartFilters.includes("urgent") 
                          ? "bg-warning text-warning-foreground hover:bg-warning/90" 
                          : "hover:bg-warning/10 border-warning/50 text-warning"
                      )}
                      onClick={() => toggleSmartFilter("urgent")}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Urgent ({smartFilterCounts.urgent})
                    </Badge>
                  )}
                  {smartFilterCounts.conflicts > 0 && (
                    <Badge
                      variant={activeSmartFilters.includes("conflicts") ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all text-xs",
                        activeSmartFilters.includes("conflicts") 
                          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                          : "hover:bg-destructive/10 border-destructive/50 text-destructive"
                      )}
                      onClick={() => toggleSmartFilter("conflicts")}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Conflicts ({smartFilterCounts.conflicts})
                    </Badge>
                  )}
                  {smartFilterCounts.lowBalance > 0 && (
                    <Badge
                      variant={activeSmartFilters.includes("lowBalance") ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all text-xs",
                        activeSmartFilters.includes("lowBalance") 
                          ? "bg-amber-500 text-white hover:bg-amber-600" 
                          : "hover:bg-amber-500/10 border-amber-500/50 text-amber-600"
                      )}
                      onClick={() => toggleSmartFilter("lowBalance")}
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Low Balance ({smartFilterCounts.lowBalance})
                    </Badge>
                  )}
                  {smartFilterCounts.overlapping > 0 && (
                    <Badge
                      variant={activeSmartFilters.includes("overlapping") ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all text-xs",
                        activeSmartFilters.includes("overlapping") 
                          ? "bg-primary" 
                          : "hover:bg-primary/10"
                      )}
                      onClick={() => toggleSmartFilter("overlapping")}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Overlapping ({smartFilterCounts.overlapping})
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests to Review */}
          <div id="requests-section">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                <h3 className="text-lg font-semibold">Requests to Review</h3>
                <Badge variant="warning" className="ml-1">{filteredRequests.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                  onCheckedChange={selectAllRequests}
                  id="select-all"
                />
                <Label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                  Select all
                </Label>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredRequests.map((request) => {
                  const Icon = leaveTypeIcons[request.leaveType] || Umbrella;
                  const colors = leaveTypeColors[request.leaveType] || leaveTypeColors.Vacation;
                  const isExpanded = expandedRequest === request.id;
                  const isSelected = selectedRequests.includes(request.id);

                  return (
                    <motion.div
                      key={request.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className={cn(
                        "transition-all overflow-hidden",
                        request.urgent && "border-l-4 border-l-warning",
                        isSelected && "ring-2 ring-primary shadow-md",
                        isExpanded && "shadow-lg"
                      )}>
                        {/* Collapsed View */}
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelectRequest(request.id)}
                              onClick={(e) => e.stopPropagation()}
                            />

                            <Avatar className="h-9 w-9 border border-border">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                {request.employeeName.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">{request.employeeName}</span>
                                <Badge className={cn("text-[10px] px-1.5 py-0 h-5 font-normal", colors.badge)}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {request.leaveType}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd")}
                                {request.days && ` · ${request.days} day${request.days > 1 ? "s" : ""}`}
                                {request.hours && ` · ${request.hours} hours`}
                              </p>
                            </div>

                            {/* Risk Indicators */}
                            <div className="hidden sm:flex items-center gap-1.5">
                              {request.urgent && (
                                <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center" title="Urgent">
                                  <Zap className="h-3.5 w-3.5 text-warning" />
                                </div>
                              )}
                              {request.conflicts.length > 0 && (
                                <div className="h-6 w-6 rounded-full bg-destructive/20 flex items-center justify-center" title="Has conflicts">
                                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                                </div>
                              )}
                              {(request.lowBalance || request.exceedsAvailability) && (
                                <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center" title="Low balance">
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-3 text-muted-foreground hover:text-foreground"
                                onClick={() => openReviewModal(request)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRequests([request.id]);
                                  setConfirmAction("reject");
                                  setConfirmModalOpen(true);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 px-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickApprove(request.id);
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          {/* Mobile Risk Indicators */}
                          <div className="flex sm:hidden items-center gap-1.5 mt-3 ml-12">
                            {request.urgent && (
                              <Badge variant="outline" className="text-[10px] h-5 border-warning/50 text-warning bg-warning/10">
                                <Zap className="h-2.5 w-2.5 mr-0.5" /> Urgent
                              </Badge>
                            )}
                            {request.conflicts.length > 0 && (
                              <Badge variant="outline" className="text-[10px] h-5 border-destructive/50 text-destructive bg-destructive/10">
                                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" /> Conflict
                              </Badge>
                            )}
                            {(request.lowBalance || request.exceedsAvailability) && (
                              <Badge variant="outline" className="text-[10px] h-5 border-amber-500/50 text-amber-600 bg-amber-50">
                                <AlertCircle className="h-2.5 w-2.5 mr-0.5" /> Low balance
                              </Badge>
                            )}
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 mt-4 border-t border-border space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Balance Impact */}
                                    <div className="p-3 rounded-lg bg-muted/50">
                                      <p className="text-xs text-muted-foreground mb-2">Vacation Balance</p>
                                      <div className="flex items-baseline gap-2">
                                        <span className={cn(
                                          "text-xl font-bold",
                                          request.balanceAfter < 0 ? "text-destructive" : "text-foreground"
                                        )}>
                                          {request.balanceAfter}
                                        </span>
                                        <span className="text-sm text-muted-foreground">/ 20 days remaining</span>
                                      </div>
                                      <Progress 
                                        value={Math.max(0, (request.balanceAfter / 20) * 100)} 
                                        className={cn("h-1.5 mt-2", request.balanceAfter < 0 && "[&>div]:bg-destructive")} 
                                      />
                                      {request.exceedsAvailability && (
                                        <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                                          <AlertCircle className="h-3 w-3" />
                                          Exceeds available balance
                                        </p>
                                      )}
                                    </div>

                                    {/* Team Impact */}
                                    <div className="p-3 rounded-lg bg-muted/50">
                                      <p className="text-xs text-muted-foreground mb-2">Team Impact</p>
                                      <p className="text-sm">
                                        <span className="font-semibold">{request.teamImpact.othersOff}</span> others off during this period
                                      </p>
                                      <p className="text-sm mt-1">
                                        Availability drops to <span className={cn(
                                          "font-semibold",
                                          request.teamImpact.availabilityDrop < 50 ? "text-destructive" : "text-foreground"
                                        )}>{request.teamImpact.availabilityDrop}%</span>
                                      </p>
                                    </div>

                                    {/* Conflicts */}
                                    <div className="p-3 rounded-lg bg-muted/50">
                                      <p className="text-xs text-muted-foreground mb-2">Conflicts ({request.conflicts.length})</p>
                                      {request.conflicts.length > 0 ? (
                                        <ul className="space-y-1">
                                          {request.conflicts.map((c, i) => (
                                            <li key={i} className="text-sm flex items-center gap-2">
                                              <AlertTriangle className="h-3 w-3 text-destructive" />
                                              <span>{c.name}</span>
                                              <span className="text-muted-foreground">· {c.dates}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-sm text-success flex items-center gap-1">
                                          <CheckCircle2 className="h-3 w-3" />
                                          No conflicts detected
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Employee Notes */}
                                  <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground mb-1">Employee's Note</p>
                                    <p className="text-sm">{request.reason}</p>
                                  </div>

                                  {/* Manager Comment */}
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1.5 block">Add a note (optional)</Label>
                                    <Textarea 
                                      placeholder="Add a comment for the employee..."
                                      className="h-20 text-sm resize-none"
                                      value={actionNote}
                                      onChange={(e) => setActionNote(e.target.value)}
                                    />
                                  </div>

                                  {/* Expanded Actions */}
                                  <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-muted-foreground">
                                      Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">A</kbd> to approve, 
                                      <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono ml-1">R</kbd> to review
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openReviewModal(request)}
                                      >
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        Request Changes
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                        onClick={() => {
                                          setSelectedRequests([request.id]);
                                          setConfirmAction("reject");
                                          setConfirmModalOpen(true);
                                        }}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleQuickApprove(request.id)}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredRequests.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm text-muted-foreground mt-1">No pending requests match your filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ManagerCalendarView />
        </TabsContent>
      </Tabs>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedRequests.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="shadow-2xl border-2">
              <CardContent className="py-3 px-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">
                      {selectedRequests.length} Request{selectedRequests.length > 1 ? "s" : ""} Selected
                    </span>
                    {(selectedConflictCount > 0 || selectedLowBalanceCount > 0) && (
                      <div className="flex items-center gap-2 text-xs">
                        {selectedConflictCount > 0 && (
                          <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">
                            {selectedConflictCount} conflict{selectedConflictCount > 1 ? "s" : ""}
                          </Badge>
                        )}
                        {selectedLowBalanceCount > 0 && (
                          <Badge variant="outline" className="border-amber-500/50 text-amber-600 bg-amber-50">
                            {selectedLowBalanceCount} low balance
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequests([])}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleBulkAction("reject")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction("approve")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedRequest?.employeeName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedRequest?.employeeName}</span>
                <p className="text-sm font-normal text-muted-foreground">{selectedRequest?.employeeRole}</p>
              </div>
            </DialogTitle>
            <DialogDescription>Review and respond to this time off request</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Leave Type</p>
                  <p className="font-medium mt-1">{selectedRequest.leaveType}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium mt-1">
                    {selectedRequest.days ? `${selectedRequest.days} day(s)` : `${selectedRequest.hours} hours`}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium mt-1">{format(new Date(selectedRequest.startDate), "MMM dd, yyyy")}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-medium mt-1">{format(new Date(selectedRequest.endDate), "MMM dd, yyyy")}</p>
                </div>
              </div>

              {/* Balance & Impact */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Balance After Approval</span>
                  <span className={cn(
                    "text-lg font-bold",
                    selectedRequest.balanceAfter < 0 ? "text-destructive" : "text-success"
                  )}>
                    {selectedRequest.balanceAfter} days
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, (selectedRequest.balanceAfter / 20) * 100)} 
                  className={cn("h-2", selectedRequest.balanceAfter < 0 && "[&>div]:bg-destructive")} 
                />
              </div>

              {/* Conflicts */}
              {selectedRequest.conflicts.length > 0 && (
                <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                  <p className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Scheduling Conflicts
                  </p>
                  <ul className="space-y-1">
                    {selectedRequest.conflicts.map((c, i) => (
                      <li key={i} className="text-sm">{c.name} - {c.dates} ({c.type})</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Employee Notes */}
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Employee's Reason</p>
                <p className="text-sm">{selectedRequest.reason}</p>
              </div>

              {/* Manager Note */}
              <div>
                <Label>Response Note</Label>
                <Textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Add a note for the employee (required for rejection)..."
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleReject}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve" 
                ? `Are you sure you want to approve ${selectedRequests.length} request(s)?`
                : `Are you sure you want to reject ${selectedRequests.length} request(s)?`
              }
            </DialogDescription>
          </DialogHeader>

          {confirmAction === "reject" && (
            <div className="py-4">
              <Label>Rejection Reason</Label>
              <Textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="mt-1.5"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            {confirmAction === "approve" ? (
              <Button onClick={handleApprove}>
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!actionNote.trim()}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
