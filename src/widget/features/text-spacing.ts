import type { FeatureModule } from "../types";

const STEP = 2; // px
const MIN = -10; // px
const MAX = 10; // px

let currentValue = 0;

/**
 * Apply text spacing change to the document
 */
function apply(value: number): void {
  currentValue = Math.max(MIN, Math.min(MAX, value));
  const spacing = `${currentValue}px`;
  document.documentElement.style.letterSpacing = spacing;
  document.documentElement.style.wordSpacing = spacing;
}

/**
 * Reset text spacing to default
 */
function reset(): void {
  currentValue = 0;
  document.documentElement.style.letterSpacing = "";
  document.documentElement.style.wordSpacing = "";
}

/**
 * Increase text spacing
 */
export function increase(): number {
  apply(currentValue + STEP);
  return currentValue;
}

/**
 * Decrease text spacing
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

export const textSpacingFeature: FeatureModule = {
  name: "textSpacing",
  label: "Text Spacing",
  icon: "↔",
  type: "stepper",
  apply,
  reset,
};

export default textSpacingFeature;