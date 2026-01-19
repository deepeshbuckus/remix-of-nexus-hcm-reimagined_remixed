import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GeofenceWebClock } from "./GeofenceWebClock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface TimeEntry {
  id: string;
  type: "regular" | "break" | "overtime";
  startTime: string;
  endTime: string;
  hours: number;
  comment: string;
}

interface DayTimesheet {
  date: string;
  entries: TimeEntry[];
  status: "Pending" | "Approved" | "Rejected";
}

const initialTimesheetData: DayTimesheet[] = [
  {
    date: "2025-10-01",
    entries: [
      {
        id: "1",
        type: "regular",
        startTime: "09:00 AM",
        endTime: "12:00 PM",
        hours: 3,
        comment: "Morning shift"
      },
      {
        id: "2",
        type: "break",
        startTime: "12:00 PM",
        endTime: "12:30 PM",
        hours: 0.5,
        comment: "Lunch break"
      },
      {
        id: "3",
        type: "regular",
        startTime: "12:30 PM",
        endTime: "05:00 PM",
        hours: 4.5,
        comment: "Afternoon shift"
      }
    ],
    status: "Approved"
  },
  {
    date: "2025-10-02",
    entries: [
      {
        id: "4",
        type: "regular",
        startTime: "09:15 AM",
        endTime: "05:30 PM",
        hours: 7.75,
        comment: "Full day work"
      },
      {
        id: "5",
        type: "break",
        startTime: "12:00 PM",
        endTime: "12:30 PM",
        hours: 0.5,
        comment: "Lunch"
      }
    ],
    status: "Approved"
  },
  {
    date: "2025-10-03",
    entries: [
      {
        id: "6",
        type: "regular",
        startTime: "08:45 AM",
        endTime: "05:00 PM",
        hours: 7.75,
        comment: "Regular hours"
      }
    ],
    status: "Pending"
  }
];

export const Timesheet = () => {
  const [timesheetData, setTimesheetData] = useState<DayTimesheet[]>(initialTimesheetData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [activeClockEntryId, setActiveClockEntryId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<TimeEntry>>({
    type: "regular",
    startTime: "",
    endTime: "",
    hours: 0,
    comment: ""
  });

  const formatTimeForDisplay = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleClockIn = (note?: string) => {
    const today = getTodayDateString();
    const now = new Date();
    const timeString = formatTimeForDisplay(now);
    const newEntryId = Math.random().toString();

    setTimesheetData(prevData => {
      const dayIndex = prevData.findIndex(d => d.date === today);
      
      if (dayIndex === -1) {
        // Create new day with the clock-in entry
        return [...prevData, {
          date: today,
          entries: [{
            id: newEntryId,
            type: "regular" as const,
            startTime: timeString,
            endTime: "",
            hours: 0,
            comment: note || "Web Clock punch"
          }],
          status: "Pending" as const
        }].sort((a, b) => a.date.localeCompare(b.date));
      } else {
        // Add entry to existing day
        const updatedData = [...prevData];
        updatedData[dayIndex].entries.push({
          id: newEntryId,
          type: "regular",
          startTime: timeString,
          endTime: "",
          hours: 0,
          comment: note || "Web Clock punch"
        });
        updatedData[dayIndex].status = "Pending";
        return updatedData;
      }
    });

    setActiveClockEntryId(newEntryId);
  };

  const handleClockOut = () => {
    if (!activeClockEntryId) return;

    const now = new Date();
    const timeString = formatTimeForDisplay(now);

    setTimesheetData(prevData => {
      return prevData.map(day => {
        const entryIndex = day.entries.findIndex(e => e.id === activeClockEntryId);
        if (entryIndex === -1) return day;

        const updatedEntries = [...day.entries];
        const entry = updatedEntries[entryIndex];
        
        // Parse start time to calculate hours
        const startParts = entry.startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (startParts) {
          let startHour = parseInt(startParts[1]);
          const startMin = parseInt(startParts[2]);
          const startPeriod = startParts[3].toUpperCase();
          
          if (startPeriod === "PM" && startHour !== 12) startHour += 12;
          if (startPeriod === "AM" && startHour === 12) startHour = 0;
          
          const startDate = new Date();
          startDate.setHours(startHour, startMin, 0, 0);
          
          const diffMs = now.getTime() - startDate.getTime();
          const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
          
          updatedEntries[entryIndex] = {
            ...entry,
            endTime: timeString,
            hours: Math.max(0, hours)
          };
        }

        return { ...day, entries: updatedEntries };
      });
    });

    setActiveClockEntryId(null);
  };

  const calculateTotals = () => {
    let regular = 0, breaks = 0, overtime = 0;
    timesheetData.forEach(day => {
      day.entries.forEach(entry => {
        if (entry.type === "regular") regular += entry.hours;
        if (entry.type === "break") breaks += entry.hours;
        if (entry.type === "overtime") overtime += entry.hours;
      });
    });
    return { regular, breaks, overtime, total: regular + overtime };
  };

  const handleAddEntry = () => {
    if (!selectedDate || !newEntry.startTime || !newEntry.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const dayIndex = timesheetData.findIndex(d => d.date === selectedDate);
    if (dayIndex === -1) {
      // Create new day
      const newDay: DayTimesheet = {
        date: selectedDate,
        entries: [{
          id: Math.random().toString(),
          type: newEntry.type as "regular" | "break" | "overtime",
          startTime: newEntry.startTime!,
          endTime: newEntry.endTime!,
          hours: newEntry.hours || 0,
          comment: newEntry.comment || ""
        }],
        status: "Pending"
      };
      setTimesheetData([...timesheetData, newDay].sort((a, b) => a.date.localeCompare(b.date)));
    } else {
      // Add to existing day
      const updatedData = [...timesheetData];
      updatedData[dayIndex].entries.push({
        id: Math.random().toString(),
        type: newEntry.type as "regular" | "break" | "overtime",
        startTime: newEntry.startTime!,
        endTime: newEntry.endTime!,
        hours: newEntry.hours || 0,
        comment: newEntry.comment || ""
      });
      setTimesheetData(updatedData);
    }

    setIsDialogOpen(false);
    setNewEntry({ type: "regular", startTime: "", endTime: "", hours: 0, comment: "" });
    toast({
      title: "Entry Added",
      description: "Time entry has been added successfully."
    });
  };

  const handleDeleteEntry = (date: string, entryId: string) => {
    const updatedData = timesheetData.map(day => {
      if (day.date === date) {
        return {
          ...day,
          entries: day.entries.filter(e => e.id !== entryId)
        };
      }
      return day;
    }).filter(day => day.entries.length > 0);
    
    setTimesheetData(updatedData);
    toast({
      title: "Entry Deleted",
      description: "Time entry has been removed."
    });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <GeofenceWebClock onPunchIn={handleClockIn} onPunchOut={handleClockOut} />
      <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Timesheet
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Time Entry</DialogTitle>
                <DialogDescription>
                  Add a new time entry for regular hours, break, or overtime.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newEntry.type}
                    onValueChange={(value: "regular" | "break" | "overtime") =>
                      setNewEntry({ ...newEntry, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Hours</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="overtime">Overtime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEntry.startTime}
                      onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEntry.endTime}
                      onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.25"
                    value={newEntry.hours}
                    onChange={(e) => setNewEntry({ ...newEntry, hours: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={newEntry.comment}
                    onChange={(e) => setNewEntry({ ...newEntry, comment: e.target.value })}
                    placeholder="Add any notes about this time entry..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEntry}>Add Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheetData.map((day) =>
                day.entries.map((entry, index) => (
                  <TableRow key={entry.id}>
                    {index === 0 && (
                      <TableCell className="font-medium" rowSpan={day.entries.length}>
                        {day.date}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={
                        entry.type === "regular" ? "default" : 
                        entry.type === "break" ? "secondary" : "outline"
                      }>
                        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.startTime}</TableCell>
                    <TableCell>{entry.endTime}</TableCell>
                    <TableCell>{entry.hours}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.comment || "-"}</TableCell>
                    {index === 0 && (
                      <TableCell rowSpan={day.entries.length}>
                        <Badge variant={day.status === "Approved" ? "default" : "secondary"}>
                          {day.status}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      {day.status === "Pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntry(day.date, entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing entries for current week
          </p>
          <div className="flex gap-4 text-sm">
            <span>Regular: <span className="font-semibold text-primary">{totals.regular}h</span></span>
            <span>Break: <span className="font-semibold">{totals.breaks}h</span></span>
            <span>Overtime: <span className="font-semibold">{totals.overtime}h</span></span>
            <span className="text-lg">Total: <span className="font-semibold text-primary">{totals.total}h</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
    </div>
  );
};
