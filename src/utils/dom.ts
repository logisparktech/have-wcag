import { parseColor, blendColors, type RGB, type RGBA } from "./color";

/**
 * Generate a unique CSS selector for an element
 */
export function getSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.className && typeof current.className === "string") {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => c);
      if (classes.length > 0) {
        selector += "." + classes.slice(0, 2).join(".");
      }
    }

    // Add nth-child if needed for uniqueness
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(" > ");
}

/**
 * Check if an element has visible text content
 */
export function hasVisibleText(element: HTMLElement): boolean {
  // Check direct text content
  const hasDirectText = Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );

  if (hasDirectText) return true;

  // Check for value in form elements
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return !!element.value || !!element.placeholder;
  }

  return false;
}

/**
 * Check if an element is visible in the viewport
 */
export function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);

  if (style.display === "none") return false;
  if (style.visibility === "hidden") return false;
  if (parseFloat(style.opacity) === 0) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;

  return true;
}

/**
 * Get the effective background color of an element
 * Traverses up the DOM tree to find actual background
 */
export function getEffectiveBackgroundColor(element: HTMLElement): RGB {
  let current: HTMLElement | null = element;
  let backgroundColor: RGBA = { r: 255, g: 255, b: 255, a: 0 };

  while (current) {
    const style = window.getComputedStyle(current);
    const bg = parseColor(style.backgroundColor);

    if (bg.a > 0) {
      if (backgroundColor.a === 0) {
        backgroundColor = bg;
      } else {
        // Blend with existing background
        backgroundColor = {
          ...blendColors(backgroundColor, bg),
          a: 1,
        };
      }

      // If fully opaque, we're done
      if (bg.a === 1) break;
    }

    current = current.parentElement;
  }

  // If still transparent, assume white background
  if (backgroundColor.a === 0) {
    return { r: 255, g: 255, b: 255 };
  }

  return backgroundColor;
}

/**
 * Check if text is "large" per WCAG definition
 * Large text: at least 18pt (24px) or 14pt (18.5px) bold
 */
export function isLargeText(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  const fontWeight =
    parseInt(style.fontWeight, 10) || (style.fontWeight === "bold" ? 700 : 400);

  // 24px or larger
  if (fontSize >= 24) return true;

  // 18.5px or larger AND bold (700+)
  if (fontSize >= 18.5 && fontWeight >= 700) return true;

  return false;
}

/**
 * Get all text-containing elements in the DOM
 */
export function getTextElements(
  root: HTMLElement = document.body,
): HTMLElement[] {
  const elements: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const el = node as HTMLElement;
      if (!isVisible(el)) return NodeFilter.FILTER_REJECT;
      if (hasVisibleText(el)) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    elements.push(node as HTMLElement);
  }

  return elements;
}

/**
 * Get all interactive elements for keyboard testing
 */
export function getInteractiveElements(
  root: HTMLElement = document.body,
): HTMLElement[] {
  const selectors = [
    "a[href]",
    "button",
    "input",
    "select",
    "textarea",
    "[tabindex]",
    "[onclick]",
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="menuitem"]',
  ];

  const elements = root.querySelectorAll<HTMLElement>(selectors.join(","));
  return Array.from(elements).filter(isVisible);
}
