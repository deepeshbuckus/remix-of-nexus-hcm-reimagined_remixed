import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { AIAssistant } from "@/components/AIAssistant";
import { ViewProvider, useView } from "@/contexts/ViewContext";
import Index from "./pages/Index";
import ManagerIndex from "./pages/ManagerIndex";
import Time from "./pages/Time";
import Earnings from "./pages/Earnings";
import MyInfo from "./pages/MyInfo";
import Documents from "./pages/Documents";
import Insights from "./pages/Insights";
import LocationExceptions from "./pages/LocationExceptions";
import GeofenceSettings from "./pages/GeofenceSettings";
import ManagerRequestDetails from "./pages/ManagerRequestDetails";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

function AppContent() {
  const { activeView } = useView();
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={activeView === "manager" ? <ManagerIndex /> : <Index />} />
              <Route path="/time" element={<Time />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/location-exceptions" element={<LocationExceptions />} />
              <Route path="/geofence-settings" element={<GeofenceSettings />} />
              <Route path="/time/request/:requestId" element={<ManagerRequestDetails />} />
              <Route path="/profile" element={<MyInfo />} />
              <Route path="/documents" element={<Documents />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <AIAssistant />
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ViewProvider>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </ViewProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
