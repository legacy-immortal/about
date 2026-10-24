/**
 * Audience personas for Legacy Immortal about site.
 * Based on AGENTS.md §3.2 profile characters.
 */

export interface Persona {
  id: string;
  name: string;
  role: string;
  goal: string;
  constraints: string[];
  successMetrics: string[];
  walkthrough: WalkthroughStep[];
}

export interface WalkthroughStep {
  name: string;
  description: string;
  actions: PersonaAction[];
  expectedOutcome: string;
}

export type PersonaAction =
  | { type: 'navigate'; url: string }
  | { type: 'click'; selector: string; description: string }
  | { type: 'scroll'; direction: 'down' | 'up'; distance?: number }
  | { type: 'wait'; selector: string; timeout?: number }
  | { type: 'assert'; selector: string; condition: 'exists' | 'visible' | 'contains'; value?: string }
  | { type: 'eval'; script: string; description: string }
  | { type: 'screenshot'; name: string }
  | { type: 'pause'; duration: number };

/**
 * Alex - Platform Engineer
 * Goal: Scaffold a new service from templates, build + test + deploy it.
 * Constraints: bun-only, offline-first
 * Success: service deploys in <10 min
 */
export const personaAlex: Persona = {
  id: 'prof-alex-001',
  name: 'Alex',
  role: 'platform-engineer',
  goal: 'Scaffold a new service from templates, build + test + deploy it',
  constraints: ['bun-only', 'offline-first'],
  successMetrics: ['service deploys in <10 min'],
  walkthrough: [
    {
      name: 'Landing - Hero Scan',
      description: 'Quickly scan hero for value proposition and CTA',
      actions: [
        { type: 'navigate', url: '/about/' },
        { type: 'wait', selector: 'h1', timeout: 10000 },
        { type: 'assert', selector: 'h1', condition: 'contains', value: 'Legacy Immortal' },
        { type: 'assert', selector: '.chakra-button', condition: 'exists' },
        { type: 'screenshot', name: 'alex-hero' },
      ],
      expectedOutcome: 'Hero clearly communicates value and has actionable CTA',
    },
    {
      name: 'Features - Technical Depth',
      description: 'Evaluate features for technical substance',
      actions: [
        { type: 'scroll', direction: 'down', distance: 500 },
        { type: 'wait', selector: '.features', timeout: 5000 },
        { type: 'assert', selector: '.features > div', condition: 'exists' },
        { type: 'eval', script: 'document.querySelectorAll(".features > div").length', description: 'Count feature subsections' },
        { type: 'screenshot', name: 'alex-features' },
      ],
      expectedOutcome: 'Features show technical depth (self-replicating, self-auditing, self-documenting)',
    },
    {
      name: 'Concept - Architecture',
      description: 'Check concept section for architectural details',
      actions: [
        { type: 'scroll', direction: 'down', distance: 500 },
        { type: 'wait', selector: '.concept', timeout: 5000 },
        { type: 'assert', selector: '.concept', condition: 'exists' },
        { type: 'screenshot', name: 'alex-concept' },
      ],
      expectedOutcome: 'Concept section explains architecture and principles',
    },
    {
      name: 'CTA - Alpha Access',
      description: 'Find and evaluate alpha access path',
      actions: [
        { type: 'scroll', direction: 'down', distance: 800 },
        { type: 'wait', selector: '#invitation, .cta, [id*="invite" i]', timeout: 5000 },
        { type: 'assert', selector: '.chakra-button', condition: 'exists' },
        { type: 'click', selector: '.chakra-button', description: 'Click CTA for alpha access' },
        { type: 'screenshot', name: 'alex-cta' },
      ],
      expectedOutcome: 'Clear path to alpha access / getting started',
    },
  ],
};

/**
 * Priya - AI Agent Operator
 * Goal: Run an agent against AGENTS.md/WORKFLOW.md without human help.
 * Constraints: None
 * Success: all doc code blocks pass
 */
export const personaPriya: Persona = {
  id: 'prof-priya-002',
  name: 'Priya',
  role: 'ai-agent-operator',
  goal: 'Run an agent against AGENTS.md/WORKFLOW.md without human help',
  constraints: [],
  successMetrics: ['all doc code blocks pass'],
  walkthrough: [
    {
      name: 'Landing - Doc References',
      description: 'Look for links to AGENTS.md, WORKFLOW.md, docs/',
      actions: [
        { type: 'navigate', url: '/about/' },
        { type: 'wait', selector: 'h1', timeout: 10000 },
        { type: 'eval', script: `
          Array.from(document.querySelectorAll('a[href*="AGENTS"], a[href*="WORKFLOW"], a[href*="docs/"]'))
            .map(a => a.href)
        `, description: 'Find doc links' },
        { type: 'screenshot', name: 'priya-landing' },
      ],
      expectedOutcome: 'Clear links to machine-readable docs (AGENTS.md, WORKFLOW.md)',
    },
    {
      name: 'Features - Executable Docs',
      description: 'Verify "executable documentation" claim',
      actions: [
        { type: 'scroll', direction: 'down', distance: 500 },
        { type: 'wait', selector: '.features', timeout: 5000 },
        { type: 'eval', script: `
          const text = document.querySelector('.features')?.textContent || '';
          return text.includes('executable') || text.includes('machine-readable') || text.includes('code blocks');
        `, description: 'Check for executable docs mention' },
        { type: 'screenshot', name: 'priya-features' },
      ],
      expectedOutcome: 'Features mention executable documentation / machine-readable docs',
    },
    {
      name: 'Build from Scratch',
      description: 'Look for "Build From Scratch" or similar section',
      actions: [
        { type: 'scroll', direction: 'down', distance: 800 },
        { type: 'eval', script: `
          const text = document.body.textContent || '';
          return text.includes('Build From Scratch') || text.includes('from scratch') || text.includes('reproduce');
        `, description: 'Check for build-from-scratch mention' },
        { type: 'screenshot', name: 'priya-build' },
      ],
      expectedOutcome: 'Site mentions reproducible build process',
    },
  ],
};

/**
 * Sam - Security Auditor
 * Goal: Verify no secrets in commits; audit passes at high level.
 * Constraints: None
 * Success: bun run audit clean
 */
export const personaSam: Persona = {
  id: 'prof-sam-003',
  name: 'Sam',
  role: 'security-auditor',
  goal: 'Verify no secrets in commits; audit passes at high level',
  constraints: [],
  successMetrics: ['bun run audit clean'],
  walkthrough: [
    {
      name: 'Landing - Security Signals',
      description: 'Look for security/compliance mentions',
      actions: [
        { type: 'navigate', url: '/about/' },
        { type: 'wait', selector: 'h1', timeout: 10000 },
        { type: 'eval', script: `
          const text = document.body.textContent || '';
          return {
            hasAudit: text.toLowerCase().includes('audit'),
            hasCompliance: text.toLowerCase().includes('compliance'),
            hasSecurity: text.toLowerCase().includes('security'),
            hasSecrets: text.toLowerCase().includes('secret'),
            hasCrypto: text.toLowerCase().includes('crypto') || text.toLowerCase().includes('encryption'),
          };
        `, description: 'Check for security keywords' },
        { type: 'screenshot', name: 'sam-landing' },
      ],
      expectedOutcome: 'Security and audit concepts visible',
    },
    {
      name: 'Concept - Sovereignty',
      description: 'Check for identity sovereignty claims',
      actions: [
        { type: 'scroll', direction: 'down', distance: 500 },
        { type: 'wait', selector: '.concept', timeout: 5000 },
        { type: 'eval', script: `
          const text = document.querySelector('.concept')?.textContent || '';
          return text.toLowerCase().includes('sovereign') || text.toLowerCase().includes('identity') || text.toLowerCase().includes('vault');
        `, description: 'Check for sovereignty/identity mentions' },
        { type: 'screenshot', name: 'sam-concept' },
      ],
      expectedOutcome: 'Concept section covers identity sovereignty',
    },
    {
      name: 'What We Are Not',
      description: 'Verify explicit non-goals (security by exclusion)',
      actions: [
        { type: 'scroll', direction: 'down', distance: 500 },
        { type: 'wait', selector: '[id*="not" i], .what-we-are-not', timeout: 5000 },
        { type: 'assert', selector: '[id*="not" i], .what-we-are-not', condition: 'exists' },
        { type: 'screenshot', name: 'sam-not' },
      ],
      expectedOutcome: 'Explicit non-goals listed (security by exclusion)',
    },
  ],
};

/**
 * Jordan - Startup Founder
 * Goal: Ship a social-media MVP (auth, profile, post, feed) end-to-end.
 * Constraints: None
 * Success: MVP passes STARTUP_PLAYBOOK health checks
 */
export const personaJordan: Persona = {
  id: 'prof-jordan-004',
  name: 'Jordan',
  role: 'startup-founder',
  goal: 'Ship a social-media MVP (auth, profile, post, feed) end-to-end',
  constraints: [],
  successMetrics: ['MVP passes STARTUP_PLAYBOOK health checks'],
  walkthrough: [
    {
      name: 'Landing - Value Proposition',
      description: 'Quickly assess if this solves a real problem',
      actions: [
        { type: 'navigate', url: '/about/' },
        { type: 'wait', selector: 'h1', timeout: 10000 },
        { type: 'assert', selector: 'h1', condition: 'contains', value: 'Legacy Immortal' },
        { type: 'eval', script: `
          const text = document.querySelector('h1 + p')?.textContent || '';
          return text.length > 20;
        `, description: 'Check hero subtitle has substance' },
        { type: 'screenshot', name: 'jordan-hero' },
      ],
      expectedOutcome: 'Clear value prop for startup founders',
    },
    {
      name: 'Features - Speed to Market',
      description: 'Look for "ship fast", "templates", "scaffold" keywords',
      actions: [
        { type: 'scroll', direction: 'down', distance: 500 },
        { type: 'wait', selector: '.features', timeout: 5000 },
        { type: 'eval', script: `
          const text = document.querySelector('.features')?.textContent || '';
          return {
            hasTemplate: text.toLowerCase().includes('template'),
            hasScaffold: text.toLowerCase().includes('scaffold'),
            hasFast: text.toLowerCase().includes('fast') || text.toLowerCase().includes('quick'),
            hasDeploy: text.toLowerCase().includes('deploy'),
          };
        `, description: 'Check for speed-to-market keywords' },
        { type: 'screenshot', name: 'jordan-features' },
      ],
      expectedOutcome: 'Features emphasize speed, templates, deployment',
    },
    {
      name: 'Pricing - Alpha Access',
      description: 'Check pricing/alpha section for founder-friendly terms',
      actions: [
        { type: 'scroll', direction: 'down', distance: 800 },
        { type: 'wait', selector: '.cta, #invitation, [id*="pricing" i]', timeout: 5000 },
        { type: 'screenshot', name: 'jordan-pricing' },
      ],
      expectedOutcome: 'Clear path to try/buy with founder-friendly terms',
    },
  ],
};

/**
 * Casey - Data Scientist
 * Goal: Produce statistical rows from benchmarks; validate an empirical claim.
 * Constraints: None
 * Success: rows load into analysis tool, p-value computed
 */
export const personaCasey: Persona = {
  id: 'prof-casey-005',
  name: 'Casey',
  role: 'data-scientist',
  goal: 'Produce statistical rows from benchmarks; validate an empirical claim',
  constraints: [],
  successMetrics: ['rows load into analysis tool, p-value computed'],
  walkthrough: [
    {
      name: 'Landing - Empirical Claims',
      description: 'Look for measurable claims with evidence',
      actions: [
        { type: 'navigate', url: '/about/' },
        { type: 'wait', selector: 'h1', timeout: 10000 },
        { type: 'eval', script: `
          const text = document.body.textContent || '';
          return {
            hasMetrics: text.toLowerCase().includes('metric') || text.toLowerCase().includes('benchmark'),
            hasStatistical: text.toLowerCase().includes('statistical') || text.toLowerCase().includes('p-value') || text.toLowerCase().includes('confidence'),
            hasEvidence: text.toLowerCase().includes('evidence') || text.toLowerCase().includes('data'),
            hasClaims: text.toLowerCase().includes('claim'),
          };
        `, description: 'Check for empirical/metric language' },
        { type: 'screenshot', name: 'casey-landing' },
      ],
      expectedOutcome: 'Site makes empirical claims with evidence references',
    },
    {
      name: 'Features - Benchmarks',
      description: 'Look for benchmark/performance mentions',
      actions: [
        { type: 'scroll', direction: 'down', distance: 500 },
        { type: 'wait', selector: '.features', timeout: 5000 },
        { type: 'eval', script: `
          const text = document.querySelector('.features')?.textContent || '';
          return text.toLowerCase().includes('benchmark') || text.toLowerCase().includes('performance') || text.toLowerCase().includes('latency');
        `, description: 'Check for performance/benchmark mentions' },
        { type: 'screenshot', name: 'casey-features' },
      ],
      expectedOutcome: 'Features mention benchmarks, performance, latency',
    },
  ],
};

/**
 * All personas for easy iteration
 */
export const allPersonas: Persona[] = [
  personaAlex,
  personaPriya,
  personaSam,
  personaJordan,
  personaCasey,
];

/**
 * Get persona by ID
 */
export function getPersona(id: string): Persona | undefined {
  return allPersonas.find(p => p.id === id);
}

/**
 * Default persona for general testing
 */
export const defaultPersona = personaAlex;
