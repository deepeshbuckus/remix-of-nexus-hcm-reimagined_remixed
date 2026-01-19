import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="border shadow-sm hover:shadow-md transition-all duration-300 h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{title}</p>
              <p className="text-3xl font-bold mt-1.5">{value}</p>
              {subtitle && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{subtitle}</p>
              )}
              {trend && trendValue && (
                <div className={`flex items-center gap-1 mt-2 text-sm font-medium leading-relaxed ${
                  trend === "up" ? "text-success" : "text-destructive"
                }`}>
                  <span>{trend === "up" ? "↑" : "↓"}</span>
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
