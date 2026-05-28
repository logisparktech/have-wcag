import type { FeatureModule } from "../types";
import { setFilter, clearFilter } from "./filter-manager";

const FILTER_KEY = "grayscale";

let isEnabled = false;

function apply(enabled: boolean): void {
  isEnabled = enabled;
  if (enabled) {
    document.documentElement.classList.add("hwcag-grayscale");
    setFilter(FILTER_KEY, "grayscale(100%)");
  } else {
    document.documentElement.classList.remove("hwcag-grayscale");
    clearFilter(FILTER_KEY);
  }
}

function reset(): void {
  apply(false);
}

export function toggle(): boolean {
  apply(!isEnabled);
  return isEnabled;
}

export function getValue(): boolean {
  return isEnabled;
}

export const grayscaleFeature: FeatureModule = {
  name: "grayscale",
  label: "Grayscale",
  icon: "◑",
  type: "toggle",
  apply,
  reset,
};

export default grayscaleFeature;
