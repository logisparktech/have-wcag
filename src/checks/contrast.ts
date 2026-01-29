import type { ContrastIssue, CheckModule } from "../types";
import {
  parseColor,
  getContrastRatio,
  suggestAccessibleColor,
  rgbToHex,
} from "../utils/color";
import {
  getSelector,
  getEffectiveBackgroundColor,
  isLargeText,
} from "../utils/dom";

/**
 * WCAG contrast ratio requirements:
 * - Level AA: 4.5:1 for normal text, 3:1 for large text
 * - Level AAA: 7:1 for normal text, 4.5:1 for large text
 */
function getRequiredRatio(isLarge: boolean, level: "A" | "AA" | "AAA"): number {
  if (level === "AAA") {
    return isLarge ? 4.5 : 7;
  }
  // Level A and AA have same contrast requirements
  return isLarge ? 3 : 4.5;
}

/**
 * Check a single element for contrast issues
 */
function checkContrast(
  element: HTMLElement,
  level: "A" | "AA" | "AAA",
): ContrastIssue | null {
  const style = window.getComputedStyle(element);
  const textColor = parseColor(style.color);
  const backgroundColor = getEffectiveBackgroundColor(element);

  const ratio = getContrastRatio(textColor, backgroundColor);
  const isLarge = isLargeText(element);
  const requiredRatio = getRequiredRatio(isLarge, level);

  // Passes the check
  if (ratio >= requiredRatio) {
    return null;
  }

  // Generate suggestion
  const suggestedColor = suggestAccessibleColor(
    textColor,
    backgroundColor,
    requiredRatio,
  );
  const suggestedRatio = getContrastRatio(suggestedColor, backgroundColor);

  return {
    id: `contrast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: "contrast",
    element,
    selector: getSelector(element),
    severity: ratio < requiredRatio * 0.7 ? "error" : "warning",
    message: `Contrast ratio ${ratio.toFixed(2)}:1 is below the required ${requiredRatio}:1 for ${isLarge ? "large" : "normal"} text`,
    wcagCriteria:
      level === "AAA"
        ? "1.4.6 Contrast (Enhanced)"
        : "1.4.3 Contrast (Minimum)",
    current: {
      ratio: Math.round(ratio * 100) / 100,
      textColor: rgbToHex(textColor),
      backgroundColor: rgbToHex(backgroundColor),
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
    },
    suggestion: {
      textColor: rgbToHex(suggestedColor),
      ratio: Math.round(suggestedRatio * 100) / 100,
    },
  };
}

/**
 * Exported check module
 */
export const contrastCheck: CheckModule = {
  name: "contrast",
  run: checkContrast,
};

export default contrastCheck;
