import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-saturation-styles";

const SATURATION_CSS = `
  /* Apply saturation to all page content, but exclude the widget and its overlays */
  html.hwcag-saturation body > *:not(.hwcag-widget):not(.hwcag-ps-overlay):not(.hwcag-sr-controls):not(.hwcag-sr-hint):not(.hwcag-toolbar) {
    filter: saturate(200%) !important;
  }
`;

let isEnabled = false;

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = SATURATION_CSS;
  document.head.appendChild(style);
}

function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-saturation");
  } else {
    document.documentElement.classList.remove("hwcag-saturation");
  }
}

function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-saturation");
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
