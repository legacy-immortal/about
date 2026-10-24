export const MIDSCENE_RUNTIME = {
  // Use the Camoufox driver via the toolkit adapter
  interface: 'camoufox',
  baseUrl: 'http://localhost:5173/about',
  fixtureRoot: 'tests/fixtures/about',
  headless: true,
  viewport: { width: 1280, height: 800 },
  traceEnabled: true,
};
