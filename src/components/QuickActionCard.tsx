import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
  gradient?: string;
}

export function QuickActionCard({ title, icon: Icon, onClick, gradient = "from-primary to-secondary" }: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border overflow-hidden" onClick={onClick}>
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
