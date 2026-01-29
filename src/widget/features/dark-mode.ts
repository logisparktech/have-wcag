import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-dark-mode-styles";

/**
 * Dark Mode CSS - applies a pleasant dark theme
 * Uses CSS custom properties for smooth theme application
 */
const DARK_MODE_CSS = `
  html.hwcag-dark-mode {
    color-scheme: dark;
  }
  
  /* Base dark theme for html and body */
  html.hwcag-dark-mode,
  html.hwcag-dark-mode body {
    background-color: #1a1a2e !important;
    color: #e8e8e8 !important;
  }
  
  /* Apply dark theme to all elements except widget and reading guide */
  html.hwcag-dark-mode *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) {
    background-color: inherit;
    color: inherit;
  }
  
  /* Preserve reading guide styles in dark mode */
  html.hwcag-dark-mode #hwcag-reading-guide {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.15) 0%,
      rgba(255, 255, 0, 0.3) 50%,
      rgba(255, 255, 0, 0.15) 100%
    ) !important;
  }
  
  /* Card and section backgrounds */
  html.hwcag-dark-mode section:not(.hwcag-widget *),
  html.hwcag-dark-mode article:not(.hwcag-widget *),
  html.hwcag-dark-mode div.card:not(.hwcag-widget *),
  html.hwcag-dark-mode [class*="card"]:not(.hwcag-widget *),
  html.hwcag-dark-mode aside:not(.hwcag-widget *),
  html.hwcag-dark-mode nav:not(.hwcag-widget *),
  html.hwcag-dark-mode header:not(.hwcag-widget *),
  html.hwcag-dark-mode footer:not(.hwcag-widget *) {
    background-color: #16213e !important;
    border-color: #2a2a4a !important;
  }
  
  /* Example/code blocks */
  html.hwcag-dark-mode .example:not(.hwcag-widget *),
  html.hwcag-dark-mode pre:not(.hwcag-widget *),
  html.hwcag-dark-mode code:not(.hwcag-widget *) {
    background-color: #0f0f23 !important;
    border-color: #2a2a4a !important;
  }
  
  /* Links */
  html.hwcag-dark-mode a:not(.hwcag-widget a):not(.hwcag-widget-panel a):not(.hwcag-toolbar a):not(.hwcag-panel a) {
    color: #64b5f6 !important;
  }
  
  html.hwcag-dark-mode a:hover:not(.hwcag-widget a):not(.hwcag-widget-panel a):not(.hwcag-toolbar a):not(.hwcag-panel a) {
    color: #90caf9 !important;
  }
  
  /* Form elements */
  html.hwcag-dark-mode input:not(.hwcag-widget input),
  html.hwcag-dark-mode textarea:not(.hwcag-widget textarea),
  html.hwcag-dark-mode select:not(.hwcag-widget select) {
    background-color: #0f0f23 !important;
    color: #e8e8e8 !important;
    border-color: #3a3a5a !important;
  }
  
  /* Buttons (non-widget) */
  html.hwcag-dark-mode button:not(.hwcag-widget button):not(.hwcag-widget-panel button):not(.hwcag-widget-button):not(.hwcag-toolbar button):not(.hwcag-panel button) {
    background-color: #2a2a4a !important;
    color: #e8e8e8 !important;
    border-color: #3a3a5a !important;
  }
  
  /* Tables */
  html.hwcag-dark-mode table:not(.hwcag-widget *) {
    border-color: #3a3a5a !important;
  }
  
  html.hwcag-dark-mode th:not(.hwcag-widget *),
  html.hwcag-dark-mode td:not(.hwcag-widget *) {
    border-color: #3a3a5a !important;
    background-color: transparent !important;
  }
  
  html.hwcag-dark-mode th:not(.hwcag-widget *) {
    background-color: #16213e !important;
  }
  
  /* Muted text */
  html.hwcag-dark-mode .subtitle:not(.hwcag-widget *),
  html.hwcag-dark-mode .muted:not(.hwcag-widget *),
  html.hwcag-dark-mode .text-muted:not(.hwcag-widget *),
  html.hwcag-dark-mode [class*="muted"]:not(.hwcag-widget *) {
    color: #a0a0a0 !important;
  }
  
  /* Images - add subtle opacity adjustment for better viewing in dark mode */
  html.hwcag-dark-mode img:not(.hwcag-widget img) {
    opacity: 0.9;
  }
`;

let isEnabled = false;

/**
 * Inject dark mode styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = DARK_MODE_CSS;
  document.head.appendChild(style);
}

/**
 * Apply dark mode
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-dark-mode");
  } else {
    document.documentElement.classList.remove("hwcag-dark-mode");
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-dark-mode");
}

/**
 * Toggle dark mode
 */
export function toggle(): boolean {
  apply(!isEnabled);
  return isEnabled;
}

/**
 * Get current state
 */
export function getValue(): boolean {
  return isEnabled;
}

export const darkModeFeature: FeatureModule = {
  name: "darkMode",
  label: "Dark Mode",
  icon: "🌙",
  type: "toggle",
  apply,
  reset,
};

export default darkModeFeature;