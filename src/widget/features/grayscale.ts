import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-grayscale-styles";

const GRAYSCALE_CSS = `
  /* Apply grayscale to all page content, but exclude the widget and its overlays */
  html.hwcag-grayscale body > *:not(.hwcag-widget):not(.hwcag-ps-overlay):not(.hwcag-sr-controls):not(.hwcag-sr-hint):not(.hwcag-toolbar) {
    filter: grayscale(100%) !important;
  }
`;

let isEnabled = false;

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = GRAYSCALE_CSS;
  document.head.appendChild(style);
}

function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-grayscale");
  } else {
    document.documentElement.classList.remove("hwcag-grayscale");
  }
}

function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-grayscale");
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
