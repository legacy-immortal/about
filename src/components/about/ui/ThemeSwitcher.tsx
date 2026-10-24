"use client";

import { IconButton } from "@chakra-ui/react";
import { GiKey, GiNautilusShell } from "react-icons/gi";
import { useColorMode } from "~/components/ui/theme/color-mode";

/** About header toggle — uses app-wide ColorModeProvider (same key as dashboard). */
export default function ThemeSwitcher() {
   const { colorMode, setColorMode } = useColorMode();

   const handleToggle = () => {
      setColorMode(colorMode === "light" ? "dark" : "light");
   };

   const CurrentIcon = colorMode === "light" ? GiNautilusShell : GiKey;
   const nextThemeLabel = colorMode === "light" ? "Vault" : "Archive";

   return (
      <IconButton
         onClick={handleToggle}
         aria-label={`Switch to ${nextThemeLabel} theme`}
         variant="ghost"
         size="sm"
         color="fg"
         _dark={{ color: "fg.muted", _hover: { opacity: 0.9 } }}
         _hover={{ opacity: 0.7 }}
         transition="all 0.3s ease"
         title={`Switch to ${nextThemeLabel} theme`}
      >
         <CurrentIcon size={20} aria-hidden />
      </IconButton>
   );
}
