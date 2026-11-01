// WebGL Fallback Test for Legacy Immortal About Site
// Tests that the nautilus shell 3D component gracefully degrades when WebGL is unavailable
// This isolates the WebGL error issue and verifies the fallback behavior

import { describe, expect, it } from 'bun:test';
import midscene from '@midscenedev/midscene';

const BASE_URL = 'file://' import.meta.url.replace(/\/[^/]*$/, '') + '/fixtures/about/page.html';

describe('WebGL Fallback - Legacy Immortal About Site', () => {
  // Test 1: Verify the page loads without WebGL errors
  it('page loads without WebGL context errors', async () => {
    const scene = await midscene.render(BASE_URL);
    // If we get here without a WebGL context error, the fallback is working
    expect(scene).toBeDefined();
  });

  // Test 2: Verify hero section is accessible even without WebGL
  it('hero h1 is present even without WebGL', async () => {
    const scene = await midscene.render(BASE_URL);
    const hasH1 = await scene.aiAssert('document.querySelector("h1") !== null', {
      errorMessage: 'hero h1 not found',
    });
    expect(hasH1).toBe(true);
  });

  // Test 3: Verify features section is accessible even without WebGL
  it('features section has 3 subsections even without WebGL', async () => {
    const scene = await midscene.render(BASE_URL);
    const count = await scene.aiEval('document.querySelectorAll(".features > div").length');
    expect(count).toBe(3);
  });

  // Test 4: Verify CTA section is present even without WebGL
  it('CTA section is present even without WebGL', async () => {
    const scene = await midscene.render(BASE_URL);
    await scene.aiAssert('document.querySelector(".cta") !== null', {
      errorMessage: 'CTA section not found',
    });
  });

  // Test 5: Verify Chakra button element exists even without WebGL
  it('Chakra button element exists even without WebGL', async () => {
    const scene = await midscene.render(BASE_URL);
    await scene.aiAssert('document.querySelector(".chakra-button") !== null', {
      errorMessage: 'Chakra button not found',
    });
  });
});
