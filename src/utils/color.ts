// Color utility functions for contrast calculation

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

/**
 * Parse any CSS color string to RGBA values
 */
export function parseColor(color: string): RGBA {
  // Handle rgb/rgba format
  const rgbaMatch = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  );
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
    };
  }

  // Handle hex format
  const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16),
      a: 1,
    };
  }

  // Handle shorthand hex
  const shortHexMatch = color.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
  if (shortHexMatch) {
    return {
      r: parseInt(shortHexMatch[1] + shortHexMatch[1], 16),
      g: parseInt(shortHexMatch[2] + shortHexMatch[2], 16),
      b: parseInt(shortHexMatch[3] + shortHexMatch[3], 16),
      a: 1,
    };
  }

  // Default to black if parsing fails
  return { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * Convert RGB to relative luminance
 * Using WCAG formula: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * Returns value between 1 and 21
 */
export function getContrastRatio(color1: RGB, color2: RGB): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Blend a semi-transparent color over a background
 */
export function blendColors(foreground: RGBA, background: RGB): RGB {
  const alpha = foreground.a;
  return {
    r: Math.round(foreground.r * alpha + background.r * (1 - alpha)),
    g: Math.round(foreground.g * alpha + background.g * (1 - alpha)),
    b: Math.round(foreground.b * alpha + background.b * (1 - alpha)),
  };
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Suggest an accessible color by adjusting lightness
 * Tries to maintain the hue while meeting contrast requirements
 */
export function suggestAccessibleColor(
  textColor: RGB,
  backgroundColor: RGB,
  requiredRatio: number,
): RGB {
  const bgLuminance = getLuminance(backgroundColor);
  let adjusted = { ...textColor };

  // Determine if we should darken or lighten
  const textLuminance = getLuminance(textColor);
  const shouldDarken = textLuminance > bgLuminance;

  // Iteratively adjust until we meet the ratio
  for (let i = 0; i < 100; i++) {
    const currentRatio = getContrastRatio(adjusted, backgroundColor);
    if (currentRatio >= requiredRatio) break;

    if (shouldDarken) {
      adjusted.r = Math.max(0, adjusted.r - 3);
      adjusted.g = Math.max(0, adjusted.g - 3);
      adjusted.b = Math.max(0, adjusted.b - 3);
    } else {
      adjusted.r = Math.min(255, adjusted.r + 3);
      adjusted.g = Math.min(255, adjusted.g + 3);
      adjusted.b = Math.min(255, adjusted.b + 3);
    }
  }

  return adjusted;
}
