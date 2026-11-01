import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorView } from "~/components/about/ErrorView";

export const Route = createRootRoute({
   component: () => <Outlet />,
   errorComponent: ({ error }) => <ErrorView error={error instanceof Error ? error : new Error(String(error))} />,
});