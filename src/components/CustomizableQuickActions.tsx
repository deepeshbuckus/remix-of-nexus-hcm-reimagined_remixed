import { useState, useEffect } from "react";
import { Calendar, Briefcase, CalendarClock, ClipboardList, Receipt, UserCircle, Settings, DollarSign, FileText, Users, Clock, Bell, HelpCircle, Mail, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface QuickAction {
  id: string;
  title: string;
  icon: LucideIcon;
}

const allQuickActions: QuickAction[] = [
  { id: "request-time-off", title: "Request Time Off", icon: CalendarClock },
  { id: "submit-timesheet", title: "Submit Timesheet", icon: ClipboardList },
  { id: "view-payslip", title: "View Payslip", icon: Receipt },
  { id: "calendar", title: "Calendar", icon: Calendar },
  { id: "my-schedule", title: "My Schedule", icon: Briefcase },
  { id: "update-profile", title: "Update Profile", icon: UserCircle },
  { id: "earnings", title: "Earnings", icon: DollarSign },
  { id: "reports", title: "Reports", icon: FileText },
  { id: "team", title: "Team Directory", icon: Users },
  { id: "clock-in-out", title: "Clock In/Out", icon: Clock },
  { id: "notifications", title: "Notifications", icon: Bell },
  { id: "help", title: "Help & Support", icon: HelpCircle },
  { id: "messages", title: "Messages", icon: Mail },
];

const defaultSelectedIds = ["request-time-off", "submit-timesheet", "view-payslip", "calendar", "my-schedule", "update-profile"];

export function CustomizableQuickActions() {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("quickActionsSelected");
    if (saved) {
      setSelectedIds(JSON.parse(saved));
    }
  }, []);

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} clicked`,
      description: "This feature will be implemented soon.",
    });
  };

  const openDialog = () => {
    setTempSelectedIds([...selectedIds]);
    setIsDialogOpen(true);
  };

  const toggleAction = (id: string) => {
    setTempSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 8) {
        toast({
          title: "Maximum reached",
          description: "You can select up to 8 quick actions.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const saveSelection = () => {
    if (tempSelectedIds.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one quick action.",
        variant: "destructive",
      });
      return;
    }
    setSelectedIds(tempSelectedIds);
    localStorage.setItem("quickActionsSelected", JSON.stringify(tempSelectedIds));
    setIsDialogOpen(false);
    toast({
      title: "Saved",
      description: "Your quick actions have been updated.",
    });
  };

  const selectedActions = allQuickActions.filter(a => selectedIds.includes(a.id));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[hsl(240_20%_98%)] dark:bg-muted/20 rounded-2xl p-5 border border-border/40"
    >
      {/* Header with label and customize button */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </span>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-primary -mr-2"
              onClick={openDialog}
            >
              <Settings className="h-3.5 w-3.5" />
              Customize
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Customize Quick Actions</DialogTitle>
              <p className="text-sm text-muted-foreground">Select up to 8 actions to show.</p>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-2 mt-4 max-h-[400px] overflow-y-auto pr-2">
              {allQuickActions.map((action) => {
                const Icon = action.icon;
                const isSelected = tempSelectedIds.includes(action.id);
                const order = tempSelectedIds.indexOf(action.id);
                
                return (
                  <div
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-primary/10 border border-primary/30" 
                        : "bg-muted/30 border border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => toggleAction(action.id)}
                      className="pointer-events-none"
                    />
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/20" : "bg-muted"}`}>
                      <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`flex-1 font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {action.title}
                    </span>
                    {isSelected && (
                      <span className="text-xs text-muted-foreground">#{order + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">{tempSelectedIds.length}/8 selected</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveSelection}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2.5">
        {selectedActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction(action.title)}
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-background border border-border/60 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 font-medium text-sm transition-all"
            >
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground/90 group-hover:text-foreground">{action.title}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}