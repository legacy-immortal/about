/** Single source of truth for dashboard base path (dev and prod under backend). */
export const DASHBOARD_BASEPATH = "/dashboard";

/** Signed-in landing: caretaker overview (not public Explore at `/dashboard`). */
export const DASHBOARD_SIGNED_IN_HOME = `${DASHBOARD_BASEPATH}/home`;

/** Auth / identity / privacy summary (reachable without sign-in for guests reading policy). */
export const DASHBOARD_PRIVACY_AUTH = `${DASHBOARD_BASEPATH}/privacy-auth`;

/** TanStack Router may use `/dashboard` or `/dashboard/`; public IA must treat both as reachable without sign-in. */
export function normalizePathnameForPublicMatch(pathname: string): string {
   const trimmed = pathname.replace(/\/+$/, "");
   return trimmed === "" ? "/" : trimmed;
}

/** Paths that show dashboard chrome without requiring auth (explore-first home, memorials, actor, invite). */
export function isDashboardPublicPathname(pathname: string): boolean {
   const base = DASHBOARD_BASEPATH;
   const n = normalizePathnameForPublicMatch(pathname);
   const publicExact = new Set([
      base,
      `${base}/explore`,
      `${base}/memorials`,
      DASHBOARD_PRIVACY_AUTH,
      `${DASHBOARD_PRIVACY_AUTH}/`,
   ]);
   if (publicExact.has(n)) {
      return true;
   }
   const publicPrefixes = [
      `${base}/explore/`,
      `${base}/memorials/`,
      `${base}/memorial/`,
      `${base}/actor/`,
      `${base}/invite/`,
   ];
   return publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}
