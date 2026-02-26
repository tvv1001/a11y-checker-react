"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ScanResult, LogMessage, Violation } from "@/lib/types";
import { parseWcagTags } from "@/lib/wcag-mapping";

function ViolationCard({ violation }: { violation: Violation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const wcagTags = (violation.tags || []).filter((tag) =>
    tag.toLowerCase().startsWith("wcag"),
  );
  const parsedWcag = parseWcagTags(wcagTags);

  return (
    <div className="issue">
      <div className="issue-header">
        <div className="issue-title-group">
          <h3 className="issue-title">{violation.id}</h3>
          <a
            href={`https://dequeuniversity.com/rules/axe/4.11/${violation.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rule-link"
          >
            View Rule Details →
          </a>
        </div>
        <span className={`issue-impact ${violation.impact}`}>
          {violation.impact}
        </span>
      </div>
      <p className="issue-description">{violation.description}</p>
      {violation.help && (
        <div className="issue-help">
          <div className="help-icon">💡</div>
          <div className="help-content">
            <strong>How to fix:</strong>
            <p>{violation.help}</p>
            {violation.helpUrl && (
              <a
                href={violation.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="help-link"
              >
                <span>Learn more about this issue</span>
                <svg
                  className="external-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
      {(parsedWcag.levels.length > 0 || parsedWcag.criteria.length > 0) && (
        <div className="issue-wcag">
          {parsedWcag.levels.length > 0 && (
            <span className="wcag-inline">
              <strong>Conformance Levels:</strong>{" "}
              {parsedWcag.levels.map((level, idx) => (
                <span key={idx} className="wcag-level-badge">
                  {level}
                </span>
              ))}
            </span>
          )}
          {parsedWcag.criteria.length > 0 && (
            <span className="wcag-inline">
              <strong>Success Criteria:</strong>{" "}
              {parsedWcag.criteria.map((criterion, idx) => (
                <span key={idx} className="wcag-criterion-badge">
                  {criterion}
                </span>
              ))}
            </span>
          )}
        </div>
      )}
      {violation.nodes.length > 0 && (
        <details
          className="issue-nodes"
          open={isExpanded}
          onToggle={(e) => setIsExpanded(e.currentTarget.open)}
        >
          <summary>Affected elements ({violation.nodes.length})</summary>
          <div className="nodes-list">
            {violation.nodes.slice(0, 5).map((node, idx) => (
              <div key={idx} className="node-item">
                <div className="node-header">
                  <span className="node-number">Element {idx + 1}</span>
                  {node.target && node.target.length > 0 && (
                    <code className="node-selector">
                      {node.target.join(" ")}
                    </code>
                  )}
                </div>
                {node.failureSummary && (
                  <div className="node-failure">
                    <strong>Issue:</strong>
                    <div
                      dangerouslySetInnerHTML={{ __html: node.failureSummary }}
                    />
                  </div>
                )}
                <div className="node-html">
                  <strong>HTML:</strong>
                  <code>{node.html}</code>
                </div>
              </div>
            ))}
            {violation.nodes.length > 5 && (
              <div className="nodes-more">
                ... and {violation.nodes.length - 5} more element(s)
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleOutputRef.current) {
      consoleOutputRef.current.scrollTop =
        consoleOutputRef.current.scrollHeight;
    }
  }, [logs]);

  const handleScan = useCallback(
    async (targetUrl?: string) => {
      const urlToScan = targetUrl || url.trim();

      if (!urlToScan) {
        alert("Please enter a valid URL.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setResults(null);
      setLogs([]);

      const sessionId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);

      try {
        const params = new URLSearchParams({
          url: urlToScan,
          session: sessionId,
        });

        const response = await fetch(`/api/scan?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to scan the target URL.");
        }

        setResults(data);
        setLogs(data.logs || []);

        // Update the URL with the scanned page as a query parameter
        const encodedUrl = encodeURIComponent(urlToScan);
        window.history.pushState(
          { url: urlToScan },
          `WCAG Scan: ${urlToScan}`,
          `?url=${encodedUrl}`,
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to scan the target URL.";
        setError(message);
        setLogs((prev) => [
          ...prev,
          {
            type: "error",
            message,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [url],
  );

  // Load URL from query parameter on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scannedUrl = params.get("url");
    if (scannedUrl) {
      setUrl(scannedUrl);
      handleScan(scannedUrl);
    }
  }, [handleScan]);

  const clearConsole = () => {
    setLogs([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>WCAG Compliance Checker</h1>
        <p className="subtitle">
          Check web accessibility from WCAG 2.0 A to WCAG 2.2 AA
        </p>
      </header>

      {/* Input Section */}
      <div className="input-section">
        <label htmlFor="urlInput" className="input-label">
          Enter URL to scan
        </label>
        <div className="input-group">
          <input
            type="url"
            id="urlInput"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com"
            aria-label="URL to check"
            disabled={isLoading}
          />
          <button
            onClick={() => handleScan()}
            className="primary-button"
            disabled={isLoading}
          >
            <span className="button-text">
              {isLoading ? "Scanning..." : "Scan Page"}
            </span>
            <span className="button-icon">🔍</span>
          </button>
        </div>
      </div>

      {/* Loading Section */}
      {isLoading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p className="loading-text">Scanning page...</p>
        </div>
      )}

      {/* Console Section */}
      {logs.length > 0 && (
        <div className="console-section">
          <div className="console-header">
            <h2>Console Output</h2>
            <button
              onClick={clearConsole}
              className="clear-button"
              aria-label="Clear console"
            >
              Clear
            </button>
          </div>
          <div className="console-output" ref={consoleOutputRef}>
            {logs.map((log, index) => (
              <div key={index} className={`console-line ${log.type}`}>
                <span className="timestamp">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>{" "}
                {log.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && !error && (
        <div className="results-section">
          <div className="results-header">
            <h2>Scan Results</h2>
            <div className="results-summary">
              <div
                className={`summary-badge ${results.violations.length > 0 ? "error" : "success"}`}
              >
                <span>{results.violations.length > 0 ? "❌" : "✅"}</span>
                <span>
                  {results.violations.length} Violation
                  {results.violations.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="summary-badge success">
                <span>✅</span>
                <span>{results.passes.length} Passed</span>
              </div>
              {results.incomplete.length > 0 && (
                <div className="summary-badge warning">
                  <span>⚠️</span>
                  <span>{results.incomplete.length} Incomplete</span>
                </div>
              )}
            </div>
          </div>

          <div className="results-container">
            {results.violations.length === 0 ? (
              <div className="no-issues">
                <div className="no-issues-icon">✨</div>
                <h3>No Accessibility Issues Found!</h3>
                <p>The page passed all WCAG compliance checks.</p>
              </div>
            ) : (
              results.violations.map((violation, index) => (
                <ViolationCard key={index} violation={violation} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
