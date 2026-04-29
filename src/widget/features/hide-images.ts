import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-hide-images-styles";

let isEnabled = false;

/**
 * Inject hide images styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* Hide all images except those in the widget */
    html.hwcag-hide-images img:not(.hwcag-widget img):not(.hwcag-widget-panel img):not(.hwcag-toolbar img):not(.hwcag-panel img) {
      visibility: hidden !important;
    }
    
    /* Show image placeholders with alt text for accessibility */
    html.hwcag-hide-images img:not(.hwcag-widget img):not(.hwcag-widget-panel img):not(.hwcag-toolbar img):not(.hwcag-panel img)::after {
      content: attr(alt);
      display: block;
      width: 100%;
      height: 100%;
      text-align: center;
      color: #666;
      font-style: italic;
      pointer-events: none;
      background-color: #f5f5f5;
      border: 1px dashed #ccc;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Apply hide images mode
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-hide-images");
  } else {
    document.documentElement.classList.remove("hwcag-hide-images");
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-hide-images");
  const styleEl = document.getElementById(STYLE_ID);
  if (styleEl) styleEl.remove();
}

/**
 * Toggle hide images mode
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

export const hideImagesFeature: FeatureModule = {
  name: "hideImages",
  label: "Hide Images",
  icon: "▭",
  type: "toggle",
  apply,
  reset,
};

export default hideImagesFeature;