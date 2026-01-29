import {
  textSizeFeature,
  increase as increaseTextSize,
  decrease as decreaseTextSize,
  getValue as getTextSizeValue,
} from "./text-size";
import {
  contrastFeature,
  toggle as toggleContrast,
  getValue as getContrastValue,
} from "./contrast";
import {
  darkModeFeature,
  toggle as toggleDarkMode,
  getValue as getDarkModeValue,
} from "./dark-mode";
import {
  dyslexiaFontFeature,
  toggle as toggleDyslexiaFont,
  getValue as getDyslexiaFontValue,
} from "./dyslexia-font";
import {
  lineHeightFeature,
  increase as increaseLineHeight,
  decrease as decreaseLineHeight,
  getValue as getLineHeightValue,
} from "./line-height";
import {
  linkHighlightFeature,
  toggle as toggleLinkHighlight,
  getValue as getLinkHighlightValue,
} from "./link-highlight";
import {
  cursorSizeFeature,
  cycle as cycleCursorSize,
  getValue as getCursorSizeValue,
} from "./cursor-size";
import {
  readingGuideFeature,
  toggle as toggleReadingGuide,
  getValue as getReadingGuideValue,
} from "./reading-guide";

import type { FeatureModule, WidgetFeature } from "../types";

/**
 * All feature modules
 */
export const features: Record<WidgetFeature, FeatureModule> = {
  textSize: textSizeFeature,
  contrast: contrastFeature,
  darkMode: darkModeFeature,
  dyslexiaFont: dyslexiaFontFeature,
  lineHeight: lineHeightFeature,
  linkHighlight: linkHighlightFeature,
  cursorSize: cursorSizeFeature,
  readingGuide: readingGuideFeature,
};

/**
 * Feature actions for UI
 */
export const featureActions = {
  textSize: {
    increase: increaseTextSize,
    decrease: decreaseTextSize,
    getValue: getTextSizeValue,
    reset: textSizeFeature.reset,
  },
  contrast: {
    toggle: toggleContrast,
    getValue: getContrastValue,
    reset: contrastFeature.reset,
  },
  darkMode: {
    toggle: toggleDarkMode,
    getValue: getDarkModeValue,
    reset: darkModeFeature.reset,
  },
  dyslexiaFont: {
    toggle: toggleDyslexiaFont,
    getValue: getDyslexiaFontValue,
    reset: dyslexiaFontFeature.reset,
  },
  lineHeight: {
    increase: increaseLineHeight,
    decrease: decreaseLineHeight,
    getValue: getLineHeightValue,
    reset: lineHeightFeature.reset,
  },
  linkHighlight: {
    toggle: toggleLinkHighlight,
    getValue: getLinkHighlightValue,
    reset: linkHighlightFeature.reset,
  },
  cursorSize: {
    cycle: cycleCursorSize,
    getValue: getCursorSizeValue,
    reset: cursorSizeFeature.reset,
  },
  readingGuide: {
    toggle: toggleReadingGuide,
    getValue: getReadingGuideValue,
    reset: readingGuideFeature.reset,
  },
};

/**
 * Reset all features to default
 */
export function resetAll(): void {
  Object.values(features).forEach((feature) => feature.reset());
}

export {
  textSizeFeature,
  contrastFeature,
  darkModeFeature,
  dyslexiaFontFeature,
  lineHeightFeature,
  linkHighlightFeature,
  cursorSizeFeature,
  readingGuideFeature,
};
