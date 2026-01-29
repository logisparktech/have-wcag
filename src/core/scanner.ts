import type { CheckType } from "../types";
import {
  getTextElements,
  getInteractiveElements,
  isVisible,
} from "../utils/dom";

/**
 * Scanner configuration
 */
export interface ScannerConfig {
  root?: HTMLElement;
  exclude?: string[];
}

/**
 * Default selectors to exclude from scanning
 */
const DEFAULT_EXCLUDE = [
  "script",
  "style",
  "noscript",
  "iframe",
  "svg",
  '[aria-hidden="true"]',
  ".hwcag-toolbar",
  ".hwcag-panel",
];

/**
 * Scanner class for traversing the DOM
 */
export class Scanner {
  private root: HTMLElement;
  private excludeSelectors: string[];

  constructor(config: ScannerConfig = {}) {
    this.root = config.root || document.body;
    this.excludeSelectors = [...DEFAULT_EXCLUDE, ...(config.exclude || [])];
  }

  /**
   * Check if element should be excluded
   */
  private shouldExclude(element: HTMLElement): boolean {
    return this.excludeSelectors.some((selector) => {
      try {
        return element.matches(selector);
      } catch {
        return false;
      }
    });
  }

  /**
   * Get all elements for a specific check type
   */
  getElements(checkType: CheckType): HTMLElement[] {
    let elements: HTMLElement[];

    switch (checkType) {
      case "contrast":
      case "textResize":
        elements = getTextElements(this.root);
        break;
      case "keyboard":
        elements = getInteractiveElements(this.root);
        break;
      default:
        elements = [];
    }

    return elements.filter((el) => !this.shouldExclude(el));
  }

  /**
   * Get all visible elements in the DOM tree
   */
  getAllElements(): HTMLElement[] {
    const elements: HTMLElement[] = [];
    const walker = document.createTreeWalker(
      this.root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          const el = node as HTMLElement;
          if (this.shouldExclude(el)) return NodeFilter.FILTER_REJECT;
          if (!isVisible(el)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      elements.push(node as HTMLElement);
    }

    return elements;
  }

  /**
   * Scan for elements matching a CSS selector
   */
  querySelectorAll(selector: string): HTMLElement[] {
    const elements = this.root.querySelectorAll<HTMLElement>(selector);
    return Array.from(elements).filter(
      (el) => !this.shouldExclude(el) && isVisible(el),
    );
  }

  /**
   * Update scanner root
   */
  setRoot(root: HTMLElement): void {
    this.root = root;
  }

  /**
   * Add exclusion selectors
   */
  addExclusions(selectors: string[]): void {
    this.excludeSelectors.push(...selectors);
  }
}

/**
 * Create a scanner instance
 */
export function createScanner(config?: ScannerConfig): Scanner {
  return new Scanner(config);
}

export default Scanner;
