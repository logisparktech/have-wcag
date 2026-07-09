import type { WidgetConfig, WidgetPosition } from "./types";
import { DEFAULT_CONFIG } from "./types";
import { createButton } from "./ui/button";
import { createPanel, getPanelStyles } from "./ui/panel";
import { resetAll, featureActions, features } from "./features";
import { announce } from "./features/screen-reader";

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
    if (!features[key as keyof typeof features]?.transient) {
      state[key] = (actions as any).getValue();
    }
  });
  return state;
}

/**
 * Save current state (features + position) to localStorage
 */
function saveState(): void {
  try {
    const state = getCurrentState();
    state.__position = currentConfig.position ?? DEFAULT_CONFIG.position;
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("hwcag: Failed to save state to localStorage", e);
  }
}

/**
 * Load state from localStorage — must run before button/panel are created
 * so that currentConfig.position is correct at creation time.
 */
function loadState(): void {
  try {
    const stateStr = localStorage.getItem(STATE_KEY);
    if (!stateStr) return;
    const state = JSON.parse(stateStr);

    // Restore position into config before elements are created
    if (state.__position) {
      currentConfig = {
        ...currentConfig,
        position: state.__position as WidgetPosition,
      };
    }

    Object.entries(features).forEach(([key, feature]) => {
      if (!feature.transient && state[key] !== undefined) {
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

  buttonElement.classList.add("loading");

  const isOpen = panelElement.classList.toggle("open");
  buttonElement.classList.toggle("active", isOpen);
  buttonElement.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    buttonElement.style.setProperty("display", "none", "important");
    announce("Accessibility menu opened");
  } else {
    buttonElement.style.setProperty("display", "flex", "important");
    buttonElement.classList.remove("loading");
    announce("Accessibility menu closed");
  }
}

/**
 * Close panel
 */
function closePanel(): void {
  if (!panelElement || !buttonElement) return;

  const wasOpen = panelElement.classList.contains("open");

  panelElement.classList.remove("open");
  buttonElement.classList.remove("active");
  buttonElement.setAttribute("aria-expanded", "false");

  buttonElement.style.setProperty("display", "flex", "important");
  buttonElement.classList.remove("loading");

  if (wasOpen) announce("Accessibility menu closed");
}

/**
 * Move widget to the opposite horizontal side.
 * Closes the panel, switches side, then reopens it.
 */
function moveWidget(): void {
  if (!panelElement || !buttonElement) return;

  const currentPos = (currentConfig.position ?? DEFAULT_CONFIG.position) as string;
  const isRight = currentPos.includes("right");
  const vertical = currentPos.includes("top") ? "top" : "bottom";
  const newSide = isRight ? "left" : "right";
  const newPosition = `${vertical}-${newSide}` as WidgetPosition;

  const wasOpen = panelElement.classList.contains("open");

  // Close the panel so it slides out on the current side
  panelElement.classList.remove("open");
  buttonElement.style.setProperty("display", "flex", "important");
  buttonElement.classList.remove("loading");

  // After the slide-out animation (~350ms), apply the new position
  setTimeout(() => {
    currentConfig = { ...currentConfig, position: newPosition };

    // Update panel CSS (border-radius, side anchoring, slide direction)
    const panelStyle = document.getElementById(
      "hwcag-widget-panel-styles",
    ) as HTMLStyleElement | null;
    if (panelStyle) {
      panelStyle.textContent = getPanelStyles(newPosition);
    }

    // Move the button: clear the old side property and set the new one
    if (buttonElement) {
      buttonElement.style.removeProperty(isRight ? "right" : "left");
      buttonElement.style.setProperty(newSide, "24px", "important");
    }

    // Update move-button icon and label in the (still-mounted) panel
    if (panelElement) {
      const moveBtn = panelElement.querySelector(
        ".hwcag-panel-move",
      ) as HTMLElement | null;
      if (moveBtn) {
        const nextTarget = newSide === "left" ? "right" : "left";
        moveBtn.setAttribute("aria-label", `Move widget to the ${nextTarget}`);
        moveBtn.setAttribute("title", `Move widget to the ${nextTarget}`);
        const { getMoveIcon: icon } = _iconHelpers;
        moveBtn.innerHTML = icon(nextTarget);
      }
    }

    announce(`Widget moved to the ${newSide}`);

    // Reopen if it was open before
    if (wasOpen && panelElement) {
      panelElement.classList.add("open");
      buttonElement?.style.setProperty("display", "none", "important");
    }

    saveState();
  }, 360);
}

// Helper to avoid importing getMoveIcon into this file (keeps the reference stable)
const _iconHelpers = {
  getMoveIcon(toSide: "left" | "right"): string {
    if (toSide === "left") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/></svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 7l5 5-5 5"/><path d="M6 7l5 5-5 5"/></svg>`;
  },
};

/**
 * Handle click outside to close panel
 */
function handleClickOutside(e: MouseEvent): void {
  if (!panelElement || !buttonElement) return;

  const target = e.target as HTMLElement;
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
  const newPanel = createPanel(currentConfig, moveWidget);

  if (wasOpen) {
    newPanel.classList.add("open");
    if (buttonElement)
      buttonElement.style.setProperty("display", "none", "important");
  }

  panelElement.replaceWith(newPanel);
  panelElement = newPanel;

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

  // loadState may update currentConfig.position before elements are created
  loadState();

  buttonElement = createButton(currentConfig);
  panelElement = createPanel(currentConfig, moveWidget);

  buttonElement.addEventListener("click", togglePanel);

  const closeBtn = panelElement.querySelector(".hwcag-panel-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }

  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("hwcag:reset", handleResetEvent);
  document.addEventListener("hwcag:stateChange", saveState);

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

  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscapeKey);
  document.removeEventListener("hwcag:reset", handleResetEvent);
  document.removeEventListener("hwcag:stateChange", saveState);

  resetAll();

  buttonElement?.remove();
  panelElement?.remove();

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
  announce("Accessibility menu opened");
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

  if (panelElement?.classList.contains("open")) {
    const newPanel = createPanel(currentConfig, moveWidget);
    newPanel.classList.add("open");
    if (buttonElement)
      buttonElement.style.setProperty("display", "none", "important");
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
