# Midscene + Camoufox Test Suite for About Site

## Purpose
Run Midscene agent tests driven by Camoufox browser via the camoufox-toolkit adapter.
Tests include smoke checks, trusted human-click validation, and **persona-based walkthroughs** matching AGENTS.md §3.2 audience profiles.

## Structure
```
tests/midscene/
  config.midscene.json           – Midscene project config
  midscene.runtime.config.ts     – Runtime knobs (baseUrl, interface, viewport)
  run-personas.ts                – Standalone persona runner (executable)
  utils/
    index.ts                     – Barrel export
    diagnostics.ts               – Rich error diagnostics (screenshots, DOM, console, network)
    personas.ts                  – 5 audience personas from AGENTS.md §3.2
    runner.ts                    – Walkthrough execution engine
  suites/
    about.spec.ts                – Basic smoke tests (hero, features)
    about-human-click.spec.ts    – Trusted click validation (isTrusted === true)
    persona-walkthroughs.spec.ts – Full persona walkthroughs (bun test)
  reports/                       – Generated reports (gitignored)
  README.md                      – This file
```

## Prerequisites
- **Dev server running**: `bun run dev` (serves at `http://localhost:5173/about/`)
- **Camoufox browser**: `camoufox-bin` on PATH or `CAMOUFOXKIT_BROWSER` env var pointing to binary
  - Binary typically at `~/.cache/camoufox/browsers/official/156.0.1-beta.34-09effb44/camoufox-bin`
  - Or build from camoufox-toolkit: `cd ~/workspace/camoufox-toolkit && make`
- **Integration enabled**: `CAMOUFOX_MIDSCENE_INTEGRATION=1`

## Run Commands

### Smoke tests (basic)
```bash
# Terminal 1 - start dev server
bun run dev

# Terminal 2 - run smoke tests
bun run test:midscene
```

### Persona walkthroughs (full audience simulation)
```bash
# Terminal 1 - start dev server
bun run dev

# Terminal 2 - run all personas
bun run test:personas

# Or run specific persona
PERSONA=prof-alex-001 bun run test:personas

# Or run standalone script (more verbose output)
CAMOUFOX_MIDSCENE_INTEGRATION=1 bun run tests/midscene/run-personas.ts
CAMOUFOX_MIDSCENE_INTEGRATION=1 PERSONA=prof-priya-002 bun run tests/midscene/run-personas.ts
```

## Personas (from AGENTS.md §3.2)

| ID | Name | Role | Goal |
|----|------|------|------|
| `prof-alex-001` | Alex | platform-engineer | Scaffold a new service from templates, build + test + deploy it |
| `prof-priya-002` | Priya | ai-agent-operator | Run an agent against AGENTS.md/WORKFLOW.md without human help |
| `prof-sam-003` | Sam | security-auditor | Verify no secrets in commits; audit passes at high level |
| `prof-jordan-004` | Jordan | startup-founder | Ship a social-media MVP (auth, profile, post, feed) end-to-end |
| `prof-casey-005` | Casey | data-scientist | Produce statistical rows from benchmarks; validate an empirical claim |

Each persona has a multi-step walkthrough:
1. **Landing** - Hero scan, value prop assessment
2. **Features** - Technical depth / executable docs / security / speed / benchmarks
3. **Concept** - Architecture / sovereignty / evidence
4. **CTA/Pricing** - Alpha access / founder terms / pricing
5. **What We Are Not** - Explicit non-goals (security by exclusion)

## Error Diagnostics
The test suite captures rich diagnostics on every failure:
- **Screenshot** (base64 PNG) - visual state at failure point
- **DOM snapshot** - full HTML (scripts/styles removed) for inspection
- **Console logs** - last 30 console.log/error/warn/info/debug entries
- **Network errors** - failed fetch/XHR requests with status codes
- **Viewport & page title** - context for layout issues
- **Step-by-step trace** - which action failed in which walkthrough step

Error messages are formatted as structured reports with clear sections for quick debugging.

## Integration with camoufox-toolkit
The adapter lives at `~/workspace/camoufox-toolkit/ts/midscene/`:
- `CamoufoxMidsceneInterface` implements Midscene's `AbstractInterface`
- Uses subprocess transport (`camoufox-drive`) for isolation
- Produces trusted events (`isTrusted === true`) via browser's native input pipeline
- `interfaceType: 'camoufox'` for routing in Midscene task builder

## Expected Results
- **Smoke tests**: Hero h1 present, features has 3 subsections, CTA visible, Chakra button exists
- **Human click**: Click on `.chakra-button` produces `click`, `mousemove`, `mouseup` events all with `isTrusted === true`
- **Persona walkthroughs**: Each persona completes their goal-oriented path; results printed as summary table

## CI Integration
```yaml
# Example GitHub Actions step
- name: Run persona walkthroughs
  run: |
    bun run dev &
    sleep 10
    CAMOUFOX_MIDSCENE_INTEGRATION=1 bun run test:personas
  env:
    CAMOUFOXKIT_BROWSER: ${{ secrets.CAMOUFOX_BINARY_PATH }}
```

## Troubleshooting

### Browser fails to start ("browser was killed (signal 15)")
- Ensure `camoufox-bin` is on PATH or `CAMOUFOXKIT_BROWSER` is set
- Try running directly: `xvfb-run -a camoufox-bin --headless "file:///path/to/page.html"`
- Check for GPU/display issues in headless mode (see camoufox-toolkit README)

### Tests timeout
- Increase `startupTimeoutMs` in test options (default 60s)
- Check dev server is accessible at `http://localhost:5173/about/`
- Verify no firewall blocking localhost connections

### Selector not found
- Check DOM snapshot in error output for actual structure
- Selectors in personas are based on fixture `page.html` - may differ from live React app
- Update `personas.ts` selectors if React-rendered classes differ

## Development
```bash
# Add new persona
# 1. Add to tests/midscene/utils/personas.ts
# 2. Import in tests/midscene/utils/index.ts
# 3. Run to verify

# Improve diagnostics
# Edit tests/midscene/utils/diagnostics.ts

# Add new walkthrough step type
# 1. Add to PersonaAction union in personas.ts
# 2. Handle in runner.ts executeAction()
```
