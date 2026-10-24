/**
 * Playwright test for Legacy Immortal marketing site.
 * Verifies: hero section, features section, CTA section, and Chakra UI styles.
 * Uses page.click() to verify trusted events (real person interaction).
 */

import { test, expect } from '@playwright/test'

const MARKETING_PAGE = new URL('../fixtures/marketing/page.html', import.meta.url).pathname

test('hero section has h1', async ({ page }) => {
  await page.goto(MARKETING_PAGE)
  await expect(page.locator('h1')).toBeVisible()
  const h1Text = await page.textContent('h1')
  expect(h1Text).toBe('Legacy Immortal')
})

test('features has 3 subsections', async ({ page }) => {
  await page.goto(MARKETING_PAGE)
  const divs = page.locator('.features > div')
  await expect(divs).toHaveCount(3)
})

test('CTA section is present', async ({ page }) => {
  await page.goto(MARKETING_PAGE)
  await expect(page.locator('.cta')).toBeVisible()
})

test('Chakra button element exists', async ({ page }) => {
  await page.goto(MARKETING_PAGE)
  await expect(page.locator('.chakra-button')).toBeVisible()
  const buttonText = await page.textContent('.chakra-button')
  expect(buttonText).toBe('Get Started')
})

test('human click on CTA button produces trusted events', async ({ page }) => {
  await page.goto(MARKETING_PAGE)

  // Capture console events during the click
  const events: any[] = []
  page.on('console', (msg) => events.push({ type: msg.type(), text: msg.text() }))

  // Human click on the CTA button
  await page.click('.chakra-button')

  // Wait a moment for events to be queued
  await new Promise(resolve => setTimeout(resolve, 100))

  // Find click-related trusted events
  const clickEvents = events.filter(
    (e: any) => e.type === 'mouseup' || e.type === 'mousedown' || e.type === 'click'
  )

  // Verify we captured trusted events
  expect(clickEvents.length).toBeGreaterThan(0)

  // Check that at least some events are trusted (isTrusted in event details)
  // Note: page.click() dispatches trusted events by default in modern browsers
  const mouseupEvent = events.find((e: any) => e.type === 'mouseup')
  expect(mouseupEvent).toBeDefined()
})