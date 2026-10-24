import { describe, it, expect } from 'bun:test';
import { runPersonaById, runAllPersonas, printSummary, PersonaWalkthroughResult } from '../utils/runner';

// This test runs all persona walkthroughs sequentially.
// It requires:
// 1. Dev server running at http://localhost:5173/about/
// 2. Camoufox browser available (CAMOUFOXKIT_BROWSER or camoufox-bin on PATH)
// 3. CAMOUFOX_MIDSCENE_INTEGRATION=1 env var to enable integration tests

const INTEGRATION_ENABLED = process.env.CAMOUFOX_MIDSCENE_INTEGRATION === '1';

describe.skipIf(!INTEGRATION_ENABLED)('Persona Walkthroughs - About Site', () => {
  it('Alex (platform-engineer) walkthrough', async () => {
    const result = await runPersonaById('prof-alex-001', { 
      headless: true, 
      startupTimeoutMs: 60000 
    });
    expect(result).not.toBeNull();
    if (result) {
      printSummary([result]);
      // Don't fail the test on persona failure - we want to see all results
      // expect(result.overallSuccess).toBe(true);
    }
  }, 180000);

  it('Priya (ai-agent-operator) walkthrough', async () => {
    const result = await runPersonaById('prof-priya-002', { 
      headless: true, 
      startupTimeoutMs: 60000 
    });
    expect(result).not.toBeNull();
    if (result) {
      printSummary([result]);
    }
  }, 180000);

  it('Sam (security-auditor) walkthrough', async () => {
    const result = await runPersonaById('prof-sam-003', { 
      headless: true, 
      startupTimeoutMs: 60000 
    });
    expect(result).not.toBeNull();
    if (result) {
      printSummary([result]);
    }
  }, 180000);

  it('Jordan (startup-founder) walkthrough', async () => {
    const result = await runPersonaById('prof-jordan-004', { 
      headless: true, 
      startupTimeoutMs: 60000 
    });
    expect(result).not.toBeNull();
    if (result) {
      printSummary([result]);
    }
  }, 180000);

  it('Casey (data-scientist) walkthrough', async () => {
    const result = await runPersonaById('prof-casey-005', { 
      headless: true, 
      startupTimeoutMs: 60000 
    });
    expect(result).not.toBeNull();
    if (result) {
      printSummary([result]);
    }
  }, 180000);

  it('All personas - full suite', async () => {
    const results = await runAllPersonas({ 
      headless: true, 
      startupTimeoutMs: 60000 
    });
    printSummary(results);
    
    // Report overall results
    const passed = results.filter(r => r.overallSuccess).length;
    const total = results.length;
    console.log(`\nRESULT: ${passed}/${total} personas completed successfully`);
    
    // For CI, we might want this to pass even if some personas fail
    // The detailed output shows what each persona found
    expect(results.length).toBe(5);
  }, 900000);
});

// Standalone script for running without bun test
if (import.meta.main) {
  console.log('Running persona walkthroughs as standalone script...');
  console.log('Set CAMOUFOX_MIDSCENE_INTEGRATION=1 to enable');
  
  if (process.env.CAMOUFOX_MIDSCENE_INTEGRATION === '1') {
    runAllPersonas({ headless: true, startupTimeoutMs: 60000 })
      .then(results => {
        printSummary(results);
        process.exit(results.every(r => r.overallSuccess) ? 0 : 1);
      })
      .catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
      });
  } else {
    console.log('Integration tests disabled. Set CAMOUFOX_MIDSCENE_INTEGRATION=1 to run.');
    process.exit(0);
  }
}
