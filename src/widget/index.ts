import type { WidgetConfig } from "./types";
import { DEFAULT_CONFIG } from "./types";
import { createButton } from "./ui/button";
import { createPanel } from "./ui/panel";
import { resetAll, featureActions, features } from "./features";

let isInitialized = false;
let buttonElement: HTMLElement | null = null;
let panelElement: HTMLElement | null = null;
let currentConfig: WidgetConfig = {};

const STATE_KEY = "hwcag-state";

/**
 * Get current state across all features
 */
function getCurrentState(): Record<string, any> {
  const state: Record<string, any> = {};
  Object.entries(featureActions).forEach(([key, actions]) => {
    state[key] = (actions as any).getValue();
  });
  return state;
}

/**
 * Save current state to localStorage
 */
function saveState(): void {
  try {
    const state = getCurrentState();
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("hwcag: Failed to save state to localStorage", e);
  }
}

/**
 * Load state from localStorage
 */
function loadState(): void {
  try {
    const stateStr = localStorage.getItem(STATE_KEY);
    if (!stateStr) return;
    const state = JSON.parse(stateStr);
    
    Object.entries(features).forEach(([key, feature]) => {
      if (state[key] !== undefined) {
        feature.apply(state[key]);
      }
    });
  } catch (e) {
    console.error("hwcag: Failed to load state from localStorage", e);
  }
}

/**
 * Toggle panel visibility
 */
function togglePanel(): void {
  if (!panelElement || !buttonElement) return;

  // Trigger loading animation
  buttonElement.classList.add("loading");

  const isOpen = panelElement.classList.toggle("open");
  buttonElement.classList.toggle("active", isOpen);
  buttonElement.setAttribute("aria-expanded", String(isOpen));
  
  // Hide button when open
  if (isOpen) {
    buttonElement.style.setProperty("display", "none", "important");
  } else {
    buttonElement.style.setProperty("display", "flex", "important");
    buttonElement.classList.remove("loading");
  }
}

/**
 * Close panel
 */
function closePanel(): void {
  if (!panelElement || !buttonElement) return;

  panelElement.classList.remove("open");
  buttonElement.classList.remove("active");
  buttonElement.setAttribute("aria-expanded", "false");
  
  // Show button when closed
  buttonElement.style.setProperty("display", "flex", "important");
  buttonElement.classList.remove("loading");
}

/**
 * Handle click outside to close panel
 */
function handleClickOutside(e: MouseEvent): void {
  if (!panelElement || !buttonElement) return;

  const target = e.target as HTMLElement;
  
  // If the target is no longer in the document (e.g. removed during the click handler like in reset), ignore it
  if (!document.contains(target)) return;

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
 * Refresh the panel UI (used after reset)
 */
function refreshPanel(): void {
  if (!panelElement) return;

  const wasOpen = panelElement.classList.contains("open");
  const newPanel = createPanel(currentConfig);

  // Preserve open state
  if (wasOpen) {
    newPanel.classList.add("open");
    if (buttonElement) buttonElement.style.setProperty("display", "none", "important");
  }

  panelElement.replaceWith(newPanel);
  panelElement = newPanel;

  // Re-attach close button listener
  const closeBtn = panelElement.querySelector(".hwcag-panel-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }
}

/**
 * Show a snackbar message in the panel
 */
export function showSnackbar(message: string): void {
  if (!panelElement) return;
  const snackbar = document.createElement("div");
  snackbar.className = "hwcag-snackbar";
  snackbar.textContent = message;
  panelElement.appendChild(snackbar);
  
  requestAnimationFrame(() => {
    snackbar.classList.add("show");
  });
  
  setTimeout(() => {
    snackbar.classList.remove("show");
    setTimeout(() => snackbar.remove(), 300);
  }, 3000);
}

/**
 * Handle reset event from panel
 */
function handleResetEvent(): void {
  saveState();
  refreshPanel();
  showSnackbar("Accessibility settings reset successfully");
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
  panelElement = createPanel(currentConfig);

  // Set up event listeners
  buttonElement.addEventListener("click", togglePanel);

  const closeBtn = panelElement.querySelector(".hwcag-panel-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }

  // Load any previously saved state
  loadState();

  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("hwcag:reset", handleResetEvent);
  document.addEventListener("hwcag:stateChange", saveState);

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
  document.removeEventListener("hwcag:reset", handleResetEvent);
  document.removeEventListener("hwcag:stateChange", saveState);

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
  buttonElement.style.setProperty("display", "none", "important");
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
    if (buttonElement) buttonElement.style.setProperty("display", "none", "important");
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