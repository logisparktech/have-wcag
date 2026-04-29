import type { WidgetConfig, WidgetTheme, WidgetFeature } from "../types";
import { DEFAULT_CONFIG } from "../types";
import { features, featureActions, resetAll } from "../features";

function getThemeCSS(theme: WidgetTheme): string {
  const t = { ...DEFAULT_CONFIG.theme, ...theme };
  return `
    --hwcag-primary: ${t.primaryColor};
    --hwcag-bg: ${t.backgroundColor};
    --hwcag-text: ${t.textColor};
    --hwcag-accent: ${t.accentColor};
    --hwcag-radius: ${t.borderRadius};
  `;
}

function getPanelStyles(position: string): string {
  const positionStyles: Record<string, string> = {
    "bottom-right": "bottom: 96px; right: 24px;",
    "bottom-left": "bottom: 96px; left: 24px;",
    "top-right": "top: 96px; right: 24px;",
    "top-left": "top: 96px; left: 24px;",
  };

  return `
    .hwcag-widget-panel {
      position: fixed !important;
      ${position.includes("right") ? "right: 0 !important;" : "left: 0 !important;"}
      top: 0 !important;
      bottom: 0 !important;
      width: 360px !important;
      height: 100vh !important;
      max-height: 100vh !important;
      background: #ffffff !important;
      border-radius: ${position.includes("right") ? "12px 0 0 12px" : "0 12px 12px 0"} !important;
      box-shadow: ${position.includes("right") ? "-8px 0 40px rgba(0,0,0,0.12)" : "8px 0 40px rgba(0,0,0,0.12)"} !important;
      z-index: 999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      color: #1e2329 !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      transform: translateX(${position.includes("right") ? "100%" : "-100%"});
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      pointer-events: auto !important;
      visibility: hidden;
    }
    .hwcag-widget-panel.open {
      transform: translateX(0);
      visibility: visible;
    }
    .hwcag-panel-header {
      background: var(--hwcag-primary);
      color: white;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      border-radius: ${position.includes("right") ? "12px 0 0 0" : "0 12px 0 0"} !important;
    }
    .hwcag-panel-header-icon {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .hwcag-panel-header-icon svg {
      position: absolute;
      width: 60%;
      height: 60%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .hwcag-panel-title-wrap {
      flex: 1;
      min-width: 0;
    }
    .hwcag-panel-title {
      font-weight: 700;
      font-size: 16px;
      margin: 0;
      line-height: 1.25;
      letter-spacing: -0.01em;
    }
    .hwcag-panel-close {
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      width: 34px;
      height: 34px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
      line-height: 1;
    }
    .hwcag-panel-close:hover {
      background: rgba(255,255,255,0.28);
    }
    .hwcag-panel-close:focus {
      outline: 2px solid white;
      outline-offset: 2px;
    }
    .hwcag-panel-content {
      padding: 16px 16px 12px;
      overflow-y: auto;
      flex: 1;
    }
    .hwcag-panel-content::-webkit-scrollbar {
      width: 4px;
    }
    .hwcag-panel-content::-webkit-scrollbar-track {
      background: transparent;
    }
    .hwcag-panel-content::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 2px;
    }
    .hwcag-features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .hwcag-feature-card {
      background: #f8faff;
      border: 1.5px solid #e5e7eb;
      border-radius: 14px;
      padding: 14px 10px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s;
      min-height: 108px;
      text-align: center;
      width: 100%;
      font-family: inherit;
      font-size: inherit;
      color: #1e2329;
    }
    .hwcag-feature-card:hover {
      border-color: var(--hwcag-primary);
      background: #eff6ff;
      box-shadow: 0 2px 8px rgba(26,86,219,0.1);
    }
    .hwcag-feature-card.active {
      background: var(--hwcag-primary);
      border-color: var(--hwcag-primary);
      color: white;
      box-shadow: 0 4px 14px rgba(26,86,219,0.3);
    }
    .hwcag-feature-card:focus {
      outline: 3px solid var(--hwcag-accent);
      outline-offset: 2px;
    }
    .hwcag-feature-card-icon {
      font-size: 26px;
      line-height: 1;
      margin-top: 2px;
    }
    .hwcag-feature-card-label {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.3;
      color: inherit;
      flex: 1;
    }
    /* Dot indicators */
    .hwcag-card-dots {
      display: flex;
      gap: 5px;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
    }
    .hwcag-card-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(30, 35, 41, 0.18);
      transition: background 0.15s, transform 0.15s;
      flex-shrink: 0;
    }
    .hwcag-card-dot.active {
      background: var(--hwcag-primary);
      transform: scale(1.25);
    }
    .hwcag-feature-card.active .hwcag-card-dot {
      background: rgba(255, 255, 255, 0.35);
    }
    .hwcag-feature-card.active .hwcag-card-dot.active {
      background: white;
      transform: scale(1.25);
    }
    /* Mini toggle switch for on/off features */
    .hwcag-card-switch {
      width: 36px;
      height: 18px;
      border-radius: 9px;
      background: rgba(30, 35, 41, 0.18);
      position: relative;
      transition: background 0.2s;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .hwcag-card-switch-knob {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .hwcag-card-switch.on {
      background: var(--hwcag-primary);
    }
    .hwcag-card-switch.on .hwcag-card-switch-knob {
      transform: translateX(18px);
    }
    .hwcag-feature-card.active .hwcag-card-switch {
      background: rgba(255, 255, 255, 0.3);
    }
    .hwcag-feature-card.active .hwcag-card-switch.on {
      background: rgba(255, 255, 255, 0.5);
    }
    .hwcag-feature-card.active .hwcag-card-switch-knob {
      background: white;
    }
    /* Footer */
    .hwcag-panel-footer {
      padding: 14px 16px;
      flex-shrink: 0;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      border-radius: ${position.includes("right") ? "0 0 0 12px" : "0 0 12px 0"} !important;
    }
    .hwcag-reset-btn {
      width: 100%;
      padding: 11px 16px;
      border: 1.5px solid #e5e7eb;
      background: white;
      color: #6b7280;
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .hwcag-reset-btn:hover {
      border-color: #ef4444;
      color: #ef4444;
      background: #fff5f5;
    }
    .hwcag-reset-btn:focus {
      outline: 3px solid var(--hwcag-accent);
      outline-offset: 2px;
    }
  `;
}

const HEADER_ICON_SVG = `<svg viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.10046 8.08314C4.8759 10.6185 4.2846 13.0779 3.36294 15.4685C3.13796 16.0522 3.43701 16.7056 4.03054 16.927C4.62408 17.1483 5.2884 16.8541 5.51348 16.2704C6.1657 14.5781 6.66457 12.8537 6.99948 11.0958C7.33429 12.8538 7.83308 14.578 8.48549 16.2704C8.71047 16.8542 9.37488 17.1484 9.96843 16.927C10.562 16.7057 10.8611 16.0522 10.636 15.4685C9.71502 13.0789 9.12381 10.6212 8.89895 8.08795C10.3587 7.73074 11.7585 7.42709 13.0021 7.03614C13.6831 6.82433 14.0416 6.21736 13.9307 5.65715C13.8198 5.09676 13.2377 4.70548 12.681 4.78807C10.821 5.08391 9.54895 5.87472 6.99948 5.87472C4.45002 5.87472 3.17173 5.08366 1.31283 4.78807C0.756127 4.70601 0.174885 5.09753 0.0642017 5.65715C-0.0465771 6.21795 0.313145 6.82588 0.997425 7.03614C2.2395 7.42962 3.63857 7.73074 5.10046 8.08314Z" fill="white"></path>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.56269 2.1585C8.56269 3.34718 7.62959 4.31063 6.49981 4.31063C5.37023 4.31063 4.43714 3.34718 4.43714 2.1585C4.43714 0.969813 5.37023 0.00637294 6.49981 0.00637294C7.62959 0.00637294 8.56269 0.969813 8.56269 2.1585Z" fill="white"></path>
</svg>`;

const RESET_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;

// UI levels for stepper features: [step size, total dot count including level 0]
const STEPPER_UI: Record<string, { step: number; numLevels: number }> = {
  textSize: { step: 10, numLevels: 5 },   // 0 → 10 → 20 → 30 → 40
  lineHeight: { step: 0.25, numLevels: 5 }, // 0 → 0.25 → 0.5 → 0.75 → 1.0
  textSpacing: { step: 2, numLevels: 6 }, // -10 → -8 → -6 → -4 → -2 → 0 → 2 → 4 → 6 → 8 → 10
};

function createDots(
  count: number,
  activeIndex: number,
): { el: HTMLElement; update: (i: number) => void } {
  const container = document.createElement("div");
  container.className = "hwcag-card-dots";
  container.setAttribute("aria-hidden", "true");

  const dotEls: HTMLElement[] = [];
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = `hwcag-card-dot${i === activeIndex ? " active" : ""}`;
    dotEls.push(dot);
    container.appendChild(dot);
  }

  return {
    el: container,
    update(i: number) {
      dotEls.forEach((d, idx) => d.classList.toggle("active", idx === i));
    },
  };
}

function createToggleSwitch(
  initialValue: boolean,
): { el: HTMLElement; update: (on: boolean) => void } {
  const container = document.createElement("div");
  container.className = `hwcag-card-switch${initialValue ? " on" : ""}`;
  container.setAttribute("aria-hidden", "true");

  const knob = document.createElement("div");
  knob.className = "hwcag-card-switch-knob";
  container.appendChild(knob);

  return {
    el: container,
    update(on: boolean) {
      container.classList.toggle("on", on);
    },
  };
}

function createToggleCard(
  icon: string,
  labelText: string,
  initialValue: boolean,
  onChange: () => void,
): HTMLElement {
  const card = document.createElement("button");
  card.className = `hwcag-feature-card${initialValue ? " active" : ""}`;
  card.setAttribute("role", "switch");
  card.setAttribute("aria-checked", String(initialValue));
  card.setAttribute("aria-label", `${labelText}: ${initialValue ? "On" : "Off"}`);

  const iconEl = document.createElement("span");
  iconEl.className = "hwcag-feature-card-icon";
  if (icon.trim().startsWith("<svg")) {
    iconEl.innerHTML = icon;
  } else {
    iconEl.textContent = icon;
  }
  iconEl.setAttribute("aria-hidden", "true");

  const labelEl = document.createElement("span");
  labelEl.className = "hwcag-feature-card-label";
  labelEl.textContent = labelText;

  const toggle = createToggleSwitch(initialValue);

  card.appendChild(iconEl);
  card.appendChild(labelEl);
  card.appendChild(toggle.el);

  card.addEventListener("click", () => {
    onChange();
    const isActive = card.classList.toggle("active");
    card.setAttribute("aria-checked", String(isActive));
    card.setAttribute("aria-label", `${labelText}: ${isActive ? "On" : "Off"}`);
    toggle.update(isActive);
  });

  return card;
}

function createStepperCard(
  icon: string,
  labelText: string,
  getValue: () => number,
  onIncrease: () => number,
  onReset: () => void,
  step: number,
  numLevels: number,
): HTMLElement {
  const getLevelIndex = () =>
    Math.min(Math.max(0, Math.round(getValue() / step)), numLevels - 1);

  let currentLevel = getLevelIndex();

  const card = document.createElement("button");
  card.className = `hwcag-feature-card${currentLevel > 0 ? " active" : ""}`;
  card.setAttribute("aria-label", `${labelText}: level ${currentLevel} of ${numLevels - 1}`);

  const iconEl = document.createElement("span");
  iconEl.className = "hwcag-feature-card-icon";
  if (icon.trim().startsWith("<svg")) {
    iconEl.innerHTML = icon;
  } else {
    iconEl.textContent = icon;
  }
  iconEl.setAttribute("aria-hidden", "true");

  const labelEl = document.createElement("span");
  labelEl.className = "hwcag-feature-card-label";
  labelEl.textContent = labelText;

  const dots = createDots(numLevels, currentLevel);

  card.appendChild(iconEl);
  card.appendChild(labelEl);
  card.appendChild(dots.el);

  card.addEventListener("click", () => {
    if (currentLevel >= numLevels - 1) {
      onReset();
      currentLevel = 0;
    } else {
      onIncrease();
      currentLevel++;
    }
    card.classList.toggle("active", currentLevel > 0);
    card.setAttribute(
      "aria-label",
      `${labelText}: level ${currentLevel} of ${numLevels - 1}`,
    );
    dots.update(currentLevel);
  });

  return card;
}

function createSelectCard(
  icon: string,
  labelText: string,
  options: string[],
  getValue: () => string,
  onCycle: () => string,
  optionLabels?: Record<string, string>,
  optionIcons?: Record<string, string>,
): HTMLElement {
  const getIndex = () => {
    const idx = options.indexOf(getValue());
    return idx >= 0 ? idx : 0;
  };

  let currentIndex = getIndex();

  const card = document.createElement("button");
  card.className = `hwcag-feature-card${currentIndex > 0 ? " active" : ""}`;
  
  const currentOption = options[currentIndex];
  const displayLabel = optionLabels ? optionLabels[currentOption] : labelText;
  const displayIcon = optionIcons ? optionIcons[currentOption] : icon;

  card.setAttribute("aria-label", `${labelText}: ${options[currentIndex]}`);

  const iconEl = document.createElement("span");
  iconEl.className = "hwcag-feature-card-icon";
  if (displayIcon.trim().startsWith("<svg")) {
    iconEl.innerHTML = displayIcon;
  } else {
    iconEl.textContent = displayIcon;
  }
  iconEl.setAttribute("aria-hidden", "true");

  const labelEl = document.createElement("span");
  labelEl.className = "hwcag-feature-card-label";
  labelEl.textContent = displayLabel;

  const dots = createDots(options.length, currentIndex);

  card.appendChild(iconEl);
  card.appendChild(labelEl);
  card.appendChild(dots.el);

  card.addEventListener("click", () => {
    onCycle();
    currentIndex = getIndex();
    const newOption = options[currentIndex];
    
    card.classList.toggle("active", currentIndex > 0);
    card.setAttribute("aria-label", `${labelText}: ${newOption}`);
    
    // Update dynamic content
    if (optionLabels) {
      labelEl.textContent = optionLabels[newOption];
    }
    if (optionIcons) {
      const newIcon = optionIcons[newOption];
      if (newIcon.trim().startsWith("<svg")) {
        iconEl.innerHTML = newIcon;
      } else {
        iconEl.textContent = newIcon;
      }
    }
    
    dots.update(currentIndex);
  });

  return card;
}

function createActionCard(
  icon: string,
  labelText: string,
  onClick: () => void,
): HTMLElement {
  const card = document.createElement("button");
  card.className = "hwcag-feature-card";
  card.setAttribute("aria-label", labelText);

  const iconEl = document.createElement("span");
  iconEl.className = "hwcag-feature-card-icon";
  if (icon.trim().startsWith("<svg")) {
    iconEl.innerHTML = icon;
  } else {
    iconEl.textContent = icon;
  }
  iconEl.setAttribute("aria-hidden", "true");

  const labelEl = document.createElement("span");
  labelEl.className = "hwcag-feature-card-label";
  labelEl.textContent = labelText;

  card.appendChild(iconEl);
  card.appendChild(labelEl);

  card.addEventListener("click", onClick);

  return card;
}

function createFeatureCard(featureName: WidgetFeature): HTMLElement {
  const feature = features[featureName];
  const actions = featureActions[featureName];

  // Page Structure opens a modal — use an action card (not a toggle)
  if (featureName === "pageStructure") {
    return createActionCard(
      feature.icon,
      feature.label,
      (actions as any).toggle,
    );
  }

  switch (feature.type) {
    case "toggle":
      return createToggleCard(
        feature.icon,
        feature.label,
        (actions as any).getValue(),
        (actions as any).toggle,
      );
    case "stepper": {
      const ui = STEPPER_UI[featureName] ?? { step: 1, numLevels: 5 };
      return createStepperCard(
        feature.icon,
        feature.label,
        (actions as any).getValue,
        (actions as any).increase,
        (actions as any).reset,
        ui.step,
        ui.numLevels,
      );
    }
    case "select": {
      const opts: string[] = (feature as any).options ?? [];
      return createSelectCard(
        feature.icon,
        feature.label,
        opts,
        (actions as any).getValue,
        (actions as any).cycle,
        feature.optionLabels,
        feature.optionIcons,
      );
    }
    default:
      return document.createElement("div");
  }
}

export function createPanel(config: WidgetConfig): HTMLElement {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const theme = { ...DEFAULT_CONFIG.theme, ...config.theme };

  const styleId = "hwcag-widget-panel-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = getPanelStyles(settings.position);
    document.head.appendChild(style);
  }

  const panel = document.createElement("div");
  panel.className = "hwcag-widget hwcag-widget-panel";
  panel.style.cssText = getThemeCSS(theme);
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "hwcag-panel-title");

  // Header
  const header = document.createElement("div");
  header.className = "hwcag-panel-header";

  const headerIconWrap = document.createElement("div");
  headerIconWrap.className = "hwcag-panel-header-icon";
  headerIconWrap.innerHTML = HEADER_ICON_SVG;

  const titleWrap = document.createElement("div");
  titleWrap.className = "hwcag-panel-title-wrap";

  const title = document.createElement("h2");
  title.className = "hwcag-panel-title";
  title.id = "hwcag-panel-title";
  title.textContent = settings.panelTitle;

  titleWrap.appendChild(title);

  const closeBtn = document.createElement("button");
  closeBtn.className = "hwcag-panel-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Close accessibility menu");

  header.appendChild(headerIconWrap);
  header.appendChild(titleWrap);
  header.appendChild(closeBtn);

  // Content
  const content = document.createElement("div");
  content.className = "hwcag-panel-content";

  const grid = document.createElement("div");
  grid.className = "hwcag-features-grid";

  settings.features.forEach((featureName) => {
    grid.appendChild(createFeatureCard(featureName));
  });

  content.appendChild(grid);

  // Footer
  const footer = document.createElement("div");
  footer.className = "hwcag-panel-footer";

  const resetBtn = document.createElement("button");
  resetBtn.className = "hwcag-reset-btn";
  resetBtn.innerHTML = `${RESET_ICON} Reset Settings`;
  resetBtn.addEventListener("click", () => {
    resetAll();
    document.dispatchEvent(new CustomEvent("hwcag:reset"));
  });

  footer.appendChild(resetBtn);

  panel.appendChild(header);
  panel.appendChild(content);
  panel.appendChild(footer);

  return panel;
}
