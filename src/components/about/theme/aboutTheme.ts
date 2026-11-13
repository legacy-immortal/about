/**
 * Legacy Immortal about-site Chakra v3 system.
 *
 * The palette lives in `styles/about/about.css` as `--about-*` custom
 * properties (one source of truth, switched by `html.light` / `html.dark`).
 * The semantic tokens below point at those properties so Chakra-aware props
 * (`color="fg"`, `color="fg.muted"`, `bg="bg"`, …) resolve to the same
 * archival palette instead of Chakra's default zinc scale.
 *
 * Type: Crimson Text for display and headings, Inter for body and interface,
 * IBM Plex Mono for literal values (invite keys, identifiers).
 *
 * References:
 *   https://www.chakra-ui.com/docs/theming/customization/animations
 *   https://www.chakra-ui.com/docs/theming/typography
 *   https://www.chakra-ui.com/docs/theming/tokens
 */

import { createSystem, defaultSystem } from "@chakra-ui/react";

export const aboutSystem = createSystem(defaultSystem._config, {
   theme: {
      tokens: {
         fonts: {
            heading: {
               value: `"Crimson Text", Georgia, "Times New Roman", serif`,
            },
            body: {
               value: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
            },
            mono: {
               value: `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,
            },
         },
      },
      semanticTokens: {
         colors: {
            // Archival paper and ink — resolved from the about-site CSS vars.
            bg: { value: "var(--about-paper)" },
            "bg.subtle": { value: "var(--about-surface)" },
            "bg.muted": { value: "var(--about-surface-sunk)" },
            "bg.panel": { value: "var(--about-surface)" },
            fg: { value: "var(--about-ink)" },
            "fg.muted": { value: "var(--about-ink-soft)" },
            "fg.subtle": { value: "var(--about-ink-faint)" },
            border: { value: "var(--about-rule)" },
            "border.muted": { value: "var(--about-rule-soft)" },
            "border.subtle": { value: "var(--about-rule-soft)" },
            "border.emphasized": { value: "var(--about-rule-strong)" },
            ring: { value: "var(--about-patina)" },
            // One accent, used sparingly: seal wax for actions, patina for structure.
            accent: { value: "var(--about-seal)" },
            "accent.muted": { value: "var(--about-patina)" },
            "on.accent": { value: "var(--about-on-seal)" },
         },
      },
      // Layer styles — reusable background/border combinations
      layerStyles: {
         card: {
            bg: "bg.subtle",
            border: "1px solid",
            borderColor: "border.muted",
            borderRadius: "3px",
            boxShadow: "none",
         },
         cardOutlined: {
            bg: "transparent",
            border: "1px solid",
            borderColor: "border",
            borderRadius: "3px",
            boxShadow: "none",
         },
         section: {
            bg: "bg",
         },
      },
      // Text styles — reusable typography scales
      textStyles: {
         heading: {
            fontFamily: "heading",
            fontWeight: "semibold",
            lineHeight: "1.15",
            letterSpacing: "0.004em",
         },
         headingLg: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: { base: "2rem", md: "2.5rem", lg: "2.875rem" },
            lineHeight: "1.1",
         },
         headingMd: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: { base: "1.5rem", md: "1.875rem", lg: "2.25rem" },
            lineHeight: "1.12",
         },
         headingSm: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: "1.3125rem",
            lineHeight: "1.2",
         },
         body: {
            fontFamily: "body",
            lineHeight: "1.65",
         },
         bodyLg: {
            fontFamily: "body",
            fontSize: "lg",
            lineHeight: "1.7",
         },
         bodySm: {
            fontFamily: "body",
            fontSize: "sm",
            lineHeight: "1.65",
         },
         mono: {
            fontFamily: "mono",
         },
      },
   },
});
