import type {
  HaveWcagConfig,
  AuditResults,
  WcagIssue,
  CheckType,
  CheckModule,
} from "../types";
import { getTextElements, getInteractiveElements } from "../utils/dom";
import { contrastCheck } from "../checks/contrast";
import { keyboardCheck } from "../checks/keyboard";
import { textResizeCheck } from "../checks/text-resize";

const DEFAULT_CONFIG: Required<HaveWcagConfig> = {
  autoRun: false,
  showToolbar: true,
  level: "AA",
  checks: ["contrast", "textResize", "keyboard"],
  onComplete: () => {},
};

/**
 * Map of check types to their implementations
 */
const CHECK_MODULES: Record<CheckType, CheckModule> = {
  contrast: contrastCheck,
  textResize: textResizeCheck,
  keyboard: keyboardCheck,
};

/**
 * Get elements to check based on check type
 */
function getElementsForCheck(checkType: CheckType): HTMLElement[] {
  switch (checkType) {
    case "contrast":
    case "textResize":
      return getTextElements();
    case "keyboard":
      return getInteractiveElements();
    default:
      return [];
  }
}

/**
 * Main audit function
 */
export async function audit(
  config: Partial<HaveWcagConfig> = {},
): Promise<AuditResults> {
  const settings = { ...DEFAULT_CONFIG, ...config };

  // Create fresh arrays for each audit run
  const issues: WcagIssue[] = [];
  const passed: Record<CheckType, number> = {
    contrast: 0,
    textResize: 0,
    keyboard: 0,
  };

  // Clear any previous highlights
  document.querySelectorAll(".hwcag-highlight").forEach((el) => {
    el.classList.remove("hwcag-highlight");
  });

  // Run each enabled check
  for (const checkType of settings.checks) {
    const checkModule = CHECK_MODULES[checkType];
    const elements = getElementsForCheck(checkType);

    for (const element of elements) {
      const issue = checkModule.run(element, settings.level);

      if (issue) {
        issues.push(issue);
      } else {
        passed[checkType]++;
      }
    }
  }

  // Compile results
  const results: AuditResults = {
    timestamp: new Date(),
    url: window.location.href,
    level: settings.level,
    summary: {
      total: issues.length + Object.values(passed).reduce((a, b) => a + b, 0),
      passed: Object.values(passed).reduce((a, b) => a + b, 0),
      failed: issues.length,
      byType: {
        contrast: {
          passed: passed.contrast,
          failed: issues.filter((i) => i.type === "contrast").length,
        },
        textResize: {
          passed: passed.textResize,
          failed: issues.filter((i) => i.type === "textResize").length,
        },
        keyboard: {
          passed: passed.keyboard,
          failed: issues.filter((i) => i.type === "keyboard").length,
        },
      },
    },
    issues,
  };

  if (settings.onComplete) {
    settings.onComplete(results);
  }
  return results;
}

/**
 * Audit a specific element only
 */
export function auditElement(
  element: HTMLElement,
  checks: CheckType[] = ["contrast", "textResize", "keyboard"],
  level: "A" | "AA" | "AAA" = "AA",
): WcagIssue[] {
  const issues: WcagIssue[] = [];

  for (const checkType of checks) {
    const issue = CHECK_MODULES[checkType].run(element, level);
    if (issue) issues.push(issue);
  }

  return issues;
}

export default audit;
