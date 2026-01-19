import { Users, CalendarDays, Gift, Clock, UserCheck, AlertTriangle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const whoIsOutToday = [
  { name: "Sarah Williams", avatar: "SW", type: "Vacation", until: "Oct 18" },
  { name: "Michael Lee", avatar: "ML", type: "Sick", until: "Today" },
];

const upcomingLeaves = [
  { name: "Emily Thompson", avatar: "ET", dates: "Oct 20-22", type: "Personal" },
  { name: "James Rodriguez", avatar: "JR", dates: "Oct 25-28", type: "Vacation" },
  { name: "David Park", avatar: "DP", dates: "Nov 1-3", type: "Conference" },
];

const birthdays = [
  { name: "Marcus Chen", avatar: "MC", date: "Oct 12" },
  { name: "Lisa Wang", avatar: "LW", date: "Oct 18" },
];

const workAnniversaries = [
  { name: "John Smith", avatar: "JS", date: "Oct 15", years: 3 },
  { name: "Anna Kim", avatar: "AK", date: "Oct 22", years: 5 },
];

const teamHoursSummary = {
  totalHours: 285,
  avgHours: 35.6,
  onTarget: 6,
  belowTarget: 2,
};

export function TeamOverviewSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Team Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Who's Out Today */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-destructive/10">
                <CalendarDays className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="text-sm font-semibold">Who's Out Today</h3>
            </div>
            <div className="space-y-2.5">
              {whoIsOutToday.map((person) => (
                <div key={person.name} className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-muted">
                      {person.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{person.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {person.type} • Until {person.until}
                    </p>
                  </div>
                </div>
              ))}
              {whoIsOutToday.length === 0 && (
                <p className="text-xs text-muted-foreground">Everyone is in today!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Leaves */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">Upcoming Leaves</h3>
            </div>
            <div className="space-y-2.5">
              {upcomingLeaves.slice(0, 3).map((leave) => (
                <div key={leave.name} className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-muted">
                      {leave.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{leave.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {leave.dates} • {leave.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Birthdays This Month */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-pink-500/10">
                <Gift className="h-4 w-4 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold">Birthdays This Month</h3>
            </div>
            <div className="space-y-2.5">
              {birthdays.map((person) => (
                <div key={person.name} className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                      {person.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{person.name}</p>
                    <p className="text-[10px] text-muted-foreground">🎂 {person.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Anniversaries This Month */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold">Anniversaries This Month</h3>
            </div>
            <div className="space-y-2.5">
              {workAnniversaries.map((person) => (
                <div key={person.name} className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      {person.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{person.name}</p>
                    <p className="text-[10px] text-muted-foreground">🎉 {person.date} • {person.years} yrs</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Hours Summary */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-success/10">
                <Clock className="h-4 w-4 text-success" />
              </div>
              <h3 className="text-sm font-semibold">Team Hours</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Hours</span>
                <span className="text-sm font-semibold">{teamHoursSummary.totalHours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Avg per Person</span>
                <span className="text-sm font-medium">{teamHoursSummary.avgHours}h</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30 px-1.5">
                  <UserCheck className="h-3 w-3 mr-0.5" />
                  {teamHoursSummary.onTarget} on target
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning-foreground border-warning/30 px-1.5">
                  <AlertTriangle className="h-3 w-3 mr-0.5" />
                  {teamHoursSummary.belowTarget} below
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
