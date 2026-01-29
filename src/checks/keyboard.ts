import type { KeyboardIssue, CheckModule } from "../types";
import { getSelector } from "../utils/dom";

/**
 * Elements that are naturally focusable
 */
const NATURALLY_FOCUSABLE = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "details",
  "summary",
];

/**
 * Check if element has click/interaction handlers
 */
function hasInteractionHandler(element: HTMLElement): boolean {
  // Check for onclick attribute
  if (element.hasAttribute("onclick")) return true;

  // Check for common event listener patterns (data attributes)
  const interactiveAttrs = [
    "data-click",
    "data-action",
    "@click",
    "v-on:click",
  ];
  if (interactiveAttrs.some((attr) => element.hasAttribute(attr))) return true;

  // Check for cursor pointer (often indicates clickable)
  const style = window.getComputedStyle(element);
  if (style.cursor === "pointer") return true;

  return false;
}

/**
 * Check if element is focusable
 */
function isFocusable(element: HTMLElement): boolean {
  // Check if naturally focusable
  if (NATURALLY_FOCUSABLE.some((sel) => element.matches(sel))) {
    // But not if disabled
    if (element.hasAttribute("disabled")) return false;
    // Or has negative tabindex
    const tabIndex = element.getAttribute("tabindex");
    if (tabIndex && parseInt(tabIndex, 10) < 0) return false;
    return true;
  }

  // Check for explicit tabindex
  const tabIndex = element.getAttribute("tabindex");
  if (tabIndex && parseInt(tabIndex, 10) >= 0) return true;

  // Check for contenteditable
  if (element.isContentEditable) return true;

  return false;
}

/**
 * Check if element has proper focus indication
 */
function hasFocusIndicator(element: HTMLElement): boolean {
  // This is a simplified check - in reality you'd want to
  // actually focus the element and check computed styles
  const style = window.getComputedStyle(element);

  // Check for outline
  if (style.outlineStyle !== "none" && style.outlineWidth !== "0px") {
    return true;
  }

  return true; // Give benefit of doubt for now
}

/**
 * Check keyboard accessibility for an element
 */
function checkKeyboard(
  element: HTMLElement,
  level: "A" | "AA" | "AAA",
): KeyboardIssue | null {
  const isInteractive = hasInteractionHandler(element);
  const canFocus = isFocusable(element);
  const role = element.getAttribute("role");
  const tabIndex = element.getAttribute("tabindex");

  // Interactive elements must be focusable
  if (isInteractive && !canFocus) {
    return {
      id: `keyboard-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "keyboard",
      element,
      selector: getSelector(element),
      severity: "error",
      message: "Interactive element is not keyboard accessible",
      wcagCriteria: "2.1.1 Keyboard",
      current: {
        tabIndex: tabIndex ? parseInt(tabIndex, 10) : undefined,
        hasClickHandler: isInteractive,
        isFocusable: canFocus,
        role: role || undefined,
      },
      suggestion: {
        tabIndex: 0,
        role: role || "button",
      },
    };
  }

  // Check for positive tabindex (disrupts natural flow)
  if (tabIndex && parseInt(tabIndex, 10) > 0) {
    return {
      id: `keyboard-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "keyboard",
      element,
      selector: getSelector(element),
      severity: "warning",
      message: `Positive tabindex (${tabIndex}) disrupts natural tab order`,
      wcagCriteria: "2.4.3 Focus Order",
      current: {
        tabIndex: parseInt(tabIndex, 10),
        hasClickHandler: isInteractive,
        isFocusable: canFocus,
        role: role || undefined,
      },
      suggestion: {
        tabIndex: 0,
      },
    };
  }

  // Check for missing role on custom interactive elements
  if (
    isInteractive &&
    !role &&
    !element.matches(NATURALLY_FOCUSABLE.join(","))
  ) {
    return {
      id: `keyboard-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "keyboard",
      element,
      selector: getSelector(element),
      severity: "warning",
      message: "Custom interactive element missing ARIA role",
      wcagCriteria: "4.1.2 Name, Role, Value",
      current: {
        tabIndex: tabIndex ? parseInt(tabIndex, 10) : undefined,
        hasClickHandler: isInteractive,
        isFocusable: canFocus,
      },
      suggestion: {
        role: "button",
        tabIndex: 0,
      },
    };
  }

  return null;
}

export const keyboardCheck: CheckModule = {
  name: "keyboard",
  run: checkKeyboard,
};

export default keyboardCheck;
