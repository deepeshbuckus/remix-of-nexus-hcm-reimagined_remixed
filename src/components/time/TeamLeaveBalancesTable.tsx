import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Umbrella,
  Heart,
  Home,
  Baby,
  Scale,
  GraduationCap,
  Clock,
  Stethoscope,
  Plane,
  Calendar,
  UserCheck,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Leave type configuration with 12 types
const LEAVE_TYPES = [
  { key: "vacation", label: "Vacation", shortLabel: "VAC", icon: Umbrella, color: "bg-blue-500" },
  { key: "sick", label: "Sick Leave", shortLabel: "SICK", icon: Heart, color: "bg-red-500" },
  { key: "personal", label: "Personal", shortLabel: "PERS", icon: Home, color: "bg-purple-500" },
  { key: "parental", label: "Parental", shortLabel: "PAR", icon: Baby, color: "bg-pink-500" },
  { key: "bereavement", label: "Bereavement", shortLabel: "BER", icon: Heart, color: "bg-gray-500" },
  { key: "jury", label: "Jury Duty", shortLabel: "JURY", icon: Scale, color: "bg-indigo-500" },
  { key: "study", label: "Study Leave", shortLabel: "STU", icon: GraduationCap, color: "bg-teal-500" },
  { key: "comp", label: "Comp Time", shortLabel: "COMP", icon: Clock, color: "bg-orange-500" },
  { key: "medical", label: "Medical", shortLabel: "MED", icon: Stethoscope, color: "bg-emerald-500" },
  { key: "floating", label: "Floating Holiday", shortLabel: "FLOT", icon: Plane, color: "bg-cyan-500" },
  { key: "volunteer", label: "Volunteer", shortLabel: "VOL", icon: UserCheck, color: "bg-lime-500" },
  { key: "birthday", label: "Birthday", shortLabel: "BDAY", icon: Gift, color: "bg-amber-500" },
] as const;

type LeaveTypeKey = typeof LEAVE_TYPES[number]["key"];

interface LeaveBalance {
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
  balances: Partial<Record<LeaveTypeKey, LeaveBalance>>;
}

// Extended mock data with 15+ employees and 12 leave types
const employees: Employee[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Developer",
    department: "Engineering",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 8, pending: 5, remaining: 7 },
      sick: { total: 10, used: 2, pending: 0, remaining: 8 },
      personal: { total: 5, used: 1, pending: 0, remaining: 4 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 2, pending: 0, remaining: 3 },
      comp: { total: 16, used: 4, pending: 2, remaining: 10 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 1, pending: 0, remaining: 1 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Designer",
    department: "Design",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 12, pending: 0, remaining: 8 },
      sick: { total: 10, used: 5, pending: 0, remaining: 5 },
      personal: { total: 5, used: 3, pending: 1, remaining: 1 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 0, pending: 0, remaining: 5 },
      comp: { total: 16, used: 8, pending: 0, remaining: 8 },
      medical: { total: 5, used: 1, pending: 0, remaining: 4 },
      floating: { total: 2, used: 2, pending: 0, remaining: 0 },
      volunteer: { total: 2, used: 1, pending: 0, remaining: 1 },
      birthday: { total: 1, used: 1, pending: 0, remaining: 0 },
    },
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    department: "Marketing",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 15, pending: 3, remaining: 2 },
      sick: { total: 10, used: 1, pending: 0, remaining: 9 },
      personal: { total: 5, used: 2, pending: 0, remaining: 3 },
      parental: { total: 12, used: 0, pending: 12, remaining: 0 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 3, pending: 0, remaining: 2 },
      comp: { total: 16, used: 10, pending: 4, remaining: 2 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 0, pending: 1, remaining: 1 },
      volunteer: { total: 2, used: 2, pending: 0, remaining: 0 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 4,
    name: "David Kim",
    role: "Backend Engineer",
    department: "Engineering",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 10, pending: 0, remaining: 10 },
      sick: { total: 10, used: 0, pending: 0, remaining: 10 },
      personal: { total: 5, used: 0, pending: 0, remaining: 5 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 0, pending: 0, remaining: 5 },
      comp: { total: 16, used: 0, pending: 0, remaining: 16 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 0, pending: 0, remaining: 2 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "HR Specialist",
    department: "Human Resources",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 18, pending: 0, remaining: 2 },
      sick: { total: 10, used: 8, pending: 1, remaining: 1 },
      personal: { total: 5, used: 4, pending: 0, remaining: 1 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 2, pending: 0, remaining: 3 },
      jury: { total: 10, used: 5, pending: 0, remaining: 5 },
      study: { total: 5, used: 5, pending: 0, remaining: 0 },
      comp: { total: 16, used: 14, pending: 2, remaining: 0 },
      medical: { total: 5, used: 3, pending: 0, remaining: 2 },
      floating: { total: 2, used: 2, pending: 0, remaining: 0 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 1, pending: 0, remaining: 0 },
    },
  },
  {
    id: 6,
    name: "James Wilson",
    role: "QA Lead",
    department: "Engineering",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 5, pending: 2, remaining: 13 },
      sick: { total: 10, used: 3, pending: 0, remaining: 7 },
      personal: { total: 5, used: 1, pending: 0, remaining: 4 },
      parental: { total: 12, used: 12, pending: 0, remaining: 0 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 1, pending: 0, remaining: 4 },
      comp: { total: 16, used: 6, pending: 0, remaining: 10 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 1, pending: 0, remaining: 1 },
      volunteer: { total: 2, used: 1, pending: 0, remaining: 1 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 7,
    name: "Amanda Garcia",
    role: "Data Analyst",
    department: "Analytics",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 7, pending: 0, remaining: 13 },
      sick: { total: 10, used: 2, pending: 0, remaining: 8 },
      personal: { total: 5, used: 2, pending: 1, remaining: 2 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 0, pending: 0, remaining: 5 },
      comp: { total: 16, used: 2, pending: 0, remaining: 14 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 0, pending: 0, remaining: 2 },
      volunteer: { total: 2, used: 2, pending: 0, remaining: 0 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 8,
    name: "Robert Martinez",
    role: "DevOps Engineer",
    department: "Engineering",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 14, pending: 4, remaining: 2 },
      sick: { total: 10, used: 6, pending: 0, remaining: 4 },
      personal: { total: 5, used: 3, pending: 2, remaining: 0 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 4, pending: 1, remaining: 0 },
      comp: { total: 16, used: 12, pending: 0, remaining: 4 },
      medical: { total: 5, used: 2, pending: 0, remaining: 3 },
      floating: { total: 2, used: 1, pending: 1, remaining: 0 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 1, pending: 0, remaining: 0 },
    },
  },
  {
    id: 9,
    name: "Jennifer Lee",
    role: "UX Researcher",
    department: "Design",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 9, pending: 0, remaining: 11 },
      sick: { total: 10, used: 1, pending: 0, remaining: 9 },
      personal: { total: 5, used: 0, pending: 0, remaining: 5 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 3, pending: 0, remaining: 7 },
      study: { total: 5, used: 2, pending: 0, remaining: 3 },
      comp: { total: 16, used: 4, pending: 0, remaining: 12 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 0, pending: 0, remaining: 2 },
      volunteer: { total: 2, used: 1, pending: 0, remaining: 1 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 10,
    name: "Christopher Brown",
    role: "Frontend Developer",
    department: "Engineering",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 3, pending: 0, remaining: 17 },
      sick: { total: 10, used: 0, pending: 0, remaining: 10 },
      personal: { total: 5, used: 1, pending: 0, remaining: 4 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 0, pending: 0, remaining: 5 },
      comp: { total: 16, used: 0, pending: 0, remaining: 16 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 0, pending: 0, remaining: 2 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 11,
    name: "Nicole Adams",
    role: "Content Writer",
    department: "Marketing",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 11, pending: 2, remaining: 7 },
      sick: { total: 10, used: 4, pending: 0, remaining: 6 },
      personal: { total: 5, used: 2, pending: 0, remaining: 3 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 1, pending: 0, remaining: 4 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 1, pending: 0, remaining: 4 },
      comp: { total: 16, used: 5, pending: 0, remaining: 11 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 1, pending: 0, remaining: 1 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 12,
    name: "Daniel Taylor",
    role: "Security Engineer",
    department: "Engineering",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 6, pending: 0, remaining: 14 },
      sick: { total: 10, used: 2, pending: 0, remaining: 8 },
      personal: { total: 5, used: 0, pending: 0, remaining: 5 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 3, pending: 0, remaining: 2 },
      comp: { total: 16, used: 8, pending: 0, remaining: 8 },
      medical: { total: 5, used: 1, pending: 0, remaining: 4 },
      floating: { total: 2, used: 0, pending: 0, remaining: 2 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 13,
    name: "Michelle Wright",
    role: "Product Manager",
    department: "Product",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 16, pending: 2, remaining: 2 },
      sick: { total: 10, used: 7, pending: 2, remaining: 1 },
      personal: { total: 5, used: 5, pending: 0, remaining: 0 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 5, pending: 0, remaining: 0 },
      comp: { total: 16, used: 16, pending: 0, remaining: 0 },
      medical: { total: 5, used: 4, pending: 1, remaining: 0 },
      floating: { total: 2, used: 2, pending: 0, remaining: 0 },
      volunteer: { total: 2, used: 2, pending: 0, remaining: 0 },
      birthday: { total: 1, used: 1, pending: 0, remaining: 0 },
    },
  },
  {
    id: 14,
    name: "Andrew Scott",
    role: "Sales Executive",
    department: "Sales",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 4, pending: 0, remaining: 16 },
      sick: { total: 10, used: 1, pending: 0, remaining: 9 },
      personal: { total: 5, used: 1, pending: 0, remaining: 4 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 2, pending: 0, remaining: 8 },
      study: { total: 5, used: 0, pending: 0, remaining: 5 },
      comp: { total: 16, used: 2, pending: 0, remaining: 14 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 0, pending: 0, remaining: 2 },
      volunteer: { total: 2, used: 1, pending: 0, remaining: 1 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
  {
    id: 15,
    name: "Rachel Green",
    role: "Finance Analyst",
    department: "Finance",
    avatar: "",
    balances: {
      vacation: { total: 20, used: 10, pending: 5, remaining: 5 },
      sick: { total: 10, used: 3, pending: 0, remaining: 7 },
      personal: { total: 5, used: 2, pending: 1, remaining: 2 },
      parental: { total: 12, used: 0, pending: 0, remaining: 12 },
      bereavement: { total: 5, used: 0, pending: 0, remaining: 5 },
      jury: { total: 10, used: 0, pending: 0, remaining: 10 },
      study: { total: 5, used: 2, pending: 0, remaining: 3 },
      comp: { total: 16, used: 6, pending: 2, remaining: 8 },
      medical: { total: 5, used: 0, pending: 0, remaining: 5 },
      floating: { total: 2, used: 1, pending: 0, remaining: 1 },
      volunteer: { total: 2, used: 0, pending: 0, remaining: 2 },
      birthday: { total: 1, used: 0, pending: 0, remaining: 1 },
    },
  },
];

type SortField = "name" | "lowestBalance" | "highestPending";
type SortDirection = "asc" | "desc";

interface BalanceCellProps {
  balance: LeaveBalance | undefined;
  leaveType: typeof LEAVE_TYPES[number];
}

function BalanceCell({ balance, leaveType }: BalanceCellProps) {
  if (!balance) {
    return (
      <div className="text-center text-muted-foreground text-xs">—</div>
    );
  }

  const { used, pending, remaining, total } = balance;
  const isLowBalance = remaining < 2;
  const usedPercent = (used / total) * 100;
  const pendingPercent = (pending / total) * 100;
  const remainingPercent = (remaining / total) * 100;

  // Get heatmap background based on remaining balance
  const getHeatmapBg = () => {
    const ratio = remaining / total;
    if (ratio <= 0.1) return "bg-red-100 dark:bg-red-950/40";
    if (ratio <= 0.25) return "bg-orange-100 dark:bg-orange-950/40";
    if (ratio <= 0.5) return "bg-yellow-50 dark:bg-yellow-950/20";
    return "";
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1.5 rounded cursor-pointer transition-colors hover:bg-muted/50 min-w-[60px]",
              getHeatmapBg()
            )}
          >
            {/* Primary number - Remaining */}
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-sm font-bold tabular-nums",
                isLowBalance ? "text-red-600 dark:text-red-400" : "text-foreground"
              )}>
                {remaining}
              </span>
              {isLowBalance && (
                <AlertTriangle className="h-3 w-3 text-orange-500" />
              )}
            </div>

            {/* Mini stacked progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex mt-1">
              <div
                className="h-full bg-red-400 dark:bg-red-500"
                style={{ width: `${usedPercent}%` }}
              />
              <div
                className="h-full bg-yellow-400 dark:bg-yellow-500"
                style={{ width: `${pendingPercent}%` }}
              />
              <div
                className="h-full bg-blue-400 dark:bg-blue-500"
                style={{ width: `${remainingPercent}%` }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 min-w-[160px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm border-b pb-2">
              <leaveType.icon className="h-4 w-4" />
              {leaveType.label}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-muted-foreground">Used:</span>
                </div>
                <span className="font-medium">{used} days</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-muted-foreground">Pending:</span>
                </div>
                <span className="font-medium">{pending} days</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-muted-foreground">Remaining:</span>
                </div>
                <span className="font-medium">{remaining} days</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t mt-1">
                <span className="text-muted-foreground font-medium">Total:</span>
                <span className="font-bold">{total} days</span>
              </div>
            </div>
            {isLowBalance && (
              <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 text-xs pt-1 border-t">
                <AlertTriangle className="h-3 w-3" />
                Low balance warning
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TeamLeaveBalancesTable() {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());

  const departments = useMemo(() => {
    return ["all", ...new Set(employees.map((e) => e.department))];
  }, []);

  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Filter by department
    if (departmentFilter !== "all") {
      result = result.filter((e) => e.department === departmentFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortField === "lowestBalance") {
        const aMin = Math.min(
          ...Object.values(a.balances).map((bal) => bal?.remaining ?? Infinity)
        );
        const bMin = Math.min(
          ...Object.values(b.balances).map((bal) => bal?.remaining ?? Infinity)
        );
        return sortDirection === "asc" ? aMin - bMin : bMin - aMin;
      }

      if (sortField === "highestPending") {
        const aMax = Math.max(
          ...Object.values(a.balances).map((bal) => bal?.pending ?? 0)
        );
        const bMax = Math.max(
          ...Object.values(b.balances).map((bal) => bal?.pending ?? 0)
        );
        return sortDirection === "asc" ? bMax - aMax : aMax - bMax;
      }

      return 0;
    });

    return result;
  }, [departmentFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleEmployeeSelection = (id: number) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllSelection = () => {
    if (selectedEmployees.size === filteredAndSortedEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredAndSortedEmployees.map((e) => e.id)));
    }
  };


  const lowBalanceCount = useMemo(() => {
    return filteredAndSortedEmployees.filter((emp) =>
      Object.values(emp.balances).some((bal) => bal && bal.remaining < 2)
    ).length;
  }, [filteredAndSortedEmployees]);

  return (
    <Card className="bg-background">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Leave Balances
            {lowBalanceCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {lowBalanceCount} low balance
              </Badge>
            )}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Controls */}
            <Button
              variant={sortField === "lowestBalance" ? "secondary" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => toggleSort("lowestBalance")}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Lowest Balance
            </Button>
            <Button
              variant={sortField === "highestPending" ? "secondary" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => toggleSort("highestPending")}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Highest Pending
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span>Used</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Remaining</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            <span>Low balance (&lt;2 days)</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Bulk actions bar */}
        {selectedEmployees.size > 0 && (
          <div className="bg-primary/10 border-b px-4 py-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedEmployees.size} employee(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Export Selected
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Send Reminder
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px] sticky left-0 bg-background z-20">
                  <Checkbox
                    checked={
                      selectedEmployees.size === filteredAndSortedEmployees.length &&
                      filteredAndSortedEmployees.length > 0
                    }
                    onCheckedChange={toggleAllSelection}
                  />
                </TableHead>
                <TableHead className="sticky left-[40px] bg-background z-20 min-w-[200px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium hover:bg-transparent"
                    onClick={() => toggleSort("name")}
                  >
                    Employee
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </Button>
                </TableHead>
                {LEAVE_TYPES.map((type) => (
                  <TableHead key={type.key} className="text-center px-1 min-w-[70px]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center gap-0.5 cursor-help">
                            <type.icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-[10px] font-medium">{type.shortLabel}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <span>{type.label}</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEmployees.map((employee) => {
                const hasLowBalance = Object.values(employee.balances).some(
                  (bal) => bal && bal.remaining < 2
                );

                return (
                  <TableRow
                    key={employee.id}
                    className={cn(
                      "group",
                      hasLowBalance && "bg-orange-50/50 dark:bg-orange-950/10"
                    )}
                  >
                    <TableCell className="sticky left-0 bg-background z-10">
                      <Checkbox
                        checked={selectedEmployees.has(employee.id)}
                        onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                      />
                    </TableCell>
                    <TableCell className="sticky left-[40px] bg-background z-10">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{employee.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {employee.department}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {LEAVE_TYPES.map((type) => (
                      <TableCell key={type.key} className="p-1 text-center">
                        <BalanceCell
                          balance={employee.balances[type.key]}
                          leaveType={type}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile alternative hint */}
        <div className="p-4 border-t text-center text-xs text-muted-foreground sm:hidden">
          Scroll horizontally to see all leave types
        </div>
      </CardContent>
    </Card>
  );
}
