import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-invert-styles";

/**
 * Invert Colors CSS
 * Inverts all colors on the page except for the widget and some media elements
 */
const INVERT_CSS = `
  html.hwcag-invert {
    filter: invert(100%) !important;
    background-color: #fff !important;
  }
  
  /* Only re-invert the widget to keep it readable and usable */
  html.hwcag-invert .hwcag-widget {
    filter: invert(100%) !important;
  }
  
  /* Ensure background is covered */
  html.hwcag-invert body {
    background-color: inherit !important;
  }
`;

let isEnabled = false;

/**
 * Inject invert styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = INVERT_CSS;
  document.head.appendChild(style);
}

/**
 * Apply invert mode
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-invert");
  } else {
    document.documentElement.classList.remove("hwcag-invert");
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-invert");
}

/**
 * Toggle invert mode
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

export const invertFeature: FeatureModule = {
  name: "invert",
  label: "Invert Colors",
  icon: "◐",
  type: "toggle",
  apply,
  reset,
};

export default invertFeature;
