/**
 * Content loader for markdown files with JSON frontmatter.
 *
 * Explicitly imports each markdown file as a raw string, then parses the
 * leading --- delimited JSON frontmatter.
 */

interface Frontmatter {
   [key: string]: unknown;
}

interface ContentFile {
   frontmatter: Frontmatter;
   body: string;
   raw: string;
}

/**
 * Parse a markdown file with --- delimited JSON frontmatter.
 */
function parseFrontmatter(raw: string): ContentFile {
   let frontmatter: Frontmatter = {};
   let body = raw;

   const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
   if (match) {
      try {
         frontmatter = JSON.parse(match[1]);
      } catch {
         frontmatter = {};
      }
      body = match[2];
   }

   return { frontmatter, body, raw };
}

// Explicitly import each markdown file as raw text
import heroMd from "/src/components/about/content/hero.md?raw";
import featuresMd from "/src/components/about/content/features.md?raw";
import conceptMd from "/src/components/about/content/concept.md?raw";
import pricingMd from "/src/components/about/content/pricing.md?raw";
import invitationMd from "/src/components/about/content/invitation.md?raw";
import ctaMd from "/src/components/about/content/cta.md?raw";
import whatWeAreNotMd from "/src/components/about/content/what-we-are-not.md?raw";

const rawFiles: Record<string, string> = {
   hero: heroMd,
   features: featuresMd,
   concept: conceptMd,
   pricing: pricingMd,
   invitation: invitationMd,
   cta: ctaMd,
   "what-we-are-not": whatWeAreNotMd,
};

/**
 * Load all markdown content files.
 * Returns a map of filename (without extension) to parsed content.
 */
export function loadContent(): Record<string, ContentFile> {
   const content: Record<string, ContentFile> = {};

   for (const [key, raw] of Object.entries(rawFiles)) {
      content[key] = parseFrontmatter(raw);
   }

   return content;
}
