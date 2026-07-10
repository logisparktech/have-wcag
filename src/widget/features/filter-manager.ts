const STYLE_ID = "hwcag-combined-filter-styles";
// Elements re-filtered with the same chain to cancel it back out (see recompute()).
const EXCLUDED_SELECTOR = `.hwcag-widget, .hwcag-ps-overlay, .hwcag-sr-controls, .hwcag-sr-hint, .hwcag-toolbar`;

const activeFilters = new Map<string, string>();

function recompute(): void {
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  if (activeFilters.size === 0) {
    styleEl.textContent = "";
    return;
  }

  const combined = Array.from(activeFilters.values()).join(" ");
  // The filter goes on <html> rather than individual `body > *` children.
  // `filter` (like `transform`) establishes a new containing block for any
  // `position: fixed`/`absolute` descendant. Putting it on arbitrary body
  // children (e.g. a framework's teleported dialog/portal root, which is
  // often an unstyled 0-size wrapper div) reparents that descendant's fixed
  // positioning to the wrapper's box instead of the viewport, collapsing
  // dialogs to nothing. <html>'s box always matches the viewport, so fixed
  // descendants are unaffected. The widget itself gets the identical filter
  // re-applied on top to cancel it back out (invert/hue-rotate are
  // self-inverting; a doubled brightness() is an acceptable rounding error).
  styleEl.textContent = `
    html { filter: ${combined} !important; }
    ${EXCLUDED_SELECTOR} { filter: ${combined} !important; }
  `;
}

export function setFilter(name: string, value: string): void {
  activeFilters.set(name, value);
  recompute();
}

export function clearFilter(name: string): void {
  activeFilters.delete(name);
  recompute();
}
