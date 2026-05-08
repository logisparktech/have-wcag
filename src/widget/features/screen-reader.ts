import type { FeatureModule } from "../types";

const STYLE_ID = "hwcag-screen-reader-styles";

const SCREEN_READER_CSS = `
  .hwcag-sr-highlight {
    outline: 3px solid #f5d623 !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 6px rgba(245, 214, 35, 0.3) !important;
    transition: outline 0.2s ease, box-shadow 0.2s ease !important;
    border-radius: 3px !important;
  }

  .hwcag-sr-controls {
    position: fixed !important;
    bottom: 24px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 1000001 !important;
    background: #1e293b !important;
    color: #f1f5f9 !important;
    border-radius: 16px !important;
    padding: 10px 20px !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 13px !important;
    backdrop-filter: blur(12px) !important;
    animation: hwcag-sr-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    pointer-events: auto !important;
  }

  .hwcag-sr-controls-btn {
    background: rgba(255, 255, 255, 0.1) !important;
    border: none !important;
    color: #f1f5f9 !important;
    width: 36px !important;
    height: 36px !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background 0.15s !important;
    flex-shrink: 0 !important;
  }
  .hwcag-sr-controls-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
  }
  .hwcag-sr-controls-btn svg {
    width: 18px !important;
    height: 18px !important;
  }

  .hwcag-sr-status {
    font-size: 12px !important;
    color: white !important;
    min-width: 90px !important;
    text-align: center !important;
    white-space: nowrap !important;
  }
  .hwcag-sr-status.reading {
    color: white !important;
  }

  .hwcag-sr-speed {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    font-size: 12px !important;
    color: #94a3b8 !important;
  }
  .hwcag-sr-speed-label {
    font-weight: 600 !important;
    color: #e2e8f0 !important;
    min-width: 32px !important;
    text-align: center !important;
  }

  .hwcag-sr-divider {
    width: 1px !important;
    height: 24px !important;
    background: rgba(255, 255, 255, 0.12) !important;
    flex-shrink: 0 !important;
  }

  .hwcag-sr-hint {
    position: fixed !important;
    bottom: 80px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 1000001 !important;
    background: #1e293b !important;
    color: white !important;
    border-radius: 10px !important;
    padding: 8px 16px !important;
    font-size: 12px !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
    animation: hwcag-sr-fade-in 0.3s ease !important;
    pointer-events: none !important;
  }

  @keyframes hwcag-sr-slide-up {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @keyframes hwcag-sr-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// SVG icons for the control bar
const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const STOP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>`;
const SPEED_DOWN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const SPEED_UP_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

let isEnabled = false;
let currentHighlight: HTMLElement | null = null;
let controlBar: HTMLElement | null = null;
let hintEl: HTMLElement | null = null;
let speechRate = 1.0;
let isPaused = false;
let hintTimeout: ReturnType<typeof setTimeout> | null = null;
let readGeneration = 0; // tracks active read session to prevent stale callbacks

// Block-level text containers to detect
const TEXT_CONTAINERS = [
  "P", "LI", "H1", "H2", "H3", "H4", "H5", "H6",
  "TD", "TH", "BLOCKQUOTE", "DD", "DT", "FIGCAPTION",
  "LABEL", "PRE", "SUMMARY", "CAPTION", "A", "BUTTON", "IMG"
];

/**
 * Compute the accessible name for an element
 */
function getAccessibleName(el: HTMLElement): string {
  // 1. aria-labelledby
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const labelEl = document.getElementById(labelledby.split(' ')[0]);
    if (labelEl) {
      const labelName = getAccessibleName(labelEl);
      if (labelName) return labelName;
    }
  }

  // 2. aria-label
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

  // 3. alt text for images
  if (el.tagName === "IMG") {
    const alt = el.getAttribute("alt");
    if (alt && alt.trim()) return alt.trim();
  }

  // 4. Form inputs (value, placeholder)
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    const input = el as HTMLInputElement;
    if (input.value && input.value.trim()) return input.value.trim();
    if (input.placeholder && input.placeholder.trim()) return input.placeholder.trim();
  }

  // 5. innerText (ignores hidden elements and styles/scripts)
  if (el.innerText && el.innerText.trim()) {
    return el.innerText.trim();
  }

  // 6. title attribute
  const title = el.getAttribute("title");
  if (title && title.trim()) return title.trim();

  // 7. textContent as a last resort
  return el.textContent?.trim() || "";
}

/**
 * Inject screen reader styles
 */
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = SCREEN_READER_CSS;
  document.head.appendChild(style);
}

/**
 * Find the nearest text-containing block ancestor
 */
function findTextBlock(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el;
  // Walk up looking for a known text container
  while (node && node !== document.body && node.tagName !== "HTML" && node.tagName !== "MAIN") {
    if (node.closest(".hwcag-widget")) return null; // ignore widget elements
    if (TEXT_CONTAINERS.includes(node.tagName)) {
      return node;
    }
    node = node.parentElement;
  }
  
  // Fallback: if the clicked element itself has human-readable text content, or aria/input values
  const text = getAccessibleName(el);
  if (text && text.length > 0 && !el.closest(".hwcag-widget")) {
    // Never read structural layout tags if clicked in empty space
    const IGNORED = ["BODY", "MAIN", "SECTION", "ARTICLE", "ASIDE", "HEADER", "FOOTER", "NAV", "FORM", "STYLE", "SCRIPT", "NOSCRIPT", "DIALOG"];
    if (IGNORED.includes(el.tagName)) return null;

    // If the element contains known block text containers, the user likely clicked a blank gap.
    // Reading the whole container would be too much text.
    const hasBlockChildren = el.querySelector(TEXT_CONTAINERS.join(",")) !== null;
    if (!hasBlockChildren) {
      return el;
    }
  }
  return null;
}

/**
 * Remove current highlight
 */
function clearHighlight(): void {
  if (currentHighlight) {
    currentHighlight.classList.remove("hwcag-sr-highlight");
    currentHighlight = null;
  }
}

/**
 * Stop all speech
 */
function stopSpeech(): void {
  window.speechSynthesis.cancel();
  isPaused = false;
  clearHighlight();
  updateControlBarStatus("Click text to read");
}

/**
 * Read a text element
 */
function readElement(el: HTMLElement): void {
  // Increment generation so stale onend/onerror callbacks become no-ops
  readGeneration++;
  const thisGeneration = readGeneration;

  // Cancel any ongoing speech — this may fire onend/onerror synchronously,
  // but those callbacks will see a stale generation and skip clearHighlight.
  window.speechSynthesis.cancel();
  clearHighlight();

  // Compute the best accessible name (aria-labels, alt text, innerText, etc.)
  const text = getAccessibleName(el);
  if (!text) return;

  // Highlight the element
  el.classList.add("hwcag-sr-highlight");
  currentHighlight = el;

  // Create speech utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = speechRate;

  if(/[\u0900-\u097F]/.test(text)) {
    const voices = window.speechSynthesis.getVoices();
    let devanagariVoice = voices.find(v => v.lang.includes('ne'));
    if (!devanagariVoice) {
      devanagariVoice = voices.find(v => v.lang.includes('hi'));
    }
    if (devanagariVoice) {
      utterance.lang = devanagariVoice.lang;
      utterance.voice = devanagariVoice;
    } else {
      console.warn("No Devanagari voice found on this device.");
      updateControlBarStatus('Devanagari scripts not supported on this browser!');
      const notFoundUtterance = new SpeechSynthesisUtterance('Devanagari scripts not supported on this browser!');
      window.speechSynthesis.speak(notFoundUtterance);
      return;
    }
  } else {
    utterance.lang = document.documentElement.lang || "en";
  }

  utterance.onstart = () => {
    isPaused = false;
    updateControlBarStatus("Reading...", true);
  };

  utterance.onend = () => {
    // Only clear if this is still the active read session
    if (thisGeneration !== readGeneration) return;
    clearHighlight();
    isPaused = false;
    updateControlBarStatus("Click text to read");
  };

  utterance.onerror = () => {
    if (thisGeneration !== readGeneration) return;
    clearHighlight();
    isPaused = false;
    updateControlBarStatus("Click text to read");
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Handle click on the page
 */
function handlePageClick(e: MouseEvent): void {
  if (!isEnabled) return;

  const target = e.target as HTMLElement;

  // Ignore clicks on the widget and control bar
  if (target.closest(".hwcag-widget") || target.closest(".hwcag-sr-controls")) return;

  const textBlock = findTextBlock(target);
  if (textBlock) {
    e.preventDefault();
    readElement(textBlock);
  }
}

/**
 * Handle focus/tabbing on the page
 */
function handleFocus(e: FocusEvent): void {
  if (!isEnabled) return;

  const target = e.target as HTMLElement;

  // Ignore focus on the widget and control bar
  if (!target || target.closest(".hwcag-widget") || target.closest(".hwcag-sr-controls")) return;

  const textBlock = findTextBlock(target);
  if (textBlock) {
    readElement(textBlock);
  }
}

/**
 * Create or update the floating control bar status
 */
function updateControlBarStatus(text: string, isReading = false): void {
  const status = controlBar?.querySelector(".hwcag-sr-status");
  if (status) {
    status.textContent = text;
    status.classList.toggle("reading", isReading);
  }
}

/**
 * Update speed display
 */
function updateSpeedDisplay(): void {
  const label = controlBar?.querySelector(".hwcag-sr-speed-label");
  if (label) {
    label.textContent = `${speechRate.toFixed(1)}×`;
  }
}

/**
 * Create the floating control bar
 */
function createControlBar(): HTMLElement {
  const bar = document.createElement("div");
  bar.className = "hwcag-widget hwcag-sr-controls";

  // Play/Pause button
  const playPauseBtn = document.createElement("button");
  playPauseBtn.className = "hwcag-sr-controls-btn";
  playPauseBtn.innerHTML = PAUSE_ICON;
  playPauseBtn.setAttribute("aria-label", "Pause/Resume reading");
  playPauseBtn.addEventListener("click", () => {
    if (window.speechSynthesis.speaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        isPaused = false;
        playPauseBtn.innerHTML = PAUSE_ICON;
        updateControlBarStatus("Reading...", true);
      } else {
        window.speechSynthesis.pause();
        isPaused = true;
        playPauseBtn.innerHTML = PLAY_ICON;
        updateControlBarStatus("Paused");
      }
    }
  });

  // Stop button
  const stopBtn = document.createElement("button");
  stopBtn.className = "hwcag-sr-controls-btn";
  stopBtn.innerHTML = STOP_ICON;
  stopBtn.setAttribute("aria-label", "Stop reading");
  stopBtn.addEventListener("click", () => {
    stopSpeech();
    playPauseBtn.innerHTML = PAUSE_ICON;
  });

  // Status text
  const status = document.createElement("span");
  status.className = "hwcag-sr-status";
  status.textContent = "Click text to read";

  // Divider
  const divider = document.createElement("span");
  divider.className = "hwcag-sr-divider";

  // Speed controls
  const speedWrap = document.createElement("div");
  speedWrap.className = "hwcag-sr-speed";

  const speedDown = document.createElement("button");
  speedDown.className = "hwcag-sr-controls-btn";
  speedDown.innerHTML = SPEED_DOWN_ICON;
  speedDown.setAttribute("aria-label", "Decrease reading speed");
  speedDown.addEventListener("click", () => {
    speechRate = Math.max(0.5, speechRate - 0.25);
    updateSpeedDisplay();
  });

  const speedLabel = document.createElement("span");
  speedLabel.className = "hwcag-sr-speed-label";
  speedLabel.textContent = `${speechRate.toFixed(1)}×`;

  const speedUp = document.createElement("button");
  speedUp.className = "hwcag-sr-controls-btn";
  speedUp.innerHTML = SPEED_UP_ICON;
  speedUp.setAttribute("aria-label", "Increase reading speed");
  speedUp.addEventListener("click", () => {
    speechRate = Math.min(3.0, speechRate + 0.25);
    updateSpeedDisplay();
  });

  speedWrap.appendChild(speedDown);
  speedWrap.appendChild(speedLabel);
  speedWrap.appendChild(speedUp);

  bar.appendChild(playPauseBtn);
  bar.appendChild(stopBtn);
  bar.appendChild(status);
  bar.appendChild(divider);
  bar.appendChild(speedWrap);

  return bar;
}

/**
 * Show a hint bubble
 */
function showHint(): void {
  if (hintEl) return;
  hintEl = document.createElement("div");
  hintEl.className = "hwcag-widget hwcag-sr-hint";
  hintEl.textContent = "🔊 Click on any text to hear it read aloud";
  document.body.appendChild(hintEl);

  hintTimeout = setTimeout(() => {
    hintEl?.remove();
    hintEl = null;
  }, 4000);
}

/**
 * Stop speech on page unload / navigation
 */
function handleBeforeUnload(): void {
  window.speechSynthesis.cancel();
}

/**
 * Apply screen reader
 */
function apply(enabled: boolean): void {
  isEnabled = enabled;
  injectStyles();

  if (enabled) {
    if (!("speechSynthesis" in window)) {
      console.warn("hwcag: SpeechSynthesis API not supported in this browser.");
      return;
    }
    document.addEventListener("click", handlePageClick, true);
    document.addEventListener("focusin", handleFocus, true);
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Create control bar
    controlBar = createControlBar();
    document.body.appendChild(controlBar);
    showHint();
  } else {
    document.removeEventListener("click", handlePageClick, true);
    document.removeEventListener("focusin", handleFocus, true);
    window.removeEventListener("beforeunload", handleBeforeUnload);
    stopSpeech();
    // Remove control bar
    controlBar?.remove();
    controlBar = null;
    // Remove hint
    if (hintTimeout) clearTimeout(hintTimeout);
    hintEl?.remove();
    hintEl = null;
  }
}

/**
 * Reset to default
 */
function reset(): void {
  apply(false);
  isEnabled = false;
}

/**
 * Toggle screen reader
 */
export function toggle(): boolean {
  apply(!isEnabled);
  return isEnabled;
}

/**
 * Get current state
 */
export function getValue(): boolean {
  return isEnabled;
}

const SPEAKER_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

export const screenReaderFeature: FeatureModule = {
  name: "screenReader",
  label: "Screen Reader",
  icon: SPEAKER_SVG,
  type: "toggle",
  apply,
  reset,
};

export default screenReaderFeature;
