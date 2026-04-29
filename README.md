# have-wcag

A comprehensive **WCAG 2.1 accessibility toolkit** that empowers both **end-users** and **developers** to create and maintain accessible web applications. Have-WCAG provides a user-facing accessibility widget and developer auditing tools that work seamlessly across all modern frameworks.

## Overview

have-wcag is a dual-purpose accessibility toolkit:

1. **🎯 Widget** — Empowers end-users with accessibility controls they can use on any website
2. **🔍 Auditor** — Helps developers audit and fix accessibility issues during development

Perfect for ensuring your web applications meet **WCAG 2.1 Level AA** (and AAA) compliance while respecting user preferences and diverse accessibility needs.

---

## Features

### 🎛️ Widget Features (End-User Accessibility Controls)

The widget provides an intuitive floating panel with accessibility features:

| Feature | Description | Use Case |
|---------|-------------|----------|
| **📏 Text Size** | Increase/decrease font size dynamically | Users with low vision |
| **🌓 High Contrast** | Toggle high contrast mode for better visibility | Users with color blindness or low vision |
| **🌙 Dark Mode** | Invert colors to reduce eye strain | Users with light sensitivity or photophobia |
| **🔤 Dyslexia Font** | Apply OpenDyslexic font for easier reading | Users with dyslexia |
| **↕️ Line Spacing** | Adjust line height for better readability | Users with reading disorders |
| **🔗 Link Highlighting** | Visually emphasize all links on the page | Users who need clear link identification |
| **🖱️ Cursor Size** | Choose small, medium, or large cursor | Users with motor impairment or low vision |
| **📖 Reading Guide** | Horizontal ruler that follows the cursor | Users with focusing difficulties |

### 🔍 Auditor Features (Developer Accessibility Checks)

Automated auditing for common accessibility issues:

| Check | Standards | Details |
|-------|-----------|---------|
| **Color Contrast** | WCAG 1.4.3, 1.4.6 | Validates text/background contrast ratios (AA & AAA levels) |
| **Keyboard Navigation** | WCAG 2.1.1, 2.4.3 | Ensures interactive elements are keyboard accessible |
| **Text Resize** | WCAG 1.4.4 | Detects text that breaks when resized |

Features:
- Visual highlighting of accessibility issues
- Detailed fix suggestions with CSS output
- Configurable WCAG compliance levels (A, AA, AAA)
- Real-time audit results
- Element-level auditing capability

---

## Installation

```bash
npm install have-wcag
```

Or with yarn:

```bash
yarn add have-wcag
```

Or with pnpm:

```bash
pnpm add have-wcag
```

---

## Quick Start

### Simplest Setup (Widget Only)

```javascript
import { widget } from "have-wcag";

// Initialize with defaults
widget.init();
```

This displays an accessibility widget in the bottom-right corner of your page.

### Widget + Auditor Setup

```javascript
import { widget, auditor } from "have-wcag";

// Initialize widget (for all users)
widget.init({ position: "bottom-right" });
```

### Plain HTML Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Accessible Website</title>
</head>
<body>
  <h1>Welcome to my website</h1>
  <p>Your content here...</p>

  <!-- Auto-initializing bundle (simplest method) -->
  <script src="https://unpkg.com/have-wcag/dist/bundle.js"></script>
</body>
</html>
```

Or with configuration:

```html
<script>
  window.HAVE_WCAG_CONFIG = {
    widget: {
      enabled: true,
      position: "bottom-right",
      theme: {
        primaryColor: "#1a1a2e",
        accentColor: "#007bff",
      },
    },
  };
</script>
<script src="https://unpkg.com/have-wcag/dist/bundle.js"></script>
```

---

## Framework Integration Guides

### ⚛️ React

#### Basic Setup

```jsx
import { useEffect } from "react";
import { widget, auditor } from "have-wcag";

function App() {
  useEffect(() => {
    // Initialize widget
    widget.init({ position: "bottom-right" });

    // Cleanup on unmount
    return () => {
      widget.destroy();
    };
  }, []);

  return (
    <div>
      <h1>My React App</h1>
      {/* Your app content */}
    </div>
  );
}

export default App;
```

#### With Custom Configuration

```jsx
import { useEffect } from "react";
import { widget, auditor } from "have-wcag";

function App() {
  useEffect(() => {
    widget.init({
      position: "bottom-right",
      features: ["textSize", "contrast", "darkMode", "dyslexiaFont"],
      theme: {
        primaryColor: "#667eea",
        accentColor: "#764ba2",
      },
    });

    return () => {
      widget.destroy();
    };
  }, []);

  return <div>{/* Your content */}</div>;
}

export default App;
```

#### Create a Reusable Provider

```jsx
import { useEffect } from "react";
import { widget, auditor } from "have-wcag";

export function AccessibilityProvider({ children }) {
  useEffect(() => {
    widget.init({ position: "bottom-right" });

    return () => {
      widget.destroy();
    };
  }, []);

  return children;
}

// Usage in App.jsx
export default function App() {
  return (
    <AccessibilityProvider>
      <YourApp />
    </AccessibilityProvider>
  );
}
```

---

### 🔴 Next.js

#### App Router (Recommended)

```jsx
// app/accessibility-provider.jsx
"use client";

import { useEffect } from "react";
import { widget, auditor } from "have-wcag";

export function AccessibilityProvider({ children }) {
  useEffect(() => {
    // Widget for all users
    widget.init({ position: "bottom-right" });

    return () => {
      widget.destroy();
    };
  }, []);

  return children;
}
```

```jsx
// app/layout.jsx
import { AccessibilityProvider } from "./accessibility-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
```

#### Pages Router

```jsx
// pages/_app.jsx
import { useEffect } from "react";
import { widget, auditor } from "have-wcag";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    widget.init({ position: "bottom-right" });

    return () => {
      widget.destroy();
    };
  }, []);

  return <Component {...pageProps} />;
}
```

---

### 💚 Vue 3

#### Composition API

```vue
<!-- App.vue -->
<script setup>
import { onMounted, onUnmounted } from "vue";
import { widget, auditor } from "have-wcag";

onMounted(() => {
  // Initialize widget
  widget.init({
    position: "bottom-right",
    theme: {
      primaryColor: "#42b983",
      accentColor: "#35495e",
    },
  });
});

onUnmounted(() => {
  widget.destroy();
});
</script>

<template>
  <div>
    <h1>My Vue App</h1>
    <!-- Your content -->
  </div>
</template>
```

#### Options API

```vue
<script>
import { widget, auditor } from "have-wcag";

export default {
  name: "App",
  mounted() {
    widget.init({ position: "bottom-right" });
  },
  unmounted() {
    widget.destroy();
  },
};
</script>

<template>
  <div>
    <h1>My Vue App</h1>
    <!-- Your content -->
  </div>
</template>
```

#### Create a Plugin

```javascript
// plugins/have-wcag.js
import { widget, auditor } from "have-wcag";

export default {
  install(app, options = {}) {
    widget.init({
      position: "bottom-right",
      ...options.widget,
    });

  },
};
```

```javascript
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import accessibilityPlugin from "./plugins/have-wcag";

const app = createApp(App);

app.use(accessibilityPlugin, {
  widget: { position: "bottom-right" },
  auditor: { level: "AA" },
});

app.mount("#app");
```

---

### 🅰️ Angular

#### Service-Based Approach (Recommended)

```typescript
// services/accessibility.service.ts
import { Injectable, NgZone } from "@angular/core";
import { widget, auditor } from "have-wcag";
import type { WidgetConfig } from "have-wcag";

@Injectable({
  providedIn: "root",
})
export class AccessibilityService {
  private isInitialized = false;

  constructor(private ngZone: NgZone) {}

  /**
   * Initialize the accessibility widget
   * Must be called outside Angular zone for performance
   */
  initWidget(config?: WidgetConfig): void {
    if (this.isInitialized) return;

    this.ngZone.runOutsideAngular(() => {
      widget.init({
        position: "bottom-right",
        ...config,
      });
    });

    this.isInitialized = true;
  }

  /**
   * Clean up widget
   */
  destroy(): void {
    widget.destroy();
    this.isInitialized = false;
  }

  /**
   * Open widget panel
   */
  open(): void {
    widget.open?.();
  }

  /**
   * Close widget panel
   */
  close(): void {
    widget.close?.();
  }

  /**
   * Reset all widget settings
   */
  reset(): void {
    widget.reset?.();
  }
}
```

#### Usage in a Component

```typescript
// app.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AccessibilityService } from "./services/accessibility.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "My Angular App";

  constructor(private a11y: AccessibilityService) {}

  ngOnInit(): void {
    // Initialize widget on app load
    this.a11y.initWidget({
      position: "bottom-right",
      features: [
        "textSize",
        "contrast",
        "darkMode",
        "dyslexiaFont",
        "lineHeight",
      ],
      theme: {
        primaryColor: "#3f51b5",
        accentColor: "#ff4081",
      },
    });
  }

  ngOnDestroy(): void {
    // Clean up on app destroy
    this.a11y.destroy();
  }
}
```

```html
<!-- app.component.html -->
<div class="container">
  <h1>{{ title }}</h1>
  <p>Accessibility widget is active!</p>
  <!-- Your app content -->
</div>
```

#### Module Setup (Traditional)

```typescript
// app.module.ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { AccessibilityService } from "./services/accessibility.service";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [AccessibilityService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### Standalone Component Setup (Angular 14+)

```typescript
// app.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AccessibilityService } from "./services/accessibility.service";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [AccessibilityService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "My Angular App";

  constructor(private a11y: AccessibilityService) {}

  ngOnInit(): void {
    this.a11y.initWidget({
      position: "bottom-right",
    });
  }

  ngOnDestroy(): void {
    this.a11y.destroy();
  }
}
```

#### App Initializer (Advanced)

For application-wide initialization before any components load:

```typescript
// app.config.ts (Angular 14+ standalone approach)
import { ApplicationConfig, NgZone } from "@angular/core";
import { provideRouter } from "@angular/router";
import { widget } from "have-wcag";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: "APP_INITIALIZER",
      useFactory: (ngZone: NgZone) => {
        return () => {
          ngZone.runOutsideAngular(() => {
            widget.init({
              position: "bottom-right",
            });
          });
        };
      },
      deps: [NgZone],
      multi: true,
    },
  ],
};
```

Or in `main.ts`:

```typescript
// main.ts
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig);
```

---

### 🌟 Nuxt 3

#### Auto-Import Plugin

```typescript
// plugins/have-wcag.ts
import { widget, auditor } from "have-wcag";

export default defineNuxtPlugin(() => {
  // Only initialize on client side
  if (process.server) return;

  // Initialize widget for all users
  widget.init({
    position: "bottom-right",
  });
});
```

#### With Custom Configuration

```typescript
// plugins/have-wcag.ts
import { widget, auditor } from "have-wcag";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return;

  const isDev = process.env.NODE_ENV === "development";

  widget.init({
    position: "bottom-right",
    features: ["textSize", "contrast", "darkMode"],
    theme: {
      primaryColor: "#00dc82",
      accentColor: "#ffffff",
    },
  });
});
```

#### Usage in Pages/Components

```vue
<!-- pages/index.vue -->
<script setup>
// Accessibility is already initialized via plugin
// No additional setup needed!
</script>

<template>
  <div>
    <h1>Welcome to Nuxt</h1>
    <p>Accessibility features are automatically available!</p>
  </div>
</template>
```

---

## Configuration

### Widget Configuration

```typescript
interface WidgetConfig {
  // Position on screen
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  
  // Which features to enable
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
  
  // Theme customization
  theme?: {
    primaryColor?: string;        // Main color
    backgroundColor?: string;    // Panel background
    textColor?: string;           // Text color
    accentColor?: string;         // Accent/highlight color
    borderRadius?: string;        // Border radius
  };
  
  // Label for toggle button
  buttonLabel?: string;
  
  // Title shown in panel
  panelTitle?: string;
}
```

**Example:**

```javascript
widget.init({
  position: "bottom-left",
  features: ["textSize", "contrast", "darkMode"],
  theme: {
    primaryColor: "#1a73e8",
    backgroundColor: "#ffffff",
    textColor: "#202124",
    accentColor: "#1a73e8",
    borderRadius: "8px",
  },
  buttonLabel: "Accessibility",
  panelTitle: "Accessibility Options",
});
```

### Auditor Configuration

```typescript
interface AuditorConfig {
  // Show the auditor toolbar
  showToolbar?: boolean;
  
  // Automatically run audit on init
  autoRun?: boolean;
  
  // WCAG compliance level
  level?: "A" | "AA" | "AAA";
  
  // Which checks to run
  checks?: Array<"contrast" | "textResize" | "keyboard">;
  
  // Callback when audit completes
  onComplete?: (results: AuditResults) => void;
}
```

**Example:**

```javascript
auditor.init({
  showToolbar: true,
  level: "AA",
  checks: ["contrast", "keyboard", "textResize"],
  onComplete: (results) => {
    console.log("Audit complete:", results);
    console.log(`Found ${results.summary.failed} issues`);
  },
});
```

---

## API Reference

### Widget API

```javascript
import { widget } from "have-wcag";

// Initialize with options
widget.init(config);

// Destroy and cleanup
widget.destroy();

// Open panel programmatically
widget.open();

// Close panel programmatically
widget.close();

// Reset all settings to defaults
widget.reset();

// Update configuration
widget.configure(newConfig);
```

### Auditor API

```javascript
import { auditor } from "have-wcag";

// Initialize with options
auditor.init(config);

// Destroy and cleanup
auditor.destroy();

// Run full page audit
const results = await auditor.audit();

// Audit specific element
const issue = auditor.auditElement(element);

// Update configuration
auditor.configure(newConfig);
```

---

## Build Outputs & Distribution

The package provides multiple build formats for different use cases:

| File | Format | Use Case |
|------|--------|----------|
| `dist/index.js` | CommonJS | Node.js/CommonJS projects |
| `dist/index.esm.js` | ES Module | Modern bundlers (Webpack, Vite, etc.) |
| `dist/widget.js` | IIFE | Standalone widget in script tags |
| `dist/widget.esm.js` | ESM | Widget as ES module |
| `dist/auditor.js` | IIFE | Standalone auditor in script tags |
| `dist/auditor.esm.js` | ESM | Auditor as ES module |
| `dist/bundle.js` | IIFE | Auto-initializing bundle (script tag only) |
| `dist/types/*.d.ts` | TypeScript Declarations | Type support |

### Usage by Build Format

**ES Modules (Recommended):**
```javascript
import { widget, auditor } from "have-wcag";
```

**CommonJS:**
```javascript
const { widget, auditor } = require("have-wcag");
```

**Script Tag (Widget Only):**
```html
<script src="https://unpkg.com/have-wcag/dist/widget.js"></script>
<script>
  HaveWcagWidget.init();
</script>
```

**Script Tag (Auto-Init Bundle):**
```html
<script src="https://unpkg.com/have-wcag/dist/bundle.js"></script>
```

---

## Complete Examples

### Production Setup (All Frameworks)

```javascript
// Initialize only widget for end users
widget.init({
  position: "bottom-right",
  features: [
    "textSize",
    "contrast",
    "darkMode",
    "dyslexiaFont",
    "lineHeight",
    "linkHighlight",
  ],
});
```

### Development Setup (All Frameworks)

```javascript
import { widget, auditor } from "have-wcag";

// Widget for all users
widget.init({ position: "bottom-right" });
```

### Advanced Configuration

```javascript
widget.init({
  position: "bottom-left",
  features: ["textSize", "contrast", "darkMode", "readingGuide"],
  theme: {
    primaryColor: "#667eea",
    backgroundColor: "#f7fafc",
    textColor: "#2d3748",
    accentColor: "#764ba2",
    borderRadius: "12px",
  },
  buttonLabel: "🎯 Accessibility",
  panelTitle: "Accessibility Settings",
});
```

---

## Development

### Setup

```bash
# Install dependencies
npm install

# Install Node version (if needed)
nvm use
```

### Scripts

```bash
# Build for distribution
npm run build

# Build in watch mode (for development)
npm run dev

# Type check with TypeScript
npm run typecheck

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Project Structure

```
src/
├── widget/           # End-user widget
├── auditor/          # Developer auditor
├── core/             # Core logic
├── checks/           # Audit checks
├── types/            # TypeScript types
├── ui/               # UI components
├── utils/            # Utilities
└── index.ts          # Main entry point
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

## Accessibility Standards

have-wcag is built to help implement:

- **WCAG 2.1** Level A, AA, and AAA
- **Web Accessibility Initiative (WAI)** standards
- **Americans with Disabilities Act (ADA)** compliance
- **European Accessibility Act (EAA)** requirements

---

## Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

## License

MIT

---

## Authors

Ruby Shrestha, Maheshwor Nagarkoti - Logispark Technologies Pvt. Ltd.

---

## Support

For questions, issues, or suggestions:
- 📧 Open an issue on GitHub
- 🐛 Report bugs with detailed reproduction steps
- 💡 Suggest features with use cases

---

**Make the web accessible for everyone with have-wcag! ✨**
