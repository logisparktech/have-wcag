import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-contrast-styles";

/**
 * High Contrast CSS - for users with low vision
 * Provides maximum contrast with black background, white text, and yellow links
 * Follows WCAG AAA contrast requirements
 */
const CONTRAST_CSS = `
  /* Base high contrast theme */
  html.hwcag-high-contrast,
  html.hwcag-high-contrast body,
  html[data-hwcag-contrast],
  html[data-hwcag-contrast] body {
    background-color: #000000 !important;
    color: #ffffff !important;
  }
  
  /* Aggressive global override for all elements */
  html.hwcag-high-contrast *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide),
  html[data-hwcag-contrast] *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) {
    background-color: #000000 !important;
    color: #ffffff !important;
    border-color: #ffffff !important;
    text-shadow: none !important;
    box-shadow: none !important;
  }
  
  /* Links - Yellow for high visibility */
  html.hwcag-high-contrast a:not(.hwcag-widget *),
  html[data-hwcag-contrast] a:not(.hwcag-widget *) {
    color: #ffff00 !important;
    text-decoration: underline !important;
    font-weight: bold !important;
  }
  
  html.hwcag-high-contrast a:hover:not(.hwcag-widget *),
  html[data-hwcag-contrast] a:hover:not(.hwcag-widget *) {
    color: #00ffff !important;
    outline: 2px solid #00ffff !important;
  }
  
  /* Form elements */
  html.hwcag-high-contrast input:not(.hwcag-widget *),
  html.hwcag-high-contrast textarea:not(.hwcag-widget *),
  html.hwcag-high-contrast select:not(.hwcag-widget *),
  html[data-hwcag-contrast] input:not(.hwcag-widget *),
  html[data-hwcag-contrast] textarea:not(.hwcag-widget *),
  html[data-hwcag-contrast] select:not(.hwcag-widget *) {
    background-color: #000000 !important;
    color: #ffffff !important;
    border: 3px solid #ffffff !important;
  }
  
  /* Buttons */
  html.hwcag-high-contrast button:not(.hwcag-widget *),
  html[data-hwcag-contrast] button:not(.hwcag-widget *) {
    background-color: #ffffff !important;
    color: #000000 !important;
    border: 3px solid #ffffff !important;
    font-weight: bold !important;
  }
  
  html.hwcag-high-contrast button:hover:not(.hwcag-widget *),
  html[data-hwcag-contrast] button:hover:not(.hwcag-widget *) {
    background-color: #ffff00 !important;
    color: #000000 !important;
  }
  
  /* Focus indicators */
  html.hwcag-high-contrast *:focus:not(.hwcag-widget *),
  html[data-hwcag-contrast] *:focus:not(.hwcag-widget *) {
    outline: 4px solid #ffff00 !important;
    outline-offset: 2px !important;
  }
  
  /* Images - high contrast enhancement */
  html.hwcag-high-contrast img:not(.hwcag-widget *),
  html[data-hwcag-contrast] img:not(.hwcag-widget *) {
    filter: contrast(1.5) grayscale(1) !important;
    border: 2px solid #ffffff !important;
  }
`;

let isEnabled = false;

/**
 * Inject contrast styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CONTRAST_CSS;
  document.head.appendChild(style);
}

/**
 * Apply high contrast mode
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-high-contrast");
  } else {
    document.documentElement.classList.remove("hwcag-high-contrast");
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-high-contrast");
}

/**
 * Toggle contrast mode
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

export const contrastFeature: FeatureModule = {
  name: "contrast",
  label: "High Contrast",
  icon: "◉",
  type: "toggle",
  apply,
  reset,
};

export default contrastFeature;