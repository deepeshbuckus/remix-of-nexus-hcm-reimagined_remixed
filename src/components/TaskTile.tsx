import { MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Priority = "critical" | "high" | "medium" | "low";

interface TaskTileProps {
  title: string;
  dueDate: string;
  priority: Priority;
  icon: React.ReactNode;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryActions?: {
    label: string;
    onClick: () => void;
  }[];
  onClick?: () => void;
}

const priorityConfig = {
  critical: { chip: "🔴", bg: "bg-destructive/5" },
  high: { chip: "🟡", bg: "bg-warning/5" },
  medium: { chip: "🔵", bg: "bg-primary/5" },
  low: { chip: "⚪", bg: "bg-muted/50" },
};

export function TaskTile({
  title,
  dueDate,
  priority,
  icon,
  primaryAction,
  secondaryActions,
  onClick,
}: TaskTileProps) {
  const config = priorityConfig[priority];

  return (
    <Card
      className={cn(
        "group relative p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        "rounded-xl border border-border/50",
        config.bg
      )}
      onClick={onClick}
    >
      {/* Priority Indicator - Top Left */}
      <span className="absolute top-2.5 left-2.5 text-xs">{config.chip}</span>

      {/* Kebab Menu - Top Right */}
      {secondaryActions && secondaryActions.length > 0 && (
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              {secondaryActions.map((action, index) => (
                <DropdownMenuItem key={index} onClick={action.onClick}>
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Centered Icon */}
      <div className="flex justify-center pt-2 pb-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-center leading-tight line-clamp-2 mb-1">
        {title}
      </h3>

      {/* Due Date */}
      <p className="text-[11px] text-muted-foreground text-center mb-3">
        {dueDate}
      </p>

      {/* Primary Action */}
      <div onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="secondary"
          className="w-full h-7 text-xs font-medium"
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </Button>
      </div>
    </Card>
  );
}
