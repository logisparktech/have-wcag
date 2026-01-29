import type { AuditResults, WcagIssue } from "../types";
import {
  highlightElement,
  removeHighlight,
  removeAllHighlights,
} from "./highlighter";

let toolbarElement: HTMLElement | null = null;
let panelElement: HTMLElement | null = null;
let currentResults: AuditResults | null = null;

interface ToolbarConfig {
  onAudit: () => Promise<AuditResults>;
  level: "A" | "AA" | "AAA";
}

const STYLES = `
  .hwcag-toolbar {
    position: fixed;
    bottom: 90px;
    right: 20px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
  }
  .hwcag-toolbar-btn {
    background: #1a1a2e;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .hwcag-toolbar-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  }
  .hwcag-toolbar-btn:focus {
    outline: 3px solid #007bff;
    outline-offset: 2px;
  }
  .hwcag-panel {
    position: fixed;
    bottom: 150px;
    right: 20px;
    width: 380px;
    max-height: 70vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    z-index: 999998;
    overflow: hidden;
    display: none;
  }
  .hwcag-panel.open { display: block; }
  .hwcag-panel-header {
    background: #1a1a2e;
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .hwcag-panel-title { font-weight: 600; font-size: 16px; }
  .hwcag-panel-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 20px;
    padding: 4px 8px;
    line-height: 1;
  }
  .hwcag-panel-close:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
  .hwcag-panel-summary {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  .hwcag-stat {
    text-align: center;
    flex: 1;
  }
  .hwcag-stat-value {
    font-size: 24px;
    font-weight: 700;
  }
  .hwcag-stat-value.errors { color: #dc3545; }
  .hwcag-stat-value.errors::before { content: '❌ '; font-size: 16px; }
  .hwcag-stat-value.warnings { color: #ffc107; }
  .hwcag-stat-value.warnings::before { content: '⚠️ '; font-size: 16px; }
  .hwcag-stat-value.passed { color: #28a745; }
  .hwcag-stat-value.passed::before { content: '✓ '; font-size: 16px; }
  .hwcag-stat-label { font-size: 12px; color: #6c757d; }
  .hwcag-panel-content {
    max-height: calc(70vh - 140px);
    overflow-y: auto;
    padding: 8px;
  }
  .hwcag-issue {
    padding: 12px;
    margin: 8px 0;
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    border-left: 4px solid #dc3545;
  }
  .hwcag-issue.warning { border-left-color: #ffc107; }
  .hwcag-issue-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 8px;
  }
  .hwcag-issue-type {
    font-size: 11px;
    text-transform: uppercase;
    color: #6c757d;
    font-weight: 600;
  }
  .hwcag-issue-wcag {
    font-size: 11px;
    color: #6c757d;
  }
  .hwcag-issue-message {
    font-size: 13px;
    color: #333;
    margin-bottom: 8px;
  }
  .hwcag-issue-selector {
    font-size: 11px;
    color: #6c757d;
    font-family: monospace;
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 8px;
    word-break: break-all;
  }
  .hwcag-issue-actions {
    display: flex;
    gap: 8px;
  }
  .hwcag-issue-btn {
    padding: 6px 12px;
    font-size: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .hwcag-issue-btn:focus {
    outline: 3px solid #007bff;
    outline-offset: 2px;
  }
  .hwcag-issue-btn.highlight {
    background: #e9ecef;
    color: #333;
  }
  .hwcag-issue-btn.highlight:hover { background: #dee2e6; }
  .hwcag-issue-btn.preview {
    background: #007bff;
    color: white;
  }
  .hwcag-issue-btn.preview:hover { background: #0056b3; }
  .hwcag-issue-btn.copy {
    background: #28a745;
    color: white;
  }
  .hwcag-issue-btn.copy:hover { background: #1e7e34; }
  /* Visual severity indicator icons */
  .hwcag-issue::before {
    content: '❌';
    font-size: 12px;
    margin-right: 6px;
    position: absolute;
    top: 12px;
    left: -2px;
  }
  .hwcag-issue.warning::before {
    content: '⚠️';
  }
  .hwcag-issue {
    position: relative;
    padding-left: 20px;
  }
`;

function injectStyles(): void {
  if (document.getElementById("have-wcag-styles")) return;
  const style = document.createElement("style");
  style.id = "have-wcag-styles";
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function createIssueCard(issue: WcagIssue): HTMLElement {
  const card = document.createElement("div");
  card.className = `hwcag-issue ${issue.severity}`;
  card.setAttribute("role", "article");
  card.setAttribute(
    "aria-label",
    `${issue.severity === "error" ? "Error" : "Warning"}: ${issue.message}`,
  );

  card.innerHTML = `
    <div class="hwcag-issue-header">
      <span class="hwcag-issue-type">${issue.type}</span>
      <span class="hwcag-issue-wcag">${issue.wcagCriteria}</span>
    </div>
    <div class="hwcag-issue-message">${issue.message}</div>
    <div class="hwcag-issue-selector">${issue.selector}</div>
    <div class="hwcag-issue-actions" role="group" aria-label="Actions">
      <button class="hwcag-issue-btn highlight" aria-pressed="false">Highlight</button>
      ${issue.suggestion ? '<button class="hwcag-issue-btn preview" aria-pressed="false">Preview Fix</button>' : ""}
      ${issue.suggestion ? '<button class="hwcag-issue-btn copy">Copy CSS</button>' : ""}
    </div>
  `;

  // Highlight button
  const highlightBtn = card.querySelector(".highlight") as HTMLButtonElement;
  let isHighlighted = false;
  highlightBtn.addEventListener("click", () => {
    if (isHighlighted) {
      removeHighlight(issue.element);
      highlightBtn.textContent = "Highlight";
      highlightBtn.setAttribute("aria-pressed", "false");
    } else {
      highlightElement(issue.element);
      issue.element.scrollIntoView({ behavior: "smooth", block: "center" });
      highlightBtn.textContent = "Remove";
      highlightBtn.setAttribute("aria-pressed", "true");
    }
    isHighlighted = !isHighlighted;
  });

  // Preview button
  const previewBtn = card.querySelector(".preview") as HTMLButtonElement;
  if (previewBtn && issue.suggestion) {
    let isPreviewing = false;
    let originalStyle = "";
    const suggestion = issue.suggestion;

    previewBtn.addEventListener("click", () => {
      if (isPreviewing) {
        issue.element.setAttribute("style", originalStyle);
        previewBtn.textContent = "Preview Fix";
        previewBtn.setAttribute("aria-pressed", "false");
      } else {
        originalStyle = issue.element.getAttribute("style") || "";
        if (issue.type === "contrast" && suggestion.textColor) {
          issue.element.style.color = suggestion.textColor;
        }
        previewBtn.textContent = "Revert";
        previewBtn.setAttribute("aria-pressed", "true");
      }
      isPreviewing = !isPreviewing;
    });
  }

  // Copy button
  const copyBtn = card.querySelector(".copy") as HTMLButtonElement;
  if (copyBtn && issue.suggestion) {
    const suggestion = issue.suggestion;

    copyBtn.addEventListener("click", () => {
      let css = "";
      if (issue.type === "contrast" && suggestion.textColor) {
        css = `${issue.selector} { color: ${suggestion.textColor}; }`;
      } else if (issue.type === "textResize" && suggestion.value) {
        css = `${issue.selector} { font-size: ${suggestion.value}; }`;
      } else if (issue.type === "keyboard") {
        const attrs: string[] = [];
        if (suggestion.tabIndex !== undefined)
          attrs.push(`tabindex="${suggestion.tabIndex}"`);
        if (suggestion.role) attrs.push(`role="${suggestion.role}"`);
        css = `Add attributes: ${attrs.join(" ")}`;
      }
      navigator.clipboard.writeText(css);
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy CSS";
      }, 2000);
    });
  }

  return card;
}

function renderResults(results: AuditResults): void {
  if (!panelElement) return;

  // Store fresh results
  currentResults = results;

  // Calculate counts from fresh results
  const errors = results.issues.filter((i) => i.severity === "error").length;
  const warnings = results.issues.filter(
    (i) => i.severity === "warning",
  ).length;
  const passed = results.summary.passed;

  const content = panelElement.querySelector(
    ".hwcag-panel-content",
  ) as HTMLElement;
  const summary = panelElement.querySelector(
    ".hwcag-panel-summary",
  ) as HTMLElement;

  // Clear previous content completely
  while (summary.firstChild) {
    summary.removeChild(summary.firstChild);
  }
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  // Render fresh summary
  const summaryHTML = document.createElement("div");
  summaryHTML.innerHTML = `
    <div class="hwcag-stat">
      <div class="hwcag-stat-value errors">${errors}</div>
      <div class="hwcag-stat-label">Errors</div>
    </div>
    <div class="hwcag-stat">
      <div class="hwcag-stat-value warnings">${warnings}</div>
      <div class="hwcag-stat-label">Warnings</div>
    </div>
    <div class="hwcag-stat">
      <div class="hwcag-stat-value passed">${passed}</div>
      <div class="hwcag-stat-label">Passed</div>
    </div>
  `;

  // Append each stat separately
  while (summaryHTML.firstChild) {
    summary.appendChild(summaryHTML.firstChild);
  }

  // Render fresh issues
  if (results.issues.length === 0) {
    const noIssues = document.createElement("p");
    noIssues.style.cssText = "text-align:center;color:#28a745;padding:20px;";
    noIssues.textContent = "No issues found!";
    content.appendChild(noIssues);
  } else {
    results.issues.forEach((issue) => {
      content.appendChild(createIssueCard(issue));
    });
  }

  panelElement.classList.add("open");
}

export function createToolbar(config: ToolbarConfig): void {
  // Destroy existing toolbar if any
  destroyToolbar();

  injectStyles();

  // Create toolbar button
  toolbarElement = document.createElement("div");
  toolbarElement.className = "hwcag-toolbar";
  toolbarElement.innerHTML = `<button class="hwcag-toolbar-btn" aria-label="Audit Accessibility" aria-expanded="false" aria-haspopup="dialog">♿ Audit Accessibility</button>`;

  // Create panel
  panelElement = document.createElement("div");
  panelElement.className = "hwcag-panel";
  panelElement.setAttribute("role", "dialog");
  panelElement.setAttribute("aria-modal", "true");
  panelElement.setAttribute("aria-labelledby", "hwcag-audit-title");
  panelElement.innerHTML = `
    <div class="hwcag-panel-header">
      <span class="hwcag-panel-title" id="hwcag-audit-title">have-wcag Audit</span>
      <button class="hwcag-panel-close" aria-label="Close audit panel">×</button>
    </div>
    <div class="hwcag-panel-summary" role="region" aria-label="Audit summary"></div>
    <div class="hwcag-panel-content" role="region" aria-label="Audit results" aria-live="polite">
      <p style="text-align:center;color:#6c757d;padding:20px;">Click "Audit" to scan this page</p>
    </div>
  `;

  // Event listeners
  toolbarElement
    .querySelector("button")!
    .addEventListener("click", async () => {
      const btn = toolbarElement!.querySelector("button")!;

      // Toggle panel if already open
      if (panelElement!.classList.contains("open")) {
        panelElement!.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        removeAllHighlights();
        return;
      }

      btn.textContent = "⏳ Scanning...";
      btn.setAttribute("aria-expanded", "true");

      // Clear previous results and highlights
      removeAllHighlights();
      currentResults = null;

      // Reset panel content before scanning
      const content = panelElement!.querySelector(
        ".hwcag-panel-content",
      ) as HTMLElement;
      const summary = panelElement!.querySelector(
        ".hwcag-panel-summary",
      ) as HTMLElement;
      while (summary.firstChild) summary.removeChild(summary.firstChild);
      while (content.firstChild) content.removeChild(content.firstChild);

      // Show loading state
      const loading = document.createElement("p");
      loading.style.cssText = "text-align:center;color:#6c757d;padding:20px;";
      loading.textContent = "Scanning...";
      content.appendChild(loading);
      panelElement!.classList.add("open");

      // Run fresh audit
      currentResults = await config.onAudit();
      renderResults(currentResults);

      btn.textContent = "♿ Audit Accessibility";
    });

  panelElement
    .querySelector(".hwcag-panel-close")!
    .addEventListener("click", () => {
      panelElement!.classList.remove("open");
      const btn = toolbarElement?.querySelector("button");
      btn?.setAttribute("aria-expanded", "false");
      removeAllHighlights();
    });

  document.body.appendChild(panelElement);
  document.body.appendChild(toolbarElement);
}

export function destroyToolbar(): void {
  removeAllHighlights();
  toolbarElement?.remove();
  panelElement?.remove();
  document.getElementById("have-wcag-styles")?.remove();
  toolbarElement = null;
  panelElement = null;
  currentResults = null;
}