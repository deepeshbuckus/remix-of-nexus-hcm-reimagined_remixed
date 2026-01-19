import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, LogOut, Check, UserCircle, Briefcase } from "lucide-react";
import { useView } from "@/contexts/ViewContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import profileAvatar from "@/assets/profile-avatar.jpg";

interface ProfilePopoverProps {
  userName?: string;
  userEmail?: string;
}

type ViewType = "employee" | "manager";

export function ProfilePopover({ 
  userName = "Anoushka", 
  userEmail = "anoushka@company.com" 
}: ProfilePopoverProps) {
  const [open, setOpen] = useState(false);
  const { activeView, setActiveView } = useView();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewSwitch = (view: ViewType) => {
    setActiveView(view);
    setOpen(false);
    toast({
      title: `Switched to ${view === "employee" ? "Employee" : "Manager"} View`,
      description: `You are now viewing the ${view} dashboard`,
    });
  };

  const menuItems = [
    {
      icon: User,
      label: "My Info",
      onClick: () => {
        setOpen(false);
        navigate("/profile");
      },
      ariaLabel: "View my info",
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => {
        setOpen(false);
        toast({ title: "Notifications", description: "Notifications page coming soon" });
      },
      ariaLabel: "View notifications",
      badge: 3,
    },
  ];

  const viewOptions = [
    {
      value: "employee" as ViewType,
      icon: UserCircle,
      label: "Switch to Employee View",
      ariaLabel: "Switch to employee view",
    },
    {
      value: "manager" as ViewType,
      icon: Briefcase,
      label: "Switch to Manager View",
      ariaLabel: "Switch to manager view",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Open profile menu"
        >
          <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
            <AvatarImage src={profileAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0 bg-background border shadow-lg z-50" 
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* User Info Header */}
          <div className="px-4 py-3 bg-muted/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profileAvatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{userName}</p>
                <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  aria-label={item.ariaLabel}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:bg-accent focus:text-accent-foreground",
                    "transition-colors cursor-pointer"
                  )}
                  style={{ minHeight: "44px" }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <Separator />

          {/* View Switcher */}
          <div className="py-2">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activeView === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleViewSwitch(option.value)}
                  aria-label={option.ariaLabel}
                  aria-current={isActive ? "true" : "false"}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:bg-accent focus:text-accent-foreground",
                    "transition-colors cursor-pointer",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                  style={{ minHeight: "44px" }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{option.label}</span>
                  {isActive && (
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          <Separator />

          {/* Sign Out */}
          <div className="py-2">
            <button
              onClick={() => {
                setOpen(false);
                toast({
                  title: "Signed Out",
                  description: "You have been successfully signed out",
                });
              }}
              aria-label="Sign out"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm",
                "hover:bg-destructive/10 hover:text-destructive",
                "focus:outline-none focus:bg-destructive/10 focus:text-destructive",
                "transition-colors cursor-pointer text-destructive"
              )}
              style={{ minHeight: "44px" }}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Sign Out</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
