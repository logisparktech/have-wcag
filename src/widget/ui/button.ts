import type { WidgetConfig, WidgetTheme } from "../types";
import { DEFAULT_CONFIG } from "../types";

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
 * Get position styles
 */
function getPositionStyles(position: string): string {
  const positions: Record<string, string> = {
    "bottom-right": "bottom: 20px; right: 20px;",
    "bottom-left": "bottom: 20px; left: 20px;",
    "top-right": "top: 20px; right: 20px;",
    "top-left": "top: 20px; left: 20px;",
  };
  return positions[position] || positions["bottom-right"];
}

/**
 * Button styles
 */
const BUTTON_STYLES = `
  .hwcag-widget-button {
    position: fixed;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--hwcag-primary);
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .hwcag-widget-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .hwcag-widget-button:focus {
    outline: 3px solid var(--hwcag-accent);
    outline-offset: 2px;
  }
  .hwcag-widget-button.active {
    background: var(--hwcag-accent);
  }
`;

/**
 * Create the floating button
 */
export function createButton(config: WidgetConfig): HTMLElement {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const theme = { ...DEFAULT_CONFIG.theme, ...config.theme };

  // Inject styles
  const styleId = "hwcag-widget-button-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = BUTTON_STYLES;
    document.head.appendChild(style);
  }

  // Create button
  const button = document.createElement("button");
  button.className = "hwcag-widget hwcag-widget-button";
  button.style.cssText =
    getThemeCSS(theme) + getPositionStyles(settings.position);
  button.innerHTML = "♿";
  button.setAttribute("aria-label", settings.buttonLabel);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-haspopup", "dialog");

  return button;
}
