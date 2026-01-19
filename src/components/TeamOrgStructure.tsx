import { useState } from "react";
import { 
  MessageSquare, 
  User, 
  CheckSquare, 
  Palmtree, 
  Home, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Search
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status?: "on-leave" | "remote" | "new-hire" | "in-office";
  pendingTasks?: number;
  badge?: "new-hire" | "probation" | "high-performer";
}

interface TeamOrgStructureProps {
  className?: string;
}

const manager: Employee = {
  id: "m1",
  name: "Anoushka Sharma",
  role: "Engineering Manager",
  avatar: "/placeholder.svg",
  status: "in-office",
};

const directReports: Employee[] = [
  { id: "e1", name: "Priya Patel", role: "Senior Developer", status: "in-office", pendingTasks: 2 },
  { id: "e2", name: "James Chen", role: "UX Designer", status: "remote", badge: "high-performer" },
  { id: "e3", name: "Sarah Miller", role: "Frontend Developer", status: "on-leave" },
  { id: "e4", name: "Alex Johnson", role: "Backend Developer", status: "in-office", pendingTasks: 1 },
  { id: "e5", name: "Maria Garcia", role: "QA Engineer", status: "remote", badge: "new-hire" },
  { id: "e6", name: "David Kim", role: "DevOps Engineer", status: "in-office" },
  { id: "e7", name: "Emily Wong", role: "Product Analyst", status: "on-leave" },
  { id: "e8", name: "Michael Brown", role: "Junior Developer", status: "in-office", badge: "probation" },
];

const statusConfig = {
  "on-leave": { label: "On Leave", color: "bg-amber-500", icon: Palmtree },
  "remote": { label: "Remote", color: "bg-emerald-500", icon: Home },
  "new-hire": { label: "New Hire", color: "bg-primary", icon: Sparkles },
  "in-office": { label: "In Office", color: "bg-muted-foreground/40", icon: null },
};

const badgeConfig = {
  "new-hire": { label: "New Hire", variant: "default" as const },
  "probation": { label: "Probation", variant: "secondary" as const },
  "high-performer": { label: "Top Performer", variant: "default" as const },
};

export const TeamOrgStructure = ({ className }: TeamOrgStructureProps) => {
  const [viewMode, setViewMode] = useState<"org" | "list">("org");
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredReports = directReports.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action: string, employeeName: string) => {
    toast({
      title: action,
      description: `Opening ${action.toLowerCase()} for ${employeeName}`,
    });
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className={cn("space-y-3", className)}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold">Team Structure</h2>
            <p className="text-xs text-muted-foreground">Your direct reports</p>
          </div>
          <div className="flex items-center gap-1.5">
            {/* View Toggle */}
            <div className="flex items-center bg-muted rounded-md p-0.5">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-1.5 rounded",
                  viewMode === "org" && "bg-background shadow-sm"
                )}
                onClick={() => setViewMode("org")}
              >
                <LayoutGrid className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-1.5 rounded",
                  viewMode === "list" && "bg-background shadow-sm"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
            {/* Expand/Collapse */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="relative max-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-sm bg-background"
                />
              </div>

              {/* Org Chart View */}
              {viewMode === "org" ? (
                <div className="flex flex-col items-center">
                  {/* Manager Card */}
                  <ManagerCard manager={manager} teamSize={directReports.length} />
                  
                  {/* Connector Line */}
                  <div className="w-px h-4 bg-border hidden md:block" />
                  <div className="hidden md:block w-full max-w-4xl">
                    <div className="h-px bg-border" />
                  </div>

                  {/* Direct Reports Grid - More compact with more columns */}
                  <div className="mt-3 md:mt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 w-full">
                    {filteredReports.map((employee, index) => (
                      <motion.div
                        key={employee.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                      >
                        {/* Vertical connector for desktop */}
                        <div className="hidden lg:flex justify-center mb-1">
                          <div className="w-px h-3 bg-border" />
                        </div>
                        <EmployeeCard
                          employee={employee}
                          onAction={handleAction}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="space-y-1">
                  {/* Manager in list */}
                  <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 ring-1 ring-primary/20">
                        <AvatarImage src={manager.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                          {manager.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs">{manager.name}</p>
                        <p className="text-[10px] text-muted-foreground">{manager.role} • You</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {directReports.length} reports
                      </Badge>
                    </div>
                  </div>

                  {/* Employees list */}
                  {filteredReports.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                    >
                      <EmployeeListItem
                        employee={employee}
                        onAction={handleAction}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredReports.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-4">
                  No team members found matching "{searchQuery}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  );
};

const ManagerCard = ({ manager, teamSize }: { manager: Employee; teamSize: number }) => (
  <div className="flex flex-col items-center text-center mb-1">
    <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-1 ring-offset-background">
      <AvatarImage src={manager.avatar} />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
        {manager.name.split(" ").map(n => n[0]).join("")}
      </AvatarFallback>
    </Avatar>
    <p className="font-semibold text-xs mt-1.5">{manager.name}</p>
    <p className="text-[10px] text-muted-foreground">{manager.role}</p>
    <p className="text-[10px] text-primary font-medium">{teamSize} direct reports</p>
  </div>
);

const EmployeeCard = ({
  employee,
  onAction,
}: {
  employee: Employee;
  onAction: (action: string, name: string) => void;
}) => {
  const status = employee.status ? statusConfig[employee.status] : null;
  const badge = employee.badge ? badgeConfig[employee.badge] : null;

  return (
    <div className="group relative bg-card rounded-lg border border-border/50 p-2 shadow-sm hover:shadow-md hover:border-border transition-all duration-200 h-[120px] w-full flex flex-col">
      {/* Status indicator dot */}
      {status && status.color !== "bg-muted-foreground/40" && (
        <div className={cn("absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full", status.color)} />
      )}

      <div className="flex flex-col items-center text-center gap-1 flex-1">
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback className="bg-muted text-muted-foreground font-medium text-[10px]">
              {employee.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          {/* Status icon overlay */}
          {status && status.icon && (
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full flex items-center justify-center",
              status.color
            )}>
              <status.icon className="h-2 w-2 text-white" />
            </div>
          )}
        </div>

        <div className="space-y-0 flex-shrink-0">
          <p className="font-medium text-[11px] leading-tight truncate max-w-full">{employee.name.split(" ")[0]}</p>
          <p className="text-[9px] text-muted-foreground leading-tight truncate max-w-full">{employee.role}</p>
        </div>

        <div className="h-4 flex items-center flex-shrink-0">
          {badge && (
            <Badge 
              variant={badge.variant} 
              className={cn(
                "text-[8px] px-1 py-0 h-3",
                badge.variant === "default" && employee.badge === "high-performer" && "bg-emerald-500/10 text-emerald-600 border-emerald-200"
              )}
            >
              {badge.label}
            </Badge>
          )}
        </div>

        {/* Quick Actions - show on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={() => onAction("Message", employee.name)}
              >
                <MessageSquare className="h-2.5 w-2.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Message</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={() => onAction("Profile", employee.name)}
              >
                <User className="h-2.5 w-2.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Profile</TooltipContent>
          </Tooltip>
          {employee.pendingTasks && employee.pendingTasks > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full relative"
                  onClick={() => onAction("Approvals", employee.name)}
                >
                  <CheckSquare className="h-2.5 w-2.5" />
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-destructive text-destructive-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
                    {employee.pendingTasks}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{employee.pendingTasks} pending approvals</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

const EmployeeListItem = ({
  employee,
  onAction,
}: {
  employee: Employee;
  onAction: (action: string, name: string) => void;
}) => {
  const status = employee.status ? statusConfig[employee.status] : null;
  const badge = employee.badge ? badgeConfig[employee.badge] : null;

  return (
    <div className="group flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors">
      <div className="relative">
        <Avatar className="h-7 w-7">
          <AvatarImage src={employee.avatar} />
          <AvatarFallback className="bg-muted text-muted-foreground font-medium text-[10px]">
            {employee.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        {status && status.icon && (
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full flex items-center justify-center",
            status.color
          )}>
            <status.icon className="h-1.5 w-1.5 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-xs truncate">{employee.name}</p>
          {badge && (
            <Badge 
              variant={badge.variant}
              className={cn(
                "text-[8px] px-1 py-0 h-3",
                badge.variant === "default" && employee.badge === "high-performer" && "bg-emerald-500/10 text-emerald-600 border-emerald-200"
              )}
            >
              {badge.label}
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{employee.role}</p>
      </div>

      {status && (
        <span className="text-[10px] text-muted-foreground hidden sm:block">
          {status.label}
        </span>
      )}

      {/* Quick Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onAction("Message", employee.name)}
        >
          <MessageSquare className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onAction("Profile", employee.name)}
        >
          <User className="h-3 w-3" />
        </Button>
        {employee.pendingTasks && employee.pendingTasks > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 relative"
            onClick={() => onAction("Approvals", employee.name)}
          >
            <CheckSquare className="h-3 w-3" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-destructive text-destructive-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
              {employee.pendingTasks}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeamOrgStructure;
