import { FileText, CalendarDays, Users, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Sample counts - in real app, these would come from API
const pendingTimesheets = 3;
const pendingTimeOff = 4;

export function TeamApprovalsSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Team Approvals
        </h2>
      </div>

      {/* Two Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Timesheet Approvals Card */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/40 group"
          onClick={() => navigate("/time")}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Timesheets</p>
                  <p className="text-xs text-muted-foreground">Pending approval</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-blue-500/10 text-blue-600 border-0 text-lg font-semibold px-3 py-1"
              >
                {pendingTimesheets}
              </Badge>
            </div>
            <div className="mt-4 flex items-center text-xs text-primary font-medium group-hover:underline">
              Review timesheets
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Time Off Approvals Card */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/40 group"
          onClick={() => navigate("/time")}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10">
                  <CalendarDays className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Time Off</p>
                  <p className="text-xs text-muted-foreground">Pending approval</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-amber-500/10 text-amber-600 border-0 text-lg font-semibold px-3 py-1"
              >
                {pendingTimeOff}
              </Badge>
            </div>
            <div className="mt-4 flex items-center text-xs text-primary font-medium group-hover:underline">
              Review requests
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
