import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-link-highlight-styles";

const LINK_HIGHLIGHT_CSS = `
  html.hwcag-link-highlight a:not(.hwcag-widget a) {
    outline: 2px solid #007bff !important;
    outline-offset: 2px !important;
    background-color: rgba(0, 123, 255, 0.1) !important;
    text-decoration: underline !important;
  }
  html.hwcag-link-highlight a:not(.hwcag-widget a):hover {
    outline-color: #0056b3 !important;
    background-color: rgba(0, 123, 255, 0.2) !important;
  }
  html.hwcag-link-highlight a:not(.hwcag-widget a):focus {
    outline-width: 3px !important;
    outline-color: #0056b3 !important;
  }
`;

let isEnabled = false;

/**
 * Inject link highlight styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = LINK_HIGHLIGHT_CSS;
  document.head.appendChild(style);
}

/**
 * Apply link highlighting
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-link-highlight");
  } else {
    document.documentElement.classList.remove("hwcag-link-highlight");
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-link-highlight");
}

/**
 * Toggle link highlighting
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

export const linkHighlightFeature: FeatureModule = {
  name: "linkHighlight",
  label: "Highlight Links",
  icon: "≡",
  type: "toggle",
  apply,
  reset,
};

export default linkHighlightFeature;
