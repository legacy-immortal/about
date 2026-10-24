import { createAgent } from '@midscene/core';
import { CamoufoxMidsceneInterface } from '/home/user/workspace/camoufox-toolkit/ts/midscene';
import { 
  Persona, 
  PersonaAction, 
  WalkthroughStep,
  allPersonas,
  defaultPersona 
} from './personas';
import { 
  captureDiagnostics, 
  assertWithDiagnostics, 
  waitForSelectorWithDiagnostics,
  navigateWithDiagnostics,
  clickWithDiagnostics,
  evalWithDiagnostics,
  createContext,
  injectCaptureScripts,
  DiagnosticContext 
} from './diagnostics';

export interface PersonaTestResult {
  personaId: string;
  personaName: string;
  stepName: string;
  success: boolean;
  durationMs: number;
  error?: string;
  diagnostics?: any;
}

export interface PersonaWalkthroughResult {
  persona: Persona;
  steps: PersonaTestResult[];
  overallSuccess: boolean;
  totalDurationMs: number;
}

/**
 * Execute a single persona action
 */
async function executeAction(
  agent: any,
  iface: CamoufoxMidsceneInterface,
  action: PersonaAction,
  context: DiagnosticContext
): Promise<void> {
  switch (action.type) {
    case 'navigate': {
      const baseUrl = 'http://localhost:5173';
      await navigateWithDiagnostics(agent, iface, `${baseUrl}${action.url}`, context);
      break;
    }
    case 'click': {
      await clickWithDiagnostics(agent, iface, action.selector, context);
      break;
    }
    case 'scroll': {
      const distance = action.distance || 500;
      await iface.evaluateJavaScript<void>(`window.scrollBy(0, ${action.direction === 'down' ? distance : -distance})`);
      await new Promise(r => setTimeout(r, 500));
      break;
    }
    case 'wait': {
      await waitForSelectorWithDiagnostics(iface, action.selector, context, { timeout: action.timeout || 10000 });
      break;
    }
    case 'assert': {
      const exists = await evalWithDiagnostics<boolean>(iface, `
        (() => {
          const el = document.querySelector('${action.selector.replace(/'/g, "\\'")}');
          if (!el) return false;
          switch ('${action.condition}') {
            case 'exists': return true;
            case 'visible': {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetWidth > 0 && el.offsetHeight > 0;
            }
            case 'contains': return el.textContent?.includes('${action.value?.replace(/'/g, "\\'") || ''}') ?? false;
            default: return false;
          }
        })()
      `, context, `assert ${action.selector} ${action.condition}`);
      await assertWithDiagnostics(iface, exists, `Assertion failed: ${action.selector} ${action.condition}${action.value ? ` "${action.value}"` : ''}`, context);
      break;
    }
    case 'eval': {
      await evalWithDiagnostics(iface, action.script, context, action.description);
      break;
    }
    case 'screenshot': {
      const diag = await captureDiagnostics(iface, { ...context, step: `screenshot(${action.name})` });
      if (!diag.success) {
        throw new Error(`Screenshot failed: ${diag.message}`);
      }
      break;
    }
    case 'pause': {
      await new Promise(r => setTimeout(r, action.duration));
      break;
    }
  }
}

/**
 * Execute a single walkthrough step
 */
async function executeStep(
  agent: any,
  iface: CamoufoxMidsceneInterface,
  persona: Persona,
  step: WalkthroughStep,
  stepIndex: number
): Promise<PersonaTestResult> {
  const context = createContext(
    `${persona.name} (${persona.id})`,
    `Step ${stepIndex + 1}: ${step.name}`
  );
  const startTime = Date.now();

  try {
    // Inject capture scripts at the start of each step
    await injectCaptureScripts(iface);

    for (const action of step.actions) {
      await executeAction(agent, iface, action, context);
    }

    return {
      personaId: persona.id,
      personaName: persona.name,
      stepName: step.name,
      success: true,
      durationMs: Date.now() - startTime,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    // Capture diagnostics on failure
    const diag = await captureDiagnostics(iface, context).catch(() => ({ success: false }));
    return {
      personaId: persona.id,
      personaName: persona.name,
      stepName: step.name,
      success: false,
      durationMs: Date.now() - startTime,
      error,
      diagnostics: diag,
    };
  }
}

/**
 * Run a full persona walkthrough
 */
export async function runPersonaWalkthrough(
  persona: Persona,
  options?: { headless?: boolean; startupTimeoutMs?: number }
): Promise<PersonaWalkthroughResult> {
  const iface = new CamoufoxMidsceneInterface({ 
    headless: options?.headless ?? true, 
    startupTimeoutMs: options?.startupTimeoutMs ?? 60000 
  });
  
  await iface.start();
  const agent = createAgent(iface);
  
  const steps: PersonaTestResult[] = [];
  const overallStartTime = Date.now();

  try {
    for (let i = 0; i < persona.walkthrough.length; i++) {
      const step = persona.walkthrough[i];
      const result = await executeStep(agent, iface, persona, step, i);
      steps.push(result);
      
      if (!result.success) {
        console.error(`[${persona.name}] Step "${step.name}" FAILED: ${result.error}`);
        // Continue to next step to gather more data
      } else {
        console.log(`[${persona.name}] Step "${step.name}" PASSED (${result.durationMs}ms)`);
      }
    }
  } finally {
    await iface.destroy().catch(() => {});
  }

  const overallSuccess = steps.every(s => s.success);
  
  return {
    persona,
    steps,
    overallSuccess,
    totalDurationMs: Date.now() - overallStartTime,
  };
}

/**
 * Run all personas sequentially
 */
export async function runAllPersonas(
  options?: { headless?: boolean; startupTimeoutMs?: number }
): Promise<PersonaWalkthroughResult[]> {
  const results: PersonaWalkthroughResult[] = [];
  
  for (const persona of allPersonas) {
    console.log(`\n=== Running persona: ${persona.name} (${persona.role}) ===`);
    const result = await runPersonaWalkthrough(persona, options);
    results.push(result);
    console.log(`=== ${persona.name}: ${result.overallSuccess ? 'PASSED' : 'FAILED'} (${result.totalDurationMs}ms) ===\n`);
  }
  
  return results;
}

/**
 * Run a single persona by ID
 */
export async function runPersonaById(
  personaId: string,
  options?: { headless?: boolean; startupTimeoutMs?: number }
): Promise<PersonaWalkthroughResult | null> {
  const persona = allPersonas.find(p => p.id === personaId);
  if (!persona) {
    console.error(`Persona not found: ${personaId}`);
    return null;
  }
  return runPersonaWalkthrough(persona, options);
}

/**
 * Print summary of all results
 */
export function printSummary(results: PersonaWalkthroughResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('PERSONA WALKTHROUGH SUMMARY');
  console.log('='.repeat(80));
  
  for (const result of results) {
    const status = result.overallSuccess ? '✅ PASS' : '❌ FAIL';
    console.log(`\n${status} ${result.persona.name} (${result.persona.role}) - ${result.totalDurationMs}ms`);
    console.log(`  Goal: ${result.persona.goal}`);
    
    for (const step of result.steps) {
      const stepStatus = step.success ? '  ✅' : '  ❌';
      console.log(`${stepStatus} ${step.stepName} (${step.durationMs}ms)`);
      if (!step.success && step.error) {
        console.log(`      Error: ${step.error.split('\n')[0]}`);
      }
    }
  }
  
  const passed = results.filter(r => r.overallSuccess).length;
  const total = results.length;
  console.log(`\n${'='.repeat(80)}`);
  console.log(`OVERALL: ${passed}/${total} personas passed`);
  console.log('='.repeat(80));
}
