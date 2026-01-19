import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Activity {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  description: string;
  time: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "success",
    title: "Timesheet Approved",
    description: "Your timesheet for week ending 23/06/2025 has been approved.",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "info",
    title: "New Company Policy",
    description: "Updated remote work policy is now available in the documents section.",
    time: "1 day ago",
  },
  {
    id: "3",
    type: "warning",
    title: "Pending Review",
    description: "Your leave request is awaiting manager approval.",
    time: "2 days ago",
  },
];

export function ActivityFeed() {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "info":
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return "success" as const;
      case "warning":
        return "warning" as const;
      case "info":
        return "muted" as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
            <div className="mt-1">{getIcon(activity.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm leading-relaxed">{activity.title}</h4>
                <Badge variant={getBadgeVariant(activity.type)} className="shrink-0 text-xs">
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground leading-relaxed">
                <Clock className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
