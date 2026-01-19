import { Home, DollarSign, Clock, UserCircle, Bell, X, FileText, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useView } from "@/contexts/ViewContext";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Payroll", url: "/earnings", icon: DollarSign },
  { title: "Time", url: "/time", icon: Clock },
  { title: "My Documents", url: "/documents", icon: FileText },
  { title: "My Info", url: "/profile", icon: UserCircle },
];

const managerMenuItems = [
  { title: "Insights", url: "/insights", icon: TrendingUp },
];

const communicationItems = [
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const { activeView } = useView();
  const isManager = activeView === "manager";

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="h-[73px] px-6 border-b border-sidebar-border flex items-center justify-between">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Powerpay
          </h1>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isManager && (
          <SidebarGroup>
            <SidebarGroupLabel>Manager</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Communication</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
