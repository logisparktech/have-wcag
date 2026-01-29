// Configuration options for the auditor
export interface HaveWcagConfig {
  autoRun?: boolean;
  showToolbar?: boolean;
  level?: "A" | "AA" | "AAA";
  checks?: CheckType[];
  onComplete?: (results: AuditResults) => void;
}

export type CheckType = "contrast" | "textResize" | "keyboard";

// Individual issue found during audit
export interface WcagIssue {
  id: string;
  type: CheckType;
  element: HTMLElement;
  selector: string;
  severity: "error" | "warning";
  message: string;
  wcagCriteria: string;
  current: Record<string, any>;
  suggestion?: Record<string, any>;
}

// Contrast-specific issue details
export interface ContrastIssue extends WcagIssue {
  type: "contrast";
  current: {
    ratio: number;
    textColor: string;
    backgroundColor: string;
    fontSize: string;
    fontWeight: string;
  };
  suggestion?: {
    textColor?: string;
    backgroundColor?: string;
    ratio: number;
  };
}

// Text resize issue details
export interface TextResizeIssue extends WcagIssue {
  type: "textResize";
  current: {
    unit: string;
    value: string;
    computedSize: string;
  };
  suggestion?: {
    value: string;
    unit: "rem" | "em" | "%";
  };
}

// Keyboard navigation issue details
export interface KeyboardIssue extends WcagIssue {
  type: "keyboard";
  current: {
    tabIndex?: number;
    hasClickHandler: boolean;
    isFocusable: boolean;
    role?: string;
  };
  suggestion?: {
    tabIndex?: number;
    role?: string;
    ariaLabel?: string;
  };
}

// Complete audit results
export interface AuditResults {
  timestamp: Date;
  url: string;
  level: "A" | "AA" | "AAA";
  summary: {
    total: number;
    passed: number;
    failed: number;
    byType: Record<CheckType, { passed: number; failed: number }>;
  };
  issues: WcagIssue[];
}

// Check function interface
export interface CheckModule {
  name: CheckType;
  run: (element: HTMLElement, level: "A" | "AA" | "AAA") => WcagIssue | null;
}
