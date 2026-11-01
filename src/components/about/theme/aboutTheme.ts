/**
 * Legacy Immortal about-site Chakra v3 system.
 *
 * Uses createSystem to define the sunbleached technical-drawing palette
 * as semantic tokens, plus layer styles, text styles, and component recipes
 * (Card, Button) via cva/sva.
 *
 * References:
 *   https://www.chakra-ui.com/docs/theming/customization/animations
 *   https://www.chakra-ui.com/docs/theming/layer-styles
 *   https://www.chakra-ui.com/docs/theming/typography
 *   https://www.chakra-ui.com/docs/components/prose
 *   https://www.chakra-ui.com/docs/components/theme
 *   https://www.chakra-ui.com/docs/styling/chakra-factory
 */

import { createSystem, defaultSystem } from "@chakra-ui/react";

export const aboutSystem = createSystem(defaultSystem._config, {
   theme: {
      semanticTokens: {
         colors: {
            // Sunbleached technical-drawing palette
            aboutBg: { value: { light: "#fdf6e3", dark: "#053d48" } },
            aboutTextPrimary: { value: { light: "#073642", dark: "#454a94" } },
            aboutTextSecondary: { value: { light: "#586e75", dark: "#adbcbc" } },
            aboutTextMuted: { value: { light: "#657b83", dark: "#718b90" } },
            aboutAccent: { value: { light: "#b58900", dark: "#0096f5" } },
            aboutAccentSecondary: { value: { light: "#cb4b16", dark: "#39c7b9" } },
            aboutBorder: { value: { light: "#586e75", dark: "#839496" } },
         },
      },
      // Layer styles — reusable background/border/shadow combinations
      layerStyles: {
         card: {
            bg: "transparent",
            border: "1px solid",
            borderColor: "aboutBorder",
            borderRadius: "2px",
            boxShadow: "0 12px 32px -8px rgba(7, 54, 66, 0.06)",
            _dark: {
               boxShadow: "0 12px 32px -8px rgba(226, 232, 240, 0.06)",
            },
         },
         cardOutlined: {
            bg: "transparent",
            border: "1px solid",
            borderColor: "aboutBorder",
            borderRadius: "2px",
            boxShadow: "none",
            _dark: {
               boxShadow: "none",
            },
         },
         section: {
            bg: "aboutBg",
            _dark: {
               bg: "aboutBg",
            },
         },
      },
      // Text styles — reusable typography scales
      textStyles: {
         heading: {
            fontFamily: "heading",
            fontWeight: "bold",
            letterSpacing: "wider",
         },
         headingLg: {
            fontFamily: "heading",
            fontWeight: "bold",
            fontSize: { base: "4xl", md: "5xl", lg: "6xl" },
            letterSpacing: "wider",
         },
         headingMd: {
            fontFamily: "heading",
            fontWeight: "bold",
            fontSize: { base: "3xl", md: "4xl", lg: "5xl" },
            letterSpacing: "wider",
         },
         headingSm: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: "xl",
            letterSpacing: "wider",
         },
         body: {
            fontFamily: "body",
            lineHeight: "relaxed",
         },
         bodyLg: {
            fontFamily: "body",
            fontSize: "lg",
            lineHeight: "relaxed",
         },
         bodySm: {
            fontFamily: "body",
            fontSize: "sm",
            lineHeight: "relaxed",
         },
         mono: {
            fontFamily: "mono",
         },
      },
   },
});

export type AboutSystem = typeof aboutSystem;
