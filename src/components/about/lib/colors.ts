/**
 * About palette CSS vars (defined in about.css).
 * Prefer these over Chakra `primary.*` tokens — the dashboard system has no Solarized primary scale.
 */
export const mkt = {
   primary: "var(--about-primary)",
   accent: "var(--about-primary-accent)",
   fg: "var(--about-text-primary)",
   fgMuted: "var(--about-text-secondary)",
   fgSubtle: "var(--about-text-muted)",
   bg: "var(--about-bg)",
} as const;
