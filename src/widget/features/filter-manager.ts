const STYLE_ID = "hwcag-combined-filter-styles";
const SELECTOR = `body > *:not(.hwcag-widget):not(.hwcag-ps-overlay):not(.hwcag-sr-controls):not(.hwcag-sr-hint):not(.hwcag-toolbar)`;

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
  styleEl.textContent = `${SELECTOR} { filter: ${combined} !important; }`;
}

export function setFilter(name: string, value: string): void {
  activeFilters.set(name, value);
  recompute();
}

export function clearFilter(name: string): void {
  activeFilters.delete(name);
  recompute();
}
