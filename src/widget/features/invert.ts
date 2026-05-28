import type { FeatureModule } from "../types";
import { setFilter, clearFilter } from "./filter-manager";

const FILTER_KEY = "invert";

let isEnabled = false;

function apply(enabled: boolean): void {
  isEnabled = enabled;
  if (enabled) {
    document.documentElement.classList.add("hwcag-invert");
    setFilter(FILTER_KEY, "invert(100%)");
  } else {
    document.documentElement.classList.remove("hwcag-invert");
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

export const invertFeature: FeatureModule = {
  name: "invert",
  label: "Invert Colors",
  icon: "◐",
  type: "toggle",
  apply,
  reset,
};

export default invertFeature;
