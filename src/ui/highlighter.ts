/**
 * Element highlighting utilities for visual feedback
 */

const HIGHLIGHT_CLASS = "hwcag-highlight";
const HIGHLIGHT_STYLES = `
  .${HIGHLIGHT_CLASS} {
    outline: 3px solid #dc3545 !important;
    outline-offset: 2px !important;
    animation: hwcag-pulse 1.5s ease-in-out infinite !important;
  }
  @keyframes hwcag-pulse {
    0%, 100% { outline-color: #dc3545; }
    50% { outline-color: #ff6b6b; }
  }
`;

let stylesInjected = false;

function injectHighlightStyles(): void {
  if (stylesInjected) return;

  const style = document.createElement("style");
  style.id = "have-wcag-highlight-styles";
  style.textContent = HIGHLIGHT_STYLES;
  document.head.appendChild(style);
  stylesInjected = true;
}

/**
 * Highlight an element with a visible outline
 */
export function highlightElement(element: HTMLElement): void {
  injectHighlightStyles();
  element.classList.add(HIGHLIGHT_CLASS);
}

/**
 * Remove highlight from an element
 */
export function removeHighlight(element: HTMLElement): void {
  element.classList.remove(HIGHLIGHT_CLASS);
}

/**
 * Remove all highlights from the page
 */
export function removeAllHighlights(): void {
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS);
  });
}

/**
 * Create an overlay tooltip near an element
 */
export function showTooltip(
  element: HTMLElement,
  message: string,
): HTMLElement {
  const tooltip = document.createElement("div");
  tooltip.className = "hwcag-tooltip";
  tooltip.textContent = message;

  const rect = element.getBoundingClientRect();
  tooltip.style.cssText = `
    position: fixed;
    top: ${rect.top - 30}px;
    left: ${rect.left}px;
    background: #1a1a2e;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000000;
    pointer-events: none;
  `;

  document.body.appendChild(tooltip);
  return tooltip;
}

/**
 * Remove a tooltip element
 */
export function removeTooltip(tooltip: HTMLElement): void {
  tooltip.remove();
}
