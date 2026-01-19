import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Clock,
  Filter,
  Users,
  Umbrella,
  Heart,
  Home,
  AlertTriangle,
  MessageSquare,
  CalendarDays,
  List,
  TrendingUp,
  Activity,
} from "lucide-react";
import { format, differenceInDays, isBefore, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ManagerCalendarView } from "./ManagerCalendarView";
import { ManagerInsightsPanel } from "./ManagerInsightsPanel";

// Mock data for team members
const mockTeamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "",
    role: "Senior Developer",
    vacation: { total: 20, used: 8, pending: 5, available: 7 },
    sick: { total: 10, used: 2, pending: 0, available: 8 },
    personal: { total: 5, used: 1, pending: 0, available: 4 },
    upcomingLeave: { type: "Vacation", startDate: "2025-12-15", days: 5 },
    pendingRequests: 1,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "",
    role: "Product Designer",
    vacation: { total: 20, used: 12, pending: 0, available: 8 },
    sick: { total: 10, used: 5, pending: 0, available: 5 },
    personal: { total: 5, used: 3, pending: 1, available: 1 },
    upcomingLeave: null,
    pendingRequests: 1,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "",
    role: "Marketing Manager",
    vacation: { total: 20, used: 15, pending: 3, available: 2 },
    sick: { total: 10, used: 1, pending: 0, available: 9 },
    personal: { total: 5, used: 2, pending: 0, available: 3 },
    upcomingLeave: { type: "Vacation", startDate: "2025-12-20", days: 3 },
    pendingRequests: 1,
    lowBalance: true,
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "",
    role: "Backend Engineer",
    vacation: { total: 20, used: 10, pending: 0, available: 10 },
    sick: { total: 10, used: 0, pending: 0, available: 10 },
    personal: { total: 5, used: 0, pending: 0, available: 5 },
    upcomingLeave: null,
    pendingRequests: 0,
  },
];

// Mock pending requests
const mockPendingRequests = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sarah Johnson",
    employeeRole: "Senior Developer",
    leaveType: "Vacation",
    durationType: "Full Day",
    startDate: "2025-12-15",
    endDate: "2025-12-19",
    days: 5,
    reason: "Family vacation to Hawaii",
    status: "Pending",
    submittedDate: "2025-11-28",
    balanceAfter: 2,
    conflicts: 1,
    urgent: true,
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: "Emily Rodriguez",
    employeeRole: "Marketing Manager",
    leaveType: "Vacation",
    durationType: "Full Day",
    startDate: "2025-12-20",
    endDate: "2025-12-22",
    days: 3,
    reason: "Holiday break",
    status: "Pending",
    submittedDate: "2025-11-30",
    balanceAfter: -1,
    conflicts: 2,
    urgent: false,
    warning: "Request exceeds available balance by 1 day",
  },
  {
    id: 3,
    employeeId: 2,
    employeeName: "Michael Chen",
    employeeRole: "Product Designer",
    leaveType: "Personal",
    durationType: "Hours",
    startDate: "2025-12-10",
    endDate: "2025-12-10",
    hours: 4,
    reason: "Doctor's appointment",
    status: "Pending",
    submittedDate: "2025-12-01",
    balanceAfter: 0.5,
    conflicts: 0,
    urgent: false,
  },
];

const leaveTypeIcons: Record<string, typeof Umbrella> = {
  Vacation: Umbrella,
  "Sick Leave": Heart,
  Personal: Home,
};

const leaveTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  Vacation: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", border: "border-l-blue-500" },
  "Sick Leave": { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-l-purple-500" },
  Personal: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-600 dark:text-orange-400", border: "border-l-orange-500" },
};

export function ManagerTimeAwayView() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [teamFilter, setTeamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<typeof mockPendingRequests[0] | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");

  const handleApprove = () => {
    toast({
      title: "Request Approved",
      description: `${selectedRequest?.employeeName}'s time off request has been approved.`,
    });
    setReviewModalOpen(false);
    setSelectedRequest(null);
    setActionNote("");
  };

  const handleReject = () => {
    if (!actionNote.trim()) {
      toast({
        title: "Note Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Request Rejected",
      description: `${selectedRequest?.employeeName}'s time off request has been rejected.`,
    });
    setReviewModalOpen(false);
    setSelectedRequest(null);
    setActionNote("");
  };

  const handleRequestInfo = () => {
    if (!actionNote.trim()) {
      toast({
        title: "Message Required",
        description: "Please provide a message to the employee.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Clarification Requested",
      description: `Message sent to ${selectedRequest?.employeeName}.`,
    });
    setReviewModalOpen(false);
    setSelectedRequest(null);
    setActionNote("");
  };

  const openReviewModal = (request: typeof mockPendingRequests[0]) => {
    setSelectedRequest(request);
    setReviewModalOpen(true);
  };

  const getDaysUntilStart = (startDate: string) => {
    return differenceInDays(new Date(startDate), new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Team Time Away</h2>
        <p className="text-muted-foreground mt-1">
          Review requests, check balances, and manage team availability.
        </p>
      </div>

      {/* Tabs for List/Calendar/Insights View */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6 space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upcoming Leaves</p>
                <p className="text-3xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground mt-1">Requires action</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-950/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Team Availability</p>
                <p className="text-3xl font-bold text-foreground">87%</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">High-Risk Overlaps</p>
                <p className="text-3xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground mt-1">Scheduling conflicts</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="employee-filter" className="text-sm font-medium mb-2 block">
                Employee
              </Label>
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger id="employee-filter">
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                  <SelectItem value="emily">Emily Rodriguez</SelectItem>
                  <SelectItem value="david">David Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="team-filter" className="text-sm font-medium mb-2 block">
                Team / Department
              </Label>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger id="team-filter">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="leave-type-filter" className="text-sm font-medium mb-2 block">
                Leave Type
              </Label>
              <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                <SelectTrigger id="leave-type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-filter" className="text-sm font-medium mb-2 block">
                Date Range
              </Label>
              <Select defaultValue="30">
                <SelectTrigger id="date-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Leave Balances Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Team Leave Balances</h3>
          </div>
          <Button variant="outline" size="sm">
            View All Details
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {mockTeamMembers.map((member) => (
            <Card 
              key={member.id} 
              className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              <CardContent className="pt-6">
                {/* Employee Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-base font-semibold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate text-base">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                  </div>
                </div>

                {/* Quick Indicators */}
                <div className="space-y-2 mb-4">
                  {member.upcomingLeave && (
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg animate-fade-in">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span className="truncate font-medium">
                        📅 {member.upcomingLeave.type} - {format(new Date(member.upcomingLeave.startDate), "MMM dd")}
                      </span>
                    </div>
                  )}
                  {member.lowBalance && (
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg animate-fade-in">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span className="font-medium">⚠ Low balance alert</span>
                    </div>
                  )}
                  {member.pendingRequests > 0 && (
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-2 rounded-lg animate-fade-in">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-medium">🕒 {member.pendingRequests} pending</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Balance Summary with Progress */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <Umbrella className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-muted-foreground text-xs">Vacation</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {member.vacation.available}<span className="text-xs text-muted-foreground">/</span>{member.vacation.total}d
                      </span>
                    </div>
                    <Progress 
                      value={(member.vacation.available / member.vacation.total) * 100} 
                      className="h-1.5 bg-blue-100 dark:bg-blue-950/30"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <Heart className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        <span className="text-muted-foreground text-xs">Sick</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {member.sick.available}<span className="text-xs text-muted-foreground">/</span>{member.sick.total}d
                      </span>
                    </div>
                    <Progress 
                      value={(member.sick.available / member.sick.total) * 100} 
                      className="h-1.5 bg-purple-100 dark:bg-purple-950/30"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <Home className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                        <span className="text-muted-foreground text-xs">Personal</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {member.personal.available}<span className="text-xs text-muted-foreground">/</span>{member.personal.total}d
                      </span>
                    </div>
                    <Progress 
                      value={(member.personal.available / member.personal.total) * 100} 
                      className="h-1.5 bg-orange-100 dark:bg-orange-950/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manager Requests Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Requests to Review</h3>
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">{mockPendingRequests.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="default" size="sm">Pending</Button>
            <Button variant="outline" size="sm">Approved</Button>
            <Button variant="outline" size="sm">Rejected</Button>
          </div>
        </div>

        <div className="space-y-3">
          {mockPendingRequests.map((request) => {
            const daysUntil = getDaysUntilStart(request.startDate);
            const isUrgent = daysUntil <= 2 && daysUntil >= 0;
            const Icon = leaveTypeIcons[request.leaveType] || Umbrella;
            const colors = leaveTypeColors[request.leaveType] || leaveTypeColors.Vacation;

            return (
              <Card 
                key={request.id} 
                className={cn(
                  "hover:shadow-md transition-all cursor-pointer border-l-4",
                  colors.border,
                  isUrgent && "ring-2 ring-orange-500/50"
                )}
                onClick={() => navigate(`/time/request/${request.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Employee Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {request.employeeName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{request.employeeName}</p>
                        <p className="text-sm text-muted-foreground truncate">{request.employeeRole}</p>
                      </div>
                    </div>

                    {/* Leave Details */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className={cn("p-2 rounded-lg", colors.bg)}>
                        <Icon className={cn("h-5 w-5", colors.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{request.leaveType}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd, yyyy")} • {request.days ? `${request.days} days` : `${request.hours}h`}
                        </p>
                      </div>
                    </div>

                    {/* Status & Warnings */}
                    <div className="flex flex-wrap gap-2">
                      {isUrgent && (
                        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Starts in {daysUntil}d
                        </Badge>
                      )}
                      {request.conflicts > 0 && (
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                          {request.conflicts} team conflict{request.conflicts > 1 ? 's' : ''}
                        </Badge>
                      )}
                      {request.warning && (
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Exceeds balance
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/time/request/${request.id}`);
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ManagerCalendarView />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <ManagerInsightsPanel />
        </TabsContent>
      </Tabs>

      {/* Review Request Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Time Off Request</DialogTitle>
            <DialogDescription>
              Review the details and make a decision on this request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Employee Details */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {selectedRequest.employeeName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg text-foreground">{selectedRequest.employeeName}</p>
                  <p className="text-muted-foreground">{selectedRequest.employeeRole}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submitted {format(new Date(selectedRequest.submittedDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Leave Type</Label>
                  <p className="text-foreground font-medium mt-1">{selectedRequest.leaveType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Duration</Label>
                  <p className="text-foreground font-medium mt-1">
                    {selectedRequest.durationType} ({selectedRequest.days ? `${selectedRequest.days} days` : `${selectedRequest.hours} hours`})
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Start Date</Label>
                  <p className="text-foreground font-medium mt-1">
                    {format(new Date(selectedRequest.startDate), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">End Date</Label>
                  <p className="text-foreground font-medium mt-1">
                    {format(new Date(selectedRequest.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {/* Reason */}
              {selectedRequest.reason && (
                <div>
                  <Label className="text-muted-foreground">Reason</Label>
                  <p className="text-foreground mt-1">{selectedRequest.reason}</p>
                </div>
              )}

              <Separator />

               {/* Balance Impact */}
              <div className="space-y-3 p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <Label className="text-foreground font-semibold text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Balance Impact
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-background rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Before</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedRequest.balanceAfter + (selectedRequest.days || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">days available</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-2xl text-primary font-bold">→</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-background rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">After</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      selectedRequest.balanceAfter < 0 
                        ? "text-red-600 dark:text-red-400" 
                        : "text-green-600 dark:text-green-400"
                    )}>
                      {selectedRequest.balanceAfter}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">days remaining</p>
                  </div>
                </div>
              </div>

              {/* Conflict Detection Panel */}
              <div className="space-y-3 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <Label className="text-foreground font-semibold text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Coverage Analysis
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-background rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Overlapping Absences</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedRequest.conflicts} team member{selectedRequest.conflicts !== 1 ? 's' : ''} off during this period
                      </p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={cn(
                        selectedRequest.conflicts >= 3 
                          ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-300"
                          : selectedRequest.conflicts >= 2
                          ? "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-300"
                          : "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-300"
                      )}
                    >
                      {selectedRequest.conflicts >= 3 ? "High Risk" : selectedRequest.conflicts >= 2 ? "Medium Risk" : "Low Risk"}
                    </Badge>
                  </div>
                  {selectedRequest.conflicts > 0 && (
                    <div className="space-y-2 p-3 bg-white dark:bg-background rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground">Also Off:</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">MC</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">Michael Chen</span>
                        </div>
                        {selectedRequest.conflicts > 1 && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">DK</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">David Kim</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Warnings & Recommendations */}
              {(selectedRequest.warning || selectedRequest.conflicts > 0) && (
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Alerts</Label>
                  {selectedRequest.warning && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg">
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{selectedRequest.warning}</p>
                    </div>
                  )}
                  {selectedRequest.conflicts > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        {selectedRequest.conflicts} team member{selectedRequest.conflicts > 1 ? 's are' : ' is'} already scheduled off during this period
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Note */}
              <div>
                <Label htmlFor="action-note">Note / Reason (optional for approval, required for rejection)</Label>
                <Textarea
                  id="action-note"
                  placeholder="Add a note or reason for your decision..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleRequestInfo}
              className="w-full sm:w-auto gap-2 hover:bg-muted"
            >
              <MessageSquare className="h-4 w-4" />
              Request Info
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              className="w-full sm:w-auto gap-2"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              className="w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
