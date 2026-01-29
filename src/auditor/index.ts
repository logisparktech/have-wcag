/**
 * Auditor module - Developer accessibility auditing tool
 *
 * This is a re-export of the existing auditor functionality
 * organized under the auditor namespace.
 */

import { audit, auditElement } from "../core/auditor";
import { createToolbar, destroyToolbar } from "../ui/toolbar";
import type { HaveWcagConfig, AuditResults, WcagIssue } from "../types";

let isInitialized = false;
let currentConfig: HaveWcagConfig = {};

/**
 * Initialize the auditor
 */
export function init(config: HaveWcagConfig = {}): void {
  if (isInitialized) {
    console.warn("have-wcag auditor is already initialized");
    return;
  }

  currentConfig = {
    autoRun: false,
    showToolbar: true,
    level: "AA",
    checks: ["contrast", "textResize", "keyboard"],
    ...config,
  };

  isInitialized = true;

  // Show toolbar if enabled
  if (currentConfig.showToolbar) {
    createToolbar({
      onAudit: runAudit,
      level: currentConfig.level!,
    });
  }

  // Auto-run if enabled
  if (currentConfig.autoRun) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runAudit);
    } else {
      runAudit();
    }
  }

  console.log("have-wcag auditor initialized", currentConfig);
}

/**
 * Run the audit with current configuration
 */
export async function runAudit(): Promise<AuditResults> {
  // Always create fresh audit with current config
  const freshConfig = {
    autoRun: false,
    showToolbar: currentConfig.showToolbar ?? true,
    level: currentConfig.level ?? "AA",
    checks: currentConfig.checks ?? ["contrast", "textResize", "keyboard"],
  };
  const results = await audit(freshConfig);

  // Call onComplete if provided
  if (currentConfig.onComplete) {
    currentConfig.onComplete(results);
  }

  return results;
}

/**
 * Destroy the auditor and clean up
 */
export function destroy(): void {
  if (!isInitialized) return;

  destroyToolbar();
  isInitialized = false;
  currentConfig = {};
}

/**
 * Update configuration
 */
export function configure(config: Partial<HaveWcagConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

// Export core functions
export { audit, auditElement };

// Export types
export * from "../types";

// Default export
export default {
  init,
  destroy,
  configure,
  audit: runAudit,
  auditElement,
};
