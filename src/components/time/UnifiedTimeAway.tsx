import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useView } from "@/contexts/ViewContext";
import { MyTimeAwaySection } from "./MyTimeAwaySection";
import { TeamTimeAwaySection } from "./TeamTimeAwaySection";
import { NewRequestDialog } from "./NewRequestDialog";
import { User, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Entitlements for NewRequestDialog (manager's personal balances)
const managerEntitlements: Record<string, { total: number; used: number; pending: number }> = {
  "Vacation": { total: 25, used: 10, pending: 0 },
  "Sick Leave": { total: 10, used: 2, pending: 0 },
  "Personal": { total: 5, used: 1, pending: 0 },
  "Bereavement": { total: 5, used: 0, pending: 0 },
  "Parental Leave": { total: 12, used: 0, pending: 0 },
  "Jury Duty": { total: 10, used: 0, pending: 0 },
  "Study Leave": { total: 5, used: 0, pending: 0 },
  "Comp Time": { total: 16, used: 8, pending: 0 },
};

export function UnifiedTimeAway() {
  const { activeView } = useView();
  const isManager = activeView === "manager";

  return (
    <div className="space-y-6">
      {isManager ? (
        // Manager view: Show tabs for My Time Away and Team Time Away
        <>
          {/* Tabs for different views */}
          <Tabs defaultValue="team" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Time Away
                <Badge variant="warning" className="ml-1 h-5 px-1.5 text-xs">3</Badge>
              </TabsTrigger>
              <TabsTrigger value="my" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                My Time Away
              </TabsTrigger>
            </TabsList>

            <TabsContent value="team" className="mt-6">
              <TeamTimeAwaySection />
            </TabsContent>

            <TabsContent value="my" className="mt-6">
              <MyTimeAwaySection />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        // Employee view: Only show My Time Away
        <MyTimeAwaySection />
      )}
    </div>
  );
}
