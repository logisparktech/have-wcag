import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-dyslexia-font-styles";

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

  /* Apply OpenDyslexic to all elements */
  html.hwcag-dyslexia-font * {
    font-family: 'OpenDyslexic', sans-serif !important;
  }

  /*
   * Restore icon-font elements — revert removes our !important so the
   * component's own font-family rule (Material Icons, MDI, FA, etc.) applies.
   */
  html.hwcag-dyslexia-font .material-icons,
  html.hwcag-dyslexia-font .material-icons-outlined,
  html.hwcag-dyslexia-font .material-icons-round,
  html.hwcag-dyslexia-font .material-icons-sharp,
  html.hwcag-dyslexia-font .material-icons-two-tone,
  html.hwcag-dyslexia-font .material-symbols-outlined,
  html.hwcag-dyslexia-font .material-symbols-rounded,
  html.hwcag-dyslexia-font .material-symbols-sharp,
  html.hwcag-dyslexia-font .mdi,
  html.hwcag-dyslexia-font [class^="mdi-"],
  html.hwcag-dyslexia-font [class*=" mdi-"],
  html.hwcag-dyslexia-font .v-icon,
  html.hwcag-dyslexia-font .q-icon,
  html.hwcag-dyslexia-font .fa,
  html.hwcag-dyslexia-font .fas,
  html.hwcag-dyslexia-font .far,
  html.hwcag-dyslexia-font .fal,
  html.hwcag-dyslexia-font .fab,
  html.hwcag-dyslexia-font .fad,
  html.hwcag-dyslexia-font .fa-solid,
  html.hwcag-dyslexia-font .fa-regular,
  html.hwcag-dyslexia-font .fa-light,
  html.hwcag-dyslexia-font .fa-thin,
  html.hwcag-dyslexia-font .fa-brands,
  html.hwcag-dyslexia-font .bi,
  html.hwcag-dyslexia-font ion-icon {
    font-family: revert !important;
  }

  /* Children of icon containers inherit the reverted (icon) font */
  html.hwcag-dyslexia-font .material-icons *,
  html.hwcag-dyslexia-font .material-icons-outlined *,
  html.hwcag-dyslexia-font .material-symbols-outlined *,
  html.hwcag-dyslexia-font .mdi *,
  html.hwcag-dyslexia-font [class^="mdi-"] *,
  html.hwcag-dyslexia-font .v-icon *,
  html.hwcag-dyslexia-font .q-icon *,
  html.hwcag-dyslexia-font .fa *,
  html.hwcag-dyslexia-font .fas *,
  html.hwcag-dyslexia-font .far *,
  html.hwcag-dyslexia-font .fab * {
    font-family: inherit !important;
  }

  /* Preserve the accessibility widget's own font */
  html.hwcag-dyslexia-font .hwcag-widget,
  html.hwcag-dyslexia-font .hwcag-widget * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
`;

let isEnabled = false;

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = DYSLEXIA_CSS;
  document.head.appendChild(style);
}

function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-dyslexia-font");
  } else {
    document.documentElement.classList.remove("hwcag-dyslexia-font");
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

export const dyslexiaFontFeature: FeatureModule = {
  name: "dyslexiaFont",
  label: "Dyslexia Font",
  icon: "Ɐ",
  type: "toggle",
  apply,
  reset,
};

export default dyslexiaFontFeature;
