import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-contrast-styles";

const CONTRAST_CSS = `
  html.hwcag-high-contrast {
    filter: invert(1) hue-rotate(180deg);
  }
  html.hwcag-high-contrast img,
  html.hwcag-high-contrast video,
  html.hwcag-high-contrast picture,
  html.hwcag-high-contrast canvas,
  html.hwcag-high-contrast svg:not(.hwcag-widget svg),
  html.hwcag-high-contrast [style*="background-image"]:not(.hwcag-widget *) {
    filter: invert(1) hue-rotate(180deg);
  }
  /* Preserve widget styles */
  html.hwcag-high-contrast .hwcag-widget,
  html.hwcag-high-contrast .hwcag-widget *,
  html.hwcag-high-contrast .hwcag-toolbar,
  html.hwcag-high-contrast .hwcag-toolbar *,
  html.hwcag-high-contrast .hwcag-panel,
  html.hwcag-high-contrast .hwcag-panel * {
    filter: invert(1) hue-rotate(180deg);
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
