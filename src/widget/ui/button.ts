import type { WidgetConfig, WidgetTheme } from "../types";
import { DEFAULT_CONFIG } from "../types";

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

function getPositionStyles(position: string): string {
  const positions: Record<string, string> = {
    "bottom-right": "bottom: 24px; right: 24px;",
    "bottom-left": "bottom: 24px; left: 24px;",
    "top-right": "top: 24px; right: 24px;",
    "top-left": "top: 24px; left: 24px;",
  };
  return positions[position] || positions["bottom-right"];
}

// const ACCESSIBILITY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" fill="white" aria-hidden="true" focusable="false">
//   <circle cx="16" cy="7" r="3.5"/>
//   <path d="M7.5 14.5q8.5-4 17 0" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
//   <line x1="16" y1="13" x2="16" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
//   <path d="M16 22 L11.5 29 M16 22 L20.5 29" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
// </svg>`;
const ACCESSIBILITY_ICON = `<div class="a11y-icons-container">
  <svg id="a11y-btn-circle" role="presentation" aria-hidden="true" viewBox="0 0 28 28"> 
    <circle cx="14" cy="14" r="13" fill="none" stroke="white" stroke-width="1.5"></circle> 
  </svg>
  <svg id="a11y-btn-figure" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.10046 8.08314C4.8759 10.6185 4.2846 13.0779 3.36294 15.4685C3.13796 16.0522 3.43701 16.7056 4.03054 16.927C4.62408 17.1483 5.2884 16.8541 5.51348 16.2704C6.1657 14.5781 6.66457 12.8537 6.99948 11.0958C7.33429 12.8538 7.83308 14.578 8.48549 16.2704C8.71047 16.8542 9.37488 17.1484 9.96843 16.927C10.562 16.7057 10.8611 16.0522 10.636 15.4685C9.71502 13.0789 9.12381 10.6212 8.89895 8.08795C10.3587 7.73074 11.7585 7.42709 13.0021 7.03614C13.6831 6.82433 14.0416 6.21736 13.9307 5.65715C13.8198 5.09676 13.2377 4.70548 12.681 4.78807C10.821 5.08391 9.54895 5.87472 6.99948 5.87472C4.45002 5.87472 3.17173 5.08366 1.31283 4.78807C0.756127 4.70601 0.174885 5.09753 0.0642017 5.65715C-0.0465771 6.21795 0.313145 6.82588 0.997425 7.03614C2.2395 7.42962 3.63857 7.73074 5.10046 8.08314Z" fill="white"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.56269 2.1585C8.56269 3.34718 7.62959 4.31063 6.49981 4.31063C5.37023 4.31063 4.43714 3.34718 4.43714 2.1585C4.43714 0.969813 5.37023 0.00637294 6.49981 0.00637294C7.62959 0.00637294 8.56269 0.969813 8.56269 2.1585Z" fill="white"></path>
  </svg>
</div>`;

const BUTTON_STYLES = `
  .hwcag-widget-button {
    position: fixed !important;
    width: 60px !important;
    height: 60px !important;
    border-radius: 50% !important;
    background: var(--hwcag-primary) !important;
    color: white !important;
    border: none !important;
    cursor: pointer !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.12) !important;
    z-index: 1000000 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    /* CSS Reset to prevent inherited accessibility settings from affecting the button */
    font-size: 16px !important;
    line-height: 1 !important;
    letter-spacing: normal !important;
    word-spacing: normal !important;
    text-align: center !important;
    text-transform: none !important;
  }
  .hwcag-widget-button * {
    font-family: inherit !important;
    font-size: inherit !important;
    line-height: inherit !important;
    letter-spacing: inherit !important;
    word-spacing: inherit !important;
    text-align: inherit !important;
    text-transform: inherit !important;
  }
  .hwcag-widget-button::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--hwcag-primary);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .hwcag-widget-button:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.14);
  }
  .hwcag-widget-button:focus-visible {
    outline: none;
  }
  .hwcag-widget-button:focus-visible::before {
    opacity: 1;
  }
  .hwcag-widget-button:focus {
    outline: 3px solid var(--hwcag-accent);
    outline-offset: 3px;
  }
  .hwcag-widget-button.active {
    background: var(--hwcag-accent);
  }
  .a11y-icons-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  #a11y-btn-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    opacity: 0.8;
    transition: opacity 0.3s, stroke-dasharray 0.3s;
  }
  .hwcag-widget-button.loading #a11y-btn-circle {
    opacity: 1;
    animation: a11y-rotate 0.8s linear infinite;
  }
  .hwcag-widget-button.loading #a11y-btn-circle circle {
    stroke-dasharray: 20 60 !important;
  }
  #a11y-btn-figure {
    position: absolute;
    width: 50%;
    height: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .hwcag-widget-button:hover #a11y-btn-figure {
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  @keyframes a11y-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

`;

export function createButton(config: WidgetConfig): HTMLElement {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const theme = { ...DEFAULT_CONFIG.theme, ...config.theme };

  const styleId = "hwcag-widget-button-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = BUTTON_STYLES;
    document.head.appendChild(style);
  }

  const button = document.createElement("button");
  button.className = "hwcag-widget hwcag-widget-button";
  button.title = 'Accessibility Settings';
  button.ariaLabel = 'Accessibility Settings';
  button.style.cssText = getThemeCSS(theme) + getPositionStyles(settings.position);
  button.innerHTML = ACCESSIBILITY_ICON;
  button.setAttribute("aria-label", settings.buttonLabel);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-haspopup", "dialog");

  return button;
}
