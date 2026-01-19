import { FileText, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { CustomizableQuickActions } from "@/components/CustomizableQuickActions";
import { TaskTile } from "@/components/TaskTile";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section with Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-5"
        >
          {/* Greeting */}
          <div className="py-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-2xl md:text-3xl font-bold tracking-tight"
            >
              Welcome back, Anoushka 👋
            </motion.h1>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-border via-border/60 to-transparent" />
            
          {/* Quick Actions Module */}
          <CustomizableQuickActions />
        </motion.div>

        {/* My Week at a Glance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4">My Week at a Glance</h2>
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Hours This Week</p>
                  <p className="text-2xl font-bold">32.5</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +2.5h from last week
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Approval</p>
                  <p className="text-2xl font-bold">8.0</p>
                  <p className="text-xs text-muted-foreground">Hours awaiting review</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Leave Balance</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Days remaining</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Next Payday</p>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Days away</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Upcoming Leave</p>
                  <p className="text-2xl font-bold">Oct 15</p>
                  <p className="text-xs text-muted-foreground">3-day vacation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Tasks & Approvals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <p className="text-sm text-muted-foreground">Items requiring your attention</p>
            </div>
            <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30 px-2.5 py-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              2 Pending
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <TaskTile
              title="Timesheet - Week of Oct 1-7"
              dueDate="Due Today • 5 PM"
              priority="critical"
              icon={<FileText className="h-5 w-5" />}
              primaryAction={{
                label: "Submit",
                onClick: () => toast({ title: "Viewed", description: "Opening timesheet details." }),
              }}
              secondaryActions={[
                { label: "Edit", onClick: () => toast({ title: "Edit", description: "Opening timesheet for editing." }) },
                { label: "View Details", onClick: () => toast({ title: "Details", description: "Opening full details." }) },
              ]}
            />

            <TaskTile
              title="Time Off Request"
              dueDate="Due Fri, Oct 11"
              priority="high"
              icon={<Calendar className="h-5 w-5" />}
              primaryAction={{
                label: "View",
                onClick: () => toast({ title: "Viewed", description: "Opening time-off request details." }),
              }}
              secondaryActions={[
                { label: "Withdraw", onClick: () => toast({ title: "Withdraw", description: "Withdrawing time-off request.", variant: "destructive" }) },
              ]}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Index;
