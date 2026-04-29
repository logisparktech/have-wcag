import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-dark-mode-styles";

/**
 * Dark Mode CSS - applies a pleasant dark theme
 * Uses CSS custom properties for smooth theme application
 */
const DARK_MODE_CSS = `
  html.hwcag-dark-mode {
    filter: invert(1) hue-rotate(180deg) brightness(0.95) !important;
  }
  
  /* Double invert for images and media to preserve original colors */
  html.hwcag-dark-mode img,
  html.hwcag-dark-mode video,
  html.hwcag-dark-mode iframe,
  html.hwcag-dark-mode canvas,
  html.hwcag-dark-mode picture {
    filter: invert(1) hue-rotate(180deg) !important;
  }

  /* Protect widget UI from being inverted by the html filter */
  html.hwcag-dark-mode .hwcag-widget-panel,
  html.hwcag-dark-mode .hwcag-widget-button,
  html.hwcag-dark-mode .hwcag-ps-overlay,
  html.hwcag-dark-mode .hwcag-sr-controls,
  html.hwcag-dark-mode .hwcag-toolbar {
    filter: invert(1) hue-rotate(180deg) brightness(1.05) !important;
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