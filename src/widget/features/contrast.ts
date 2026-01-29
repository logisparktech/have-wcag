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
  html.hwcag-high-contrast body {
    background-color: #000000 !important;
    color: #ffffff !important;
  }
  
  /* Remove backgrounds and ensure text visibility */
  html.hwcag-high-contrast *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *) {
    background-color: #000000 !important;
    color: #ffffff !important;
    border-color: #ffffff !important;
    text-shadow: none !important;
    box-shadow: none !important;
  }
  
  /* Links - Yellow for high visibility */
  html.hwcag-high-contrast a:not(.hwcag-widget a):not(.hwcag-widget-panel a):not(.hwcag-toolbar a):not(.hwcag-panel a) {
    color: #ffff00 !important;
    text-decoration: underline !important;
    font-weight: bold !important;
  }
  
  html.hwcag-high-contrast a:hover:not(.hwcag-widget a):not(.hwcag-widget-panel a):not(.hwcag-toolbar a):not(.hwcag-panel a),
  html.hwcag-high-contrast a:focus:not(.hwcag-widget a):not(.hwcag-widget-panel a):not(.hwcag-toolbar a):not(.hwcag-panel a) {
    color: #00ffff !important;
    outline: 2px solid #00ffff !important;
  }
  
  /* Form elements */
  html.hwcag-high-contrast input:not(.hwcag-widget input),
  html.hwcag-high-contrast textarea:not(.hwcag-widget textarea),
  html.hwcag-high-contrast select:not(.hwcag-widget select) {
    background-color: #000000 !important;
    color: #ffffff !important;
    border: 3px solid #ffffff !important;
  }
  
  html.hwcag-high-contrast input:focus:not(.hwcag-widget input),
  html.hwcag-high-contrast textarea:focus:not(.hwcag-widget textarea),
  html.hwcag-high-contrast select:focus:not(.hwcag-widget select) {
    outline: 3px solid #ffff00 !important;
    outline-offset: 2px !important;
  }
  
  /* Buttons */
  html.hwcag-high-contrast button:not(.hwcag-widget button):not(.hwcag-widget-panel button):not(.hwcag-widget-button):not(.hwcag-toolbar button):not(.hwcag-panel button) {
    background-color: #ffffff !important;
    color: #000000 !important;
    border: 3px solid #ffffff !important;
    font-weight: bold !important;
  }
  
  html.hwcag-high-contrast button:hover:not(.hwcag-widget button):not(.hwcag-widget-panel button):not(.hwcag-widget-button):not(.hwcag-toolbar button):not(.hwcag-panel button),
  html.hwcag-high-contrast button:focus:not(.hwcag-widget button):not(.hwcag-widget-panel button):not(.hwcag-widget-button):not(.hwcag-toolbar button):not(.hwcag-panel button) {
    background-color: #ffff00 !important;
    color: #000000 !important;
    outline: 3px solid #ffff00 !important;
  }
  
  /* Headings - make them stand out */
  html.hwcag-high-contrast h1:not(.hwcag-widget *),
  html.hwcag-high-contrast h2:not(.hwcag-widget *),
  html.hwcag-high-contrast h3:not(.hwcag-widget *),
  html.hwcag-high-contrast h4:not(.hwcag-widget *),
  html.hwcag-high-contrast h5:not(.hwcag-widget *),
  html.hwcag-high-contrast h6:not(.hwcag-widget *) {
    color: #ffffff !important;
    font-weight: bold !important;
  }
  
  /* Images - high contrast enhancement */
  html.hwcag-high-contrast img:not(.hwcag-widget img) {
    filter: contrast(1.2) !important;
    border: 2px solid #ffffff !important;
  }
  
  /* Tables */
  html.hwcag-high-contrast table:not(.hwcag-widget *) th,
  html.hwcag-high-contrast table:not(.hwcag-widget *) td {
    border: 2px solid #ffffff !important;
  }
  
  /* Focus indicators - critical for accessibility */
  html.hwcag-high-contrast *:focus:not(.hwcag-widget *) {
    outline: 3px solid #ffff00 !important;
    outline-offset: 2px !important;
  }
  
  /* Error states */
  html.hwcag-high-contrast .error:not(.hwcag-widget *),
  html.hwcag-high-contrast [class*="error"]:not(.hwcag-widget *),
  html.hwcag-high-contrast .danger:not(.hwcag-widget *) {
    color: #ff6b6b !important;
    border-color: #ff6b6b !important;
  }
  
  /* Success states */
  html.hwcag-high-contrast .success:not(.hwcag-widget *),
  html.hwcag-high-contrast [class*="success"]:not(.hwcag-widget *) {
    color: #00ff00 !important;
    border-color: #00ff00 !important;
  }
  
  /* High contrast takes priority over dark mode when both are enabled */
  html.hwcag-high-contrast.hwcag-dark-mode,
  html.hwcag-high-contrast.hwcag-dark-mode body {
    background-color: #000000 !important;
    color: #ffffff !important;
  }
  
  html.hwcag-high-contrast.hwcag-dark-mode *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *) {
    background-color: #000000 !important;
    color: #ffffff !important;
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
  icon: "◐",
  type: "toggle",
  apply,
  reset,
};

export default contrastFeature;