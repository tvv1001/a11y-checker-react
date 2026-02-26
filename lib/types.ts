export interface ScanResult {
  violations: Violation[];
  passes: PassedCheck[];
  incomplete: IncompleteCheck[];
  summary: ScanSummary;
  logs: LogMessage[];
}

export interface Violation {
  id: string;
  message: string;
  description: string;
  help: string;
  helpUrl?: string;
  impact: string;
  tags: string[];
  nodes: ViolationNode[];
  nodeCount: number;
}

export interface ViolationNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

export interface PassedCheck {
  id: string;
  description: string;
}

export interface IncompleteCheck {
  id: string;
  description: string;
}

export interface ScanSummary {
  violation_count: number;
  pass_count: number;
  incomplete_count: number;
}

export interface LogMessage {
  type: "info" | "success" | "error" | "warning";
  message: string;
  timestamp: number;
}
