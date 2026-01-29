import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-dyslexia-font-styles";

// Using OpenDyslexic font from CDN
const DYSLEXIA_CSS = `
  @font-face {
    font-family: 'OpenDyslexic';
    src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'OpenDyslexic';
    src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Bold.woff') format('woff');
    font-weight: bold;
    font-style: normal;
  }
  html.hwcag-dyslexia-font,
  html.hwcag-dyslexia-font * {
    font-family: 'OpenDyslexic', sans-serif !important;
  }
  /* Preserve widget font */
  html.hwcag-dyslexia-font .hwcag-widget,
  html.hwcag-dyslexia-font .hwcag-widget * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
`;

let isEnabled = false;

/**
 * Inject dyslexia font styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = DYSLEXIA_CSS;
  document.head.appendChild(style);
}

/**
 * Apply dyslexia font
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-dyslexia-font");
  } else {
    document.documentElement.classList.remove("hwcag-dyslexia-font");
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  document.documentElement.classList.remove("hwcag-dyslexia-font");
}

/**
 * Toggle dyslexia font
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

export const dyslexiaFontFeature: FeatureModule = {
  name: "dyslexiaFont",
  label: "Dyslexia Font",
  icon: "Dy",
  type: "toggle",
  apply,
  reset,
};

export default dyslexiaFontFeature;
