import type { FeatureModule } from "../types";

const STEP = 10; // percentage step
const MIN = -30; // minimum (70%)
const MAX = 50; // maximum (150%)

let currentValue = 0;

/**
 * Apply text size change to the document
 */
function apply(value: number): void {
  currentValue = Math.max(MIN, Math.min(MAX, value));
  const percentage = 100 + currentValue;
  document.documentElement.style.setProperty(
    "--hwcag-text-size",
    `${percentage}%`,
  );
  document.documentElement.style.fontSize = `${percentage}%`;
}

/**
 * Reset text size to default
 */
function reset(): void {
  currentValue = 0;
  document.documentElement.style.removeProperty("--hwcag-text-size");
  document.documentElement.style.fontSize = "";
}

/**
 * Increase text size
 */
export function increase(): number {
  apply(currentValue + STEP);
  return currentValue;
}

/**
 * Decrease text size
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

export const textSizeFeature: FeatureModule = {
  name: "textSize",
  label: "Text Size",
  icon: "Aa",
  type: "stepper",
  apply,
  reset,
};

export default textSizeFeature;
