import type { AuditResults, WcagIssue, CheckType } from "../types";

/**
 * Panel tab configuration
 */
export interface PanelTab {
  id: string;
  label: string;
  count: number;
}

/**
 * Filter state for the panel
 */
export interface PanelFilters {
  type: CheckType | "all";
  severity: "error" | "warning" | "all";
  search: string;
}

/**
 * Panel state
 */
export interface PanelState {
  isOpen: boolean;
  activeTab: string;
  filters: PanelFilters;
  results: AuditResults | null;
}

/**
 * Create initial panel state
 */
export function createPanelState(): PanelState {
  return {
    isOpen: false,
    activeTab: "all",
    filters: {
      type: "all",
      severity: "all",
      search: "",
    },
    results: null,
  };
}

/**
 * Filter issues based on current filters
 */
export function filterIssues(
  issues: WcagIssue[],
  filters: PanelFilters,
): WcagIssue[] {
  return issues.filter((issue) => {
    // Filter by type
    if (filters.type !== "all" && issue.type !== filters.type) {
      return false;
    }

    // Filter by severity
    if (filters.severity !== "all" && issue.severity !== filters.severity) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSelector = issue.selector
        .toLowerCase()
        .includes(searchLower);
      const matchesMessage = issue.message.toLowerCase().includes(searchLower);
      const matchesCriteria = issue.wcagCriteria
        .toLowerCase()
        .includes(searchLower);

      if (!matchesSelector && !matchesMessage && !matchesCriteria) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get tab configuration from results
 */
export function getTabs(results: AuditResults): PanelTab[] {
  const tabs: PanelTab[] = [
    { id: "all", label: "All", count: results.issues.length },
  ];

  const types: CheckType[] = ["contrast", "textResize", "keyboard"];
  types.forEach((type) => {
    const count = results.issues.filter((i) => i.type === type).length;
    if (count > 0) {
      tabs.push({
        id: type,
        label: formatTabLabel(type),
        count,
      });
    }
  });

  return tabs;
}

/**
 * Format tab label from check type
 */
function formatTabLabel(type: CheckType): string {
  switch (type) {
    case "contrast":
      return "Contrast";
    case "textResize":
      return "Text Size";
    case "keyboard":
      return "Keyboard";
    default:
      return type;
  }
}

/**
 * Sort issues by severity (errors first)
 */
export function sortIssues(issues: WcagIssue[]): WcagIssue[] {
  return [...issues].sort((a, b) => {
    if (a.severity === "error" && b.severity === "warning") return -1;
    if (a.severity === "warning" && b.severity === "error") return 1;
    return 0;
  });
}

/**
 * Get summary statistics
 */
export function getSummary(results: AuditResults): {
  errors: number;
  warnings: number;
  passed: number;
  total: number;
} {
  return {
    errors: results.issues.filter((i) => i.severity === "error").length,
    warnings: results.issues.filter((i) => i.severity === "warning").length,
    passed: results.summary.passed,
    total: results.summary.total,
  };
}

/**
 * Export results for download
 */
export function exportResults(
  results: AuditResults,
  format: "json" | "csv",
): string {
  if (format === "json") {
    return JSON.stringify(results, null, 2);
  }

  // CSV format
  const headers = ["Type", "Severity", "Selector", "Message", "WCAG Criteria"];
  const rows = results.issues.map((issue) => [
    issue.type,
    issue.severity,
    `"${issue.selector.replace(/"/g, '""')}"`,
    `"${issue.message.replace(/"/g, '""')}"`,
    issue.wcagCriteria,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Download results as a file
 */
export function downloadResults(
  results: AuditResults,
  format: "json" | "csv",
): void {
  const content = exportResults(results, format);
  const mimeType = format === "json" ? "application/json" : "text/csv";
  const extension = format;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `have-wcag-report-${Date.now()}.${extension}`;
  link.click();

  URL.revokeObjectURL(url);
}
