import type { CamoufoxMidsceneInterface } from '/home/user/workspace/camoufox-toolkit/ts/midscene';

/**
 * Diagnostic utilities for Midscene + Camoufox tests.
 * Provides detailed error messages, screenshots, and state dumps on failure.
 */

export interface DiagnosticContext {
  testName: string;
  step: string;
  url?: string;
  timestamp: string;
}

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
  screenshot?: string; // base64
  domSnapshot?: string;
  consoleLogs?: string[];
  networkErrors?: string[];
}

/**
 * Capture a full diagnostic snapshot from the browser.
 */
export async function captureDiagnostics(
  iface: CamoufoxMidsceneInterface,
  context: DiagnosticContext
): Promise<DiagnosticResult> {
  const timestamp = new Date().toISOString();
  const details: Record<string, any> = {
    testName: context.testName,
    step: context.step,
    url: context.url,
    timestamp,
  };

  try {
    // Capture screenshot
    const screenshot = await iface.screenshotBase64();
    details.screenshotSize = screenshot.length;

    // Capture DOM state
    const dom = await iface.evaluateJavaScript<string>(`
      (() => {
        const clone = document.documentElement.cloneNode(true);
        // Remove scripts and styles to reduce size
        clone.querySelectorAll('script, style, link[rel="stylesheet"]').forEach(el => el.remove());
        return clone.outerHTML;
      })()
    `);
    details.domLength = dom?.length || 0;

    // Capture console logs
    const consoleLogs = await iface.evaluateJavaScript<string[]>(`
      (() => {
        return window.__consoleLogs || [];
      })()
    `);
    details.consoleLogCount = consoleLogs?.length || 0;

    // Capture network errors
    const networkErrors = await iface.evaluateJavaScript<string[]>(`
      (() => {
        return window.__networkErrors || [];
      })()
    `);
    details.networkErrorCount = networkErrors?.length || 0;

    // Capture viewport info
    const size = await iface.size();
    details.viewport = size;

    // Capture page title
    const title = await iface.describe?.();
    details.pageTitle = title;

    return {
      success: true,
      message: 'Diagnostics captured successfully',
      details,
      screenshot,
      domSnapshot: dom?.slice(0, 50000),
      consoleLogs,
      networkErrors,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to capture diagnostics: ${err instanceof Error ? err.message : String(err)}`,
      details: { ...details, error: err instanceof Error ? err.stack : String(err) },
    };
  }
}

/**
 * Enhanced assertion with full diagnostics on failure.
 */
export async function assertWithDiagnostics(
  iface: CamoufoxMidsceneInterface,
  condition: boolean,
  message: string,
  context: DiagnosticContext,
  extraDetails?: Record<string, any>
): Promise<void> {
  if (condition) return;

  const diag = await captureDiagnostics(iface, context);
  const errorMsg = [
    `ASSERTION FAILED: ${message}`,
    `Test: ${context.testName}`,
    `Step: ${context.step}`,
    `URL: ${context.url || 'unknown'}`,
    `Timestamp: ${context.timestamp}`,
    '',
    '--- DIAGNOSTICS ---',
    `Screenshot captured: ${diag.screenshot ? `yes (${diag.details?.screenshotSize} bytes)` : 'no'}`,
    `DOM length: ${diag.details?.domLength || 0} chars`,
    `Console logs: ${diag.details?.consoleLogCount || 0}`,
    `Network errors: ${diag.details?.networkErrorCount || 0}`,
    `Viewport: ${JSON.stringify(diag.details?.viewport)}`,
    `Page title: ${diag.details?.pageTitle || 'unknown'}`,
    '',
    '--- CONSOLE LOGS (last 20) ---',
    ...(diag.consoleLogs?.slice(-20).map(l => `  ${l}`) || ['(none)']),
    '',
    '--- NETWORK ERRORS ---',
    ...(diag.networkErrors?.map(e => `  ${e}`) || ['(none)']),
    '',
    '--- EXTRA DETAILS ---',
    ...Object.entries(extraDetails || {}).map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`),
    '',
    '--- DOM SNAPSHOT (first 5000 chars) ---',
    diag.domSnapshot?.slice(0, 5000) || '(none)',
  ].join('\n');

  throw new Error(errorMsg);
}

/**
 * Wait for a selector with detailed diagnostics on timeout.
 */
export async function waitForSelectorWithDiagnostics(
  iface: CamoufoxMidsceneInterface,
  selector: string,
  context: DiagnosticContext,
  options?: { timeout?: number; visible?: boolean }
): Promise<void> {
  const timeout = options?.timeout || 15000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const found = await iface.evaluateJavaScript<boolean>(`
        (() => {
          const el = document.querySelector('${selector.replace(/'/g, "\\'")}');
          if (!el) return false;
          if (${options?.visible ? 'true' : 'false'}) {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetWidth > 0 && el.offsetHeight > 0;
          }
          return true;
        })()
      `);
      if (found) return;
    } catch {
      // Ignore eval errors, keep waiting
    }
    await new Promise(r => setTimeout(r, 100));
  }

  // Timeout - capture diagnostics
  const diag = await captureDiagnostics(iface, { ...context, step: `waitForSelector(${selector})` });
  const errorMsg = [
    `TIMEOUT: Selector "${selector}" not found within ${timeout}ms`,
    `Test: ${context.testName}`,
    `Step: ${context.step}`,
    `URL: ${context.url || 'unknown'}`,
    '',
    '--- DIAGNOSTICS AT TIMEOUT ---',
    `Screenshot captured: ${diag.screenshot ? 'yes' : 'no'}`,
    `DOM length: ${diag.details?.domLength || 0} chars`,
    `Console logs: ${diag.details?.consoleLogCount || 0}`,
    `Network errors: ${diag.details?.networkErrorCount || 0}`,
    '',
    '--- CONSOLE LOGS (last 30) ---',
    ...(diag.consoleLogs?.slice(-30).map(l => `  ${l}`) || ['(none)']),
    '',
    '--- NETWORK ERRORS ---',
    ...(diag.networkErrors?.map(e => `  ${e}`) || ['(none)']),
    '',
    '--- DOM SNAPSHOT (first 10000 chars) ---',
    diag.domSnapshot?.slice(0, 10000) || '(none)',
  ].join('\n');

  throw new Error(errorMsg);
}

/**
 * Navigate to URL with detailed diagnostics on failure.
 */
export async function navigateWithDiagnostics(
  agent: any, // Midscene Agent
  iface: CamoufoxMidsceneInterface,
  url: string,
  context: DiagnosticContext
): Promise<void> {
  try {
    await agent.navigate(url);
    // Wait for navigation to complete
    await new Promise(r => setTimeout(r, 1000));
    
    const currentUrl = await iface.url();
    const readyState = await iface.evaluateJavaScript<string>('document.readyState');
    
    if (readyState !== 'complete') {
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (err) {
    const diag = await captureDiagnostics(iface, { ...context, step: `navigate(${url})`, url });
    const errorMsg = [
      `NAVIGATION FAILED: ${url}`,
      `Error: ${err instanceof Error ? err.message : String(err)}`,
      `Test: ${context.testName}`,
      '',
      '--- DIAGNOSTICS ---',
      `Screenshot captured: ${diag.screenshot ? 'yes' : 'no'}`,
      `DOM length: ${diag.details?.domLength || 0} chars`,
      `Console logs: ${diag.details?.consoleLogCount || 0}`,
      `Network errors: ${diag.details?.networkErrorCount || 0}`,
      '',
      '--- CONSOLE LOGS (last 30) ---',
      ...(diag.consoleLogs?.slice(-30).map(l => `  ${l}`) || ['(none)']),
      '',
      '--- NETWORK ERRORS ---',
      ...(diag.networkErrors?.map(e => `  ${e}`) || ['(none)']),
      '',
      '--- DOM SNAPSHOT (first 10000 chars) ---',
      diag.domSnapshot?.slice(0, 10000) || '(none)',
    ].join('\n');
    throw new Error(errorMsg);
  }
}

/**
 * Click element with detailed diagnostics on failure.
 */
export async function clickWithDiagnostics(
  agent: any, // Midscene Agent
  iface: CamoufoxMidsceneInterface,
  selector: string,
  context: DiagnosticContext
): Promise<void> {
  try {
    await agent.waitForSelector(selector, { timeout: 10000 });
    await agent.click(selector);
  } catch (err) {
    const diag = await captureDiagnostics(iface, { ...context, step: `click(${selector})`, url: await iface.url() });
    const errorMsg = [
      `CLICK FAILED: ${selector}`,
      `Error: ${err instanceof Error ? err.message : String(err)}`,
      `Test: ${context.testName}`,
      '',
      '--- DIAGNOSTICS ---',
      `Screenshot captured: ${diag.screenshot ? 'yes' : 'no'}`,
      `DOM length: ${diag.details?.domLength || 0} chars`,
      `Console logs: ${diag.details?.consoleLogCount || 0}`,
      `Network errors: ${diag.details?.networkErrorCount || 0}`,
      '',
      '--- CONSOLE LOGS (last 30) ---',
      ...(diag.consoleLogs?.slice(-30).map(l => `  ${l}`) || ['(none)']),
      '',
      '--- NETWORK ERRORS ---',
      ...(diag.networkErrors?.map(e => `  ${e}`) || ['(none)']),
      '',
      '--- DOM SNAPSHOT (first 10000 chars) ---',
      diag.domSnapshot?.slice(0, 10000) || '(none)',
    ].join('\n');
    throw new Error(errorMsg);
  }
}

/**
 * Evaluate JavaScript with detailed diagnostics on failure.
 */
export async function evalWithDiagnostics<T>(
  iface: CamoufoxMidsceneInterface,
  script: string,
  context: DiagnosticContext,
  description: string
): Promise<T> {
  try {
    return await iface.evaluateJavaScript<T>(script);
  } catch (err) {
    const diag = await captureDiagnostics(iface, { ...context, step: `eval(${description})` });
    const errorMsg = [
      `EVAL FAILED: ${description}`,
      `Script: ${script.slice(0, 200)}...`,
      `Error: ${err instanceof Error ? err.message : String(err)}`,
      `Test: ${context.testName}`,
      '',
      '--- DIAGNOSTICS ---',
      `Screenshot captured: ${diag.screenshot ? 'yes' : 'no'}`,
      `DOM length: ${diag.details?.domLength || 0} chars`,
      `Console logs: ${diag.details?.consoleLogCount || 0}`,
      `Network errors: ${diag.details?.networkErrorCount || 0}`,
      '',
      '--- CONSOLE LOGS (last 30) ---',
      ...(diag.consoleLogs?.slice(-30).map(l => `  ${l}`) || ['(none)']),
      '',
      '--- NETWORK ERRORS ---',
      ...(diag.networkErrors?.map(e => `  ${e}`) || ['(none)']),
      '',
      '--- DOM SNAPSHOT (first 10000 chars) ---',
      diag.domSnapshot?.slice(0, 10000) || '(none)',
    ].join('\n');
    throw new Error(errorMsg);
  }
}

/**
 * Create a diagnostic context for a test.
 */
export function createContext(testName: string, step: string, url?: string): DiagnosticContext {
  return {
    testName,
    step,
    url,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Inject console and network error capture into the page.
 */
export async function injectCaptureScripts(iface: CamoufoxMidsceneInterface): Promise<void> {
  await iface.evaluateJavaScript<void>(`
    (() => {
      // Capture console logs
      window.__consoleLogs = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;
      const originalDebug = console.debug;
      
      const capture = (level: string, args: any[]) => {
        const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        window.__consoleLogs.push(\`[\${level}] \${msg}\`);
        if (window.__consoleLogs.length > 200) window.__consoleLogs.shift();
      };
      
      console.log = (...args) => { capture('log', args); originalLog.apply(console, args); };
      console.error = (...args) => { capture('error', args); originalError.apply(console, args); };
      console.warn = (...args) => { capture('warn', args); originalWarn.apply(console, args); };
      console.info = (...args) => { capture('info', args); originalInfo.apply(console, args); };
      console.debug = (...args) => { capture('debug', args); originalDebug.apply(console, args); };
      
      // Capture network errors
      window.__networkErrors = [];
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          if (!response.ok) {
            window.__networkErrors.push(\`HTTP \${response.status}: \${args[0]}\`);
            if (window.__networkErrors.length > 50) window.__networkErrors.shift();
          }
          return response;
        } catch (err) {
          window.__networkErrors.push(\`FETCH ERROR: \${args[0]} - \${err.message}\`);
          if (window.__networkErrors.length > 50) window.__networkErrors.shift();
          throw err;
        }
      };
      
      // Capture XHR errors
      const originalXhr = window.XMLHttpRequest.prototype.open;
      window.XMLHttpRequest.prototype.open = function(...args) {
        this.addEventListener('error', () => {
          window.__networkErrors.push(\`XHR ERROR: \${args[1]}\`);
          if (window.__networkErrors.length > 50) window.__networkErrors.shift();
        });
        return originalXhr.apply(this, args);
      };
      
      // Capture unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        window.__consoleLogs.push(\`[unhandledrejection] \${event.reason}\`);
        if (window.__consoleLogs.length > 200) window.__consoleLogs.shift();
      });
      
      // Capture global errors
      window.addEventListener('error', (event) => {
        window.__consoleLogs.push(\`[error] \${event.message} at \${event.filename}:\${event.lineno}:\${event.colno}\`);
        if (window.__consoleLogs.length > 200) window.__consoleLogs.shift();
      });
    })()
  `);
}
