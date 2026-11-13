/**
 * About palette CSS vars (defined in `styles/about/about.css`).
 * Prefer these over Chakra `primary.*` tokens — the dashboard system has no
 * seal-wax primary scale, and the about palette flips with `html.dark`.
 */
export const mkt = {
   primary: "var(--about-seal)",
   accent: "var(--about-patina)",
   fg: "var(--about-ink)",
   fgMuted: "var(--about-ink-soft)",
   fgSubtle: "var(--about-ink-faint)",
   bg: "var(--about-paper)",
   surface: "var(--about-surface)",
   rule: "var(--about-rule)",
} as const;
