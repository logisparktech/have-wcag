/**
 * Widget position options
 */
export type WidgetPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

/**
 * Available widget features
 */
export type WidgetFeature =
  | "textSize"
  | "contrast"
  | "darkMode"
  | "dyslexiaFont"
  | "lineHeight"
  | "linkHighlight"
  | "cursorSize"
  | "readingGuide"
  | "textSpacing"
  | "hideImages"
  | "invert"
  | "textAlignment"
  | "stopAnimations"
  | "pageStructure"
  | "screenReader";

/**
 * Theme configuration for the widget
 */
export interface WidgetTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: string;
}

/**
 * Widget configuration options
 */
export interface WidgetConfig {
  position?: WidgetPosition;
  features?: WidgetFeature[];
  theme?: WidgetTheme;
  buttonLabel?: string;
  panelTitle?: string;
}

/**
 * Current state of all widget features
 */
export interface WidgetState {
  textSize: number; // 0 = default, positive = larger, negative = smaller
  contrast: boolean; // high contrast mode
  darkMode: boolean; // dark mode
  dyslexiaFont: boolean; // dyslexia-friendly font
  lineHeight: number; // 0 = default, positive = larger, negative = smaller
  linkHighlight: boolean; // highlight all links
  cursorSize: "small" | "medium" | "large";
  readingGuide: boolean; // reading guide/ruler
  textSpacing: number; // 0 = default, positive = larger spacing, negative = smaller spacing
  hideImages: boolean; // hide images
  invert: boolean; // invert colors
  textAlignment: "default" | "left" | "center" | "right" | "justify";
  stopAnimations: boolean;
  pageStructure: boolean;
  screenReader: boolean;
}

/**
 * Feature module interface
 */
export interface FeatureModule {
  name: WidgetFeature;
  label: string;
  icon: string;
  type: "toggle" | "stepper" | "select";
  options?: string[]; // For 'select' type
  optionLabels?: Record<string, string>; // Display labels for options
  optionIcons?: Record<string, string>; // Display icons for options
  apply: (value: any) => void;
  reset: () => void;
}

/**
 * Default widget configuration
 */
export const DEFAULT_CONFIG: Required<WidgetConfig> = {
  position: "bottom-right",
  features: [
    "textSize",
    "contrast",
    "darkMode",
    "dyslexiaFont",
    "lineHeight",
    "linkHighlight",
    "cursorSize",
    "readingGuide",
    "textSpacing",
    "hideImages",
    "invert",
    "textAlignment",
    "stopAnimations",
    "pageStructure",
    "screenReader",
  ],
  theme: {
    primaryColor: "#045fc1",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    accentColor: "#233bb9",
    borderRadius: "12px",
  },
  buttonLabel: "Accessibility Options",
  panelTitle: "Accessibility Settings",
};

/**
 * Default widget state
 */
export const DEFAULT_STATE: WidgetState = {
  textSize: 0,
  contrast: false,
  darkMode: false,
  dyslexiaFont: false,
  lineHeight: 0,
  linkHighlight: false,
  cursorSize: "small",
  readingGuide: false,
  textSpacing: 0,
  hideImages: false,
  invert: false,
  textAlignment: "default",
  stopAnimations: false,
  pageStructure: false,
  screenReader: false,
};
