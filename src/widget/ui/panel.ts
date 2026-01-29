import type { WidgetConfig, WidgetTheme, WidgetFeature } from "../types";
import { DEFAULT_CONFIG } from "../types";
import { features, featureActions, resetAll } from "../features";

/**
 * Generate CSS variables from theme
 */
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

/**
 * Panel styles
 */
function getPanelStyles(position: string): string {
  const positionStyles: Record<string, string> = {
    "bottom-right": "bottom: 80px; right: 20px;",
    "bottom-left": "bottom: 80px; left: 20px;",
    "top-right": "top: 80px; right: 20px;",
    "top-left": "top: 80px; left: 20px;",
  };

  return `
    .hwcag-widget-panel {
      position: fixed;
      ${positionStyles[position] || positionStyles["bottom-right"]}
      width: 320px;
      max-height: 480px;
      background: var(--hwcag-bg);
      border-radius: var(--hwcag-radius);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: var(--hwcag-text);
      overflow: hidden;
      display: none;
    }
    .hwcag-widget-panel.open {
      display: block;
    }
    .hwcag-panel-header {
      background: var(--hwcag-primary);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hwcag-panel-title {
      font-weight: 600;
      font-size: 16px;
      margin: 0;
    }
    .hwcag-panel-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .hwcag-panel-close:hover {
      opacity: 1;
    }
    .hwcag-panel-content {
      padding: 16px;
      max-height: 380px;
      overflow-y: auto;
    }
    .hwcag-feature {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      margin-bottom: 8px;
      background: #f8f9fa;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .hwcag-feature:hover {
      background: #f0f1f2;
    }
    .hwcag-feature-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .hwcag-feature-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--hwcag-primary);
      color: white;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
    }
    .hwcag-feature-label {
      font-weight: 500;
    }
    .hwcag-feature-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .hwcag-toggle {
      width: 48px;
      height: 26px;
      background: #ccc;
      border-radius: 13px;
      position: relative;
      cursor: pointer;
      transition: background 0.2s;
      border: none;
      padding: 0;
    }
    .hwcag-toggle.active {
      background: var(--hwcag-accent);
    }
    .hwcag-toggle::after {
      content: '';
      position: absolute;
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: transform 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .hwcag-toggle.active::after {
      transform: translateX(22px);
    }
    .hwcag-stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hwcag-stepper-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: var(--hwcag-primary);
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }
    .hwcag-stepper-btn:hover {
      opacity: 0.85;
    }
    .hwcag-stepper-value {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
    }
    .hwcag-select-btn {
      padding: 6px 12px;
      border: 2px solid var(--hwcag-primary);
      background: white;
      color: var(--hwcag-primary);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
      transition: all 0.2s;
    }
    .hwcag-select-btn:hover {
      background: var(--hwcag-primary);
      color: white;
    }
    .hwcag-reset-btn {
      width: 100%;
      padding: 12px;
      margin-top: 8px;
      border: none;
      background: #dc3545;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .hwcag-reset-btn:hover {
      background: #c82333;
    }
  `;
}

/**
 * Create toggle control
 */
function createToggle(
  feature: WidgetFeature,
  initialValue: boolean,
  onChange: () => void,
): HTMLElement {
  const toggle = document.createElement("button");
  toggle.className = `hwcag-toggle ${initialValue ? "active" : ""}`;
  toggle.setAttribute("role", "switch");
  toggle.setAttribute("aria-checked", String(initialValue));

  toggle.addEventListener("click", () => {
    onChange();
    const isActive = toggle.classList.toggle("active");
    toggle.setAttribute("aria-checked", String(isActive));
  });

  return toggle;
}

/**
 * Create stepper control
 */
function createStepper(
  feature: WidgetFeature,
  getValue: () => number,
  onIncrease: () => number,
  onDecrease: () => number,
): HTMLElement {
  const container = document.createElement("div");
  container.className = "hwcag-stepper";

  const decreaseBtn = document.createElement("button");
  decreaseBtn.className = "hwcag-stepper-btn";
  decreaseBtn.textContent = "−";
  decreaseBtn.setAttribute("aria-label", "Decrease");

  const valueDisplay = document.createElement("span");
  valueDisplay.className = "hwcag-stepper-value";
  valueDisplay.textContent = formatStepperValue(getValue());

  const increaseBtn = document.createElement("button");
  increaseBtn.className = "hwcag-stepper-btn";
  increaseBtn.textContent = "+";
  increaseBtn.setAttribute("aria-label", "Increase");

  decreaseBtn.addEventListener("click", () => {
    const newVal = onDecrease();
    valueDisplay.textContent = formatStepperValue(newVal);
  });

  increaseBtn.addEventListener("click", () => {
    const newVal = onIncrease();
    valueDisplay.textContent = formatStepperValue(newVal);
  });

  container.appendChild(decreaseBtn);
  container.appendChild(valueDisplay);
  container.appendChild(increaseBtn);

  return container;
}

/**
 * Format stepper value for display
 */
function formatStepperValue(value: number): string {
  if (value === 0) return "Default";
  return value > 0 ? `+${value}` : String(value);
}

/**
 * Create select/cycle control
 */
function createSelect(
  feature: WidgetFeature,
  getValue: () => string,
  onCycle: () => string,
): HTMLElement {
  const btn = document.createElement("button");
  btn.className = "hwcag-select-btn";
  btn.textContent = getValue();

  btn.addEventListener("click", () => {
    const newVal = onCycle();
    btn.textContent = newVal;
  });

  return btn;
}

/**
 * Create a feature row
 */
function createFeatureRow(featureName: WidgetFeature): HTMLElement {
  const feature = features[featureName];
  const actions = featureActions[featureName];

  const row = document.createElement("div");
  row.className = "hwcag-feature";

  // Info section
  const info = document.createElement("div");
  info.className = "hwcag-feature-info";

  const icon = document.createElement("div");
  icon.className = "hwcag-feature-icon";
  icon.textContent = feature.icon;

  const label = document.createElement("span");
  label.className = "hwcag-feature-label";
  label.textContent = feature.label;

  info.appendChild(icon);
  info.appendChild(label);

  // Controls section
  const controls = document.createElement("div");
  controls.className = "hwcag-feature-controls";

  let control: HTMLElement;

  switch (feature.type) {
    case "toggle":
      control = createToggle(
        featureName,
        (actions as any).getValue(),
        (actions as any).toggle,
      );
      break;
    case "stepper":
      control = createStepper(
        featureName,
        (actions as any).getValue,
        (actions as any).increase,
        (actions as any).decrease,
      );
      break;
    case "select":
      control = createSelect(
        featureName,
        (actions as any).getValue,
        (actions as any).cycle,
      );
      break;
    default:
      control = document.createElement("div");
  }

  controls.appendChild(control);

  row.appendChild(info);
  row.appendChild(controls);

  return row;
}

/**
 * Create the panel element
 */
export function createPanel(
  config: WidgetConfig,
  onReset?: () => void,
): HTMLElement {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const theme = { ...DEFAULT_CONFIG.theme, ...config.theme };

  // Inject styles
  const styleId = "hwcag-widget-panel-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = getPanelStyles(settings.position);
    document.head.appendChild(style);
  }

  // Create panel
  const panel = document.createElement("div");
  panel.className = "hwcag-widget hwcag-widget-panel";
  panel.style.cssText = getThemeCSS(theme);
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", settings.panelTitle);

  // Header
  const header = document.createElement("div");
  header.className = "hwcag-panel-header";

  const title = document.createElement("h2");
  title.className = "hwcag-panel-title";
  title.textContent = settings.panelTitle;

  const closeBtn = document.createElement("button");
  closeBtn.className = "hwcag-panel-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Close panel");

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Content
  const content = document.createElement("div");
  content.className = "hwcag-panel-content";

  // Add feature rows
  settings.features.forEach((featureName) => {
    content.appendChild(createFeatureRow(featureName));
  });

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.className = "hwcag-reset-btn";
  resetBtn.textContent = "Reset All Settings";
  resetBtn.addEventListener("click", () => {
    resetAll();
    // Trigger reset callback if provided
    if (onReset) {
      onReset();
    }
  });

  content.appendChild(resetBtn);

  panel.appendChild(header);
  panel.appendChild(content);

  return panel;
}
