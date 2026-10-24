/* Midscene E2E test for Legacy Immortal about site.
 * Verifies: hero section, features section, CTA section, and Chakra UI styles.
 * Uses human-click to prove events carry isTrusted === true (real person interaction).
 *
 * This test follows the pattern from AGENTS.md and uses midscene's
 * aiAssert to verify DOM elements and event traces.
 */

import { describe, expect, it } from 'bun:test'
import midscene from '@midscenedev/midscene'

const BASE_URL = 'file://' import.meta.url.replace(/\/[^/]*$/, '') + '/fixtures/about/page.html'

describe('Legacy Immortal About Site', () => {
  it('hero section has h1', async () => {
    const scene = await midscene.render(BASE_URL)
    await scene.aiAssert('document.querySelector("h1") !== null', {
      errorMessage: 'hero h1 not found',
    })
  })

  it('features has 3 subsections', async () => {
    const scene = await midscene.render(BASE_URL)
    const count = await scene.aiEval('document.querySelectorAll(".features > div").length')
    expect(count).toBe(3)
  })

  it('CTA section is present', async () => {
    const scene = await midscene.render(BASE_URL)
    await scene.aiAssert('document.querySelector(".cta") !== null', {
      errorMessage: 'CTA section not found',
    })
  })

  it('Chakra button element exists', async () => {
    const scene = await midscene.render(BASE_URL)
    await scene.aiAssert('document.querySelector(".chakra-button") !== null', {
      errorMessage: 'Chakra button not found',
    })
  })

  it('human click on CTA button produces trusted events', async () => {
    const scene = await midscene.render(BASE_URL)

    // Human click through midscene's input pipeline
    await scene.aiClick('.chakra-button')

    // Verify the page recorded event trace with isTrusted === true
    const trace: any = await scene.aiEval('window.__trace')
    expect(trace).toBeDefined()

    // Check for click, mousemove, mouseup event types
    const types: string[] = trace.map((e: any) => e.type)
    expect(types).toContain('click')
    expect(types).toContain('mousemove')
    expect(types).toContain('mouseup')

    // Verify isTrusted is true for all events
    const trusted: boolean[] = trace.map((e: any) => e.isTrusted)
    expect(trusted.every((t: boolean) => t === true)).toBe(true)
  })
})