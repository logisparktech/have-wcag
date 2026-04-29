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
import {
  textSpacingFeature,
  increase as increaseTextSpacing,
  decrease as decreaseTextSpacing,
  getValue as getTextSpacingValue,
} from "./text-spacing";
import {
  hideImagesFeature,
  toggle as toggleHideImages,
  getValue as getHideImagesValue,
} from "./hide-images";
import {
  invertFeature,
  toggle as toggleInvert,
  getValue as getInvertValue,
} from "./invert";
import {
  textAlignmentFeature,
  cycle as cycleTextAlignment,
  getValue as getTextAlignmentValue,
} from "./text-alignment";
import {
  stopAnimationsFeature,
  toggle as toggleStopAnimations,
  getValue as getStopAnimationsValue,
} from "./stop-animations";
import {
  pageStructureFeature,
  toggle as togglePageStructure,
  getValue as getPageStructureValue,
} from "./page-structure";
import {
  screenReaderFeature,
  toggle as toggleScreenReader,
  getValue as getScreenReaderValue,
} from "./screen-reader";

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
  textSpacing: textSpacingFeature,
  hideImages: hideImagesFeature,
  invert: invertFeature,
  textAlignment: textAlignmentFeature,
  stopAnimations: stopAnimationsFeature,
  pageStructure: pageStructureFeature,
  screenReader: screenReaderFeature,
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
  textSpacing: {
    increase: increaseTextSpacing,
    decrease: decreaseTextSpacing,
    getValue: getTextSpacingValue,
    reset: textSpacingFeature.reset,
  },
  hideImages: {
    toggle: toggleHideImages,
    getValue: getHideImagesValue,
    reset: hideImagesFeature.reset,
  },
  invert: {
    toggle: toggleInvert,
    getValue: getInvertValue,
    reset: invertFeature.reset,
  },
  textAlignment: {
    cycle: cycleTextAlignment,
    getValue: getTextAlignmentValue,
    reset: textAlignmentFeature.reset,
  },
  stopAnimations: {
    toggle: toggleStopAnimations,
    getValue: getStopAnimationsValue,
    reset: stopAnimationsFeature.reset,
  },
  pageStructure: {
    toggle: togglePageStructure,
    getValue: getPageStructureValue,
    reset: pageStructureFeature.reset,
  },
  screenReader: {
    toggle: toggleScreenReader,
    getValue: getScreenReaderValue,
    reset: screenReaderFeature.reset,
  },
};

/**
 * Reset all features to default
 */
export function resetAll(): void {
  Object.keys(features).forEach((key) => {
    (features[key as WidgetFeature] as FeatureModule).reset();
  });
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
  textSpacingFeature,
  hideImagesFeature,
  invertFeature,
  textAlignmentFeature,
  stopAnimationsFeature,
  pageStructureFeature,
  screenReaderFeature,
};
