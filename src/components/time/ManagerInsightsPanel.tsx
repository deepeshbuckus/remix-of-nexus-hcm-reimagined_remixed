import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TeamLeaveBalancesTable } from "./TeamLeaveBalancesTable";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  Users,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock analytics data
const leaveTypeFrequency = [
  { type: "Vacation", count: 45, percentage: 60 },
  { type: "Sick Leave", count: 20, percentage: 27 },
  { type: "Personal", count: 10, percentage: 13 },
];

const monthlyTrends = [
  { month: "Jul", vacation: 12, sick: 5, personal: 3 },
  { month: "Aug", vacation: 15, sick: 4, personal: 2 },
  { month: "Sep", vacation: 10, sick: 8, personal: 4 },
  { month: "Oct", vacation: 14, sick: 6, personal: 3 },
  { month: "Nov", vacation: 18, sick: 3, personal: 5 },
  { month: "Dec", vacation: 20, sick: 4, personal: 2 },
];

const balanceForecast = [
  { quarter: "Q1 2025", available: 180, projected: 160 },
  { quarter: "Q2 2025", available: 160, projected: 140 },
  { quarter: "Q3 2025", available: 140, projected: 125 },
  { quarter: "Q4 2025", available: 125, projected: 110 },
];

const weekdayHeatmap = [
  { day: "Mon", absences: 8, risk: "low" },
  { day: "Tue", absences: 6, risk: "low" },
  { day: "Wed", absences: 5, risk: "low" },
  { day: "Thu", absences: 7, risk: "low" },
  { day: "Fri", absences: 15, risk: "high" },
];

const atRiskScenarios = [
  {
    id: 1,
    title: "High Friday Absences",
    description: "89% higher absence rate on Fridays compared to other days",
    severity: "high",
    metric: "+89%",
  },
  {
    id: 2,
    title: "Low Sick Leave Balance",
    description: "3 team members have less than 2 days of sick leave remaining",
    severity: "medium",
    metric: "3 employees",
  },
  {
    id: 3,
    title: "Holiday Coverage Gap",
    description: "5 employees requesting leave during same week in December",
    severity: "high",
    metric: "Week of Dec 20",
  },
];

const COLORS = {
  vacation: "#3B82F6", // Blue
  sick: "#FACC15", // Yellow
  personal: "#A855F7", // Purple
  high: "#EF4444",
  medium: "#FB923C",
  low: "#22C55E",
};

export function ManagerInsightsPanel() {
  const getHeatmapColor = (absences: number) => {
    if (absences >= 12) return "bg-red-500";
    if (absences >= 8) return "bg-orange-500";
    if (absences >= 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-950/30";
      case "medium":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950/30";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-950/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Team Insights</h2>
        <p className="text-muted-foreground mt-1">
          Analytics and trends to help manage team availability
        </p>
      </div>

      {/* At-Risk Scenarios */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <h3 className="text-xl font-semibold text-foreground">At-Risk Scenarios</h3>
        </div>
        {atRiskScenarios.map((scenario) => (
          <Alert
            key={scenario.id}
            className={cn("border-l-4", getSeverityColor(scenario.severity))}
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
              <span>{scenario.title}</span>
              <Badge
                variant="outline"
                className={cn(
                  scenario.severity === "high" &&
                    "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800",
                  scenario.severity === "medium" &&
                    "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800"
                )}
              >
                {scenario.metric}
              </Badge>
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {scenario.description}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequent Leave Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Most Frequent Leave Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaveTypeFrequency}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="type"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  <Cell fill={COLORS.vacation} />
                  <Cell fill={COLORS.sick} />
                  <Cell fill={COLORS.personal} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {leaveTypeFrequency.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{
                        backgroundColor:
                          idx === 0
                            ? COLORS.vacation
                            : idx === 1
                            ? COLORS.sick
                            : COLORS.personal,
                      }}
                    />
                    <span className="text-muted-foreground">{item.type}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leave Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Leave Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="vacation"
                  stroke={COLORS.vacation}
                  strokeWidth={2}
                  dot={{ fill: COLORS.vacation }}
                  name="Vacation"
                />
                <Line
                  type="monotone"
                  dataKey="sick"
                  stroke={COLORS.sick}
                  strokeWidth={2}
                  dot={{ fill: COLORS.sick }}
                  name="Sick Leave"
                />
                <Line
                  type="monotone"
                  dataKey="personal"
                  stroke={COLORS.personal}
                  strokeWidth={2}
                  dot={{ fill: COLORS.personal }}
                  name="Personal"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Balance Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Team Balance Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={balanceForecast}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="quarter"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  dataKey="available"
                  fill={COLORS.vacation}
                  radius={[8, 8, 0, 0]}
                  name="Current Available"
                />
                <Bar
                  dataKey="projected"
                  fill={COLORS.personal}
                  radius={[8, 8, 0, 0]}
                  name="Projected"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Team balance is expected to decrease by{" "}
                <span className="font-semibold text-foreground">39%</span> by Q4
                2025 based on current usage patterns.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Absence Heatmap by Weekday */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Absence Heatmap by Weekday
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekdayHeatmap.map((day) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {day.day}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {day.absences} absences
                      </span>
                      {day.risk === "high" && (
                        <Badge
                          variant="outline"
                          className="bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800"
                        >
                          High Risk
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="relative w-full h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        getHeatmapColor(day.absences)
                      )}
                      style={{ width: `${(day.absences / 15) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-300 text-sm">
                    High Friday Absence Rate
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    Consider implementing flexible scheduling or addressing
                    potential issues causing high Friday absences.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Low (0-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span>Medium (5-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span>High (8-11)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span>Critical (12+)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Leave Balances Table */}
      <TeamLeaveBalancesTable />
    </div>
  );
}
