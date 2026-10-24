import { createFileRoute } from "@tanstack/react-router";
import { DashboardProvider } from "~/contexts";
import { AboutHomePage } from "../components/about/AboutHomePage";

function AboutIndexRoute() {
   return (
      <DashboardProvider>
         <AboutHomePage />
      </DashboardProvider>
   );
}

export const Route = createFileRoute("/")({
   component: AboutIndexRoute,
});