#!/usr/bin/env bun
/**
 * Standalone persona walkthrough runner.
 * 
 * Usage:
 *   CAMOUFOX_MIDSCENE_INTEGRATION=1 bun run tests/midscene/run-personas.ts
 *   
 * Or with specific persona:
 *   CAMOUFOX_MIDSCENE_INTEGRATION=1 PERSONA=prof-alex-001 bun run tests/midscene/run-personas.ts
 *   
 * Prerequisites:
 * - Dev server running: bun run dev (serves at http://localhost:5173/about/)
 * - Camoufox browser: camoufox-bin on PATH or CAMOUFOXKIT_BROWSER env var
 * - Integration enabled: CAMOUFOX_MIDSCENE_INTEGRATION=1
 */

import { runPersonaById, runAllPersonas, printSummary, PersonaWalkthroughResult } from './utils/runner';
import { allPersonas, getPersona } from './utils/personas';

async function main() {
  const integrationEnabled = process.env.CAMOUFOX_MIDSCENE_INTEGRATION === '1';
  const personaId = process.env.PERSONA;

  if (!integrationEnabled) {
    console.log('❌ Integration tests disabled.');
    console.log('   Set CAMOUFOX_MIDSCENE_INTEGRATION=1 to enable.');
    console.log('');
    console.log('Available personas:');
    for (const p of allPersonas) {
      console.log(`  ${p.id} - ${p.name} (${p.role})`);
      console.log(`    Goal: ${p.goal}`);
    }
    process.exit(0);
  }

  console.log('🚀 Starting persona walkthroughs...');
  console.log('');

  let results: PersonaWalkthroughResult[] = [];

  if (personaId) {
    const persona = getPersona(personaId);
    if (!persona) {
      console.error(`❌ Unknown persona: ${personaId}`);
      console.log('Available:', allPersonas.map(p => p.id).join(', '));
      process.exit(1);
    }
    console.log(`Running single persona: ${persona.name} (${persona.id})`);
    const result = await runPersonaById(personaId, { 
      headless: true, 
      startupTimeoutMs: 60000 
    });
    if (result) {
      results = [result];
    }
  } else {
    console.log('Running all personas...');
    results = await runAllPersonas({ 
      headless: true, 
      startupTimeoutMs: 60000 
    });
  }

  printSummary(results);

  const passed = results.filter(r => r.overallSuccess).length;
  const total = results.length;
  
  if (passed === total) {
    console.log('\n✅ All personas passed!');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${passed}/${total} personas passed (${total - passed} failed)`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
