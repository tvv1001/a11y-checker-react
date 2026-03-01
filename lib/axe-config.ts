import type { AxeResults, Result } from "axe-core";

/**
 * axe-core configuration for WCAG compliance checking
 */

export interface AxeConfig {
  runOnly: {
    type: string;
    values: string[];
  };
  resultTypes: string[];
}

export interface FormattedViolation {
  id: string;
  message: string;
  description: string;
  help: string;
  helpUrl?: string;
  impact: string;
  // Optional list of ARIA attributes related to this rule to help link to guidance
  relatedAttributes?: string[];
  tags: string[];
  nodes: {
    html: string;
    target: string[];
    failureSummary?: string;
  }[];
  nodeCount: number;
}

export interface ProcessedResults {
  violations: FormattedViolation[];
  passes: { id: string; description: string }[];
  incomplete: { id: string; description: string }[];
  total: number;
  summary: {
    violation_count: number;
    pass_count: number;
    incomplete_count: number;
  };
}

/**
 * Default axe-core configuration for WCAG 2.1 level AA
 */
export const defaultAxeConfig: AxeConfig = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
  },
  resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
};

/**
 * Configuration presets for different WCAG levels
 */
export const wcagPresets: Record<string, AxeConfig> = {
  wcag2a: {
    runOnly: { type: "tag", values: ["wcag2a"] },
    resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
  },
  wcag2aa: {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
  },
  wcag21a: {
    runOnly: { type: "tag", values: ["wcag21a"] },
    resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
  },
  wcag21aa: {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
    resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
  },
  wcag22aa: {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
    },
    resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
  },
};

/**
 * Get axe configuration by preset name
 */
export function getConfig(preset: string = "wcag22aa"): AxeConfig {
  return wcagPresets[preset] || wcagPresets["wcag22aa"];
}

/**
 * Format axe-core violations into a readable format
 */
export function formatViolations(violations: Result[]): FormattedViolation[] {
  return violations.map((violation) => ({
    id: violation.id,
    message: violation.description,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    impact: violation.impact || "unknown",
    tags: violation.tags || [],
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      target: node.target as unknown as string[],
      failureSummary: node.failureSummary,
    })),
    nodeCount: violation.nodes.length,
    relatedAttributes: AXE_RULE_TO_ATTRIBUTES[violation.id] ?? undefined,
  }));
}

// Map axe rule ids to ARIA attributes (helps the UI link a rule to an attribute tooltip)
const AXE_RULE_TO_ATTRIBUTES: Record<string, string[]> = {
  "aria-activedescendant": ["aria-activedescendant"],
  "aria-hidden-focus": ["aria-hidden"],
  "aria-required-attr": ["aria-required"],
  "aria-roles": ["role"],
  "aria-allowed-attr": [],
  "aria-valid-attr-value": [],
  "aria-errormessage": ["aria-errormessage"],
  "aria-dialog-name": ["aria-labelledby", "aria-label"],
  "aria-required-parent": [],
};

/**
 * Process complete axe scan results
 */
export function processResults(results: AxeResults | null): ProcessedResults {
  if (!results) {
    return {
      violations: [],
      passes: [],
      incomplete: [],
      total: 0,
      summary: {
        violation_count: 0,
        pass_count: 0,
        incomplete_count: 0,
      },
    };
  }

  const violations = formatViolations(results.violations || []);
  const passes = results.passes || [];
  const incomplete = results.incomplete || [];

  return {
    violations,
    passes: passes.map((p) => ({
      id: p.id,
      description: p.description,
    })),
    incomplete: incomplete.map((i) => ({
      id: i.id,
      description: i.description,
    })),
    total: violations.length + passes.length + incomplete.length,
    summary: {
      violation_count: violations.length,
      pass_count: passes.length,
      incomplete_count: incomplete.length,
    },
  };
}

/**
 * Generate a text report summary
 */
export function generateReport(results: ProcessedResults): string {
  const { summary } = results;

  return `
WCAG Accessibility Scan Report
===============================

Total Tests Run: ${results.total}

Results:
- Violations: ${summary.violation_count}
- Passed: ${summary.pass_count}
- Incomplete: ${summary.incomplete_count}

${summary.violation_count === 0 ? "✅ No accessibility violations found!" : "❌ Violations detected. Please review the issues."}
  `.trim();
}
