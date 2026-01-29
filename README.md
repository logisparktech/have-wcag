# have-wcag

A comprehensive WCAG accessibility toolkit with two tools:

1. **Widget** — End-user accessibility controls (for production & development)
2. **Auditor** — Developer accessibility auditing tool (for development only)

## Features

### Widget (End-User Tool)

- 📏 **Text Size** — Increase/decrease font size
- 🌓 **High Contrast** — Toggle high contrast mode
- 🌙 **Dark Mode** — Invert colors for dark mode
- 🔤 **Dyslexia Font** — OpenDyslexic font for easier reading
- ↕️ **Line Spacing** — Adjust line height
- 🔗 **Link Highlighting** — Make links more visible
- 🖱️ **Cursor Size** — Small/medium/large cursor
- 📖 **Reading Guide** — Horizontal ruler that follows cursor

### Auditor (Developer Tool)

- Color contrast checking (WCAG 1.4.3, 1.4.6)
- Keyboard navigation testing (WCAG 2.1.1, 2.4.3)
- Text resize checking (WCAG 1.4.4)
- Visual issue highlighting
- Fix suggestions with CSS output

## Installation

```bash
npm install have-wcag
```

## Usage

### Production (Widget Only)

```javascript
import { widget } from "have-wcag";

widget.init({
  position: "bottom-right",
  theme: {
    primaryColor: "#1a1a2e",
    accentColor: "#007bff",
  },
});
```

Or via script tag:

```html
<script src="https://unpkg.com/have-wcag/dist/widget.js"></script>
<script>
  HaveWcagWidget.init({ position: "bottom-right" });
</script>
```

### Development (Widget + Auditor)

```javascript
import { widget, auditor } from "have-wcag";

// Widget for all environments
widget.init({ position: "bottom-right" });

// Auditor only in development
if (process.env.NODE_ENV === "development") {
  auditor.init({ position: "bottom-left", level: "AA" });
}
```

### Auto-Initialization (Script Tag)

```html
<script>
  window.HAVE_WCAG_CONFIG = {
    widget: {
      enabled: true,
      position: "bottom-right",
    },
    auditor: {
      enabled: false, // Set to true in development
      position: "bottom-left",
    },
  };
</script>
<script src="https://unpkg.com/have-wcag/dist/bundle.js"></script>
```

## Configuration

### Widget Options

```typescript
interface WidgetConfig {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  features?: Array<
    | "textSize"
    | "contrast"
    | "darkMode"
    | "dyslexiaFont"
    | "lineHeight"
    | "linkHighlight"
    | "cursorSize"
    | "readingGuide"
  >;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    borderRadius?: string;
  };
  buttonLabel?: string;
  panelTitle?: string;
}
```

### Auditor Options

```typescript
interface AuditorConfig {
  showToolbar?: boolean;
  autoRun?: boolean;
  level?: "A" | "AA" | "AAA";
  checks?: Array<"contrast" | "textResize" | "keyboard">;
  onComplete?: (results: AuditResults) => void;
}
```

## API

### Widget

```javascript
import { widget } from "have-wcag";

widget.init(config); // Initialize widget
widget.destroy(); // Remove widget
widget.open(); // Open panel programmatically
widget.close(); // Close panel
widget.reset(); // Reset all settings
widget.configure(opts); // Update configuration
```

### Auditor

```javascript
import { auditor } from "have-wcag";

auditor.init(config); // Initialize auditor
auditor.destroy(); // Remove auditor
auditor.audit(); // Run audit
auditor.auditElement(el); // Audit specific element
auditor.configure(opts); // Update configuration
```

## Build Outputs

| File                  | Description                  |
| --------------------- | ---------------------------- |
| `dist/index.js`       | CommonJS (widget + auditor)  |
| `dist/index.esm.js`   | ES Module (widget + auditor) |
| `dist/widget.js`      | Widget only (IIFE)           |
| `dist/widget.esm.js`  | Widget only (ESM)            |
| `dist/auditor.js`     | Auditor only (IIFE)          |
| `dist/auditor.esm.js` | Auditor only (ESM)           |
| `dist/bundle.js`      | Auto-initializing bundle     |

## Framework Examples

### React

```jsx
import { useEffect } from "react";
import { widget, auditor } from "have-wcag";

function App() {
  useEffect(() => {
    widget.init({ position: "bottom-right" });

    if (process.env.NODE_ENV === "development") {
      auditor.init({ position: "bottom-left" });
    }

    return () => {
      widget.destroy();
      auditor.destroy();
    };
  }, []);

  return <div>Your app content</div>;
}
```

### Vue

```vue
<script setup>
import { onMounted, onUnmounted } from "vue";
import { widget, auditor } from "have-wcag";

onMounted(() => {
  widget.init({ position: "bottom-right" });

  if (import.meta.env.DEV) {
    auditor.init({ position: "bottom-left" });
  }
});

onUnmounted(() => {
  widget.destroy();
  auditor.destroy();
});
</script>
```

### Next.js

```jsx
"use client";
import { useEffect } from "react";
import { widget, auditor } from "have-wcag";

export default function A11yProvider({ children }) {
  useEffect(() => {
    widget.init({ position: "bottom-right" });

    if (process.env.NODE_ENV === "development") {
      auditor.init({ position: "bottom-left" });
    }

    return () => {
      widget.destroy();
      auditor.destroy();
    };
  }, []);

  return children;
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run typecheck

# Test
npm test
```

## License

MIT
