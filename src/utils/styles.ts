/**
 * Style manipulation utilities
 */

/**
 * Store for original styles before modifications
 */
const originalStyles = new WeakMap<HTMLElement, string>();

/**
 * Save an element's current inline style
 */
export function saveStyle(element: HTMLElement): void {
  if (!originalStyles.has(element)) {
    originalStyles.set(element, element.getAttribute("style") || "");
  }
}

/**
 * Restore an element's original inline style
 */
export function restoreStyle(element: HTMLElement): void {
  const original = originalStyles.get(element);
  if (original !== undefined) {
    if (original) {
      element.setAttribute("style", original);
    } else {
      element.removeAttribute("style");
    }
    originalStyles.delete(element);
  }
}

/**
 * Check if an element has saved styles
 */
export function hasSavedStyle(element: HTMLElement): boolean {
  return originalStyles.has(element);
}

/**
 * Apply temporary styles to an element
 */
export function applyTempStyle(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>,
): void {
  saveStyle(element);
  Object.assign(element.style, styles);
}

/**
 * Get computed style value for a property
 */
export function getComputedStyleValue(
  element: HTMLElement,
  property: string,
): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Check if element has a specific CSS property set inline
 */
export function hasInlineStyle(
  element: HTMLElement,
  property: string,
): boolean {
  return element.style.getPropertyValue(property) !== "";
}

/**
 * Get all inline styles as an object
 */
export function getInlineStyles(element: HTMLElement): Record<string, string> {
  const styles: Record<string, string> = {};
  for (let i = 0; i < element.style.length; i++) {
    const prop = element.style[i];
    styles[prop] = element.style.getPropertyValue(prop);
  }
  return styles;
}

/**
 * Convert CSS property name to camelCase
 */
export function toCamelCase(property: string): string {
  return property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to CSS property name
 */
export function toKebabCase(property: string): string {
  return property.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Parse CSS shorthand properties
 */
export function parseShorthand(
  property: string,
  value: string,
): Record<string, string> {
  const parts = value.trim().split(/\s+/);

  switch (property) {
    case "margin":
    case "padding":
      return parseBoxModel(property, parts);
    case "border":
      return parseBorder(parts);
    default:
      return { [property]: value };
  }
}

/**
 * Parse box model shorthand (margin, padding)
 */
function parseBoxModel(
  property: string,
  parts: string[],
): Record<string, string> {
  const [top, right = top, bottom = top, left = right] = parts;
  return {
    [`${property}-top`]: top,
    [`${property}-right`]: right,
    [`${property}-bottom`]: bottom,
    [`${property}-left`]: left,
  };
}

/**
 * Parse border shorthand
 */
function parseBorder(parts: string[]): Record<string, string> {
  const result: Record<string, string> = {};

  parts.forEach((part) => {
    if (/^\d/.test(part)) {
      result["border-width"] = part;
    } else if (
      /^(solid|dashed|dotted|double|groove|ridge|inset|outset|none)$/.test(part)
    ) {
      result["border-style"] = part;
    } else {
      result["border-color"] = part;
    }
  });

  return result;
}

/**
 * Generate CSS rule string from selector and properties
 */
export function generateCSSRule(
  selector: string,
  properties: Record<string, string>,
): string {
  const props = Object.entries(properties)
    .map(([key, value]) => `  ${toKebabCase(key)}: ${value};`)
    .join("\n");

  return `${selector} {\n${props}\n}`;
}

/**
 * Inject a style element into the document
 */
export function injectStyles(id: string, css: string): HTMLStyleElement {
  let styleEl = document.getElementById(id) as HTMLStyleElement;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = id;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
  return styleEl;
}

/**
 * Remove an injected style element
 */
export function removeStyles(id: string): void {
  document.getElementById(id)?.remove();
}
