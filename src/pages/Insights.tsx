import { ManagerInsightsPanel } from "@/components/time/ManagerInsightsPanel";
import { useView } from "@/contexts/ViewContext";
import { Navigate } from "react-router-dom";

const Insights = () => {
  const { activeView } = useView();
  
  // Only managers can access this page
  if (activeView !== "manager") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <ManagerInsightsPanel />
    </div>
  );
};

export default Insights;
