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

const LOGISPARK_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1528 1858" class="hwcag-panel-branding-logo">
  <defs>
    <linearGradient id="topGrad" x1="1" y1="0" x2="1527" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#202082"/>
      <stop offset="40%"  stop-color="#265CC5"/>
      <stop offset="100%" stop-color="#2A85F2"/>
    </linearGradient>
    <linearGradient id="lsGrad" x1="-623" y1="0" x2="905" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#202082"/>
      <stop offset="20%" stop-color="#202082"/>
      <stop offset="50%" stop-color="#265CC5"/>
      <stop offset="80%" stop-color="#2A85F2"/>
      <stop offset="100%" stop-color="#2A85F2"/>
    </linearGradient>
  </defs>

  <path d="M0 0 C503.58 0 1007.16 0 1526 0 C1526 86.46 1526 172.92 1526 262 C1022.42 262 518.84 262 0 262 C0 175.54 0 89.08 0 0 Z" fill="url(#topGrad)" transform="translate(1,0)"/>

  <path d="M0 0 C298.65 0 597.3 0 905 0 C905 79.86 905 159.72 905 242 C705.68 242 506.36 242 301 242 C301 308.99 301 375.98 301 445 C500.32 445 699.64 445 905 445 C905 672.04 905 899.08 905 1133 C557.82984172 1134.16892309 557.82984172 1134.16892309 390.85857694 1134.11455117 C383.2444672 1134.11217789 375.63035717 1134.11093313 368.01624721 1134.10950619 C364.79765135 1134.10889303 361.57905549 1134.10827381 358.36045964 1134.10765224 C357.55745714 1134.10749789 356.75445465 1134.10734355 355.92711875 1134.10718453 C350.27783803 1134.10608653 344.62855735 1134.10485334 338.97927668 1134.10355959 C315.78132055 1134.0982935 292.58336508 1134.0957984 269.3854084 1134.09487724 C268.54278344 1134.09484283 267.70015848 1134.09480842 266.83199944 1134.09477296 C259.12779547 1134.09445945 251.4235915 1134.0941718 243.71938753 1134.09391499 C224.62904165 1134.09327833 205.5386958 1134.09232073 186.44834995 1134.09113979 C185.14916893 1134.09105982 185.14916893 1134.09105982 183.82374182 1134.09097823 C142.43400782 1134.08840239 101.04427452 1134.08211533 59.65454102 1134.07543945 C45.42362468 1134.07314625 31.19270834 1134.07087019 16.96179199 1134.06866455 C16.07829649 1134.0685276 15.19480098 1134.06839065 14.28453289 1134.06824955 C-27.35444824 1134.06181882 -68.99342949 1134.05816344 -110.63241099 1134.05513173 C-113.380939 1134.05493119 -116.12946701 1134.05472888 -118.87799502 1134.05452599 C-147.54844371 1134.05241042 -176.2188924 1134.05042399 -204.8893411 1134.04849322 C-205.70909338 1134.04843801 -206.52884565 1134.04838279 -207.3734389 1134.04832591 C-208.86507981 1134.04822552 -210.35672073 1134.04812527 -211.84836164 1134.04802525 C-348.89890907 1134.03880832 -485.94945292 1134.01861453 -623 1134 C-623 760.11 -623 386.22 -623 1 C-521.03 1 -419.06 1 -314 1 C-314 293.38 -314 585.76 -314 887 C-10.4 887 293.2 887 606 887 C606 821.33 606 755.66 606 688 C406.02 688 206.04 688 0 688 C0 607.81 0 527.62 0 445 C0.66 445 1.32 445 2 445 C2 378.01 2 311.02 2 242 C1.34 242 0.68 242 0 242 C0 162.14 0 82.28 0 0 Z" fill="url(#lsGrad)" transform="translate(623,358)"/>

  <path d="M0 0 C107.58 0 215.16 0 326 0 C326 86.46 326 172.92 326 262 C218.42 262 110.84 262 0 262 C0 175.54 0 89.08 0 0 Z" fill="#202082" transform="translate(452,1596)"/>
  <path d="M0 0 C107.58 0 215.16 0 326 0 C326 86.46 326 172.92 326 262 C218.42 262 110.84 262 0 262 C0 175.54 0 89.08 0 0 Z" fill="#2A85F2" transform="translate(779,1596)"/>
</svg>`

export function getPanelStyles(position: string): string {
  const isRight = position.includes("right");

  return `
    .hwcag-widget-panel {
      position: fixed !important;
      ${isRight ? "right: 0 !important;" : "left: 0 !important;"}
      top: 0 !important;
      bottom: 0 !important;
      width: 360px !important;
      height: 100vh !important;
      max-height: 100vh !important;
      background: #eff1f5 !important;
      border-radius: ${isRight ? "12px 0 0 12px" : "0 12px 12px 0"} !important;
      box-shadow: ${isRight ? "-8px 0 32px rgba(0,0,0,0.10)" : "8px 0 32px rgba(0,0,0,0.10)"} !important;
      z-index: 999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      color: #1e2329 !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      transform: translateX(${isRight ? "100%" : "-100%"});
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
      padding: 14px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      border-radius: ${isRight ? "12px 0 0 0" : "0 12px 0 0"} !important;
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
      font-weight: 700 !important;
      font-size: 13px !important;
      margin: 0 !important;
      line-height: 1.25 !important;
      letter-spacing: -0.01em !important;
      color: white !important;
    }
    .hwcag-panel-move,
    .hwcag-panel-close {
      background: rgba(255,255,255,0.15);
      border: none;
      color: white !important;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
      line-height: 1;
      padding: 0;
    }
    .hwcag-panel-close {
      font-size: 20px;
    }
    .hwcag-panel-move svg,
    .hwcag-panel-close svg {
      pointer-events: none;
    }
    .hwcag-panel-move:hover,
    .hwcag-panel-close:hover {
      background: rgba(255,255,255,0.28);
    }
    .hwcag-panel-move:focus,
    .hwcag-panel-close:focus {
      outline: 2px solid white;
      outline-offset: 2px;
    }
    .hwcag-panel-content {
      padding: 12px !important;
      overflow-y: auto !important;
      overscroll-behavior: contain !important;
      flex: 1 !important;
      background: #eff1f5 !important;
    }
    .hwcag-panel-content::-webkit-scrollbar {
      width: 4px;
    }
    .hwcag-panel-content::-webkit-scrollbar-track {
      background: transparent;
    }
    .hwcag-panel-content::-webkit-scrollbar-thumb {
      background: #c8cdd8;
      border-radius: 2px;
    }
    .hwcag-features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .hwcag-feature-card {
      background: #ffffff !important;
      border: 1.5px solid transparent !important;
      border-radius: 14px !important;
      padding: 14px 10px 12px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 6px !important;
      cursor: pointer !important;
      transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease !important;
      min-height: 108px !important;
      text-align: center !important;
      width: 100% !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      color: #1e2329 !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
    }
    .hwcag-feature-card:hover {
      border-color: var(--hwcag-primary) !important;
      background: #ffffff !important;
      box-shadow: 0 2px 8px rgba(26,86,219,0.10) !important;
    }
    .hwcag-feature-card.active {
      background: var(--hwcag-primary) !important;
      border-color: var(--hwcag-primary) !important;
      color: #ffffff !important;
      box-shadow: 0 3px 12px rgba(26,86,219,0.28) !important;
    }
    .hwcag-feature-card:focus {
      outline: 3px solid var(--hwcag-accent) !important;
      outline-offset: 2px !important;
    }
    .hwcag-feature-card-icon {
      font-size: 26px !important;
      line-height: 1 !important;
      margin-top: 2px !important;
      color: inherit !important;
    }
    .hwcag-feature-card-label {
      font-size: 12px !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      color: inherit !important;
      flex: 1 !important;
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
      padding: 12px;
      flex-shrink: 0;
      background: #e3e6ed;
      border-top: 1px solid #d4d8e2;
      border-radius: ${isRight ? "0 0 0 12px" : "0 0 12px 0"} !important;
    }
    .hwcag-reset-btn {
      width: 100% !important;
      padding: 11px 16px !important;
      border: 1.5px solid #d0d4de !important;
      background: #ffffff !important;
      color: #6b7280 !important;
      border-radius: 10px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      transition: border-color 0.15s, color 0.15s, background 0.15s !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
    }
    .hwcag-reset-btn:hover {
      border-color: #ef4444 !important;
      color: #ef4444 !important;
      background: #fff5f5 !important;
    }
    .hwcag-reset-btn:focus {
      outline: 3px solid var(--hwcag-accent) !important;
      outline-offset: 2px !important;
    }
    .hwcag-panel-branding {
      margin-top: 5px !important;
      margin-bottom: 0 !important;
      text-align: center !important;
      font-size: 11px !important;
      font-weight: 500 !important;
      color: #8e96aa !important;
      letter-spacing: 0.01em !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    .hwcag-panel-branding a {
      color: #8e96aa !important;
      text-decoration: none !important;
      display: inline-flex !important;
      align-items: center !important;
      color: var(--hwcag-primary) !important;
      gap: 5px !important;
    }
    .hwcag-panel-branding a:hover {
      text-decoration: underline !important;
    }
    .hwcag-panel-branding-logo {
      height: 15px !important;
      width: auto !important;
      vertical-align: middle !important;
      display: inline-block !important;
      flex-shrink: 0 !important;
    }
    /* Snackbar */
    .hwcag-snackbar {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #10b981;
      color: white;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s, transform 0.3s;
      z-index: 100;
      white-space: nowrap;
    }
    .hwcag-snackbar.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
}

const HEADER_ICON_SVG = `<svg viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.10046 8.08314C4.8759 10.6185 4.2846 13.0779 3.36294 15.4685C3.13796 16.0522 3.43701 16.7056 4.03054 16.927C4.62408 17.1483 5.2884 16.8541 5.51348 16.2704C6.1657 14.5781 6.66457 12.8537 6.99948 11.0958C7.33429 12.8538 7.83308 14.578 8.48549 16.2704C8.71047 16.8542 9.37488 17.1484 9.96843 16.927C10.562 16.7057 10.8611 16.0522 10.636 15.4685C9.71502 13.0789 9.12381 10.6212 8.89895 8.08795C10.3587 7.73074 11.7585 7.42709 13.0021 7.03614C13.6831 6.82433 14.0416 6.21736 13.9307 5.65715C13.8198 5.09676 13.2377 4.70548 12.681 4.78807C10.821 5.08391 9.54895 5.87472 6.99948 5.87472C4.45002 5.87472 3.17173 5.08366 1.31283 4.78807C0.756127 4.70601 0.174885 5.09753 0.0642017 5.65715C-0.0465771 6.21795 0.313145 6.82588 0.997425 7.03614C2.2395 7.42962 3.63857 7.73074 5.10046 8.08314Z" fill="white"></path>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.56269 2.1585C8.56269 3.34718 7.62959 4.31063 6.49981 4.31063C5.37023 4.31063 4.43714 3.34718 4.43714 2.1585C4.43714 0.969813 5.37023 0.00637294 6.49981 0.00637294C7.62959 0.00637294 8.56269 0.969813 8.56269 2.1585Z" fill="white"></path>
</svg>`;

const RESET_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;

function getMoveIcon(toSide: "left" | "right"): string {
  if (toSide === "left") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 7l5 5-5 5"/><path d="M6 7l5 5-5 5"/></svg>`;
}

// UI levels for stepper features: [step size, total dot count including level 0]
const STEPPER_UI: Record<string, { step: number; numLevels: number }> = {
  textSize: { step: 10, numLevels: 5 },
  lineHeight: { step: 0.25, numLevels: 5 },
  textSpacing: { step: 2, numLevels: 6 },
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
    document.dispatchEvent(new CustomEvent("hwcag:stateChange"));
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
    document.dispatchEvent(new CustomEvent("hwcag:stateChange"));
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
    document.dispatchEvent(new CustomEvent("hwcag:stateChange"));
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

export function createPanel(
  config: WidgetConfig,
  onMove?: () => void,
): HTMLElement {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const theme = { ...DEFAULT_CONFIG.theme, ...config.theme };
  const isRight = settings.position.includes("right");

  const styleId = "hwcag-widget-panel-styles";
  let panelStyle = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!panelStyle) {
    panelStyle = document.createElement("style") as HTMLStyleElement;
    panelStyle.id = styleId;
    document.head.appendChild(panelStyle);
  }
  panelStyle.textContent = getPanelStyles(settings.position);

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

  // Move button — arrow points in the direction the widget will move to
  const moveBtn = document.createElement("button");
  moveBtn.className = "hwcag-panel-move";
  const targetSide = isRight ? "left" : "right";
  moveBtn.setAttribute("aria-label", `Move widget to the ${targetSide}`);
  moveBtn.setAttribute("title", `Move widget to the ${targetSide}`);
  moveBtn.innerHTML = getMoveIcon(targetSide);
  if (onMove) {
    moveBtn.addEventListener("click", onMove);
  }

  const closeBtn = document.createElement("button");
  closeBtn.className = "hwcag-panel-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Close accessibility menu");

  header.appendChild(headerIconWrap);
  header.appendChild(titleWrap);
  header.appendChild(moveBtn);
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

  const branding = document.createElement("p");
  branding.className = "hwcag-panel-branding";
  branding.innerHTML = `Powered by&nbsp;&nbsp;<a href="https://logisparktech.com" target="_blank" rel="noopener noreferrer">Logispark Technologies ${LOGISPARK_LOGO_SVG}</a>`;

  footer.appendChild(resetBtn);
  footer.appendChild(branding);

  panel.appendChild(header);
  panel.appendChild(content);
  panel.appendChild(footer);

  return panel;
}
