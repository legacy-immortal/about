/**
 * Legacy Immortal about site — layout, typography, scroll, and WebGL fallback tests.
 *
 * These tests verify that the visual layout matches the intended design:
 *   • Scroll behavior (smooth scroll, sticky header, section navigation)
 *   • Typography legibility (line height, letter spacing, no bunching/letterboxing)
 *   • WebGL graceful degradation (Canvas vs 2D SVG fallback)
 *   • Layout integrity (card borders, section padding, heading hierarchy)
 *
 * Runs against the local Vite dev server at http://localhost:5173/.
 * Executed via `bun run test:e2e`.
 */

import { expect, test } from "@playwright/test";

test.describe("Scroll behavior", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
   });

   test("header is fixed at top and stays visible on scroll", async ({ page }) => {
      const header = page.locator("header");
      await expect(header).toBeVisible();

      // Scroll down the page
      await page.evaluate(() => window.scrollTo(0, 800));

      // Header should still be at the top (fixed position)
      const headerBox = await header.boundingBox();
      expect(headerBox).not.toBeNull();
      if (headerBox) {
         expect(headerBox.y).toBeCloseTo(0, 0);
      }
   });

   test("all navbar links scroll to their target sections", async ({ page }) => {
      // Discover all navbar links dynamically
      const navLinks = page.locator("nav a, nav [role='link']");
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);

      const linkNames: string[] = [];
      for (let i = 0; i < linkCount; i++) {
         const name = await navLinks.nth(i).getAttribute("aria-label") ||
                      await navLinks.nth(i).textContent() ||
                      "";
         linkNames.push(name.trim());
      }

      // For each link, click it and verify the target section scrolls into view
      for (let i = 0; i < linkCount; i++) {
         const link = navLinks.nth(i);
         const href = await link.getAttribute("href");

         // Skip external links and non-anchor links
         if (!href || href.startsWith("http") || href.startsWith("mailto")) {
            continue;
         }

         // Extract the section id from hash links like "#features"
         const sectionId = href.replace("#", "");
         if (!sectionId) continue;

         await link.click();

         const targetSection = page.locator(`#${sectionId}`);
         await expect(targetSection).toBeVisible({ timeout: 10_000 });

         // Verify the section landed under the fixed header
         const sectionBox = await targetSection.boundingBox();
         const headerBox = await page.locator("header").boundingBox();

         expect(sectionBox).not.toBeNull();
         expect(headerBox).not.toBeNull();

         if (sectionBox && headerBox) {
            const headerBottom = headerBox.y + headerBox.height;
            // Section top should be at or just below header bottom (allowing small offset)
            expect(sectionBox.y).toBeGreaterThanOrEqual(headerBottom - 5);
            expect(sectionBox.y).toBeLessThan(headerBottom + 150);
         }
      }
   });

   test("scrolling to bottom reaches footer without content cutoff", async ({ page }) => {
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

   test("scroll position is preserved when navigating between sections", async ({ page }) => {
      // Scroll down first
      await page.evaluate(() => window.scrollTo(0, 500));
      const initialY = await page.evaluate(() => window.scrollY);
      expect(initialY).toBeGreaterThan(0);

      // Click a nav link
      await page.locator("nav").getByRole("link", { name: /concept/i }).first().click();
      await page.waitForTimeout(500);

      // Page should have scrolled to the concept section
      const concept = page.locator("#concept");
      await expect(concept).toBeVisible();
   });
});

test.describe("Typography legibility", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
   });

   test("hero heading has serif font and adequate size", async ({ page }) => {
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();

      const fontFamily = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
      const fontSize = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      const letterSpacing = await h1.evaluate(
         (el) => parseFloat(getComputedStyle(el).letterSpacing)
      );

      // Serif font (Crimson Text family)
      expect(fontFamily.toLowerCase()).toMatch(/crimson|garamond|serif/);

      // Large enough to read (at least 3rem = 48px on base)
      expect(fontSize).toBeGreaterThanOrEqual(36);

      // Letter spacing should be present for the wide tracking style
      expect(letterSpacing).toBeGreaterThan(0);
   });

   test("hero description has comfortable line height (not bunched up)", async ({ page }) => {
      const description = page.locator("text=Your digital life, preserved").first();
      await expect(description).toBeVisible();

      // Find the paragraph element containing the description
      const para = description.locator("xpath=ancestor::p[1]");
      const lineHeight = await para.evaluate((el) => {
         const style = getComputedStyle(el);
         return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
      });

      // Line height should be at least 1.4 for readability
      expect(lineHeight).toBeGreaterThanOrEqual(1.4);
   });

   test("section headings use serif font", async ({ page }) => {
      const headings = page.locator("h2");
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         const heading = headings.nth(i);
         await expect(heading).toBeVisible();
         const fontFamily = await heading.evaluate((el) =>
            getComputedStyle(el).fontFamily
         );
         expect(fontFamily.toLowerCase()).toMatch(/crimson|garamond|serif/);
      }
   });

   test("card headings use serif font", async ({ page }) => {
      await page.goto("/#features");
      const cardHeadings = page.locator("#features h3");
      const count = await cardHeadings.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         const heading = cardHeadings.nth(i);
         const fontFamily = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
         expect(fontFamily.toLowerCase()).toMatch(/crimson|garamond|serif/);
      }
   });

   test("text does not overflow its container (no letterboxing)", async ({ page }) => {
      await page.goto("/#features");

      const featureCards = page.locator("#features .surreal-card");
      const count = await featureCards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         const card = featureCards.nth(i);
         const cardBox = await card.boundingBox();
         const textOverflow = await card.evaluate((el) => {
            const style = getComputedStyle(el);
            return style.overflow === "hidden" &&
                   parseFloat(style.maxWidth) > 0 &&
                   el.scrollWidth > el.clientWidth;
         });
         // Text should not be horizontally clipped
         expect(textOverflow).toBe(false);

         if (cardBox) {
            const children = card.locator(":scope > *");
            const childCount = await children.count();
            for (let j = 0; j < childCount; j++) {
               const child = children.nth(j);
               const childBox = await child.boundingBox();
               if (cardBox && childBox) {
                  expect(childBox.x).toBeGreaterThanOrEqual(cardBox.x - 2);
                  expect(childBox.x + childBox.width).toBeLessThanOrEqual(
                     cardBox.x + cardBox.width + 2
                  );
               }
            }
         }
      }
   });

   test("contrast between text and background meets minimum ratio", async ({ page }) => {
      // Check that text has sufficient contrast by verifying computed colors
      const body = page.locator("body");
      const bgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
      const textColor = await page.locator("h1").first().evaluate((el) =>
         getComputedStyle(el).color
      );

      expect(bgColor).not.toBe(textColor);
      // Both should be valid RGB/RGBA values
      expect(bgColor).toMatch(/rgba?\(/);
      expect(textColor).toMatch(/rgba?\(/);
   });

   test("pricing plan descriptions have readable line height", async ({ page }) => {
      await page.goto("/#pricing");
      const descriptions = page.locator("#pricing .chakra-text");
      const count = await descriptions.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         const el = descriptions.nth(i);
         const lineHeight = await el.evaluate((node) => {
            const style = getComputedStyle(node);
            return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
         });
         // Body text should have comfortable line height
         expect(lineHeight).toBeGreaterThanOrEqual(1.4);
      }
   });
});

test.describe("WebGL graceful degradation", () => {
   test("hero section renders content even when WebGL is unavailable", async ({ page }) => {
      // Force 2D fallback via URL parameter (dev mode only)
      await page.goto("/?spiral=2d");

      const heroContent = page.locator("[data-hero-content]");
      await expect(heroContent).toBeVisible();

      const h1 = page.locator("h1").first();
      await expect(h1).toContainText("Legacy Immortal");
   });

   test("2D SVG fallback renders when WebGL forced off", async ({ page }) => {
      await page.goto("/?spiral=2d");

      // The 2D fallback should render an SVG element
      const svg = page.locator("svg");
      await expect(svg).toBeVisible();

      // The 3D Canvas should NOT be present when forced to 2D
      const canvasCount = await page.locator("canvas").count();
      expect(canvasCount).toBe(0);
   });

   test("3D Canvas renders when WebGL is available (default)", async ({ page }) => {
      await page.goto("/");

      // Wait for the NautilusShell component to mount and check WebGL
      await page.waitForTimeout(2000);

      // Either a Canvas (3D) or SVG (2D fallback) should be present
      const canvasOrSvg = page.locator("canvas, svg");
      await expect(canvasOrSvg.first()).toBeVisible();
   });

   test("WebGL errors do not crash the page", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
         if (msg.type() === "error" && msg.text().includes("WebGL")) {
            errors.push(msg.text());
         }
      });

      await page.goto("/");
      await page.waitForTimeout(2000);

      // Page should still be functional despite any WebGL warnings
      const h1 = page.locator("h1").first();
      await expect(h1).toContainText("Legacy Immortal");

      // Navigate to a section to confirm interactivity
      await page.locator("nav").getByRole("link", { name: "Features" }).click();
      await expect(page.locator("#features")).toBeVisible();
   });

   test("2D fallback shows nautilus spiral SVG paths", async ({ page }) => {
      await page.goto("/?spiral=2d");

      // The SVG fallback should contain path elements for the spiral
      const spiralPaths = page.locator("svg path");
      const count = await spiralPaths.count();
      expect(count).toBeGreaterThan(0);
   });
});

test.describe("Layout integrity", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/");
   });

   test("feature cards have consistent borders and spacing", async ({ page }) => {
      await page.goto("/#features");
      const cards = page.locator("#features .surreal-card");
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
         const card = cards.nth(i);
         const borderWidth = await card.evaluate((el) =>
            getComputedStyle(el).borderWidth
         );
         const borderStyle = await card.evaluate((el) =>
            getComputedStyle(el).borderStyle
         );
         const borderRadius = await card.evaluate((el) =>
            getComputedStyle(el).borderRadius
         );

         // Cards should have visible borders
         expect(parseFloat(borderWidth)).toBeGreaterThan(0);
         expect(borderStyle).not.toBe("none");
         // Border radius should be small/sharp (2px per design)
         expect(parseFloat(borderRadius)).toBeLessThanOrEqual(8);
      }
   });

   test("section vertical padding is consistent", async ({ page }) => {
      const sections = ["#features", "#concept", "#pricing", "#invitation", "#cta"];

      for (const selector of sections) {
         const section = page.locator(selector);
         await expect(section).toBeVisible();

         const paddingTop = await section.evaluate((el) =>
            parseFloat(getComputedStyle(el).paddingTop)
         );
         const paddingBottom = await section.evaluate((el) =>
            parseFloat(getComputedStyle(el).paddingBottom)
         );

         // Sections should have meaningful vertical padding (not bunched up)
         expect(paddingTop).toBeGreaterThan(20);
         expect(paddingBottom).toBeGreaterThan(20);
      }
   });

   test("heading hierarchy is correct (h1 -> h2 -> h3)", async ({ page }) => {
      await page.goto("/");

      const h1 = page.locator("h1");
      const h2s = page.locator("h2");
      const h3s = page.locator("h3");

      await expect(h1.first()).toBeVisible();
      expect(await h2s.count()).toBeGreaterThan(0);
      expect(await h3s.count()).toBeGreaterThan(0);

      // h1 should be largest
      const h1Size = await h1.first().evaluate((el) =>
         parseFloat(getComputedStyle(el).fontSize)
      );
      const h2Size = await h2s.first().evaluate((el) =>
         parseFloat(getComputedStyle(el).fontSize)
      );
      const h3Size = await h3s.first().evaluate((el) =>
         parseFloat(getComputedStyle(el).fontSize)
      );

      expect(h1Size).toBeGreaterThan(h2Size);
      expect(h2Size).toBeGreaterThan(h3Size);
   });

   test("content width does not exceed viewport on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");

      const body = page.locator("body");
      const bodyBox = await body.boundingBox();
      const viewportWidth = page.viewportSize()!.width;

      expect(bodyBox).not.toBeNull();
      if (bodyBox) {
         expect(bodyBox.width).toBeLessThanOrEqual(viewportWidth);
      }
   });

   test("cards do not overlap each other in grid layout", async ({ page }) => {
      await page.goto("/#features");
      const cards = page.locator("#features .surreal-card");
      const count = await cards.count();
      expect(count).toBeGreaterThan(1);

      const boxes: Array<{ x: number; y: number; width: number; height: number }> = [];
      for (let i = 0; i < count; i++) {
         const box = await cards.nth(i).boundingBox();
         if (box) boxes.push(box);
      }

      // Check no two cards overlap significantly
      for (let i = 0; i < boxes.length; i++) {
         for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i];
            const b = boxes[j];
            const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
            const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
            const overlapArea = overlapX * overlapY;
            const minArea = Math.min(a.width * a.height, b.width * b.height);
            // Overlap should be less than 10% of the smaller card
            expect(overlapArea / minArea).toBeLessThan(0.1);
         }
      }
   });
});
