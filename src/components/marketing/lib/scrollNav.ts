/**
 * In-page section navigation for the marketing SPA.
 * Uses sessionStorage + scrollIntoView — never writes hashes into the URL bar.
 */

export const MARKETING_SECTION_IDS = ["features", "concept", "pricing"] as const;
export type MarketingSectionId = (typeof MARKETING_SECTION_IDS)[number];

const STORAGE_KEY = "legacy-marketing-section";

/** Fixed header clearance for scroll-margin / IntersectionObserver rootMargin. */
export const MARKETING_HEADER_OFFSET_PX = 72;

export function isMarketingSectionId(value: string | null | undefined): value is MarketingSectionId {
   return (
      typeof value === "string" &&
      (MARKETING_SECTION_IDS as readonly string[]).includes(value)
   );
}

export function readStoredSection(): MarketingSectionId | null {
   if (typeof window === "undefined") {
      return null;
   }
   try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return isMarketingSectionId(raw) ? raw : null;
   } catch {
      return null;
   }
}

export function storeSection(id: MarketingSectionId | null): void {
   if (typeof window === "undefined") {
      return;
   }
   try {
      if (id) {
         sessionStorage.setItem(STORAGE_KEY, id);
      } else {
         sessionStorage.removeItem(STORAGE_KEY);
      }
   } catch {
      /* private mode / quota — ignore */
   }
}

/** Strip a hash from the address bar without a navigation. */
export function clearLocationHash(): void {
   if (typeof window === "undefined") {
      return;
   }
   if (!window.location.hash) {
      return;
   }
   const { pathname, search } = window.location;
   window.history.replaceState(null, "", `${pathname}${search}`);
}

export function scrollToSection(
   id: MarketingSectionId,
   opts?: { behavior?: ScrollBehavior; store?: boolean },
): void {
   if (typeof document === "undefined") {
      return;
   }
   const el = document.getElementById(id);
   if (!el) {
      return;
   }
   clearLocationHash();
   el.scrollIntoView({ behavior: opts?.behavior ?? "smooth", block: "start" });
   if (opts?.store !== false) {
      storeSection(id);
   }
}
