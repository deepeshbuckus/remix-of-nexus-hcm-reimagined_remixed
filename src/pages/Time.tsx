import { Calendar, Plane, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timesheet } from "@/components/time/Timesheet";
import { UnifiedTimeAway } from "@/components/time/UnifiedTimeAway";
import { ManagerTimesheetSection } from "@/components/time/ManagerTimesheetSection";
import { useView } from "@/contexts/ViewContext";
import { Badge } from "@/components/ui/badge";

const Time = () => {
  const { activeView } = useView();
  const isManager = activeView === "manager";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isManager ? "Time Management" : "Time Management"}
        </h1>
        <p className="text-muted-foreground">
          {isManager 
            ? "Track your time, manage team timesheets, and handle time off requests" 
            : "Track your time, manage timesheets, and request time off"
          }
        </p>
      </div>

      <Tabs defaultValue={isManager ? "team-timesheet" : "timesheet"} className="w-full">
        <TabsList className={`grid w-full ${isManager ? "grid-cols-3" : "grid-cols-2"}`}>
          {isManager && (
            <TabsTrigger value="team-timesheet" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Team Timesheets</span>
              <span className="sm:hidden">Team</span>
              <Badge variant="warning" className="ml-1 h-5 px-1.5 text-xs">3</Badge>
            </TabsTrigger>
          )}
          <TabsTrigger value="timesheet" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">My Timesheet</span>
            <span className="sm:hidden">Timesheet</span>
          </TabsTrigger>
          <TabsTrigger value="timeaway" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Time Away</span>
            <span className="sm:hidden">Leave</span>
          </TabsTrigger>
        </TabsList>

        {isManager && (
          <TabsContent value="team-timesheet" className="mt-6">
            <ManagerTimesheetSection />
          </TabsContent>
        )}

        <TabsContent value="timesheet" className="mt-6">
          <Timesheet />
        </TabsContent>

        <TabsContent value="timeaway" className="mt-6">
          <UnifiedTimeAway />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Time;
