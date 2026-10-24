import { describe, it, expect } from 'bun:test';
import { CamoufoxMidsceneInterface } from '/home/user/workspace/camoufox-toolkit/ts/midscene';
import { createAgent } from '@midscene/core';

const BASE_URL = 'http://localhost:5173/about';

describe('About Site – trusted human click via Midscene + Camoufox', () => {
  it('CTA button click produces isTrusted === true events', async () => {
    const iface = new CamoufoxMidsceneInterface({ headless: true });
    await iface.start();
    const agent = createAgent(iface);
    await agent.navigate(BASE_URL);
    // Wait for page stable
    await agent.waitForSelector('.chakra-button', { timeout: 10000 });
    // Human-like click through Midscene
    await agent.click('.chakra-button');
    // Pull event trace
    const trace = await agent.eval('window.__trace || []');
    expect(Array.isArray(trace)).toBe(true);
    const types = trace.map(e => e.type);
    expect(types).toContain('click');
    expect(types).toContain('mousemove');
    expect(types).toContain('mouseup');
    const allTrusted = trace.every(e => e.isTrusted === true);
    expect(allTrusted).toBe(true);
    await iface.stop?.();
  });
});
