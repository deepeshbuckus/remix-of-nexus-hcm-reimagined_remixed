import { Bell, Search, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ProfilePopover } from "./ProfilePopover";

interface HeaderProps {
  userName?: string;
  employeeId?: string;
}

export function Header({ userName = "Anoushka", employeeId = "000000010" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-[73px] items-center justify-between gap-4 px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="rounded-full border-2 border-primary hover:bg-primary/10 h-10 w-10 shrink-0">
            <Menu className="h-5 w-5 text-primary" />
          </SidebarTrigger>
          <h1 className="text-2xl font-bold">Powerpay</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-background hover:bg-muted">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10 bg-background hover:bg-muted">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <ProfilePopover userName={userName} userEmail={`${userName.toLowerCase()}@powerpay.com`} />
        </div>
      </div>
    </header>
  );
}
