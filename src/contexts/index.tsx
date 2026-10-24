import * as React from "react";

export interface DashboardContextValue {
   isAuthenticated: boolean;
   sessionSettled: boolean;
}

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
   const value: DashboardContextValue = { isAuthenticated: false, sessionSettled: true };
   return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
   const ctx = React.useContext(DashboardContext);
   if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
   return ctx;
}

export function useOptionalDashboard(): DashboardContextValue | null {
   return React.useContext(DashboardContext);
}