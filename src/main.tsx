import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ViewProvider } from '@/contexts/ViewContext';

createRoot(document.getElementById("root")!).render(
  <ViewProvider>
    <App />
  </ViewProvider>
);
