import { AlertCircle, Clock, CalendarOff, FileText, CalendarDays, Users } from "lucide-react";
import { motion } from "framer-motion";

interface SnapshotMetric {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  urgent?: boolean;
  subtext?: string;
}

const snapshotMetrics: SnapshotMetric[] = [
  { label: "Urgent Approvals", value: 3, icon: <AlertCircle className="h-4 w-4" />, urgent: true, subtext: "due today" },
  { label: "Out Today", value: 2, icon: <CalendarOff className="h-4 w-4" />, subtext: "team members" },
  { label: "Pending Timesheets", value: 4, icon: <Clock className="h-4 w-4" />, subtext: "to review" },
  { label: "Pending Documents", value: 1, icon: <FileText className="h-4 w-4" />, subtext: "awaiting" },
  { label: "Upcoming Leave", value: 3, icon: <CalendarDays className="h-4 w-4" />, subtext: "this week" },
];

export function ManagerSnapshot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Your Team Needs Your Attention</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {snapshotMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-background/80 backdrop-blur-sm ${
              metric.urgent 
                ? "border-destructive/30 bg-destructive/5" 
                : "border-border/50"
            }`}
          >
            <div className={`p-1.5 rounded-md ${
              metric.urgent 
                ? "bg-destructive/10 text-destructive" 
                : "bg-muted text-muted-foreground"
            }`}>
              {metric.icon}
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg font-bold ${
                  metric.urgent ? "text-destructive" : "text-foreground"
                }`}>
                  {metric.value}
                </span>
                <span className="text-xs text-muted-foreground">{metric.subtext}</span>
              </div>
              <span className="text-xs text-muted-foreground/80">{metric.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
