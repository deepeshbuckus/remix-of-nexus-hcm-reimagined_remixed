import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  MapPin, 
  AlertTriangle, 
  WifiOff, 
  Navigation,
  Search,
  Filter,
  Check,
  X,
  Edit3,
  ChevronRight,
  Clock,
  Smartphone,
  Monitor,
  PartyPopper,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Exception {
  id: string;
  employee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  date: string;
  time: string;
  location: string;
  distance: string;
  type: "outside-geofence" | "missing-gps" | "low-accuracy" | "offline";
  severity: "blocking" | "compliance" | "accuracy" | "info";
  status: "open" | "approved" | "adjusted" | "rejected";
  device: "web" | "mobile";
  gpsAccuracy: string;
  note?: string;
  punches: { time: string; type: string; location: string; status: string }[];
}

const mockExceptions: Exception[] = [
  {
    id: "1",
    employee: { name: "Sarah Johnson", initials: "SJ" },
    date: "2025-06-17",
    time: "09:02 AM",
    location: "Main Store",
    distance: "1.1 km outside (limit 200m)",
    type: "outside-geofence",
    severity: "compliance",
    status: "open",
    device: "mobile",
    gpsAccuracy: "±25m",
    note: "Working from client site today",
    punches: [
      { time: "09:02 AM", type: "Clock In", location: "Off-site", status: "flagged" },
      { time: "12:30 PM", type: "Break Start", location: "Off-site", status: "flagged" },
      { time: "01:00 PM", type: "Break End", location: "Off-site", status: "flagged" },
    ],
  },
  {
    id: "2",
    employee: { name: "Mike Chen", initials: "MC" },
    date: "2025-06-17",
    time: "08:45 AM",
    location: "Warehouse East",
    distance: "450m outside (limit 100m)",
    type: "outside-geofence",
    severity: "blocking",
    status: "open",
    device: "web",
    gpsAccuracy: "±15m",
    punches: [
      { time: "08:45 AM", type: "Clock In", location: "Parking Lot", status: "flagged" },
    ],
  },
  {
    id: "3",
    employee: { name: "Emily Davis", initials: "ED" },
    date: "2025-06-16",
    time: "09:15 AM",
    location: "Downtown Office",
    distance: "N/A",
    type: "missing-gps",
    severity: "accuracy",
    status: "open",
    device: "mobile",
    gpsAccuracy: "Unavailable",
    punches: [
      { time: "09:15 AM", type: "Clock In", location: "Unknown", status: "flagged" },
      { time: "05:30 PM", type: "Clock Out", location: "Downtown Office", status: "verified" },
    ],
  },
  {
    id: "4",
    employee: { name: "James Wilson", initials: "JW" },
    date: "2025-06-16",
    time: "02:30 PM",
    location: "Main Store",
    distance: "N/A",
    type: "offline",
    severity: "info",
    status: "approved",
    device: "mobile",
    gpsAccuracy: "±30m",
    note: "Store had network issues",
    punches: [
      { time: "08:00 AM", type: "Clock In", location: "Main Store", status: "verified" },
      { time: "02:30 PM", type: "Clock Out", location: "Main Store", status: "synced" },
    ],
  },
];

const LocationExceptions = () => {
  const [exceptions, setExceptions] = useState<Exception[]>(mockExceptions);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();

  const filteredExceptions = exceptions.filter((ex) => {
    const matchesSearch = ex.employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ex.status === statusFilter;
    const matchesType = typeFilter === "all" || ex.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openExceptions = exceptions.filter((ex) => ex.status === "open");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const openIds = filteredExceptions.filter((ex) => ex.status === "open").map((ex) => ex.id);
    setSelectedIds((prev) => (prev.length === openIds.length ? [] : openIds));
  };

  const handleApprove = (ids: string[]) => {
    setExceptions((prev) =>
      prev.map((ex) => (ids.includes(ex.id) ? { ...ex, status: "approved" as const } : ex))
    );
    setSelectedIds([]);
    setSelectedException(null);
    toast({
      title: "Exception(s) Approved",
      description: `${ids.length} punch${ids.length > 1 ? "es" : ""} approved as valid worked time.`,
    });
  };

  const handleReject = (id: string) => {
    setExceptions((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, status: "rejected" as const } : ex))
    );
    setSelectedException(null);
    setRejectionReason("");
    toast({
      title: "Exception Rejected",
      description: "The punch has been rejected.",
      variant: "destructive",
    });
  };

  const getTypeConfig = (type: Exception["type"]) => {
    switch (type) {
      case "outside-geofence":
        return { icon: MapPin, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30", label: "Outside Geofence" };
      case "missing-gps":
        return { icon: Navigation, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", label: "Missing GPS" };
      case "low-accuracy":
        return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", label: "Low Accuracy" };
      case "offline":
        return { icon: WifiOff, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800", label: "Offline Punch" };
    }
  };

  const getSeverityBadge = (severity: Exception["severity"]) => {
    switch (severity) {
      case "blocking":
        return <Badge variant="destructive">Payroll Blocking</Badge>;
      case "compliance":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Compliance</Badge>;
      case "accuracy":
        return <Badge variant="secondary">Accuracy</Badge>;
      case "info":
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const getStatusBadge = (status: Exception["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Open</Badge>;
      case "approved":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>;
      case "adjusted":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Adjusted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Location Exceptions</h1>
        <p className="text-muted-foreground">
          Review and resolve punch exceptions for your team
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Exceptions</p>
                <p className="text-2xl font-bold">{openExceptions.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payroll Blocking</p>
                <p className="text-2xl font-bold text-destructive">
                  {exceptions.filter((e) => e.severity === "blocking" && e.status === "open").length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {exceptions.filter((e) => e.status === "approved").length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Exception Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="outside-geofence">Outside Geofence</SelectItem>
                <SelectItem value="missing-gps">Missing GPS</SelectItem>
                <SelectItem value="low-accuracy">Low Accuracy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-primary">
              <CardContent className="p-4 flex items-center justify-between">
                <p className="text-sm font-medium">
                  {selectedIds.length} exception{selectedIds.length > 1 ? "s" : ""} selected
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIds([])}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(selectedIds)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Bulk Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exception List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Exceptions</CardTitle>
            {filteredExceptions.filter((ex) => ex.status === "open").length > 0 && (
              <Button variant="ghost" size="sm" onClick={selectAll}>
                {selectedIds.length === filteredExceptions.filter((ex) => ex.status === "open").length
                  ? "Deselect All"
                  : "Select All Open"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredExceptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <PartyPopper className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Nothing to fix right now 🎉</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                All punches are inside geofence. Great work, team!
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredExceptions.map((exception) => {
                const typeConfig = getTypeConfig(exception.type);
                const TypeIcon = typeConfig.icon;

                return (
                  <motion.div
                    key={exception.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                      selectedIds.includes(exception.id) ? "bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedException(exception)}
                  >
                    <div className="flex items-center gap-4">
                      {exception.status === "open" && (
                        <Checkbox
                          checked={selectedIds.includes(exception.id)}
                          onCheckedChange={() => toggleSelect(exception.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={exception.employee.avatar} />
                        <AvatarFallback>{exception.employee.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{exception.employee.name}</span>
                          <Badge variant="outline" className={`${typeConfig.bg} ${typeConfig.color} border-0`}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {exception.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exception.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exception.distance}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getSeverityBadge(exception.severity)}
                        {getStatusBadge(exception.status)}
                        {exception.status === "open" && (
                          <div className="hidden md:flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove([exception.id]);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedException(exception);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selectedException} onOpenChange={() => setSelectedException(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedException && (
            <>
              <SheetHeader>
                <SheetTitle>Exception Details</SheetTitle>
                <SheetDescription>
                  Review and take action on this location exception
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Employee Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{selectedException.employee.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedException.employee.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedException.date}</p>
                  </div>
                </div>

                {/* Timeline */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Today's Punches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                      <div className="space-y-4">
                        {selectedException.punches.map((punch, i) => (
                          <div key={i} className="flex items-center gap-3 relative">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                                punch.status === "flagged"
                                  ? "bg-amber-100 dark:bg-amber-900/30"
                                  : "bg-emerald-100 dark:bg-emerald-900/30"
                              }`}
                            >
                              <Clock
                                className={`h-4 w-4 ${
                                  punch.status === "flagged" ? "text-amber-600" : "text-emerald-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{punch.time}</span>
                                <Badge variant="outline" className="text-xs">
                                  {punch.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{punch.location}</p>
                            </div>
                            {punch.status === "flagged" && (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Exception Details */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Exception Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      <p className="text-sm">
                        Punch at <strong>{selectedException.time}</strong> is{" "}
                        <strong>{selectedException.distance}</strong> from {selectedException.location}{" "}
                        geofence.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Device</p>
                        <div className="flex items-center gap-1 font-medium">
                          {selectedException.device === "web" ? (
                            <Monitor className="h-4 w-4" />
                          ) : (
                            <Smartphone className="h-4 w-4" />
                          )}
                          {selectedException.device === "web" ? "Web Browser" : "Mobile App"}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">GPS Accuracy</p>
                        <p className="font-medium">{selectedException.gpsAccuracy}</p>
                      </div>
                    </div>
                    {selectedException.note && (
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Employee Note</p>
                        <p className="text-sm bg-muted p-2 rounded">{selectedException.note}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                {selectedException.status === "open" && (
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove([selectedException.id])}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve as Valid Worked Time
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Punch Times
                    </Button>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={!rejectionReason}
                        onClick={() => handleReject(selectedException.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Punch
                      </Button>
                    </div>
                  </div>
                )}

                {selectedException.status !== "open" && (
                  <div className="flex items-center justify-center py-4">
                    {getStatusBadge(selectedException.status)}
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LocationExceptions;
