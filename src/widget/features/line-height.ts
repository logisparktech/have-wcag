import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-line-height-styles";

const STEP = 0.25;
const MIN = -0.5; // line-height: 1 (1.5 - 0.5)
const MAX = 1.5; // line-height: 3 (1.5 + 1.5)
const BASE = 1.5; // default line-height

let currentValue = 0;

/**
 * Inject or update line height styles
 */
function updateStyles(): void {
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  const lineHeight = BASE + currentValue;

  styleEl.textContent = `
    html.hwcag-line-height *:not(.hwcag-widget):not(.hwcag-widget *) {
      line-height: ${lineHeight} !important;
    }
  `;
}

/**
 * Apply line height change
 */
function apply(value: number): void {
  currentValue = Math.max(MIN, Math.min(MAX, value));

  if (currentValue === 0) {
    document.documentElement.classList.remove("hwcag-line-height");
    const styleEl = document.getElementById(STYLE_ID);
    if (styleEl) styleEl.remove();
  } else {
    document.documentElement.classList.add("hwcag-line-height");
    updateStyles();
  }
}

/**
 * Reset to default
 */
function reset(): void {
  currentValue = 0;
  document.documentElement.classList.remove("hwcag-line-height");
  const styleEl = document.getElementById(STYLE_ID);
  if (styleEl) styleEl.remove();
}

/**
 * Increase line height
 */
export function increase(): number {
  apply(currentValue + STEP);
  return currentValue;
}

/**
 * Decrease line height
 */
export function decrease(): number {
  apply(currentValue - STEP);
  return currentValue;
}

/**
 * Get current value
 */
export function getValue(): number {
  return currentValue;
}

export const lineHeightFeature: FeatureModule = {
  name: "lineHeight",
  label: "Line Spacing",
  icon: "↕",
  type: "stepper",
  apply,
  reset,
};

export default lineHeightFeature;
