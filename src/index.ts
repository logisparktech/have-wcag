/**
 * have-wcag - WCAG Accessibility Toolkit
 *
 * This package provides two main tools:
 * 1. Widget - End-user accessibility controls (for production)
 * 2. Auditor - Developer accessibility auditing tool (for development)
 */

// Import both modules
import * as widgetModule from "./widget";
import * as auditorModule from "./auditor";

// Re-export as namespaces
export const widget = widgetModule;
export const auditor = auditorModule;

// Export types
export type {
  WidgetConfig,
  WidgetTheme,
  WidgetFeature,
  WidgetPosition,
} from "./widget/types";
export type {
  HaveWcagConfig,
  AuditResults,
  WcagIssue,
  CheckType,
} from "./types";

// Default export with both modules
export default {
  widget: widgetModule.default,
  auditor: auditorModule.default,
};
