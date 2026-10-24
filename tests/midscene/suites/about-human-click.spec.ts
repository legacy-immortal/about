import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { CamoufoxMidsceneInterface } from '/home/user/workspace/camoufox-toolkit/ts/midscene';
import { createAgent } from '@midscene/core';

const BASE_URL = 'http://localhost:5173/about';

describe('About Site – trusted human click via Midscene + Camoufox', { timeout: 120000 }, () => {
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

  it('CTA button click produces isTrusted === true events', async () => {
    await agent.navigate(BASE_URL);
    await agent.waitForSelector('.chakra-button', { timeout: 15000 });
    await agent.click('.chakra-button');
    const trace = await agent.eval('window.__trace || []');
    expect(Array.isArray(trace)).toBe(true);
    const types = trace.map((e: any) => e.type);
    expect(types).toContain('click');
    expect(types).toContain('mousemove');
    expect(types).toContain('mouseup');
    const allTrusted = trace.every((e: any) => e.isTrusted === true);
    expect(allTrusted).toBe(true);
  });
});
