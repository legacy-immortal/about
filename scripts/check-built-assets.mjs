#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");

function fail(msg) {
  console.error(`check-built-assets: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  fail(`missing ${indexPath} (run build first)`);
}

const html = fs.readFileSync(indexPath, "utf8");

// Asset URLs emitted by Vite in index.html must be rooted under /about/assets/
const attrRefs = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map((m) => m[1]);
const assetRefs = attrRefs.filter((ref) => ref.includes("/assets/"));
const badAssetRefs = assetRefs.filter((ref) => !ref.startsWith("/about/assets/"));

// Guard against root-level asset references anywhere in built index output.
const rootAssetPatterns = [
  /(?:src|href)=["']\/assets\//g,
  /["']\/assets\/[^"']+["']/g,
];
const rootHits = rootAssetPatterns.flatMap((re) => html.match(re) || []);

if (assetRefs.length === 0) {
  fail("no asset references found in dist/index.html");
}
if (badAssetRefs.length > 0) {
  fail(`asset URLs not under /about/assets/: ${badAssetRefs.join(", ")}`);
}
if (rootHits.length > 0) {
  fail(`root-level asset references emitted: ${[...new Set(rootHits)].join(", ")}`);
}

console.log(`check-built-assets: ok (${assetRefs.length} asset refs under /about/assets)`);
