import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-dark-mode-styles";

/**
 * Dark Mode CSS - applies a pleasant dark theme
 * Uses CSS custom properties for smooth theme application
 */
const DARK_MODE_CSS = `
  html.hwcag-dark-mode,
  html[data-hwcag-dark] {
    color-scheme: dark !important;
  }
  
  /* Base dark theme for html and body */
  html.hwcag-dark-mode,
  html.hwcag-dark-mode body,
  html[data-hwcag-dark],
  html[data-hwcag-dark] body {
    background-color: #1a1a2e !important;
    color: #e8e8e8 !important;
  }
  
  /* Aggressive global override for all elements */
  html.hwcag-dark-mode *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide),
  html[data-hwcag-dark] *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) {
    background-color: #1a1a2e !important;
    color: #e8e8e8 !important;
    border-color: #3a3a5a !important;
  }
  
  /* Preserve reading guide styles */
  html.hwcag-dark-mode #hwcag-reading-guide,
  html[data-hwcag-dark] #hwcag-reading-guide {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.15) 0%,
      rgba(255, 255, 0, 0.3) 50%,
      rgba(255, 255, 0, 0.15) 100%
    ) !important;
  }
  
  /* Card and section backgrounds - slightly lighter for depth */
  html.hwcag-dark-mode section:not(.hwcag-widget *),
  html.hwcag-dark-mode article:not(.hwcag-widget *),
  html.hwcag-dark-mode .card:not(.hwcag-widget *),
  html.hwcag-dark-mode [class*="card"]:not(.hwcag-widget *),
  html.hwcag-dark-mode aside:not(.hwcag-widget *),
  html.hwcag-dark-mode nav:not(.hwcag-widget *),
  html.hwcag-dark-mode header:not(.hwcag-widget *),
  html.hwcag-dark-mode footer:not(.hwcag-widget *),
  html[data-hwcag-dark] section:not(.hwcag-widget *),
  html[data-hwcag-dark] article:not(.hwcag-widget *),
  html[data-hwcag-dark] .card:not(.hwcag-widget *),
  html[data-hwcag-dark] [class*="card"]:not(.hwcag-widget *) {
    background-color: #16213e !important;
  }
  
  /* Links */
  html.hwcag-dark-mode a:not(.hwcag-widget *),
  html[data-hwcag-dark] a:not(.hwcag-widget *) {
    color: #64b5f6 !important;
  }
  
  html.hwcag-dark-mode a:hover:not(.hwcag-widget *),
  html[data-hwcag-dark] a:hover:not(.hwcag-widget *) {
    color: #90caf9 !important;
  }
  
  /* Inputs and interactive elements */
  html.hwcag-dark-mode input:not(.hwcag-widget *),
  html.hwcag-dark-mode textarea:not(.hwcag-widget *),
  html.hwcag-dark-mode select:not(.hwcag-widget *),
  html.hwcag-dark-mode button:not(.hwcag-widget *),
  html[data-hwcag-dark] input:not(.hwcag-widget *),
  html[data-hwcag-dark] textarea:not(.hwcag-widget *),
  html[data-hwcag-dark] select:not(.hwcag-widget *),
  html[data-hwcag-dark] button:not(.hwcag-widget *) {
    background-color: #0f0f23 !important;
    color: #e8e8e8 !important;
    border: 1px solid #3a3a5a !important;
  }
  
  /* Muted text */
  html.hwcag-dark-mode .muted:not(.hwcag-widget *),
  html.hwcag-dark-mode [class*="muted"]:not(.hwcag-widget *),
  html[data-hwcag-dark] .muted:not(.hwcag-widget *),
  html[data-hwcag-dark] [class*="muted"]:not(.hwcag-widget *) {
    color: #a0a0a0 !important;
  }
  
  /* Images - subtle opacity */
  html.hwcag-dark-mode img:not(.hwcag-widget *),
  html[data-hwcag-dark] img:not(.hwcag-widget *) {
    opacity: 0.85 !important;
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
  icon: "☾",
  type: "toggle",
  apply,
  reset,
};

export default darkModeFeature;