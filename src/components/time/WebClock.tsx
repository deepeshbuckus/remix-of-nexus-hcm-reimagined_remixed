import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WebClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleClockIn = () => {
    setIsClockedIn(true);
    setClockInTime(new Date());
    toast({
      title: "Clocked In",
      description: `You clocked in at ${formatTime(new Date())}`,
    });
  };

  const handleClockOut = () => {
    if (clockInTime) {
      const duration = Math.floor((new Date().getTime() - clockInTime.getTime()) / 1000 / 60);
      toast({
        title: "Clocked Out",
        description: `You worked for ${Math.floor(duration / 60)}h ${duration % 60}m`,
      });
    }
    setIsClockedIn(false);
    setClockInTime(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Clock In/Out
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          <div className="text-lg text-muted-foreground">
            {formatDate(currentTime)}
          </div>
        </div>

        {isClockedIn && clockInTime && (
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Clocked in at</p>
            <p className="text-2xl font-semibold text-primary">{formatTime(clockInTime)}</p>
          </div>
        )}

        <div className="flex justify-center">
          {!isClockedIn ? (
            <Button 
              size="lg" 
              onClick={handleClockIn}
              className="w-full max-w-xs"
            >
              <Play className="h-5 w-5 mr-2" />
              Clock In
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="destructive"
              onClick={handleClockOut}
              className="w-full max-w-xs"
            >
              <Square className="h-5 w-5 mr-2" />
              Clock Out
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
