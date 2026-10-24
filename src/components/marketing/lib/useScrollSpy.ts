/**
 * Tracks which section id is under the fixed header — component-local state only,
 * never written to `location.hash` (see `scrollToSection`).
 * @module routes/marketing/-lib/useScrollSpy
 **/
import { useEffect, useState } from "react";
import { HEADER_OFFSET_PX } from "./headerOffset";

export function useScrollSpy(ids: readonly string[]): string | null {
   const [activeId, setActiveId] = useState<string | null>(null);

   useEffect(() => {
      if (typeof window === "undefined" || ids.length === 0) {
         setActiveId(null);
         return;
      }

      const handle = () => {
         let current: string | null = null;
         for (const id of ids) {
            const el = document.getElementById(id);
            if (!el) {
               continue;
            }
            if (el.getBoundingClientRect().top <= HEADER_OFFSET_PX + 8) {
               current = id;
            }
         }
         setActiveId(current);
      };

      handle();
      window.addEventListener("scroll", handle, { passive: true });
      window.addEventListener("resize", handle);
      return () => {
         window.removeEventListener("scroll", handle);
         window.removeEventListener("resize", handle);
      };
   }, [ids]);

   return activeId;
}
