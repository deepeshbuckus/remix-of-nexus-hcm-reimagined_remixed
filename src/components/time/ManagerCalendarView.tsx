import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Umbrella,
  Heart,
  Home,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  getDay,
} from "date-fns";
import { cn } from "@/lib/utils";

// Mock leave data
const mockLeaveData = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sarah Johnson",
    leaveType: "Vacation",
    startDate: new Date(2025, 11, 15),
    endDate: new Date(2025, 11, 19),
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Michael Chen",
    leaveType: "Personal",
    startDate: new Date(2025, 11, 10),
    endDate: new Date(2025, 11, 10),
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Emily Rodriguez",
    leaveType: "Vacation",
    startDate: new Date(2025, 11, 20),
    endDate: new Date(2025, 11, 22),
  },
  {
    id: 4,
    employeeId: 1,
    employeeName: "Sarah Johnson",
    leaveType: "Sick Leave",
    startDate: new Date(2025, 11, 5),
    endDate: new Date(2025, 11, 6),
  },
  {
    id: 5,
    employeeId: 4,
    employeeName: "David Kim",
    leaveType: "Personal",
    startDate: new Date(2025, 11, 18),
    endDate: new Date(2025, 11, 18),
  },
];

type ViewMode = "month" | "week" | "timeline";

const leaveTypeColors: Record<string, string> = {
  Vacation: "bg-blue-500 text-white",
  "Sick Leave": "bg-yellow-500 text-white",
  Personal: "bg-purple-500 text-white",
};

const leaveTypeIcons: Record<string, typeof Umbrella> = {
  Vacation: Umbrella,
  "Sick Leave": Heart,
  Personal: Home,
};

export function ManagerCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [teamFilter, setTeamFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateDetailsOpen, setDateDetailsOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getLeaveForDate = (date: Date) => {
    return mockLeaveData.filter((leave) => {
      const leaveStart = leave.startDate;
      const leaveEnd = leave.endDate;
      return date >= leaveStart && date <= leaveEnd;
    });
  };

  const getEmployeesOffOnDate = (date: Date) => {
    const leaves = getLeaveForDate(date);
    
    // Apply filters
    let filteredLeaves = leaves;
    if (leaveTypeFilter !== "all") {
      filteredLeaves = filteredLeaves.filter(leave => leave.leaveType === leaveTypeFilter);
    }
    
    return filteredLeaves;
  };

  const handleDateClick = (date: Date) => {
    const employeesOff = getEmployeesOffOnDate(date);
    if (employeesOff.length > 0) {
      setSelectedDate(date);
      setDateDetailsOpen(true);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Team Calendar</h2>
          <p className="text-muted-foreground mt-1">
            View team availability and plan schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold text-foreground min-w-[180px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters and View Mode */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
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

            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="leave-type-filter" className="text-sm font-medium mb-2 block">
                Leave Type
              </Label>
              <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                <SelectTrigger id="leave-type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="view-mode" className="text-sm font-medium mb-2 block">
                View Mode
              </Label>
              <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <SelectTrigger id="view-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Week Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const employeesOff = getEmployeesOffOnDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "min-h-[100px] p-2 rounded-lg border transition-all",
                    isCurrentMonth
                      ? "bg-background hover:bg-accent/50 cursor-pointer"
                      : "bg-muted/30 text-muted-foreground",
                    isToday && "ring-2 ring-primary",
                    employeesOff.length > 0 && isCurrentMonth && "shadow-sm hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      isToday && "text-primary font-bold"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  {/* Employee Avatars */}
                  {employeesOff.length > 0 && (
                    <div className="space-y-1">
                      {employeesOff.slice(0, 3).map((leave) => (
                        <div
                          key={leave.id}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                            leaveTypeColors[leave.leaveType]
                          )}
                        >
                          <Avatar className="h-5 w-5 border-2 border-white">
                            <AvatarFallback className="text-[10px] bg-background/20">
                              {leave.employeeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate flex-1">
                            {leave.employeeName.split(" ")[0]}
                          </span>
                        </div>
                      ))}
                      {employeesOff.length > 3 && (
                        <div className="text-xs text-muted-foreground px-2">
                          +{employeesOff.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-foreground">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-sm text-muted-foreground">Vacation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              <span className="text-sm text-muted-foreground">Sick Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500" />
              <span className="text-sm text-muted-foreground">Personal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Details Dialog */}
      <Dialog open={dateDetailsOpen} onOpenChange={setDateDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDate &&
              getEmployeesOffOnDate(selectedDate).map((leave) => {
                const Icon = leaveTypeIcons[leave.leaveType];
                const colorClass = leaveTypeColors[leave.leaveType];

                return (
                  <Card key={leave.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {leave.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {leave.employeeName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={cn("text-xs", colorClass)}
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {leave.leaveType}
                            </Badge>
                            {!isSameDay(leave.startDate, leave.endDate) && (
                              <span className="text-xs text-muted-foreground">
                                {format(leave.startDate, "MMM d")} -{" "}
                                {format(leave.endDate, "MMM d")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
