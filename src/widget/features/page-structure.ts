import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-page-structure-styles";

const PAGE_STRUCTURE_CSS = `
  /* Modal overlay */
  .hwcag-ps-overlay {
    position: fixed !important;
    inset: 0 !important;
    z-index: 1000002 !important;
    background: rgba(0, 0, 0, 0.45) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    animation: hwcag-ps-fade-in 0.2s ease !important;
    pointer-events: auto !important;
  }

  /* Modal panel */
  .hwcag-ps-modal {
    background: #ffffff !important;
    border-radius: 18px !important;
    width: 90vw !important;
    max-width: 500px !important;
    max-height: 75vh !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.1) !important;
    animation: hwcag-ps-scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    overflow: hidden !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    color: #1e2329 !important;
  }

  /* Modal header */
  .hwcag-ps-header {
    background: #045fc1 !important;
    color: white !important;
    padding: 16px 20px !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex-shrink: 0 !important;
  }
  .hwcag-ps-header-title {
    flex: 1 !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    margin: 0 !important;
    letter-spacing: -0.01em !important;
  }
  .hwcag-ps-close {
    background: rgba(255, 255, 255, 0.15) !important;
    border: none !important;
    color: white !important;
    width: 34px !important;
    height: 34px !important;
    border-radius: 9px !important;
    cursor: pointer !important;
    font-size: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background 0.15s !important;
    flex-shrink: 0 !important;
    line-height: 1 !important;
  }
  .hwcag-ps-close:hover {
    background: rgba(255, 255, 255, 0.28) !important;
  }

  /* Tabs */
  .hwcag-ps-tabs {
    display: flex !important;
    border-bottom: 1px solid #e5e7eb !important;
    flex-shrink: 0 !important;
    padding: 0 12px !important;
    background: #f9fafb !important;
  }
  .hwcag-ps-tab {
    padding: 10px 16px !important;
    border: none !important;
    background: transparent !important;
    color: #6b7280 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    border-bottom: 2px solid transparent !important;
    transition: color 0.15s, border-color 0.15s !important;
    font-family: inherit !important;
    white-space: nowrap !important;
  }
  .hwcag-ps-tab:hover {
    color: #045fc1 !important;
  }
  .hwcag-ps-tab.active {
    color: #045fc1 !important;
    border-bottom-color: #045fc1 !important;
  }

  /* Tree content */
  .hwcag-ps-content {
    flex: 1 !important;
    overflow-y: auto !important;
    padding: 8px 0 !important;
  }
  .hwcag-ps-content::-webkit-scrollbar {
    width: 4px;
  }
  .hwcag-ps-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .hwcag-ps-content::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }

  /* Tree node */
  .hwcag-ps-node {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 8px 16px !important;
    cursor: pointer !important;
    transition: background 0.12s !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
    border: none !important;
    background: transparent !important;
    width: 100% !important;
    text-align: left !important;
    font-family: inherit !important;
    color: #1e2329 !important;
  }
  .hwcag-ps-node:hover {
    background: #eff6ff !important;
  }
  .hwcag-ps-node:focus {
    outline: 2px solid #045fc1 !important;
    outline-offset: -2px !important;
  }

  .hwcag-ps-node-icon {
    flex-shrink: 0 !important;
    width: 20px !important;
    height: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 13px !important;
  }
  .hwcag-ps-node-tag {
    flex-shrink: 0 !important;
    background: #e0e7ff !important;
    color: #3b5998 !important;
    padding: 1px 6px !important;
    border-radius: 4px !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
  }
  .hwcag-ps-node-tag.landmark {
    background: #dcfce7 !important;
    color: #16a34a !important;
  }
  .hwcag-ps-node-tag.link {
    background: #fef3c7 !important;
    color: #d97706 !important;
  }
  .hwcag-ps-node-text {
    flex: 1 !important;
    min-width: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    color: #374151 !important;
  }

  /* Empty state */
  .hwcag-ps-empty {
    padding: 32px 20px !important;
    text-align: center !important;
    color: #9ca3af !important;
    font-size: 13px !important;
  }

  /* Scroll highlight on target element */
  .hwcag-ps-scroll-target {
    outline: 3px solid #045fc1 !important;
    outline-offset: 4px !important;
    transition: outline-color 0.3s !important;
  }

  /* Footer count */
  .hwcag-ps-footer {
    padding: 10px 16px !important;
    border-top: 1px solid #e5e7eb !important;
    font-size: 11px !important;
    color: #9ca3af !important;
    flex-shrink: 0 !important;
    background: #f9fafb !important;
    text-align: center !important;
  }

  @keyframes hwcag-ps-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes hwcag-ps-scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

// Types for tree nodes
interface TreeNode {
  type: "heading" | "landmark" | "link";
  tag: string;
  text: string;
  depth: number;
  element: Element;
}

let isModalOpen = false;
let overlayEl: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let activeTab = "all";
let cachedNodes: TreeNode[] = [];
let scrollHighlightTimeout: ReturnType<typeof setTimeout> | null = null;

const HEADING_TAGS = ["H1", "H2", "H3", "H4", "H5", "H6"];
const LANDMARK_TAGS = ["HEADER", "NAV", "MAIN", "ASIDE", "FOOTER", "SECTION", "ARTICLE"];

/**
 * Inject styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = PAGE_STRUCTURE_CSS;
  document.head.appendChild(style);
}

/**
 * Scan the page and build tree nodes
 */
function scanPage(): TreeNode[] {
  const nodes: TreeNode[] = [];

  // Scan headings
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((el) => {
    if (el.closest(".hwcag-widget") || el.closest(".hwcag-ps-overlay")) return;
    const level = parseInt(el.tagName.charAt(1));
    const text = el.textContent?.trim() || "";
    if (text) {
      nodes.push({
        type: "heading",
        tag: el.tagName,
        text,
        depth: level - 1,
        element: el,
      });
    }
  });

  // Scan landmarks
  const landmarks = document.querySelectorAll(
    "header, nav, main, aside, footer, section, article"
  );
  landmarks.forEach((el) => {
    if (el.closest(".hwcag-widget") || el.closest(".hwcag-ps-overlay")) return;
    const label =
      el.getAttribute("aria-label") ||
      el.getAttribute("aria-labelledby") ||
      el.querySelector("h1, h2, h3, h4, h5, h6")?.textContent?.trim() ||
      "";
    const displayText = label || `<${el.tagName.toLowerCase()}>`;
    nodes.push({
      type: "landmark",
      tag: el.tagName,
      text: displayText,
      depth: 0,
      element: el,
    });
  });

  // Scan links
  const links = document.querySelectorAll("a[href]");
  links.forEach((el) => {
    if (el.closest(".hwcag-widget") || el.closest(".hwcag-ps-overlay")) return;
    const text = el.textContent?.trim() || "";
    if (text) {
      nodes.push({
        type: "link",
        tag: "A",
        text,
        depth: 0,
        element: el,
      });
    }
  });

  return nodes;
}

/**
 * Get icon for node type
 */
function getNodeIcon(node: TreeNode): string {
  if (node.type === "heading") return "📄";
  if (node.type === "landmark") return "🏷️";
  return "🔗";
}

/**
 * Filter nodes based on active tab
 */
function getFilteredNodes(): TreeNode[] {
  if (activeTab === "all") return cachedNodes;
  return cachedNodes.filter((n) => {
    if (activeTab === "headings") return n.type === "heading";
    if (activeTab === "landmarks") return n.type === "landmark";
    if (activeTab === "links") return n.type === "link";
    return true;
  });
}

/**
 * Scroll to element and briefly highlight it
 */
function scrollToElement(el: Element): void {
  // Clear previous highlight
  if (scrollHighlightTimeout) {
    clearTimeout(scrollHighlightTimeout);
    document.querySelectorAll(".hwcag-ps-scroll-target").forEach((e) => {
      e.classList.remove("hwcag-ps-scroll-target");
    });
  }

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("hwcag-ps-scroll-target");

  scrollHighlightTimeout = setTimeout(() => {
    el.classList.remove("hwcag-ps-scroll-target");
  }, 2000);
}

/**
 * Render tree nodes into the content container
 */
function renderTree(container: HTMLElement): void {
  container.innerHTML = "";
  const filtered = getFilteredNodes();

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "hwcag-ps-empty";
    empty.textContent = `No ${activeTab === "all" ? "structural elements" : activeTab} found on this page.`;
    container.appendChild(empty);
    return;
  }

  filtered.forEach((node) => {
    const btn = document.createElement("button");
    btn.className = "hwcag-ps-node";
    btn.style.paddingLeft = `${16 + node.depth * 20}px`;

    const icon = document.createElement("span");
    icon.className = "hwcag-ps-node-icon";
    icon.textContent = getNodeIcon(node);

    const tag = document.createElement("span");
    tag.className = `hwcag-ps-node-tag${node.type === "landmark" ? " landmark" : ""}${node.type === "link" ? " link" : ""}`;
    tag.textContent = node.tag;

    const text = document.createElement("span");
    text.className = "hwcag-ps-node-text";
    text.textContent = node.text;

    btn.appendChild(icon);
    btn.appendChild(tag);
    btn.appendChild(text);

    btn.addEventListener("click", () => {
      scrollToElement(node.element);
    });

    container.appendChild(btn);
  });
}

/**
 * Update footer count
 */
function updateFooter(footerEl: HTMLElement): void {
  const headings = cachedNodes.filter((n) => n.type === "heading").length;
  const landmarks = cachedNodes.filter((n) => n.type === "landmark").length;
  const links = cachedNodes.filter((n) => n.type === "link").length;
  footerEl.textContent = `${headings} headings · ${landmarks} landmarks · ${links} links`;
}

/**
 * Open the page structure modal
 */
function openModal(): void {
  if (isModalOpen) return;
  injectStyles();

  isModalOpen = true;
  cachedNodes = scanPage();

  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "hwcag-widget hwcag-ps-overlay";
  overlayEl = overlay;

  // Modal
  const modal = document.createElement("div");
  modal.className = "hwcag-ps-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Page Structure");

  // Header
  const header = document.createElement("div");
  header.className = "hwcag-ps-header";

  const title = document.createElement("h2");
  title.className = "hwcag-ps-header-title";
  title.textContent = "Page Structure";

  const closeBtn = document.createElement("button");
  closeBtn.className = "hwcag-ps-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Close page structure");
  closeBtn.addEventListener("click", closeModal);

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Tabs
  const tabsWrap = document.createElement("div");
  tabsWrap.className = "hwcag-ps-tabs";

  const tabDefs = [
    { id: "all", label: "All" },
    { id: "headings", label: "Headings" },
    { id: "landmarks", label: "Landmarks" },
    { id: "links", label: "Links" },
  ];

  const treeContent = document.createElement("div");
  treeContent.className = "hwcag-ps-content";

  tabDefs.forEach((def) => {
    const tab = document.createElement("button");
    tab.className = `hwcag-ps-tab${def.id === activeTab ? " active" : ""}`;
    tab.textContent = def.label;
    tab.addEventListener("click", () => {
      activeTab = def.id;
      tabsWrap.querySelectorAll(".hwcag-ps-tab").forEach((t) =>
        t.classList.toggle("active", t === tab)
      );
      renderTree(treeContent);
    });
    tabsWrap.appendChild(tab);
  });

  // Footer
  const footer = document.createElement("div");
  footer.className = "hwcag-ps-footer";
  updateFooter(footer);

  // Render tree
  renderTree(treeContent);

  // Assemble
  modal.appendChild(header);
  modal.appendChild(tabsWrap);
  modal.appendChild(treeContent);
  modal.appendChild(footer);
  overlay.appendChild(modal);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.body.appendChild(overlay);

  // Escape key
  document.addEventListener("keydown", handleEscape);

  // Set up MutationObserver for auto-updating
  observer = new MutationObserver(() => {
    if (!isModalOpen) return;
    cachedNodes = scanPage();
    renderTree(treeContent);
    updateFooter(footer);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Focus the close button
  closeBtn.focus();
}

/**
 * Close the page structure modal
 */
function closeModal(): void {
  if (!isModalOpen) return;
  isModalOpen = false;

  // Remove highlight
  if (scrollHighlightTimeout) clearTimeout(scrollHighlightTimeout);
  document.querySelectorAll(".hwcag-ps-scroll-target").forEach((e) => {
    e.classList.remove("hwcag-ps-scroll-target");
  });

  // Disconnect observer
  observer?.disconnect();
  observer = null;

  // Remove overlay
  overlayEl?.remove();
  overlayEl = null;

  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    closeModal();
  }
}

// ---- Feature module interface ----
// page structure is now a "toggle" that opens/closes the modal

let isEnabled = false;

/**
 * Apply page structure (toggle open modal)
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  if (enabled) {
    openModal();
  } else {
    closeModal();
  }
}

/**
 * Reset to default
 */
function reset(): void {
  isEnabled = false;
  closeModal();
}

/**
 * Toggle page structure
 */
export function toggle(): boolean {
  // Always open fresh (toggle: if open, close; if closed, open)
  if (isModalOpen) {
    closeModal();
    isEnabled = false;
  } else {
    openModal();
    isEnabled = true;
  }
  return isEnabled;
}

/**
 * Get current state
 */
export function getValue(): boolean {
  return isEnabled;
}

const LAYERS_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;

export const pageStructureFeature: FeatureModule = {
  name: "pageStructure",
  label: "Page Structure",
  icon: LAYERS_SVG,
  type: "toggle",
  apply,
  reset,
};

export default pageStructureFeature;
