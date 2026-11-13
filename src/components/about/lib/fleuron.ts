/**
 * The content files end titles with a printer's fleuron (❧) — the ornament
 * that closes a title in an old printed book. It belongs in headings, where it
 * reads as part of the title. In buttons and form labels it is noise, so it
 * is stripped there.
 */
const FLEURON = "❧";

export function stripFleuron(text: string | undefined | null): string {
   if (!text) {
      return "";
   }
   const trimmed = text.trim();
   if (!trimmed.endsWith(FLEURON)) {
      return trimmed;
   }
   return trimmed.slice(0, -FLEURON.length).trim();
}

/** True when a string ends with the fleuron. */
export function hasFleuron(text: string | undefined | null): boolean {
   return Boolean(text && text.trimEnd().endsWith(FLEURON));
}
