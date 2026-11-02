/**
 * Legacy Immortal about site — independent e2e smoke tests.
 *
 * Runs against the local Vite dev server (http://localhost:5173/).
 * This suite belongs to the `about` project and is
 * executed via `bun run test:e2e` from this repo — not from the
 * adjacent `legacyimmortal-app` project.
 */

import { expect, test } from "@playwright/test";

test.describe("About site smoke", () => {
   test("hero section loads with brand title", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("h1")).toContainText("Legacy Immortal");
      await expect(page.locator("text=Your digital life, preserved")).toBeVisible();
   });

   test("navigation links scroll to sections", async ({ page }) => {
      await page.goto("/");
      await page.locator("nav").getByRole("link", { name: "Features" }).click();
      await expect(page.locator("#features")).toBeVisible();

      await page.locator("nav").getByRole("link", { name: "Concept" }).click();
      await expect(page.locator("#concept")).toBeVisible();

      await page.locator("nav").getByRole("link", { name: "Pricing" }).click();
      await expect(page.locator("#pricing")).toBeVisible();

      await page.locator("nav").getByRole("link", { name: "Early Access" }).click();
      await expect(page.locator("#invitation")).toBeVisible();
   });

   test("features section renders all feature cards", async ({ page }) => {
      await page.goto("/#features");
      const features = page.locator("#features");
      await expect(features).toBeVisible();
      await expect(features.getByText("Sign & authenticate your content")).toBeVisible();
      await expect(features.getByText("Memorial spaces")).toBeVisible();
      await expect(features.getByText("Digital vault & asset management")).toBeVisible();
      await expect(features.getByText("Succession & dead man's switches")).toBeVisible();
   });

   test("concept section renders all concept cards", async ({ page }) => {
      await page.goto("/#concept");
      const concept = page.locator("#concept");
      await expect(concept).toBeVisible();
      await expect(concept.getByText("Your own identity")).toBeVisible();
      await expect(concept.getByText("Every action signed")).toBeVisible();
      await expect(concept.getByText("Federated & peer-replicated")).toBeVisible();
      await expect(concept.getByText("Verified authentication")).toBeVisible();
      await expect(concept.getByText("Self-host or host with us")).toBeVisible();
   });

   test("pricing section renders all three plans", async ({ page }) => {
      await page.goto("/#pricing");
      const pricing = page.locator("#pricing");
      await expect(pricing).toBeVisible();
      await expect(pricing.getByText(/Free/)).toBeVisible();
      await expect(pricing.getByText(/Vault/)).toBeVisible();
      await expect(pricing.getByText(/Archive/)).toBeVisible();
   });

   test("invitation section renders form and invite keys", async ({ page }) => {
      await page.goto("/#invitation");
      const invitation = page.locator("#invitation");
      await expect(invitation).toBeVisible();
      await expect(invitation.getByRole("heading", { name: /Early Access/ })).toBeVisible();
      await expect(invitation.getByLabel(/Email Address/)).toBeVisible();
      await expect(invitation.getByText(/Keys per Invite/)).toBeVisible();
      await expect(invitation.getByText("5")).toBeVisible();
   });

   test("CTA section renders with invite button", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Build Your Legacy" })).toBeVisible();
      await expect(
         page.locator("#cta").getByRole("link", { name: /Get Invite Keys/ })
      ).toBeVisible();
   });

   test("footer renders brand and product links", async ({ page }) => {
      await page.goto("/");
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
      await expect(footer.getByRole("link", { name: "Early Access" })).toBeVisible();
      await expect(footer.getByText(/© 2026 Legacy Immortal/)).toBeVisible();
   });
});
