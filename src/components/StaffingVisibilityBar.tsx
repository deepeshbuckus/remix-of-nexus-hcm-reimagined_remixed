import { CalendarOff, CalendarClock, AlertTriangle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StaffingItem {
  type: "today" | "upcoming" | "conflict";
  label: string;
  count: number;
  names?: string[];
}

const staffingData: StaffingItem[] = [
  { type: "today", label: "Out Today", count: 2, names: ["Sarah W.", "James R."] },
  { type: "upcoming", label: "Out This Week", count: 3, names: ["Emily T.", "David P.", "Marcus C."] },
  { type: "conflict", label: "Schedule Conflicts", count: 1, names: ["Oct 15 - 3 overlapping requests"] },
];

const iconMap = {
  today: <CalendarOff className="h-3.5 w-3.5" />,
  upcoming: <CalendarClock className="h-3.5 w-3.5" />,
  conflict: <AlertTriangle className="h-3.5 w-3.5" />,
};

const colorMap = {
  today: "text-primary bg-primary/10",
  upcoming: "text-muted-foreground bg-muted",
  conflict: "text-warning bg-warning/10",
};

export function StaffingVisibilityBar() {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/40"
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
        Staffing
      </span>
      
      <div className="h-4 w-px bg-border/60" />
      
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {staffingData.map((item) => (
          <Button
            key={item.type}
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 gap-1.5 text-xs hover:bg-background/80"
            onClick={() => toast({ 
              title: item.label, 
              description: item.names?.join(", ") || "No items" 
            })}
          >
            <span className={`p-1 rounded ${colorMap[item.type]}`}>
              {iconMap[item.type]}
            </span>
            <span className="font-medium">{item.count}</span>
            <span className="text-muted-foreground hidden sm:inline">{item.label}</span>
          </Button>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
        onClick={() => toast({ title: "Team Calendar", description: "Opening team calendar view..." })}
      >
        View Calendar
        <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
      </Button>
    </motion.div>
  );
}
