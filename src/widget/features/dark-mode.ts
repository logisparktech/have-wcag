import type { FeatureModule } from "../types";
import { setFilter, clearFilter } from "./filter-manager";

const FILTER_KEY = "darkMode";
const STYLE_ID = "hwcag-dark-mode-styles";

// Only the background + image double-invert; main element filter handled by filter-manager
const DARK_MODE_CSS = `
  html.hwcag-dark-mode {
    background-color: #121212 !important;
  }
  /* Double invert images/media so they keep their original colours */
  html.hwcag-dark-mode body > *:not(.hwcag-widget) img,
  html.hwcag-dark-mode body > *:not(.hwcag-widget) video,
  html.hwcag-dark-mode body > *:not(.hwcag-widget) iframe,
  html.hwcag-dark-mode body > *:not(.hwcag-widget) canvas,
  html.hwcag-dark-mode body > *:not(.hwcag-widget) picture,
  html.hwcag-dark-mode body > *:not(.hwcag-widget) .hwcag-bg-img {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

let isEnabled = false;

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = DARK_MODE_CSS;
  document.head.appendChild(style);
}

// CSS can't select "has a background-image", so tag matching elements via JS.
function tagIfBackgroundImage(el: HTMLElement): void {
  if (getComputedStyle(el).backgroundImage !== "none") {
    el.classList.add("hwcag-bg-img");
  }
}

function tagBackgroundImageElements(root: ParentNode = document.body): void {
  root.querySelectorAll<HTMLElement>("*:not(.hwcag-widget)").forEach(tagIfBackgroundImage);
}

// Watches for SPA route changes / dynamically injected content so newly
// mounted elements also get tagged, since the initial scan only covers what's on screen at toggle time.
let contentObserver: MutationObserver | null = null;

function watchForNewContent(): void {
  if (contentObserver) return;
  contentObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          tagIfBackgroundImage(node);
          tagBackgroundImageElements(node);
        }
      });
    }
  });
  contentObserver.observe(document.body, { childList: true, subtree: true });
}

function stopWatchingForNewContent(): void {
  contentObserver?.disconnect();
  contentObserver = null;
}

function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    document.documentElement.classList.add("hwcag-dark-mode");
    tagBackgroundImageElements();
    watchForNewContent();
    setFilter(FILTER_KEY, "invert(1) hue-rotate(180deg) brightness(0.95)");
  } else {
    document.documentElement.classList.remove("hwcag-dark-mode");
    stopWatchingForNewContent();
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

export const darkModeFeature: FeatureModule = {
  name: "darkMode",
  label: "Dark Mode",
  icon: "☾",
  type: "toggle",
  apply,
  reset,
};

export default darkModeFeature;
