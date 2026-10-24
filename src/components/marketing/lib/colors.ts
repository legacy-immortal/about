/**
 * Marketing palette CSS vars (defined in marketing.css).
 * Prefer these over Chakra `primary.*` tokens — the dashboard system has no Solarized primary scale.
 */
export const mkt = {
   primary: "var(--marketing-primary)",
   accent: "var(--marketing-primary-accent)",
   fg: "var(--marketing-text-primary)",
   fgMuted: "var(--marketing-text-secondary)",
   fgSubtle: "var(--marketing-text-muted)",
   bg: "var(--marketing-bg)",
} as const;
