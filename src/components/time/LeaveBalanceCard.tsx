import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Umbrella, Heart, Home, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LeaveBalance {
  total: number;
  used: number;
  pending: number;
}

interface LeaveBalanceCardProps {
  type: string;
  balance: LeaveBalance;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const leaveTypeIcons: Record<string, typeof Umbrella> = {
  Vacation: Umbrella,
  "Sick Leave": Heart,
  Personal: Home,
};

const leaveTypeColors: Record<string, { bg: string; icon: string; border: string }> = {
  Vacation: { bg: "bg-blue-50 dark:bg-blue-950/30", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  "Sick Leave": { bg: "bg-purple-50 dark:bg-purple-950/30", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  Personal: { bg: "bg-orange-50 dark:bg-orange-950/30", icon: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
};

const leaveTypeInfo: Record<string, { accrualRate: string; carryOver: string }> = {
  Vacation: { accrualRate: "Accrues 1.67 days/month", carryOver: "Max 5 days carry-over" },
  "Sick Leave": { accrualRate: "Accrues 0.83 days/month", carryOver: "No carry-over limit" },
  Personal: { accrualRate: "Accrues 0.42 days/month", carryOver: "No carry-over" },
};

export function LeaveBalanceCard({ type, balance, isSelected, onClick, compact }: LeaveBalanceCardProps) {
  const Icon = leaveTypeIcons[type] || Umbrella;
  const colors = leaveTypeColors[type] || leaveTypeColors.Vacation;
  const info = leaveTypeInfo[type] || leaveTypeInfo.Vacation;
  const available = balance.total - balance.used - balance.pending;
  const percentageRemaining = (available / balance.total) * 100;
  const isLowBalance = available < 2;

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colors.bg, "border", colors.border)}>
              <Icon className={cn("h-4 w-4", colors.icon)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{type}</span>
                <span className="font-bold text-primary">{available} days</span>
              </div>
              <Progress value={percentageRemaining} className="h-1.5 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "relative transition-all duration-300 overflow-hidden border-2",
          onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-1",
          isSelected && "ring-4 ring-primary/30 shadow-xl scale-105 border-primary",
          !isSelected && onClick && "hover:border-primary/50"
        )}
        onClick={onClick}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-xl", colors.bg, "border", colors.border)}>
                <Icon className={cn("h-6 w-6", colors.icon)} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{type}</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">{type} Details</p>
                        <p>{info.accrualRate}</p>
                        <p>{info.carryOver}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {isLowBalance && (
                  <Badge variant="warning" className="mt-1 text-xs gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Only {available} days remaining
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{balance.total} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Used</span>
              <span className="font-semibold">{balance.used} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-semibold">{balance.pending} days</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-primary font-medium">Available</span>
              <span className="font-bold text-primary">{available} days</span>
            </div>
            
            <div className="space-y-2 pt-2">
              <Progress value={percentageRemaining} className="h-2.5" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {available} available • {balance.pending} pending • {balance.used} used
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
