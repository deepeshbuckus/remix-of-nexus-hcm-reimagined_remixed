import { AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PendingTaskCardProps {
  title: string;
  action: string;
  dueDate: string;
  priority?: "high" | "medium" | "low";
  onApprove?: () => void;
  onReject?: () => void;
}

export function PendingTaskCard({ title, action, dueDate, priority = "medium", onApprove, onReject }: PendingTaskCardProps) {
  const priorityVariants = {
    high: "destructive" as const,
    medium: "warning" as const,
    low: "muted" as const,
  };

  const iconColors = {
    high: "text-destructive",
    medium: "text-warning",
    low: "text-muted-foreground",
  };

  const iconBgColors = {
    high: "bg-destructive/10",
    medium: "bg-warning/10",
    low: "bg-muted/10",
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${iconBgColors[priority]} mt-1`}>
            <AlertCircle className={`h-5 w-5 ${iconColors[priority]}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm leading-relaxed">{title}</h4>
              <Badge variant={priorityVariants[priority]}>
                {priority}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{action}</p>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground leading-relaxed">
                <Clock className="h-4 w-4" />
                <span>Due: {dueDate}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onReject}>
                  Reject
                </Button>
                <Button size="sm" onClick={onApprove}>
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
