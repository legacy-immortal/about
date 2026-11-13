/// <reference types="vite/client" />

/**
 * Vite ambient types.
 *
 * The about-site content pipeline imports markdown files with the `?raw`
 * suffix (`import heroMd from ".../hero.md?raw"`). Vite's client types declare
 * that module shape; without this reference, TypeScript reports the imports as
 * missing modules.
 */
