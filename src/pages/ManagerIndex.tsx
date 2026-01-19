import { FileText, TrendingUp, AlertCircle, Calendar, Users } from "lucide-react";
import { ManagerQuickActions } from "@/components/ManagerQuickActions";
import { TaskTile } from "@/components/TaskTile";
import { TeamApprovalsSection } from "@/components/TeamApprovalsSection";
import { TeamOverviewSection } from "@/components/TeamOverviewSection";
import { TeamOrgStructure } from "@/components/TeamOrgStructure";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const ManagerIndex = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section with Manager Context */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-5"
        >
          {/* Greeting with Manager Label */}
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
          <ManagerQuickActions />
        </motion.div>

        {/* My Week at a Glance - Manager Edition */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4">My Week at a Glance</h2>
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Metrics */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    Team (8 Direct Reports)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Hours Pending</p>
                      <p className="text-xl font-bold text-warning">24.5</p>
                      <p className="text-xs text-muted-foreground">to approve</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">PTO Requests</p>
                      <p className="text-xl font-bold text-primary">3</p>
                      <p className="text-xs text-muted-foreground">pending</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-xl font-bold text-destructive">1</p>
                      <p className="text-xs text-muted-foreground">alert</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Out Today</p>
                      <p className="text-xl font-bold">2</p>
                      <p className="text-xs text-muted-foreground">people</p>
                    </div>
                  </div>
                </div>

                {/* Personal Metrics */}
                <div className="space-y-3 lg:border-l lg:pl-6 border-border/40">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Personal</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Hours This Week</p>
                      <p className="text-xl font-bold">32.5</p>
                      <p className="text-xs text-success flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +2.5h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">My Pending</p>
                      <p className="text-xl font-bold">2</p>
                      <p className="text-xs text-muted-foreground">tasks</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Leave Balance</p>
                      <p className="text-xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Next Payday</p>
                      <p className="text-xl font-bold">5</p>
                      <p className="text-xs text-muted-foreground">days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Approvals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <TeamApprovalsSection />
        </motion.div>

        {/* Team Overview / Insights */}
        <TeamOverviewSection />

        {/* Team Org Structure */}
        <TeamOrgStructure />

        {/* My Tasks & Approvals (Employee Role) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <p className="text-sm text-muted-foreground">Your personal items</p>
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

export default ManagerIndex;
