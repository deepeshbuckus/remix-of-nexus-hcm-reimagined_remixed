import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  X,
  Check,
  Calendar,
  TrendingUp,
  FileText,
  Eye,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock team timesheets data
const mockTeamTimesheets = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sarah Johnson",
    employeeRole: "Senior Developer",
    avatar: "",
    weekOf: "2025-12-02",
    regularHours: 40,
    overtimeHours: 5,
    totalHours: 45,
    status: "Pending",
    submittedDate: "2025-12-06",
    entries: [
      { day: "Mon", regular: 8, overtime: 0 },
      { day: "Tue", regular: 8, overtime: 2 },
      { day: "Wed", regular: 8, overtime: 0 },
      { day: "Thu", regular: 8, overtime: 3 },
      { day: "Fri", regular: 8, overtime: 0 },
    ],
    urgent: true,
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Michael Chen",
    employeeRole: "Product Designer",
    avatar: "",
    weekOf: "2025-12-02",
    regularHours: 38,
    overtimeHours: 0,
    totalHours: 38,
    status: "Pending",
    submittedDate: "2025-12-05",
    entries: [
      { day: "Mon", regular: 8, overtime: 0 },
      { day: "Tue", regular: 8, overtime: 0 },
      { day: "Wed", regular: 6, overtime: 0 },
      { day: "Thu", regular: 8, overtime: 0 },
      { day: "Fri", regular: 8, overtime: 0 },
    ],
    urgent: false,
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Emily Rodriguez",
    employeeRole: "Marketing Manager",
    avatar: "",
    weekOf: "2025-12-02",
    regularHours: 40,
    overtimeHours: 8,
    totalHours: 48,
    status: "Pending",
    submittedDate: "2025-12-04",
    entries: [
      { day: "Mon", regular: 8, overtime: 2 },
      { day: "Tue", regular: 8, overtime: 2 },
      { day: "Wed", regular: 8, overtime: 2 },
      { day: "Thu", regular: 8, overtime: 2 },
      { day: "Fri", regular: 8, overtime: 0 },
    ],
    urgent: false,
    warning: "High overtime hours this week",
  },
];

const mockApprovedTimesheets = [
  {
    id: 4,
    employeeId: 4,
    employeeName: "David Kim",
    employeeRole: "Backend Engineer",
    avatar: "",
    weekOf: "2025-11-25",
    regularHours: 40,
    overtimeHours: 0,
    totalHours: 40,
    status: "Approved",
    approvedDate: "2025-12-01",
    entries: [
      { day: "Mon", regular: 8, overtime: 0 },
      { day: "Tue", regular: 8, overtime: 0 },
      { day: "Wed", regular: 8, overtime: 0 },
      { day: "Thu", regular: 8, overtime: 0 },
      { day: "Fri", regular: 8, overtime: 0 },
    ],
    urgent: false,
  },
];

export function ManagerTimesheetSection() {
  const { toast } = useToast();
  const [selectedTimesheets, setSelectedTimesheets] = useState<number[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<typeof mockTeamTimesheets[0] | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [periodFilter, setPeriodFilter] = useState("current");
  const [statusFilter, setStatusFilter] = useState("pending");

  const pendingCount = mockTeamTimesheets.filter(t => t.status === "Pending").length;
  const totalOvertimeHours = mockTeamTimesheets.reduce((sum, t) => sum + t.overtimeHours, 0);

  const handleApprove = (timesheetId?: number) => {
    const ids = timesheetId ? [timesheetId] : selectedTimesheets;
    toast({
      title: ids.length > 1 ? "Timesheets Approved" : "Timesheet Approved",
      description: `${ids.length} timesheet(s) have been approved.`,
    });
    setReviewModalOpen(false);
    setSelectedTimesheet(null);
    setActionNote("");
    setSelectedTimesheets([]);
  };

  const handleReject = () => {
    if (!actionNote.trim()) {
      toast({ 
        title: "Note Required", 
        description: "Please provide a reason for rejection.", 
        variant: "destructive" 
      });
      return;
    }
    toast({ 
      title: "Timesheet Rejected", 
      description: "Timesheet has been rejected and sent back to employee." 
    });
    setReviewModalOpen(false);
    setSelectedTimesheet(null);
    setActionNote("");
  };

  const toggleSelectTimesheet = (id: number) => {
    setSelectedTimesheets(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const selectAllTimesheets = () => {
    if (selectedTimesheets.length === mockTeamTimesheets.length) {
      setSelectedTimesheets([]);
    } else {
      setSelectedTimesheets(mockTeamTimesheets.map(t => t.id));
    }
  };

  const openReview = (timesheet: typeof mockTeamTimesheets[0]) => {
    setSelectedTimesheet(timesheet);
    setReviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Timesheets to review</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-950/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Direct reports</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{mockTeamTimesheets.reduce((s, t) => s + t.totalHours, 0)}</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overtime Hours</p>
                <p className="text-2xl font-bold">{totalOvertimeHours}</p>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label className="text-sm mb-1.5 block">Pay Period</Label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Week</SelectItem>
                  <SelectItem value="previous">Previous Week</SelectItem>
                  <SelectItem value="all">All Periods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label className="text-sm mb-1.5 block">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedTimesheets.length > 0 && (
              <div className="flex gap-2 ml-auto">
                <Button size="sm" onClick={() => handleApprove()}>
                  <Check className="h-4 w-4 mr-1" />
                  Approve ({selectedTimesheets.length})
                </Button>
                <Button size="sm" variant="outline">
                  <X className="h-4 w-4 mr-1" />
                  Reject ({selectedTimesheets.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timesheets to Review */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Timesheets to Review</h3>
            <Badge variant="warning" className="ml-2">{pendingCount}</Badge>
          </div>
        </div>

        {/* Bulk Select */}
        <div className="mb-3 flex items-center gap-2">
          <Checkbox
            checked={selectedTimesheets.length === mockTeamTimesheets.length && mockTeamTimesheets.length > 0}
            onCheckedChange={selectAllTimesheets}
          />
          <span className="text-sm text-muted-foreground">Select All</span>
        </div>

        <div className="space-y-3">
          {mockTeamTimesheets.map((timesheet) => (
            <Card
              key={timesheet.id}
              className={cn(
                "transition-all hover:shadow-md",
                timesheet.urgent && "border-l-4 border-l-yellow-500",
                selectedTimesheets.includes(timesheet.id) && "ring-2 ring-primary"
              )}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedTimesheets.includes(timesheet.id)}
                    onCheckedChange={() => toggleSelectTimesheet(timesheet.id)}
                  />

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={timesheet.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {timesheet.employeeName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{timesheet.employeeName}</p>
                      {timesheet.urgent && (
                        <Badge variant="warning" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{timesheet.employeeRole}</p>
                  </div>

                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Week of</p>
                      <p className="font-medium">{format(new Date(timesheet.weekOf), "MMM d")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Regular</p>
                      <p className="font-medium">{timesheet.regularHours}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Overtime</p>
                      <p className={cn(
                        "font-medium",
                        timesheet.overtimeHours > 5 && "text-orange-600"
                      )}>
                        {timesheet.overtimeHours}h
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Total</p>
                      <p className="font-bold text-primary">{timesheet.totalHours}h</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReview(timesheet)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(timesheet.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>

                {/* Warning */}
                {timesheet.warning && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {timesheet.warning}
                  </div>
                )}

                {/* Mini hours breakdown on mobile */}
                <div className="md:hidden mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Regular</p>
                    <p className="font-medium">{timesheet.regularHours}h</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Overtime</p>
                    <p className="font-medium">{timesheet.overtimeHours}h</p>
                  </div>
                  <div className="text-center p-2 bg-primary/10 rounded">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">{timesheet.totalHours}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedTimesheet && (
            <>
              <DialogHeader>
                <DialogTitle>Review Timesheet</DialogTitle>
                <DialogDescription>
                  {selectedTimesheet.employeeName} - Week of {format(new Date(selectedTimesheet.weekOf), "MMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {/* Employee Info */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedTimesheet.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedTimesheet.employeeName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedTimesheet.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{selectedTimesheet.employeeRole}</p>
                  </div>
                </div>

                {/* Hours Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead className="text-right">Regular</TableHead>
                        <TableHead className="text-right">Overtime</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTimesheet.entries.map((entry, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{entry.day}</TableCell>
                          <TableCell className="text-right">{entry.regular}h</TableCell>
                          <TableCell className={cn(
                            "text-right",
                            entry.overtime > 0 && "text-orange-600"
                          )}>
                            {entry.overtime}h
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {entry.regular + entry.overtime}h
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{selectedTimesheet.regularHours}h</TableCell>
                        <TableCell className="text-right text-orange-600">{selectedTimesheet.overtimeHours}h</TableCell>
                        <TableCell className="text-right text-primary">{selectedTimesheet.totalHours}h</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Warning */}
                {selectedTimesheet.warning && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                    {selectedTimesheet.warning}
                  </div>
                )}

                {/* Note */}
                <div>
                  <Label htmlFor="note">Add a note (required for rejection)</Label>
                  <Textarea
                    id="note"
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Enter any comments or feedback..."
                    className="mt-1.5"
                  />
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedTimesheet.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
