/**
 * Content loader for markdown files with JSON frontmatter.
 *
 * Explicitly imports each markdown file as a raw string, then parses the
 * leading --- delimited JSON frontmatter.
 *
 * Frontmatter is authored as JSON, so its shape differs per section. The
 * loader keeps the raw record and exposes small typed readers; each consumer
 * narrows the fields it needs instead of casting untyped blobs.
 */

export type Frontmatter = {
   [key: string]: unknown;
};

export type ContentFile = {
   frontmatter: Frontmatter;
   body: string;
   raw: string;
};

/** Read a string field, falling back when it is missing or the wrong type. */
export function readString(
   frontmatter: Frontmatter | undefined,
   key: string,
   fallback = "",
): string {
   const value = frontmatter?.[key];
   return typeof value === "string" ? value : fallback;
}

/** Read a boolean field, falling back when it is missing or the wrong type. */
export function readBoolean(
   frontmatter: Frontmatter | undefined,
   key: string,
   fallback = false,
): boolean {
   const value = frontmatter?.[key];
   return typeof value === "boolean" ? value : fallback;
}

/** Read an array field, falling back to an empty list when it is missing. */
export function readArray<T>(frontmatter: Frontmatter | undefined, key: string): T[] {
   const value = frontmatter?.[key];
   return Array.isArray(value) ? (value as T[]) : [];
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
         frontmatter = JSON.parse(match[1]) as Frontmatter;
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

function parseBoolEnv(value: unknown): boolean | undefined {
   if (typeof value !== "string") {
      return undefined;
   }
   const normalized = value.trim().toLowerCase();
   if (normalized === "true" || normalized === "1") {
      return true;
   }
   if (normalized === "false" || normalized === "0") {
      return false;
   }
   return undefined;
}

/** Feature flag for the early access / alpha invitation flow. Defaults to enabled. */
export const EARLY_ACCESS_ENABLED: boolean =
   parseBoolEnv(import.meta.env?.VITE_EARLY_ACCESS_ENABLED) ?? true;

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

/* ── Shared content shapes ──────────────────────────────────────────────── */

export type FeatureItem = {
   title: string;
   description: string;
   icon: string;
};

export type PlanFeature = {
   label: string;
   infoText?: string;
};

export type PlanData = {
   value: string;
   title: string;
   description: string;
   features: PlanFeature[];
   priceCurrency: string;
   priceSymbol: string;
   price: number;
   priceUnit: string;
   recommended?: boolean;
   callToAction?: string;
};

/** Read the feature grid (features.md). */
export function readFeatureItems(frontmatter: Frontmatter | undefined): FeatureItem[] {
   return readArray<Frontmatter>(frontmatter, "items").map((item) => ({
      title: readString(item, "title"),
      description: readString(item, "description"),
      icon: readString(item, "icon", "GiKey"),
   }));
}

/** Read the concept grid (concept.md). */
export function readConceptItems(frontmatter: Frontmatter | undefined): FeatureItem[] {
   return readArray<Frontmatter>(frontmatter, "items").map((item) => ({
      title: readString(item, "title"),
      description: readString(item, "description"),
      icon: readString(item, "icon", "GiKey"),
   }));
}

/** Read the pricing tiers (pricing.md). */
export function readPlans(frontmatter: Frontmatter | undefined): PlanData[] {
   return readArray<Frontmatter>(frontmatter, "plans").map((plan) => ({
      value: readString(plan, "value"),
      title: readString(plan, "title"),
      description: readString(plan, "description"),
      features: readArray<Frontmatter>(plan, "features").map((feature) => {
         const infoText = readString(feature, "infoText");
         return {
            label: readString(feature, "label"),
            ...(infoText ? { infoText } : {}),
         };
      }),
      priceCurrency: readString(plan, "priceCurrency", "US"),
      priceSymbol: readString(plan, "priceSymbol", "$"),
      price: typeof plan.price === "number" ? plan.price : 0,
      priceUnit: readString(plan, "priceUnit", "month"),
      ...(readBoolean(plan, "recommended") ? { recommended: true } : {}),
      callToAction: readString(plan, "callToAction"),
   }));
}
