import type { FeatureModule } from "../types";
import { setFilter, clearFilter } from "./filter-manager";

const FILTER_KEY = "saturation";

let isEnabled = false;

function apply(enabled: boolean): void {
  isEnabled = enabled;
  if (enabled) {
    document.documentElement.classList.add("hwcag-saturation");
    setFilter(FILTER_KEY, "saturate(200%)");
  } else {
    document.documentElement.classList.remove("hwcag-saturation");
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

const SATURATION_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;

export const saturationFeature: FeatureModule = {
  name: "saturation",
  label: "High Saturation",
  icon: SATURATION_ICON,
  type: "toggle",
  apply,
  reset,
};

export default saturationFeature;
