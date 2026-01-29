import type { FeatureModule } from "../types";

const GUIDE_ID = "hwcag-reading-guide";
const STYLE_ID = "hwcag-reading-guide-styles";

const GUIDE_CSS = `
  #${GUIDE_ID} {
    position: fixed;
    left: 0;
    width: 100%;
    height: 40px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.15) 0%,
      rgba(255, 255, 0, 0.3) 50%,
      rgba(255, 255, 0, 0.15) 100%
    );
    pointer-events: none;
    z-index: 999997;
    border-top: 2px solid rgba(255, 200, 0, 0.5);
    border-bottom: 2px solid rgba(255, 200, 0, 0.5);
    transform: translateY(-50%);
    transition: top 0.05s ease-out;
  }
`;

let isEnabled = false;
let guideElement: HTMLElement | null = null;

/**
 * Handle mouse movement
 */
function handleMouseMove(e: MouseEvent): void {
  if (guideElement) {
    guideElement.style.top = `${e.clientY}px`;
  }
}

/**
 * Inject reading guide styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = GUIDE_CSS;
  document.head.appendChild(style);
}

/**
 * Create the guide element
 */
function createGuide(): void {
  if (guideElement) return;

  guideElement = document.createElement("div");
  guideElement.id = GUIDE_ID;
  document.body.appendChild(guideElement);
}

/**
 * Remove the guide element
 */
function removeGuide(): void {
  if (guideElement) {
    guideElement.remove();
    guideElement = null;
  }
}

/**
 * Apply reading guide
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    createGuide();
    document.addEventListener("mousemove", handleMouseMove);
  } else {
    removeGuide();
    document.removeEventListener("mousemove", handleMouseMove);
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  removeGuide();
  document.removeEventListener("mousemove", handleMouseMove);
}

/**
 * Toggle reading guide
 */
export function toggle(): boolean {
  apply(!isEnabled);
  return isEnabled;
}

/**
 * Get current state
 */
export function getValue(): boolean {
  return isEnabled;
}

export const readingGuideFeature: FeatureModule = {
  name: "readingGuide",
  label: "Reading Guide",
  icon: "―",
  type: "toggle",
  apply,
  reset,
};

export default readingGuideFeature;
