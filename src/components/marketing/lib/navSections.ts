/**
 * In-page marketing nav targets. Alpha Access / invitation is intentionally absent —
 * see `docs/documentation/marketing-integration.md` (alpha invite flow removed).
 * @module routes/marketing/-lib/navSections
 **/
export interface NavSection {
   id: string;
   label: string;
}

export const NAV_SECTIONS: readonly NavSection[] = [
   { id: "features", label: "Features" },
   { id: "concept", label: "Concept" },
   { id: "pricing", label: "Pricing" },
] as const;

/** Stable array reference for hooks that key effects off section ids (e.g. `useScrollSpy`). */
export const NAV_SECTION_IDS: readonly string[] = NAV_SECTIONS.map((section) => section.id);
