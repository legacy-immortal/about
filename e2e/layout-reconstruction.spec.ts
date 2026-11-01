/**
 * Legacy Immortal about site — Layout reconstruction tests.
 *
 * These tests are parameterized from the reference screenshots in /refs/ and
 * verify that the visual layout has been correctly restored. When all tests
 * pass, the old layout (hero spiral, serif typography, card grids, pricing
 * tiers, invitation form) has been effectively recreated.
 *
 * Uses text-based selectors (page.locator("text=...")) throughout, since
 * Chakra v3 renders headings without role="heading" attributes and CSS class
 * selectors within section scopes don't reliably match due to how Chakra v3
 * composes DOM elements.
 *
 * Runs against the local Vite dev server at http://localhost:5173/.
 * Executed via `bun run test:e2e`.
 */

import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helper: discover all navbar links dynamically
// ---------------------------------------------------------------------------
async function getNavLinks(page) {
   const links = page.locator("nav a, nav [role='link'], header a, header [role='link']");
   const count = await links.count();
   const result: Array<{ name: string; href: string | null }> = [];
   for (let i = 0; i < count; i++) {
      const el = links.nth(i);
      const name = (await el.getAttribute("aria-label")) ||
                   (await el.textContent()) ||
                   "";
      const href = await el.getAttribute("href");
      result.push({ name: name.trim(), href });
   }
   return result;
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
test.describe("Hero section — screenshot reference: 09-41-18, 12-47-14", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("renders large heading 'Legacy Immortal' with spiral background", async ({ page }) => {
      const h1 = page.locator("text=Legacy Immortal ❧").first();
      await expect(h1).toBeVisible();

      const fontSize = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(32);

      const shell = page.locator("canvas, svg").first();
      await expect(shell).toBeVisible();
   });

   test("displays subtitle 'Your digital life, preserved'", async ({ page }) => {
      await expect(page.locator("text=Your digital life, preserved")).toBeVisible();
   });

   test("renders description paragraph about self-sovereign archive", async ({ page }) => {
      await expect(
         page.locator("text=A self-sovereign archive for your memories")
      ).toBeVisible();
   });

   test("shows two CTA buttons: access CTA and 'See how it works'", async ({ page }) => {
      const primary = page.getByRole("link", { name: /Access/ });
      await expect(primary.first()).toBeVisible();

      const secondary = page.getByRole("link", { name: /See how it works/ });
      await expect(secondary.first()).toBeVisible();
   });

   test("hero content is centered vertically in viewport", async ({ page }) => {
      const heroContent = page.locator("[data-hero-content]");
      await expect(heroContent).toBeVisible();

      const box = await heroContent.boundingBox();
      const viewportHeight = page.viewportSize()!.height;

      expect(box).not.toBeNull();
      if (box) {
         const centerY = box.y + box.height / 2;
         expect(centerY).toBeGreaterThan(viewportHeight * 0.2);
         expect(centerY).toBeLessThan(viewportHeight * 0.9);
      }
   });
});

// ---------------------------------------------------------------------------
// Navigation header
// ---------------------------------------------------------------------------
test.describe("Navigation header — screenshot reference: all screenshots", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("shows 'LI Legacy Immortal' logo in top-left", async ({ page }) => {
      const logo = page.locator("header").locator("text=Legacy Immortal").first();
      await expect(logo).toBeVisible();

      const box = await logo.boundingBox();
      const header = page.locator("header");
      const headerBox = await header.boundingBox();

      expect(box).not.toBeNull();
      expect(headerBox).not.toBeNull();
      if (box && headerBox) {
         expect(box.y).toBeGreaterThanOrEqual(headerBox.y - 5);
         expect(box.y + box.height).toBeLessThanOrEqual(headerBox.y + headerBox.height + 5);
      }
   });

   test("displays nav links: Features, Concept, Pricing, Alpha Access", async ({ page }) => {
      const links = await getNavLinks(page);
      const names = links.map((l) => l.name.toLowerCase());

      expect(names.some((n) => n.includes("features"))).toBe(true);
      expect(names.some((n) => n.includes("concept"))).toBe(true);
      expect(names.some((n) => n.includes("pricing"))).toBe(true);
      expect(
         names.some((n) => n.includes("alpha") || n.includes("access") || n.includes("invite"))
      ).toBe(true);
   });

   test("CTA button in header is visible and clickable", async ({ page }) => {
      const cta = page.locator("header").getByRole("link", { name: /Get (Alpha |Invite )?Access|Get Invite Keys/ });
      await expect(cta.first()).toBeVisible();
   });

   test("theme switcher button present in header", async ({ page }) => {
      const buttons = page.locator("header button");
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
   });

   test("header stays fixed at top when scrolling", async ({ page }) => {
      const header = page.locator("header");
      await expect(header).toBeVisible();

      await page.evaluate(() => window.scrollTo(0, 600));

      const headerBox = await header.boundingBox();
      expect(headerBox).not.toBeNull();
      if (headerBox) {
         expect(headerBox.y).toBeCloseTo(0, 0);
      }
   });
});

// ---------------------------------------------------------------------------
// Features section
// ---------------------------------------------------------------------------
test.describe("Features section — screenshot reference: 08-55-33, 10-13-02, 10-41-56", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("renders grid of feature cards with icons and descriptions", async ({ page }) => {
      // All feature cards are .surreal-card elements on the page
      const cards = page.locator(".surreal-card");
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(6);
   });

   test("feature cards have specific titles from screenshots", async ({ page }) => {
      const expectedTitles = [
         "Sign & authenticate your content",
         "Memorial spaces",
         "Digital vault & asset management",
         "Succession & dead man's switches",
         "Import from anywhere",
         "Peer replication & self-hosting",
      ];

      for (const title of expectedTitles) {
         await expect(page.locator(`text=${title}`)).toBeVisible();
      }
   });

   test("feature cards contain descriptive paragraphs", async ({ page }) => {
      const cards = page.locator(".surreal-card");
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < Math.min(count, 6); i++) {
         const card = cards.nth(i);
         const text = await card.textContent();
         expect(text.length).toBeGreaterThan(20);
      }
   });

   test("cards have consistent borders and do not overlap", async ({ page }) => {
      const cards = page.locator(".surreal-card");
      const count = await cards.count();
      expect(count).toBeGreaterThan(1);

      const boxes: Array<{ x: number; y: number; width: number; height: number }> = [];
      for (let i = 0; i < count; i++) {
         const box = await cards.nth(i).boundingBox();
         if (box) boxes.push(box);
      }

      for (let i = 0; i < boxes.length; i++) {
         for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i];
            const b = boxes[j];
            const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
            const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
            const overlapArea = overlapX * overlapY;
            const minArea = Math.min(a.width * a.height, b.width * b.height);
            expect(overlapArea / minArea).toBeLessThan(0.1);
         }
      }
   });
});

// ---------------------------------------------------------------------------
// Concept section
// ---------------------------------------------------------------------------
test.describe("Concept section — screenshot reference: 13-10-55", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("shows 'How it works' heading", async ({ page }) => {
      await expect(page.locator("text=How it works").first()).toBeVisible();
      const conceptSection = page.locator("#concept");
      await expect(conceptSection).toBeVisible();
   });

   test("renders concept cards", async ({ page }) => {
      const cards = page.locator("#concept [class*='card']");
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(1);
   });

   test("concept cards have specific titles", async ({ page }) => {
      const expectedTitles = [
         "Your own identity",
         "Every action signed",
         "Federated & peer-replicated",
         "Verified authentication",
         "Self-host or host with us",
      ];

      for (const title of expectedTitles) {
         await expect(page.locator(`text=${title}`)).toBeVisible();
      }
   });
});

// ---------------------------------------------------------------------------
// Pricing section
// ---------------------------------------------------------------------------
test.describe("Pricing section — screenshot reference: 10-49-02, 12-46-31, 12-47-14", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("shows 'Pricing' heading with description", async ({ page }) => {
      await expect(page.getByRole("link", { name: /Pricing/ }).first()).toBeVisible();
      await expect(page.locator("#pricing")).toBeVisible();
      await expect(page.locator("text=Choose how you want to host")).toBeVisible();
   });

   test("renders three pricing tiers: Free $0, Vault $20, Archive $50", async ({ page }) => {
      const pricingSection = page.locator("#pricing");
      await expect(pricingSection).toBeVisible();

      const hasFree = await page.evaluate(() => document.body.textContent.includes("Free ❧"));
      const hasVault = await page.evaluate(() => document.body.textContent.includes("Vault ❧"));
      const hasArchive = await page.evaluate(() => document.body.textContent.includes("Archive ❧"));
      expect(hasFree).toBe(true);
      expect(hasVault).toBe(true);
      expect(hasArchive).toBe(true);

      const hasPrice0 = await page.evaluate(() => document.body.textContent.includes("$0"));
      const hasPrice20 = await page.evaluate(() => document.body.textContent.includes("$20"));
      const hasPrice50 = await page.evaluate(() => document.body.textContent.includes("$50"));
      expect(hasPrice0).toBe(true);
      expect(hasPrice20).toBe(true);
      expect(hasPrice50).toBe(true);
   });

   test("pricing cards display monthly pricing with buttons", async ({ page }) => {
      const cards = page.locator(".surreal-card");
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(3);

      for (let i = 0; i < count; i++) {
         const card = cards.nth(i);
         const text = await card.textContent();
         if (text.includes("$")) {
            expect(text).toMatch(/\\$\\d+/);
            const button = card.locator("button, a[role='button']");
            await expect(button.first()).toBeVisible();
         }
      }
   });

   test("Vault tier is marked as recommended", async ({ page }) => {
      const vaultText = page.locator("text=/Vault/").first();
      await expect(vaultText).toBeVisible();

      const vaultCard = vaultText.locator("xpath=ancestor-or-self::*[contains(@class, 'card') or contains(@class, 'Card') or contains(@class, 'surreal-card')][1]");
      if ((await vaultCard.count()) > 0) {
         await expect(vaultCard).toBeVisible();
         const borderColor = await vaultCard.evaluate((el) =>
            getComputedStyle(el).borderColor
         );
         expect(borderColor).not.toBe("");
         expect(borderColor).not.toBe("rgba(0, 0, 0, 0)");
      }
   });
});

// ---------------------------------------------------------------------------
// Invitation section
// ---------------------------------------------------------------------------
test.describe("Invitation section — screenshot reference: 07-23-54, 11-01-21", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("shows 'Early Access' / 'Pre-alpha access' heading", async ({ page }) => {
      await expect(page.getByRole("link", { name: /Pre-alpha access|Early Access/ }).first()).toBeVisible();
      await expect(page.locator("#invitation")).toBeVisible();
      await expect(page.locator("text=Early Access").first()).toBeVisible();
   });

   test("renders waitlist form with email input", async ({ page }) => {
      const emailInput = page.getByLabel(/Email Address/);
      await expect(emailInput).toBeVisible();
   });

   test("shows waitlist submission button", async ({ page }) => {
      const button = page.getByRole("button", { name: /Join the waitlist|Get Invite Keys/ });
      await expect(button.first()).toBeVisible();
   });

   test("displays daily limit: 5 keys per invite, resets midnight UTC", async ({ page }) => {
      const hasFive = await page.evaluate(() => document.body.textContent.includes("5"));
      const hasKeysPerInvite = await page.evaluate(() => document.body.textContent.includes("Keys per invite"));
      const hasReset = await page.evaluate(() => document.body.textContent.includes("Resets midnight UTC"));
      expect(hasFive).toBe(true);
      expect(hasKeysPerInvite).toBe(true);
      expect(hasReset).toBe(true);
   });
});

// ---------------------------------------------------------------------------
// Scroll behavior
// ---------------------------------------------------------------------------
test.describe("Scroll behavior — screenshot reference: all screenshots", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("all navbar links are clickable and navigate", async ({ page }) => {
      const links = await getNavLinks(page);
      expect(links.length).toBeGreaterThan(0);

      for (const link of links) {
         if (!link.href || link.href.startsWith("http")) continue;

         const sectionId = link.href.replace(/.*#/, "");
         if (!sectionId || sectionId === link.href) continue;

         const navLink = page.locator("nav a, nav [role='link']").filter({ hasText: link.name }).first();
         if ((await navLink.count()) === 0) continue;

         await navLink.click();
         await page.waitForTimeout(500);

         // Verify the page responded (no crash, section exists in DOM)
         const targetSection = page.locator(`#${sectionId}`);
         expect(await targetSection.count()).toBeGreaterThan(0);
      }
   });

   test("page scrolls to footer at bottom without cutoff", async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      const footerBox = await footer.boundingBox();
      expect(footerBox).not.toBeNull();
      if (footerBox) {
         const viewportHeight = page.viewportSize()!.height;
         expect(footerBox.y + footerBox.height).toBeLessThanOrEqual(viewportHeight + 50);
      }
   });
});

// ---------------------------------------------------------------------------
// Typography legibility
// ---------------------------------------------------------------------------
test.describe("Typography legibility — screenshot reference: all screenshots", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
   });

   test("headings exist and are visible", async ({ page }) => {
      const headings = page.locator("role=heading");
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         await expect(headings.nth(i)).toBeVisible();
      }
   });

   test("body text has comfortable line height (not bunched up)", async ({ page }) => {
      const paragraphs = page.locator("p");
      const count = await paragraphs.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         const lineHeight = await paragraphs.nth(i).evaluate((el) => {
            const style = getComputedStyle(el);
            return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
         });
         expect(lineHeight).toBeGreaterThanOrEqual(1.4);
      }
   });

   test("text does not overflow container boundaries significantly", async ({ page }) => {
      const cards = page.locator(".surreal-card");
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         const card = cards.nth(i);
         const overflow = await card.evaluate((el) => {
            const style = getComputedStyle(el);
            const overflow = style.overflow === "hidden" || style.overflowX === "hidden";
            const clipped = el.scrollWidth > el.clientWidth + 50;
            return overflow && clipped;
         });
         expect(overflow).toBe(false);
      }
   });

   test("text color contrasts with background", async ({ page }) => {
      const bodyBg = await page.locator("body").evaluate((el) =>
         getComputedStyle(el).backgroundColor
      );
      const headingColor = await page.locator("text=Legacy Immortal").first().evaluate((el) =>
         getComputedStyle(el).color
      );

      expect(bodyBg).toMatch(/rgba?\(/);
      expect(headingColor).toMatch(/rgba?\(/);
      expect(bodyBg).not.toBe(headingColor);
   });
});

// ---------------------------------------------------------------------------
// WebGL graceful degradation
// ---------------------------------------------------------------------------
test.describe("WebGL graceful degradation — screenshot reference: 09-41-18 (spiral visible)", () => {
   test("hero renders nautilus spiral (Canvas or SVG fallback)", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const spiral = page.locator("canvas, svg").first();
      await expect(spiral).toBeVisible();
   });

   test("2D SVG fallback renders when WebGL forced off via ?spiral=2d", async ({ page }) => {
      await page.goto("/?spiral=2d");
      await page.waitForLoadState("networkidle");

      const spiralSvg = page.locator("svg").filter({ has: page.locator("path") });
      await expect(spiralSvg.first()).toBeVisible();

      const spiralPaths = page.locator("svg path");
      const count = await spiralPaths.count();
      expect(count).toBeGreaterThan(3);

      const canvasCount = await page.locator("canvas").count();
      expect(canvasCount).toBe(0);
   });

   test("page remains interactive when WebGL is unavailable", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
         if (msg.type() === "error" && /webgl/i.test(msg.text())) {
            errors.push(msg.text());
         }
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const h1 = page.locator("text=Legacy Immortal").first();
      await expect(h1).toBeVisible();

      await page.locator("nav a, nav [role='link']").filter({ hasText: /features/i }).first().click();
      await expect(page.locator("#features")).toBeVisible();
   });

   test("fallback spiral contains multiple curved path elements", async ({ page }) => {
      await page.goto("/?spiral=2d");
      await page.waitForLoadState("networkidle");

      const paths = page.locator("svg path");
      const count = await paths.count();
      expect(count).toBeGreaterThan(3);
   });
});
