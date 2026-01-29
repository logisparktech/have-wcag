import type { WidgetConfig } from "./types";
import { DEFAULT_CONFIG } from "./types";
import { createButton } from "./ui/button";
import { createPanel } from "./ui/panel";
import { resetAll } from "./features";

let isInitialized = false;
let buttonElement: HTMLElement | null = null;
let panelElement: HTMLElement | null = null;
let currentConfig: WidgetConfig = {};

/**
 * Toggle panel visibility
 */
function togglePanel(): void {
  if (!panelElement || !buttonElement) return;

  const isOpen = panelElement.classList.toggle("open");
  buttonElement.classList.toggle("active", isOpen);
  buttonElement.setAttribute("aria-expanded", String(isOpen));
}

/**
 * Close panel
 */
function closePanel(): void {
  if (!panelElement || !buttonElement) return;

  panelElement.classList.remove("open");
  buttonElement.classList.remove("active");
  buttonElement.setAttribute("aria-expanded", "false");
}

/**
 * Handle click outside to close panel
 */
function handleClickOutside(e: MouseEvent): void {
  if (!panelElement || !buttonElement) return;

  const target = e.target as HTMLElement;
  if (!panelElement.contains(target) && !buttonElement.contains(target)) {
    closePanel();
  }
}

/**
 * Handle escape key to close panel
 */
function handleEscapeKey(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    closePanel();
  }
}

/**
 * Refresh panel after settings reset
 */
function refreshPanel(): void {
  if (!panelElement) return;

  const newPanel = createPanel(currentConfig, refreshPanel);
  panelElement.replaceWith(newPanel);
  panelElement = newPanel;

  // Reattach event listener to new close button
  const closeBtn = panelElement.querySelector(".hwcag-panel-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }
}

/**
 * Initialize the widget
 */
export function init(config: WidgetConfig = {}): void {
  if (isInitialized) {
    console.warn("have-wcag widget is already initialized");
    return;
  }

  currentConfig = { ...DEFAULT_CONFIG, ...config };

  // Create UI elements
  buttonElement = createButton(currentConfig);
  panelElement = createPanel(currentConfig, refreshPanel);

  // Set up event listeners
  buttonElement.addEventListener("click", togglePanel);

  const closeBtn = panelElement.querySelector(".hwcag-panel-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }

  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscapeKey);

  // Add to DOM
  document.body.appendChild(panelElement);
  document.body.appendChild(buttonElement);

  isInitialized = true;
  console.log("have-wcag widget initialized", currentConfig);
}

/**
 * Destroy the widget
 */
export function destroy(): void {
  if (!isInitialized) return;

  // Remove event listeners
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscapeKey);

  // Reset all features
  resetAll();

  // Remove elements
  buttonElement?.remove();
  panelElement?.remove();

  // Remove styles
  document.getElementById("hwcag-widget-button-styles")?.remove();
  document.getElementById("hwcag-widget-panel-styles")?.remove();

  buttonElement = null;
  panelElement = null;
  isInitialized = false;
}

/**
 * Update configuration
 */
export function configure(config: Partial<WidgetConfig>): void {
  if (!isInitialized) {
    console.warn("Widget not initialized. Call init() first.");
    return;
  }

  // Destroy and reinitialize with new config
  destroy();
  init({ ...currentConfig, ...config });
}

/**
 * Open the panel programmatically
 */
export function open(): void {
  if (!panelElement || !buttonElement) return;

  panelElement.classList.add("open");
  buttonElement.classList.add("active");
  buttonElement.setAttribute("aria-expanded", "true");
}

/**
 * Close the panel programmatically
 */
export function close(): void {
  closePanel();
}

/**
 * Reset all accessibility settings
 */
export function reset(): void {
  resetAll();

  // Refresh panel if open
  if (panelElement?.classList.contains("open")) {
    const newPanel = createPanel(currentConfig);
    newPanel.classList.add("open");
    panelElement.replaceWith(newPanel);
    panelElement = newPanel;

    const closeBtn = panelElement.querySelector(".hwcag-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closePanel);
    }
  }
}

// Export types
export * from "./types";

// Export features for programmatic use
export { featureActions } from "./features";

// Default export
export default {
  init,
  destroy,
  configure,
  open,
  close,
  reset,
};
