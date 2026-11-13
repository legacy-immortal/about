import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
   if (m.type() === "error") errors.push(`console: ${m.text()}`);
});

await page.goto("http://localhost:5173/about/");
await page.waitForTimeout(3500);
await page.screenshot({ path: "/tmp/shots/hero.png" });

await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/shots/features.png" });

await page.evaluate(() => window.scrollTo(0, 2100));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/shots/concept.png" });

await page.evaluate(() => window.scrollTo(0, 3400));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/shots/statement.png" });

await page.evaluate(() => window.scrollTo(0, 4400));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/shots/invitation.png" });

await page.evaluate(() => window.scrollTo(0, 5600));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/shots/pricing.png" });

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/shots/footer.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:5173/about/");
await mobile.waitForTimeout(3000);
await mobile.screenshot({ path: "/tmp/shots/mobile-hero.png" });
await mobile.evaluate(() => window.scrollTo(0, 1400));
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: "/tmp/shots/mobile-features.png" });

console.log("errors:", errors.length ? errors.join("\n") : "none");
const metrics = await page.evaluate(() => {
   const q = (s) => document.querySelector(s);
   const style = (el) => (el ? getComputedStyle(el) : null);
   const h1 = q("h1");
   const h2 = q("h2");
   const h3 = q("#features h3");
   return {
      h1: h1 && { size: style(h1).fontSize, family: style(h1).fontFamily, lh: style(h1).lineHeight, ls: style(h1).letterSpacing },
      h2: h2 && { size: style(h2).fontSize, family: style(h2).fontFamily },
      h3: h3 && { size: style(h3).fontSize, family: style(h3).fontFamily },
      body: getComputedStyle(document.body).backgroundColor,
      paper: style(q("[data-about-site]")).backgroundColor,
      featureCards: document.querySelectorAll("#features .surreal-card").length,
      pricingChakraText: document.querySelectorAll("#pricing .chakra-text").length,
      svgCount: document.querySelectorAll("svg").length,
   };
});
console.log(JSON.stringify(metrics, null, 2));
await browser.close();
