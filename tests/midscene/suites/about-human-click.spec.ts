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
    await iface.evaluateJavaScript<void>(`window.location.href = "${BASE_URL}"`);
    await new Promise(r => setTimeout(r, 3000));
    
    // Inject trace capture
    await iface.evaluateJavaScript<void>(`
      window.__trace = [];
      ['click', 'mousemove', 'mouseup', 'mousedown'].forEach(type => {
        document.addEventListener(type, e => {
          window.__trace.push({ type, isTrusted: e.isTrusted, target: e.target.tagName, time: Date.now() });
        }, true);
      });
    `);
    
    // Click via agent (uses midscene's aiClick which goes through inputPrimitives)
    await agent.aiClick('.chakra-button');
    await new Promise(r => setTimeout(r, 1000));
    
    const trace = await iface.evaluateJavaScript<any[]>('window.__trace || []');
    expect(Array.isArray(trace)).toBe(true);
    const types = trace.map(e => e.type);
    expect(types).toContain('click');
    expect(types).toContain('mousemove');
    expect(types).toContain('mouseup');
    const allTrusted = trace.every(e => e.isTrusted === true);
    expect(allTrusted).toBe(true);
  });
});
