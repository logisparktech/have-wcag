import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-stop-animations-styles";

const STOP_ANIMATIONS_CSS = `
  /* Stop CSS animations and transitions */
  html.hwcag-stop-animations *:not(.hwcag-widget):not(.hwcag-widget *) {
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    scroll-behavior: auto !important;
  }
  
  /* Stop SVG animations */
  html.hwcag-stop-animations svg *:not(.hwcag-widget *) {
    animation-duration: 0s !important;
  }
`;

let isEnabled = false;

/**
 * Inject stop animations styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STOP_ANIMATIONS_CSS;
  document.head.appendChild(style);
}

/**
 * Apply stop animations
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-stop-animations");
  } else {
    document.documentElement.classList.remove("hwcag-stop-animations");
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-stop-animations");
}

/**
 * Toggle stop animations
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

export const stopAnimationsFeature: FeatureModule = {
  name: "stopAnimations",
  label: "Stop Animations",
  icon: "⏯",
  type: "toggle",
  apply,
  reset,
};

export default stopAnimationsFeature;
