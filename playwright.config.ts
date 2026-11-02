import { defineConfig, devices } from "@playwright/test";

/**
 * Independent e2e test runner for the about site.
 * Serves against the local Vite dev server at http://localhost:5173/
 */
export default defineConfig({
   testDir: "e2e",
   testMatch: "e2e/*.spec.ts",
   testIgnore: ["**/vendor/**", "**/out/**", "**/stories/**", "**/midscene/**"],
   outputDir: "e2e/out",
   fullyParallel: false,
   forbidOnly: Boolean(process.env.CI),
   retries: process.env.CI ? 1 : 0,
   workers: 1,
   reporter: [["list"]],
   timeout: 90_000,
   expect: { timeout: 15_000 },
   use: {
      baseURL: (process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173").replace(/\/$/, ""),
      trace: "on-first-retry",
      viewport: { width: 1280, height: 720 },
   },
   projects: [
      {
         name: "chromium",
         use: { ...devices["Desktop Chrome"] },
      },
   ],
});
