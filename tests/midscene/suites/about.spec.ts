import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { createAgent } from '@midscene/core';
import { CamoufoxMidsceneInterface } from '/home/user/workspace/camoufox-toolkit/ts/midscene';

const BASE_URL = 'http://localhost:5173/about';

describe('Legacy Immortal About Site – Midscene + Camoufox', { timeout: 120000 }, () => {
  let iface: CamoufoxMidsceneInterface;
  let agent: Awaited<ReturnType<typeof createAgent>>;

  beforeAll(async () => {
    iface = new CamoufoxMidsceneInterface({ headless: true, startupTimeoutMs: 60000 });
    await iface.start();
    agent = createAgent(iface);
  }, 90000);

  afterAll(async () => {
    await iface.destroy().catch(() => {});
  });

  it('agent boots with Camoufox interface', async () => {
    expect(agent).toBeDefined();
    const b64 = await iface.screenshotBase64();
    expect(b64.length).toBeGreaterThan(100);
  });

  it('hero h1 is present', async () => {
    await agent.navigate(BASE_URL);
    const hasH1 = await agent.eval('document.querySelector("h1") !== null');
    expect(hasH1).toBe(true);
  });

  it('features section has 3 subsections', async () => {
    await agent.navigate(BASE_URL);
    const count = await agent.eval('document.querySelectorAll(".features > div").length');
    expect(count).toBe(3);
  });
});
