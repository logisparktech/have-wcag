import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-dark-mode-styles";

const DARK_MODE_CSS = `
  html.hwcag-dark-mode,
  html.hwcag-dark-mode body {
    background-color: #000 !important;
    color: #fff !important;
  }
  html.hwcag-dark-mode *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *) {
    background-color: inherit !important;
    color: inherit !important;
    border-color: #fff !important;
  }
  html.hwcag-dark-mode a:not(.hwcag-widget a):not(.hwcag-toolbar a):not(.hwcag-panel a) {
    color: #ffff00 !important;
    text-decoration: underline !important;
  }
  html.hwcag-dark-mode button:not(.hwcag-widget button):not(.hwcag-toolbar button):not(.hwcag-panel button),
  html.hwcag-dark-mode input:not(.hwcag-widget input),
  html.hwcag-dark-mode select:not(.hwcag-widget select),
  html.hwcag-dark-mode textarea:not(.hwcag-widget textarea) {
    background-color: #000 !important;
    color: #fff !important;
    border: 2px solid #fff !important;
  }
  html.hwcag-dark-mode img:not(.hwcag-widget img) {
    filter: contrast(1.2) !important;
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
