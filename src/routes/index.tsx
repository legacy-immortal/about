import { createFileRoute } from "@tanstack/react-router";
import { DashboardProvider } from "~/contexts";
import { MarketingHomePage } from "../components/marketing/MarketingHomePage";

function MarketingIndexRoute() {
   return (
      <DashboardProvider>
         <MarketingHomePage />
      </DashboardProvider>
   );
}

export const Route = createFileRoute("/")({
   component: MarketingIndexRoute,
});