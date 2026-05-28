import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-contrast-styles";

const CONTRAST_CSS = `
  /* ── Dark contrast ── */
  html.hwcag-high-contrast,
  html.hwcag-high-contrast body {
    background-color: #000000 !important;
    color: #50d0a0 !important;
  }

  html.hwcag-high-contrast *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) {
    background-color: transparent !important;
    color: #50d0a0 !important;
    border-color: #50d0a0 !important;
    text-shadow: none !important;
    box-shadow: none !important;
  }

  html.hwcag-high-contrast a:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) {
    color: #fcff3c !important;
    text-decoration: underline !important;
    font-weight: bold !important;
  }

  html.hwcag-high-contrast a:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) * {
    color: #fcff3c !important;
  }

  html.hwcag-high-contrast a:hover:not(.hwcag-widget):not(.hwcag-widget *) {
    color: #00ffff !important;
    outline: 2px solid #00ffff !important;
  }

  html.hwcag-high-contrast input:not(.hwcag-widget):not(.hwcag-widget *),
  html.hwcag-high-contrast textarea:not(.hwcag-widget):not(.hwcag-widget *),
  html.hwcag-high-contrast select:not(.hwcag-widget):not(.hwcag-widget *) {
    background-color: #000000 !important;
    color: #50d0a0 !important;
    border: 3px solid #50d0a0 !important;
  }

  html.hwcag-high-contrast button:not(.hwcag-widget):not(.hwcag-widget *) {
    background-color: #50d0a0 !important;
    color: #000000 !important;
    border: 3px solid #50d0a0 !important;
    font-weight: bold !important;
  }

  html.hwcag-high-contrast button:hover:not(.hwcag-widget):not(.hwcag-widget *) {
    background-color: #fcff3c !important;
    color: #000000 !important;
  }

  html.hwcag-high-contrast *:focus:not(.hwcag-widget):not(.hwcag-widget *) {
    outline: 4px solid #fcff3c !important;
    outline-offset: 2px !important;
  }

  html.hwcag-high-contrast dialog:not(.hwcag-widget *),
  html.hwcag-high-contrast [role="dialog"]:not(.hwcag-widget *),
  html.hwcag-high-contrast [role="alertdialog"]:not(.hwcag-widget *),
  html.hwcag-high-contrast [aria-modal="true"]:not(.hwcag-widget *) {
    outline: 3px solid #50d0a0 !important;
    outline-offset: 0px !important;
    box-shadow: none !important;
  }

  html.hwcag-high-contrast img:not(.hwcag-widget):not(.hwcag-widget *) {
    filter: contrast(1.5) grayscale(1) !important;
    border: 2px solid #50d0a0 !important;
  }

  /* ── Light contrast ── */
  html.hwcag-light-contrast,
  html.hwcag-light-contrast body {
    background-color: #ffffff !important;
    color: #000000 !important;
  }

  html.hwcag-light-contrast *:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) {
    background-color: transparent !important;
    color: #000000 !important;
    border-color: #000000 !important;
    text-shadow: none !important;
    box-shadow: none !important;
  }

  html.hwcag-light-contrast a:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) {
    color: #0000cc !important;
    text-decoration: underline !important;
    font-weight: bold !important;
  }

  html.hwcag-light-contrast a:not(.hwcag-widget):not(.hwcag-widget *):not(.hwcag-widget-panel):not(.hwcag-widget-panel *):not(.hwcag-widget-button):not(.hwcag-toolbar):not(.hwcag-toolbar *):not(.hwcag-panel):not(.hwcag-panel *):not(#hwcag-reading-guide) * {
    color: #0000cc !important;
  }

  html.hwcag-light-contrast a:hover:not(.hwcag-widget):not(.hwcag-widget *) {
    color: #cc0000 !important;
    outline: 2px solid #cc0000 !important;
  }

  html.hwcag-light-contrast input:not(.hwcag-widget):not(.hwcag-widget *),
  html.hwcag-light-contrast textarea:not(.hwcag-widget):not(.hwcag-widget *),
  html.hwcag-light-contrast select:not(.hwcag-widget):not(.hwcag-widget *) {
    background-color: #ffffff !important;
    color: #000000 !important;
    border: 3px solid #000000 !important;
  }

  html.hwcag-light-contrast button:not(.hwcag-widget):not(.hwcag-widget *) {
    background-color: #000000 !important;
    color: #ffffff !important;
    border: 3px solid #000000 !important;
    font-weight: bold !important;
  }

  html.hwcag-light-contrast button:hover:not(.hwcag-widget):not(.hwcag-widget *) {
    background-color: #0000cc !important;
    color: #ffffff !important;
  }

  html.hwcag-light-contrast *:focus:not(.hwcag-widget):not(.hwcag-widget *) {
    outline: 4px solid #0000cc !important;
    outline-offset: 2px !important;
  }

  html.hwcag-light-contrast dialog:not(.hwcag-widget *),
  html.hwcag-light-contrast [role="dialog"]:not(.hwcag-widget *),
  html.hwcag-light-contrast [role="alertdialog"]:not(.hwcag-widget *),
  html.hwcag-light-contrast [aria-modal="true"]:not(.hwcag-widget *) {
    outline: 3px solid #000000 !important;
    outline-offset: 0px !important;
    box-shadow: none !important;
  }

  html.hwcag-light-contrast img:not(.hwcag-widget):not(.hwcag-widget *) {
    filter: contrast(1.5) grayscale(1) !important;
    border: 2px solid #000000 !important;
  }
`;

const OPTIONS = ["off", "dark", "light"] as const;
type ContrastValue = typeof OPTIONS[number];

let currentValue: ContrastValue = "off";

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CONTRAST_CSS;
  document.head.appendChild(style);
}

function apply(value: ContrastValue): void {
  currentValue = OPTIONS.includes(value as ContrastValue) ? value : "off";
  injectStyles();
  document.documentElement.classList.remove("hwcag-high-contrast", "hwcag-light-contrast");
  if (currentValue === "dark") document.documentElement.classList.add("hwcag-high-contrast");
  if (currentValue === "light") document.documentElement.classList.add("hwcag-light-contrast");
}

function reset(): void {
  apply("off");
}

export function cycle(): ContrastValue {
  const next = OPTIONS[(OPTIONS.indexOf(currentValue) + 1) % OPTIONS.length];
  apply(next);
  return currentValue;
}

export function getValue(): ContrastValue {
  return currentValue;
}

export const contrastFeature: FeatureModule = {
  name: "contrast",
  label: "Contrast",
  icon: "◉",
  type: "select",
  options: [...OPTIONS],
  optionLabels: {
    off: "Contrast (Normal)",
    dark: "Dark Contrast",
    light: "Light Contrast",
  },
  optionIcons: {
    off: "◉",
    dark: "◑",
    light: "◐",
  },
  apply,
  reset,
};

export default contrastFeature;
