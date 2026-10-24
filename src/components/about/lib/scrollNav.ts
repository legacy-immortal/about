/**
 * In-page section navigation for the about SPA.
 * Uses sessionStorage + scrollIntoView — never writes hashes into the URL bar.
 */

export const ABOUT_SECTION_IDS = ["features", "concept", "pricing"] as const;
export type AboutSectionId = (typeof ABOUT_SECTION_IDS)[number];

const STORAGE_KEY = "legacy-about-section";

/** Fixed header clearance for scroll-margin / IntersectionObserver rootMargin. */
export const ABOUT_HEADER_OFFSET_PX = 72;

export function isAboutSectionId(value: string | null | undefined): value is AboutSectionId {
   return (
      typeof value === "string" &&
      (ABOUT_SECTION_IDS as readonly string[]).includes(value)
   );
}

export function readStoredSection(): AboutSectionId | null {
   if (typeof window === "undefined") {
      return null;
   }
   try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return isAboutSectionId(raw) ? raw : null;
   } catch {
      return null;
   }
}

export function storeSection(id: AboutSectionId | null): void {
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
   id: AboutSectionId,
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
