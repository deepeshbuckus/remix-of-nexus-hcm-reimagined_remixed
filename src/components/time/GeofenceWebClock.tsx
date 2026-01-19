import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  MapPin, 
  Play, 
  Square, 
  Coffee, 
  AlertTriangle, 
  XCircle,
  WifiOff,
  Navigation,
  CheckCircle2,
  Info,
  Loader2,
  Timer,
  Flag,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
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

type GeofenceStatus = 
  | "detecting" 
  | "inside" 
  | "outside-warn" 
  | "outside-block" 
  | "no-permission" 
  | "gps-error" 
  | "offline";

type ClockStatus = "clocked-out" | "clocked-in" | "on-break";
type PunchingState = "idle" | "punching" | "success";

interface GeofenceWebClockProps {
  onPunchIn?: (note?: string) => void;
  onPunchOut?: () => void;
  onBreakStart?: () => void;
  onBreakEnd?: () => void;
}

export const GeofenceWebClock = ({ 
  onPunchIn, 
  onPunchOut, 
  onBreakStart, 
  onBreakEnd 
}: GeofenceWebClockProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockStatus, setClockStatus] = useState<ClockStatus>("clocked-out");
  const [geofenceStatus, setGeofenceStatus] = useState<GeofenceStatus>("detecting");
  const [punchingState, setPunchingState] = useState<PunchingState>("idle");
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [locationName, setLocationName] = useState("Main Store");
  const [gpsAccuracy, setGpsAccuracy] = useState<"good" | "fair" | "poor">("good");
  const [note, setNote] = useState("");
  const [showPunches, setShowPunches] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Time update effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate geofence detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setGeofenceStatus("inside");
      setGpsAccuracy("good");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setGeofenceStatus("offline");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getElapsedTime = () => {
    if (!clockInTime) return "0h 0m";
    const diff = currentTime.getTime() - clockInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handlePunchIn = async () => {
    if (geofenceStatus === "outside-block") return;
    
    setPunchingState("punching");
    
    // Simulate brief processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setClockStatus("clocked-in");
    setClockInTime(new Date());
    setPunchingState("success");
    onPunchIn?.(note);
    
    const message = geofenceStatus === "outside-warn" 
      ? "Clocked in — flagged for review" 
      : geofenceStatus === "offline"
      ? "Clocked in — saved offline"
      : "You're on the clock!";
    
    toast({
      title: message,
      description: `Started at ${formatTime(new Date())} · ${locationName}`,
    });
    setNote("");
    
    // Reset punching state after animation
    setTimeout(() => setPunchingState("idle"), 1000);
  };

  const handlePunchOut = async () => {
    setPunchingState("punching");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const elapsed = getElapsedTime();
    setClockStatus("clocked-out");
    setClockInTime(null);
    setPunchingState("idle");
    onPunchOut?.();
    toast({
      title: "Clocked out",
      description: `Great work! You logged ${elapsed} today.`,
    });
  };

  const handleBreakStart = () => {
    setClockStatus("on-break");
    onBreakStart?.();
    toast({
      title: "Break started",
      description: "Take your time — you've earned it!",
    });
  };

  const handleBreakEnd = () => {
    setClockStatus("clocked-in");
    onBreakEnd?.();
    toast({
      title: "Welcome back!",
      description: "You're back on the clock.",
    });
  };

  const handleEnableLocation = () => {
    setGeofenceStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      () => setGeofenceStatus("inside"),
      () => setGeofenceStatus("no-permission")
    );
  };

  const handleRetryLocation = () => {
    setGeofenceStatus("detecting");
    setTimeout(() => setGeofenceStatus("inside"), 1500);
  };

  // Demo state switchers (for development)
  const demoStates: GeofenceStatus[] = [
    "inside", "outside-warn", "outside-block", "no-permission", "gps-error", "offline"
  ];

  const getStatusConfig = () => {
    switch (geofenceStatus) {
      case "detecting":
        return {
          chipColor: "bg-muted text-muted-foreground border border-border",
          chipText: "Detecting location...",
          icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
        };
      case "inside":
        return {
          chipColor: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
          chipText: "Inside work location",
          icon: <MapPin className="h-3.5 w-3.5" />,
        };
      case "outside-warn":
        return {
          chipColor: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
          chipText: "Outside work location",
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
        };
      case "outside-block":
        return {
          chipColor: "bg-destructive/10 text-destructive border border-destructive/20",
          chipText: "Punch blocked",
          icon: <XCircle className="h-3.5 w-3.5" />,
        };
      case "no-permission":
        return {
          chipColor: "bg-muted text-muted-foreground border border-border",
          chipText: "Location needed",
          icon: <Navigation className="h-3.5 w-3.5" />,
        };
      case "gps-error":
        return {
          chipColor: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
          chipText: "Can't confirm location",
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
        };
      case "offline":
        return {
          chipColor: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
          chipText: "Offline — will sync",
          icon: <WifiOff className="h-3.5 w-3.5" />,
        };
      default:
        return {
          chipColor: "bg-muted text-muted-foreground border border-border",
          chipText: "Unknown",
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const todayPunches = [
    { time: "08:03 AM", type: "Clock In", location: "Main Store", status: "verified" },
    { time: "12:00 PM", type: "Break Start", location: "Main Store", status: "verified" },
    { time: "12:32 PM", type: "Break End", location: "Main Store", status: "verified" },
  ];

  const getAccuracyLabel = () => {
    switch (gpsAccuracy) {
      case "good": return { text: "Good", class: "text-emerald-600 dark:text-emerald-400" };
      case "fair": return { text: "Fair", class: "text-amber-600 dark:text-amber-400" };
      case "poor": return { text: "Weak", class: "text-destructive" };
    }
  };

  const accuracyInfo = getAccuracyLabel();

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-4.5 w-4.5 text-primary" />
            </div>
            Web Clock
          </CardTitle>
          <motion.div
            key={geofenceStatus}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.chipColor}`}
          >
            {statusConfig.icon}
            {statusConfig.chipText}
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Detecting State */}
        {geofenceStatus === "detecting" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 space-y-4"
          >
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="text-center">
              <p className="font-medium">Finding your location...</p>
              <p className="text-sm text-muted-foreground mt-1">This usually takes a few seconds</p>
            </div>
          </motion.div>
        )}

        {/* No Permission State */}
        {geofenceStatus === "no-permission" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="bg-muted/50 rounded-xl p-6 text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Navigation className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">Location access needed</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  To use Web Clock, turn on location services. We only check your location when you punch — never in between.
                </p>
              </div>
              <Button onClick={handleEnableLocation} size="lg" className="mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                Enable Location
              </Button>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                We collect your location only at punch time to verify you're at an approved work site. Your location is never tracked between punches.
              </p>
            </div>
          </motion.div>
        )}

        {/* GPS Error State */}
        {geofenceStatus === "gps-error" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">We can't confirm your location</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Your GPS signal is weak. Try moving closer to a window or turning on Wi-Fi for better accuracy.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={handleRetryLocation} className="flex-1">
                  Try Again
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => { setGeofenceStatus("outside-warn"); }}
                  className="flex-1"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Punch & Flag
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Outside Geofence - Block State */}
        {geofenceStatus === "outside-block" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-destructive">You can't punch from here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your company requires punching from an approved work location. Head to your work site or contact your manager if you need help.
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline"
                disabled
                className="w-full opacity-60"
              >
                <Play className="h-4 w-4 mr-2" />
                Punch In (unavailable here)
              </Button>
              
              <button className="flex items-center gap-1 text-xs text-primary hover:underline mx-auto">
                <ExternalLink className="h-3 w-3" />
                View approved locations
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Clock Interface - Inside, Outside-Warn, or Offline */}
        {(geofenceStatus === "inside" || geofenceStatus === "outside-warn" || geofenceStatus === "offline") && (
          <>
            {/* Clocked Out State */}
            {clockStatus === "clocked-out" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {/* Status Message */}
                <div className="space-y-1">
                  <p className="font-semibold text-lg">You're currently clocked out</p>
                  <p className="text-sm text-muted-foreground">
                    When you're ready, punch in to start your shift.
                  </p>
                </div>

                {/* Location & Accuracy Row */}
                <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    You're at <span className="font-medium text-foreground">{locationName}</span>
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`text-sm font-medium ${accuracyInfo.class}`}>
                          {accuracyInfo.text} accuracy
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>GPS accuracy: ±{gpsAccuracy === "good" ? "10" : gpsAccuracy === "fair" ? "50" : "100"}m</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Outside Geofence Warning */}
                <AnimatePresence>
                  {geofenceStatus === "outside-warn" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <Flag className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                            You're outside your work location
                          </p>
                          <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">
                            Your punch will be saved but flagged for manager review. If you're working off-site, add a note below.
                          </p>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Add a note for your manager (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[70px] text-sm bg-background resize-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Offline Notice */}
                <AnimatePresence>
                  {geofenceStatus === "offline" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-start gap-3"
                    >
                      <WifiOff className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                          You're offline
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                          No worries — we'll save your punch locally and sync it when you're back online.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Punch In Button */}
                <div className="space-y-2">
                  <Button 
                    size="lg" 
                    onClick={handlePunchIn}
                    disabled={punchingState === "punching"}
                    className="w-full h-14 text-base font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    <AnimatePresence mode="wait">
                      {punchingState === "punching" ? (
                        <motion.div
                          key="punching"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Punching in...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="ready"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          {geofenceStatus === "outside-warn" ? (
                            <>
                              <Flag className="h-5 w-5" />
                              Punch In & Flag for Review
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5" />
                              Punch In
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We'll record the server time and your location for accuracy.
                  </p>
                </div>

                {/* View Punches Link */}
                <Collapsible open={showPunches} onOpenChange={setShowPunches}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors mx-auto">
                      <span>See today's punches</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showPunches ? "rotate-180" : ""}`} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 bg-muted/30 rounded-lg p-3 space-y-1"
                    >
                      {todayPunches.length > 0 ? todayPunches.map((punch, i) => (
                        <div key={i} className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-medium">{punch.time}</span>
                            <Badge variant="secondary" className="text-xs font-normal">{punch.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{punch.location}</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No punches yet today</p>
                      )}
                    </motion.div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            )}

            {/* Clocked In State */}
            {clockStatus === "clocked-in" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {/* Success Banner */}
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0"
                      >
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-lg text-emerald-800 dark:text-emerald-200">
                          You're on the clock
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-0.5">
                          Since {clockInTime && formatTime(clockInTime)} · {locationName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-2xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                        <Timer className="h-5 w-5" />
                        {getElapsedTime()}
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">worked so far</p>
                    </div>
                  </div>
                </motion.div>

                {/* Accuracy Info */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Location verified · {accuracyInfo.text} accuracy</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleBreakStart}
                    className="h-12 font-medium"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Start Break
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handlePunchOut}
                    disabled={punchingState === "punching"}
                    className="h-12 font-medium"
                  >
                    {punchingState === "punching" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Square className="h-4 w-4 mr-2" />
                    )}
                    Punch Out
                  </Button>
                </div>

                {/* View Punches Link */}
                <button 
                  onClick={() => setShowPunches(!showPunches)}
                  className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors mx-auto"
                >
                  <span>See today's punches</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showPunches ? "rotate-180" : ""}`} />
                </button>
              </motion.div>
            )}

            {/* On Break State */}
            {clockStatus === "on-break" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                      <Coffee className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-amber-800 dark:text-amber-200">
                        Enjoy your break!
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                        Take your time — tap below when you're ready to continue.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleBreakEnd}
                  size="lg"
                  className="w-full h-14 text-base font-semibold"
                >
                  <Play className="h-5 w-5 mr-2" />
                  End Break & Continue
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Privacy & Trust Row */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-start gap-2.5 p-3 bg-muted/30 rounded-lg">
            <Info className="h-4 w-4 text-primary/70 mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span>We only use your location when you punch, to help keep your hours accurate. </span>
              <button className="text-primary hover:underline font-medium">Learn more</button>
            </div>
          </div>
        </div>

        {/* Demo State Switcher - Remove in production */}
        <div className="pt-3 border-t border-dashed border-border/50">
          <p className="text-xs text-muted-foreground mb-2 font-medium">🧪 Demo: Switch states</p>
          <div className="flex flex-wrap gap-1.5">
            {demoStates.map((state) => (
              <Button
                key={state}
                variant={geofenceStatus === state ? "default" : "outline"}
                size="sm"
                className="text-xs h-7 px-2.5"
                onClick={() => {
                  setGeofenceStatus(state);
                  if (state !== "inside" && state !== "outside-warn" && state !== "offline") {
                    setClockStatus("clocked-out");
                  }
                }}
              >
                {state}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
