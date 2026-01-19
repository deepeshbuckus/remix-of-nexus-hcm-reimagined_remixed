import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Check, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "critical" | "high" | "medium" | "low";

interface TeamTaskTileProps {
  employeeName: string;
  employeeAvatar: string;
  taskType: string;
  title: string;
  subtitle: string;
  dueDate: string;
  priority: Priority;
  icon: ReactNode;
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
}

const priorityDot: Record<Priority, string> = {
  critical: "bg-destructive",
  high: "bg-yellow-500",
  medium: "bg-orange-400",
  low: "bg-muted-foreground/40",
};

export function TeamTaskTile({
  employeeName,
  employeeAvatar,
  taskType,
  title,
  subtitle,
  dueDate,
  priority,
  icon,
  onApprove,
  onReject,
  onView,
}: TeamTaskTileProps) {
  return (
    <div 
      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border/60 bg-background hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer"
      onClick={onView}
    >
      {/* Avatar with urgency dot */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
            {employeeAvatar}
          </AvatarFallback>
        </Avatar>
        <span 
          className={cn("absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background", priorityDot[priority])}
          title={`${priority} priority`}
        />
      </div>

      {/* Content - Name, Task Type Icon Chip, Title, Date */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{employeeName}</span>
          <div className="flex-shrink-0 p-1 rounded bg-muted/60 text-muted-foreground [&>svg]:h-3 [&>svg]:w-3">
            {icon}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80 truncate">{title}</span>
          <span className="text-muted-foreground/60">·</span>
          <span className="truncate">{dueDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          className="h-7 px-2.5 text-xs bg-primary hover:bg-primary/90"
          onClick={onApprove}
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          Approve
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-60 hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={onReject} className="text-destructive focus:text-destructive">
              <X className="h-4 w-4 mr-2" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onView}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
