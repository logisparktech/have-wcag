import type { AuditResults, WcagIssue, CheckType } from "../types";

/**
 * Report format options
 */
export type ReportFormat = "json" | "html" | "console" | "markdown";

/**
 * Reporter configuration
 */
export interface ReporterConfig {
  format?: ReportFormat;
  verbose?: boolean;
  groupBy?: "type" | "severity" | "element";
}

/**
 * Format results as JSON string
 */
export function toJSON(results: AuditResults): string {
  return JSON.stringify(
    {
      timestamp: results.timestamp.toISOString(),
      url: results.url,
      level: results.level,
      summary: results.summary,
      issues: results.issues.map((issue) => ({
        id: issue.id,
        type: issue.type,
        selector: issue.selector,
        severity: issue.severity,
        message: issue.message,
        wcagCriteria: issue.wcagCriteria,
        current: issue.current,
        suggestion: issue.suggestion,
      })),
    },
    null,
    2,
  );
}

/**
 * Format results as HTML report
 */
export function toHTML(results: AuditResults): string {
  const issueRows = results.issues
    .map(
      (issue) => `
    <tr class="${issue.severity}">
      <td>${issue.type}</td>
      <td>${issue.severity}</td>
      <td><code>${escapeHtml(issue.selector)}</code></td>
      <td>${escapeHtml(issue.message)}</td>
      <td>${issue.wcagCriteria}</td>
    </tr>
  `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>have-wcag Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
    h1 { color: #1a1a2e; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .stat { padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; }
    .stat-value.errors { color: #dc3545; }
    .stat-value.warnings { color: #ffc107; }
    .stat-value.passed { color: #28a745; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #1a1a2e; color: white; }
    tr.error { background: #fff5f5; }
    tr.warning { background: #fffbf0; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>have-wcag Audit Report</h1>
  <p>URL: ${escapeHtml(results.url)}</p>
  <p>Generated: ${results.timestamp.toLocaleString()}</p>
  <p>Level: WCAG ${results.level}</p>
  
  <div class="summary">
    <div class="stat">
      <div class="stat-value errors">${results.issues.filter((i) => i.severity === "error").length}</div>
      <div>Errors</div>
    </div>
    <div class="stat">
      <div class="stat-value warnings">${results.issues.filter((i) => i.severity === "warning").length}</div>
      <div>Warnings</div>
    </div>
    <div class="stat">
      <div class="stat-value passed">${results.summary.passed}</div>
      <div>Passed</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Severity</th>
        <th>Selector</th>
        <th>Message</th>
        <th>WCAG</th>
      </tr>
    </thead>
    <tbody>
      ${issueRows || '<tr><td colspan="5" style="text-align:center;">No issues found!</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
}

/**
 * Format results as Markdown
 */
export function toMarkdown(results: AuditResults): string {
  const errors = results.issues.filter((i) => i.severity === "error").length;
  const warnings = results.issues.filter(
    (i) => i.severity === "warning",
  ).length;

  let md = `# have-wcag Audit Report

**URL:** ${results.url}  
**Generated:** ${results.timestamp.toLocaleString()}  
**Level:** WCAG ${results.level}

## Summary

| Errors | Warnings | Passed |
|--------|----------|--------|
| ${errors} | ${warnings} | ${results.summary.passed} |

## Issues

`;

  if (results.issues.length === 0) {
    md += "✅ No issues found!\n";
  } else {
    results.issues.forEach((issue, i) => {
      md += `### ${i + 1}. ${issue.message}

- **Type:** ${issue.type}
- **Severity:** ${issue.severity}
- **WCAG:** ${issue.wcagCriteria}
- **Selector:** \`${issue.selector}\`
`;
      if (issue.suggestion) {
        md += `- **Suggestion:** \`${JSON.stringify(issue.suggestion)}\`\n`;
      }
      md += "\n";
    });
  }

  return md;
}

/**
 * Log results to console
 */
export function toConsole(
  results: AuditResults,
  verbose: boolean = false,
): void {
  const errors = results.issues.filter((i) => i.severity === "error");
  const warnings = results.issues.filter((i) => i.severity === "warning");

  console.group("🔍 have-wcag Audit Results");
  console.log(`URL: ${results.url}`);
  console.log(`Level: WCAG ${results.level}`);
  console.log(`Time: ${results.timestamp.toLocaleString()}`);
  console.log("");
  console.log(`❌ Errors: ${errors.length}`);
  console.log(`⚠️ Warnings: ${warnings.length}`);
  console.log(`✅ Passed: ${results.summary.passed}`);

  if (verbose && results.issues.length > 0) {
    console.log("");
    console.group("Issues:");
    results.issues.forEach((issue, i) => {
      const icon = issue.severity === "error" ? "❌" : "⚠️";
      console.group(`${icon} ${i + 1}. ${issue.message}`);
      console.log(`Type: ${issue.type}`);
      console.log(`WCAG: ${issue.wcagCriteria}`);
      console.log(`Selector: ${issue.selector}`);
      if (issue.suggestion) {
        console.log("Suggestion:", issue.suggestion);
      }
      console.log("Element:", issue.element);
      console.groupEnd();
    });
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Group issues by a specific property
 */
export function groupIssues(
  issues: WcagIssue[],
  by: "type" | "severity",
): Record<string, WcagIssue[]> {
  return issues.reduce(
    (acc, issue) => {
      const key = issue[by];
      if (!acc[key]) acc[key] = [];
      acc[key].push(issue);
      return acc;
    },
    {} as Record<string, WcagIssue[]>,
  );
}

/**
 * Generate report in specified format
 */
export function generateReport(
  results: AuditResults,
  config: ReporterConfig = {},
): string | void {
  const { format = "json", verbose = false } = config;

  switch (format) {
    case "json":
      return toJSON(results);
    case "html":
      return toHTML(results);
    case "markdown":
      return toMarkdown(results);
    case "console":
      toConsole(results, verbose);
      return;
    default:
      return toJSON(results);
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default {
  generateReport,
  toJSON,
  toHTML,
  toMarkdown,
  toConsole,
  groupIssues,
};
