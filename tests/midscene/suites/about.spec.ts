import { describe, it, expect } from 'bun:test';
import { createAgent } from '@midscene/core';
import { CamoufoxMidsceneInterface } from '/home/user/workspace/camoufox-toolkit/ts/midscene';

const BASE_URL = 'http://localhost:5173/about';

describe('Legacy Immortal About Site – Midscene + Camoufox', () => {
  let agent;

  it('agent boots with Camoufox interface', async () => {
    const iface = new CamoufoxMidsceneInterface({ headless: true, viewport: { width: 1280, height: 800 }});
    await iface.start();
    agent = createAgent(iface);
    expect(agent).toBeDefined();
    await iface.screenshotBase64();
    await iface.stop?.();
  });

  it('hero h1 is present', async () => {
    const iface = new CamoufoxMidsceneInterface({ headless: true });
    await iface.start();
    await agent.navigate(BASE_URL);
    const hasH1 = await agent.eval('document.querySelector("h1") !== null');
    expect(hasH1).toBe(true);
    await iface.stop?.();
  });

  it('features section has 3 subsections', async () => {
    const iface = new CamoufoxMidsceneInterface({ headless: true });
    await iface.start();
    await agent.navigate(BASE_URL);
    const count = await agent.eval('document.querySelectorAll(".features > div").length');
    expect(count).toBe(3);
    await iface.stop?.();
  });
});
