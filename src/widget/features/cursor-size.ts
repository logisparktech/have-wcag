import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-cursor-size-styles";

type CursorSize = "small" | "medium" | "large";

const CURSOR_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2z"/></svg>`;

// SVG cursors for different sizes
const CURSORS: Record<CursorSize, string> = {
  small: "", // default browser cursor
  medium: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M4 4 L4 28 L11 21 L17 30 L21 28 L15 19 L24 19 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 4 4, auto`,
  large: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M6 6 L6 42 L16.5 31.5 L25.5 45 L31.5 42 L22.5 28.5 L36 28.5 Z' fill='black' stroke='white' stroke-width='3'/%3E%3C/svg%3E") 6 6, auto`,
};

const cursorLabels: Record<CursorSize, string> = {
  small: "Default Cursor",
  medium: "Medium Cursor",
  large: "Big Cursor",
};

const cursorIcons: Record<CursorSize, string> = {
  small: CURSOR_SVG,
  medium: CURSOR_SVG,
  large: CURSOR_SVG,
};

let currentSize: CursorSize = "small";

/**
 * Inject or update cursor styles
 */
function updateStyles(): void {
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  if (currentSize === "small") {
    styleEl.textContent = "";
    return;
  }

  styleEl.textContent = `
    html.hwcag-cursor-${currentSize},
    html.hwcag-cursor-${currentSize} * {
      cursor: ${CURSORS[currentSize]} !important;
    }
    html.hwcag-cursor-${currentSize} a,
    html.hwcag-cursor-${currentSize} button,
    html.hwcag-cursor-${currentSize} [role="button"],
    html.hwcag-cursor-${currentSize} input[type="submit"],
    html.hwcag-cursor-${currentSize} input[type="button"] {
      cursor: ${CURSORS[currentSize].replace("auto", "pointer")} !important;
    }
  `;
}

/**
 * Apply cursor size
 */
function apply(size: CursorSize): void {
  // Remove previous class
  document.documentElement.classList.remove(
    "hwcag-cursor-small",
    "hwcag-cursor-medium",
    "hwcag-cursor-large",
  );

  currentSize = size;

  if (size !== "small") {
    document.documentElement.classList.add(`hwcag-cursor-${size}`);
  }

  updateStyles();
}

/**
 * Reset to default
 */
function reset(): void {
  currentSize = "small";
  document.documentElement.classList.remove(
    "hwcag-cursor-small",
    "hwcag-cursor-medium",
    "hwcag-cursor-large",
  );
  const styleEl = document.getElementById(STYLE_ID);
  if (styleEl) styleEl.textContent = "";
}

/**
 * Cycle through cursor sizes
 */
export function cycle(): CursorSize {
  const sizes: CursorSize[] = ["small", "medium", "large"];
  const currentIndex = sizes.indexOf(currentSize);
  const nextIndex = (currentIndex + 1) % sizes.length;
  apply(sizes[nextIndex]);
  return currentSize;
}

/**
 * Get current size
 */
export function getValue(): CursorSize {
  return currentSize;
}

export const cursorSizeFeature: FeatureModule = {
  name: "cursorSize",
  label: "Cursor Size",
  icon: CURSOR_SVG,
  type: "select",
  options: ["small", "medium", "large"],
  optionLabels: cursorLabels,
  optionIcons: cursorIcons,
  apply,
  reset,
};

export default cursorSizeFeature;
