# Midscene + Camoufox Test Suite for About Site

## Purpose
Run Midscene agent tests driven by Camoufox browser via the camoufox-toolkit adapter.

## Structure
```
tests/midscene/
  config.midscene.json      – Midscene project config
  midscene.runtime.config.ts– Runtime knobs (baseUrl, interface, viewport)
  suites/                   – Midscene agent specs
    about.spec.ts           – About site smoke tests
  reports/                  – Generated reports (ignored)
```

## Prerequisites
- Vite dev server running: `bun run dev`
- Camoufox browser available at `$CAMOUFOXKIT_BROWSER` or via toolkit
- Node/Ts ready: bun ≥1

## Run
```bash
# Terminal 1 – start dev server
bun run dev

# Terminal 2 – run suite
bun test tests/midscene/suites
```

## Integration notes
- Midscene agent is created with `createAgent(new CamoufoxMidsceneInterface(...))`
- InterfaceType is `camoufox`; see `~/workspaces/camoufox-toolkit/ts/midscene/camoufox-interface.ts`
- Fixtures live in `tests/fixtures/about/` for offline/static checks; live tests hit http://localhost:5173/about

## Expected results
- Agent boots with Camoufox
- Hero h1 present
- Features section contains 3 subsections
- CTA, Chakra button checks (extend as needed)
