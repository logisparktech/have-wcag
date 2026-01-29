import type { TextResizeIssue, CheckModule } from "../types";
import { getSelector } from "../utils/dom";

/**
 * Units that scale with user preferences
 */
const SCALABLE_UNITS = ["rem", "em", "%", "vw", "vh"];

/**
 * Extract unit from CSS value
 */
function extractUnit(value: string): string {
  const match = value.match(/[\d.]+([a-z%]+)/i);
  return match ? match[1].toLowerCase() : "px";
}

/**
 * Convert px to rem (assuming 16px base)
 */
function pxToRem(px: number): string {
  return `${(px / 16).toFixed(3).replace(/\.?0+$/, "")}rem`;
}

/**
 * Check if element uses absolute units for font-size
 * WCAG 1.4.4 Resize text - text should be resizable up to 200%
 */
function checkTextResize(
  element: HTMLElement,
  level: "A" | "AA" | "AAA",
): TextResizeIssue | null {
  const style = window.getComputedStyle(element);
  const fontSize = style.fontSize;
  const inlineStyle = element.style.fontSize;

  // If no inline style, check stylesheets would require more complex logic
  // For now, focus on inline styles which are common in JS frameworks
  if (!inlineStyle) {
    return null;
  }

  const unit = extractUnit(inlineStyle);

  // If using scalable units, it's fine
  if (SCALABLE_UNITS.includes(unit)) {
    return null;
  }

  // Using px or pt - flag it
  if (unit === "px" || unit === "pt") {
    const computedSize = parseFloat(fontSize);

    return {
      id: `text-resize-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "textResize",
      element,
      selector: getSelector(element),
      severity: "warning",
      message: `Font size uses absolute unit (${unit}) which may not scale with user preferences`,
      wcagCriteria: "1.4.4 Resize Text",
      current: {
        unit,
        value: inlineStyle,
        computedSize: fontSize,
      },
      suggestion: {
        value: pxToRem(computedSize),
        unit: "rem",
      },
    };
  }

  return null;
}

/**
 * Additional check: Test if content overflows at 200% zoom
 * This requires actually simulating zoom
 */
export function checkOverflowAtZoom(
  element: HTMLElement,
  zoomLevel: number = 2,
): boolean {
  const original = {
    fontSize: document.documentElement.style.fontSize,
    overflow: element.style.overflow,
  };

  // Simulate zoom by scaling root font size
  document.documentElement.style.fontSize = `${zoomLevel * 100}%`;

  // Check for overflow
  const hasOverflow =
    element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight;

  // Restore
  document.documentElement.style.fontSize = original.fontSize;

  return hasOverflow;
}

export const textResizeCheck: CheckModule = {
  name: "textResize",
  run: checkTextResize,
};

export default textResizeCheck;
