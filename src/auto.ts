/**
 * Auto-initializing entry point for script tag usage
 * This file is bundled separately and self-executes
 *
 * By default, only initializes the widget.
 * Auditor must be explicitly enabled via config.
 */
import { widget, auditor } from "./index";

interface AutoConfig {
  widget?: {
    enabled?: boolean;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    theme?: Record<string, string>;
  };
  auditor?: {
    enabled?: boolean;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    level?: "A" | "AA" | "AAA";
  };
}

// Auto-initialize when script loads
function autoInit(): void {
  const config: AutoConfig = (window as any).HAVE_WCAG_CONFIG || {};

  // Widget is enabled by default
  const widgetEnabled = config.widget?.enabled !== false;

  // Auditor is disabled by default (dev only)
  const auditorEnabled = config.auditor?.enabled === true;

  if (widgetEnabled) {
    widget.init({
      position: config.widget?.position || "bottom-right",
      theme: config.widget?.theme,
    });
  }

  if (auditorEnabled) {
    // Position auditor on opposite side if both are enabled
    const auditorPosition =
      config.auditor?.position ||
      (widgetEnabled ? "bottom-left" : "bottom-right");

    auditor.init({
      showToolbar: true,
      level: config.auditor?.level || "AA",
    });
  }

  // Expose global API
  (window as any).haveWcag = {
    widget,
    auditor,
  };
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoInit);
} else {
  autoInit();
}
