/**
 * Smooth-scrolls to an in-page section without touching `location.hash` — keeps the
 * address bar clean while still landing under the fixed header.
 * @module routes/marketing/-lib/scrollToSection
 **/
import { HEADER_OFFSET_PX } from "./headerOffset";

export function scrollToSection(id: string): boolean {
   if (typeof document === "undefined") {
      return false;
   }
   const el = document.getElementById(id);
   if (!el) {
      return false;
   }
   const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
   window.scrollTo({ top, behavior: "smooth" });
   return true;
}
