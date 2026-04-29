import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-text-alignment-styles";

type Alignment = "default" | "left" | "center" | "right" | "justify";

export const alignmentLabels: Record<Alignment, string> = {
  default: "Text Align (Default)",
  left: "Left Align",
  center: "Center Align",
  right: "Right Align",
  justify: "Justify Align",
};

const SVG_DEFAULT = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 6H3M15 12H3M21 18H3"/></svg>`;
const SVG_LEFT = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 6H3M15 12H3M17 18H3"/></svg>`;
const SVG_CENTER = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6H6M21 12H3M18 18H6"/></svg>`;
const SVG_RIGHT = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 6H3M21 12H9M21 18H7"/></svg>`;
const SVG_JUSTIFY = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 6H3M21 12H3M21 18H3"/></svg>`;

export const alignmentIcons: Record<Alignment, string> = {
  default: SVG_DEFAULT,
  left: SVG_LEFT,
  center: SVG_CENTER,
  right: SVG_RIGHT,
  justify: SVG_JUSTIFY,
};

let currentAlignment: Alignment = "default";

/**
 * Update the text alignment styles
 */
function updateStyles(): void {
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  if (currentAlignment === "default") {
    styleEl.textContent = "";
    return;
  }

  styleEl.textContent = `
    html.hwcag-text-align-${currentAlignment} *:not(.hwcag-widget):not(.hwcag-widget *) {
      text-align: ${currentAlignment} !important;
    }
  `;
}

/**
 * Apply text alignment
 */
function apply(alignment: Alignment): void {
  document.documentElement.classList.remove(
    "hwcag-text-align-left",
    "hwcag-text-align-center",
    "hwcag-text-align-right",
    "hwcag-text-align-justify"
  );

  currentAlignment = alignment;

  if (alignment !== "default") {
    document.documentElement.classList.add(`hwcag-text-align-${alignment}`);
  }

  updateStyles();
}

/**
 * Reset to default
 */
function reset(): void {
  apply("default");
}

/**
 * Cycle through alignments
 */
export function cycle(): Alignment {
  const alignments: Alignment[] = ["default", "left", "center", "right", "justify"];
  const currentIndex = alignments.indexOf(currentAlignment);
  const nextIndex = (currentIndex + 1) % alignments.length;
  apply(alignments[nextIndex]);
  return currentAlignment;
}

/**
 * Get current alignment
 */
export function getValue(): Alignment {
  return currentAlignment;
}

export const textAlignmentFeature: FeatureModule = {
  name: "textAlignment",
  label: "Text Alignment",
  icon: SVG_DEFAULT,
  type: "select",
  options: ["default", "left", "center", "right", "justify"],
  optionLabels: alignmentLabels,
  optionIcons: alignmentIcons,
  apply,
  reset,
};

export default textAlignmentFeature;
