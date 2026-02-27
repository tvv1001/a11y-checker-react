"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ScanResult, LogMessage, Violation } from "@/lib/types";
import { parseWcagTags } from "@/lib/wcag-mapping";
import { getWCAGDetails } from "@/lib/wcag-details";
import { DOMAnalysisViewer } from "@/app/components/DOMAnalysisViewer";

interface ParsedElement {
  tagName: string;
  role?: string;
  ariaAttributes: Record<string, string>;
  otherAttributes: Record<string, string>;
  rawHtml: string;
}

function parseElementHTML(html: string): ParsedElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const element = doc.body.firstElementChild;

  if (!element) {
    return {
      tagName: "unknown",
      ariaAttributes: {},
      otherAttributes: {},
      rawHtml: html,
    };
  }

  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute("role") || undefined;
  const ariaAttributes: Record<string, string> = {};
  const otherAttributes: Record<string, string> = {};

  Array.from(element.attributes).forEach((attr) => {
    if (attr.name.startsWith("aria-")) {
      ariaAttributes[attr.name] = attr.value;
    } else if (attr.name !== "role") {
      otherAttributes[attr.name] = attr.value;
    }
  });

  return {
    tagName,
    role,
    ariaAttributes,
    otherAttributes,
    rawHtml: html,
  };
}

function getJAWSDescription(violation: Violation): string {
  const id = violation.id.toLowerCase();

  // Common JAWS-related issues
  if (id.includes("label")) {
    return "JAWS will not announce a proper label for this form control, making it difficult for users to understand its purpose.";
  }
  if (id.includes("alt") || id.includes("image")) {
    return "JAWS will not provide alternative text for this image, leaving users unaware of its content or purpose.";
  }
  if (id.includes("heading")) {
    return "JAWS users rely on heading structure to navigate the page. This issue disrupts the heading hierarchy.";
  }
  if (id.includes("landmark") || id.includes("region")) {
    return "JAWS uses landmarks to help users navigate page regions. This element lacks proper landmark identification.";
  }
  if (id.includes("link") || id.includes("button")) {
    return "JAWS will announce this element, but it may lack sufficient context for users to understand its purpose.";
  }
  if (id.includes("color-contrast")) {
    return "While JAWS doesn't detect color contrast, low contrast affects users with low vision who often use screen readers.";
  }
  if (id.includes("aria")) {
    return "JAWS relies on ARIA attributes to provide context. This issue affects what JAWS announces to users.";
  }
  if (id.includes("tabindex") || id.includes("focus")) {
    return "JAWS users navigate using keyboard focus. This issue affects tab order and focus management.";
  }

  return "This accessibility issue may affect how JAWS announces or navigates this element.";
}

function ViolationCard({ violation }: { violation: Violation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const wcagTags = (violation.tags || []).filter((tag) =>
    tag.toLowerCase().startsWith("wcag"),
  );
  const parsedWcag = parseWcagTags(wcagTags);

  // Get detailed WCAG information for each criterion
  const wcagDetails = parsedWcag.criteria
    .map((criterion) => {
      const id = criterion.split(" ")[0]; // Extract "1.1.1" from "1.1.1 Non-text Content"
      return getWCAGDetails(id);
    })
    .filter(Boolean);

  const isAALevel = violation.tags?.some(
    (tag) =>
      tag.toLowerCase().includes("wcag") &&
      (tag.toLowerCase().includes("aa") || tag.toLowerCase().includes("aaa")),
  );

  return (
    <div className="issue">
      <div className="issue-header">
        <div className="issue-title-group">
          <h3 className="issue-title">{violation.id}</h3>
        </div>
        <span className={`issue-impact ${violation.impact}`}>
          {violation.impact}
        </span>
      </div>
      <p className="issue-description">{violation.description}</p>
      {violation.help && (
        <div className="issue-help">
          <div className="help-icon" aria-hidden="true">
            💡
          </div>
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

      {/* Detailed WCAG Information with JAWS Impact */}
      {wcagDetails.length > 0 &&
        wcagDetails.map(
          (detail, idx) =>
            detail && (
              <div key={idx} className="wcag-detail-section">
                {/* JAWS Screen Reader Impact */}
                {isAALevel && detail.jawsImpact && (
                  <div
                    className={`jaws-detail-impact jaws-severity-${detail.jawsImpact.severity}`}
                  >
                    <div className="jaws-detail-header">
                      <span className="jaws-detail-icon">🎧</span>
                      <strong>
                        JAWS Screen Reader Impact (
                        {detail.jawsImpact.severity.toUpperCase()})
                      </strong>
                    </div>
                    <p className="jaws-detail-description">
                      {detail.jawsImpact.description}
                    </p>

                    <div className="jaws-announcements">
                      <div className="jaws-announcement-correct">
                        <strong>✓ When implemented correctly:</strong>
                        <p>{detail.jawsImpact.announcement}</p>
                      </div>
                      <div className="jaws-announcement-broken">
                        <strong>✗ When this fails:</strong>
                        <p>{detail.jawsImpact.announcementWhenBroken}</p>
                      </div>
                    </div>

                    {detail.jawsImpact.shortcuts &&
                      detail.jawsImpact.shortcuts.length > 0 && (
                        <div className="jaws-shortcuts">
                          <strong>Relevant JAWS Keyboard Shortcuts:</strong>
                          <ul>
                            {detail.jawsImpact.shortcuts.map(
                              (shortcut, sIdx) => (
                                <li key={sIdx}>
                                  <code>{shortcut}</code>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {detail.jawsImpact.tips &&
                      detail.jawsImpact.tips.length > 0 && (
                        <div className="jaws-tips">
                          <strong>JAWS Testing Tips:</strong>
                          <ul>
                            {detail.jawsImpact.tips.map((tip, tIdx) => (
                              <li key={tIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}

                {/* Compliance Information */}
                {detail.compliance && (
                  <div className="compliance-section">
                    <div className="compliance-header">
                      <span className="compliance-icon">⚖️</span>
                      <strong>Legal Compliance Requirements</strong>
                    </div>
                    <div className="compliance-badges">
                      {detail.compliance.section508 && (
                        <span className="compliance-badge section508">
                          Section 508
                        </span>
                      )}
                      {detail.compliance.ada && (
                        <span className="compliance-badge ada">
                          ADA {detail.compliance.adaTitle}
                        </span>
                      )}
                      {detail.compliance.en301549 && (
                        <span className="compliance-badge en301549">
                          EN 301 549
                        </span>
                      )}
                    </div>
                    {detail.compliance.notes && (
                      <p className="compliance-notes">
                        {detail.compliance.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Link to Official WCAG Understanding */}
                <div className="wcag-official-link">
                  <a
                    href={detail.understanding}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wcag-link"
                  >
                    📖 Understanding {detail.number} {detail.name} (W3C
                    Official)
                    <svg
                      className="external-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            ),
        )}

      {violation.nodes.length > 0 && (
        <details
          className="issue-nodes"
          open={isExpanded}
          onToggle={(e) => setIsExpanded(e.currentTarget.open)}
        >
          <summary>Affected elements ({violation.nodes.length})</summary>
          <div className="nodes-list">
            {violation.nodes.slice(0, 5).map((node, idx) => {
              const parsed = parseElementHTML(node.html);
              const isAALevel = violation.tags?.some(
                (tag) =>
                  tag.toLowerCase().includes("wcag") &&
                  (tag.toLowerCase().includes("aa") ||
                    tag.toLowerCase().includes("aaa")),
              );

              return (
                <div key={idx} className="node-item">
                  <div className="node-header">
                    <span className="node-number">Element {idx + 1}</span>
                    {node.target && node.target.length > 0 && (
                      <code className="node-selector">
                        {node.target.join(" ")}
                      </code>
                    )}
                  </div>

                  {/* JAWS Impact Description for AA/AAA issues */}
                  {isAALevel && (
                    <div className="jaws-impact">
                      <div className="jaws-icon">🎧</div>
                      <div className="jaws-content">
                        <strong>JAWS Screen Reader Impact:</strong>
                        <p>{getJAWSDescription(violation)}</p>
                      </div>
                    </div>
                  )}

                  {/* Semantic Element Display */}
                  <div className="semantic-html">
                    <div className="semantic-header">
                      <strong>Semantic HTML:</strong>
                    </div>
                    <div className="semantic-content">
                      <div className="html-tag">
                        <span className="tag-bracket">&lt;</span>
                        <span className="tag-name">{parsed.tagName}</span>
                        {parsed.role && (
                          <span className="html-attribute role-attribute">
                            {" "}
                            <span className="attr-name highlight-role">
                              role
                            </span>
                            <span className="attr-equals">=</span>
                            <span className="attr-value">
                              &quot;{parsed.role}&quot;
                            </span>
                          </span>
                        )}
                        {Object.entries(parsed.ariaAttributes).map(
                          ([name, value]) => (
                            <span
                              key={name}
                              className="html-attribute aria-attribute"
                            >
                              {" "}
                              <span className="attr-name highlight-aria">
                                {name}
                              </span>
                              <span className="attr-equals">=</span>
                              <span className="attr-value">
                                &quot;{value}&quot;
                              </span>
                            </span>
                          ),
                        )}
                        {Object.entries(parsed.otherAttributes)
                          .slice(0, 3)
                          .map(([name, value]) => (
                            <span key={name} className="html-attribute">
                              {" "}
                              <span className="attr-name">{name}</span>
                              <span className="attr-equals">=</span>
                              <span className="attr-value">
                                &quot;
                                {value.length > 30
                                  ? value.slice(0, 30) + "..."
                                  : value}
                                &quot;
                              </span>
                            </span>
                          ))}
                        {Object.keys(parsed.otherAttributes).length > 3 && (
                          <span className="attr-more"> ...</span>
                        )}
                        <span className="tag-bracket">&gt;</span>
                      </div>
                    </div>
                  </div>

                  {node.failureSummary && (
                    <div className="node-failure">
                      <strong>Issue Details:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: node.failureSummary,
                        }}
                      />
                    </div>
                  )}

                  {/* Raw HTML for reference */}
                  <details className="raw-html-details">
                    <summary>View Raw HTML</summary>
                    <div className="node-html">
                      <code>{node.html}</code>
                    </div>
                  </details>
                </div>
              );
            })}
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
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasLoadedInitialUrl = useRef(false);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleOutputRef.current) {
      consoleOutputRef.current.scrollTop =
        consoleOutputRef.current.scrollHeight;
    }
  }, [logs]);

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

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

      // Close existing EventSource if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Connect to log stream
      const eventSource = new EventSource(
        `/api/scan/stream?session=${sessionId}`,
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        if (event.data && event.data !== ": heartbeat") {
          try {
            const logMessage = JSON.parse(event.data);
            setLogs((prev) => [...prev, logMessage]);
          } catch (error) {
            console.error("Error parsing log message:", error);
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
      };

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
        // Close the EventSource after a short delay to ensure all logs are received
        setTimeout(() => {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        }, 1000);
      }
    },
    [url],
  );

  // Load URL from query parameter on page load (only once)
  useEffect(() => {
    if (hasLoadedInitialUrl.current) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const scannedUrl = params.get("url");
    if (scannedUrl) {
      hasLoadedInitialUrl.current = true;
      setUrl(scannedUrl);
      handleScan(scannedUrl);
    }
    // Only run on mount - handleScan is called with explicit URL parameter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <header className="header" role="banner">
        <h1>WCAG Compliance Checker</h1>
        <p className="subtitle">
          Check web accessibility from WCAG 2.0 A to WCAG 2.2 AA
        </p>
      </header>

      {/* Input Section */}
      <div className="input-section" role="search">
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
            aria-busy={isLoading}
            aria-label={
              isLoading
                ? "Scanning page for accessibility issues"
                : "Scan page for accessibility issues"
            }
          >
            <span className="button-text">
              {isLoading ? "Scanning..." : "Scan Page"}
            </span>
            <span className="button-icon" aria-hidden="true">
              🔍
            </span>
          </button>
        </div>
      </div>

      {/* Console Section */}
      {(logs.length > 0 || isLoading) && (
        <div
          className="console-section"
          role="region"
          aria-label="Console Output"
        >
          <div className="console-header">
            <div className="console-title-group">
              <h2>Console Output</h2>
              {isLoading && (
                <span className="live-indicator">
                  <span className="live-dot"></span>
                  LIVE
                </span>
              )}
            </div>
            <button
              onClick={clearConsole}
              className="clear-button"
              aria-label="Clear console"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
          <div
            className="console-output"
            ref={consoleOutputRef}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {logs.map((log, index) => (
              <div key={index} className={`console-line ${log.type}`}>
                <span className="timestamp">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>{" "}
                {log.message}
              </div>
            ))}
            {isLoading && (
              <div className="console-loading">
                <div className="loading-spinner"></div>
                <span className="loading-text">Scanning in progress...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DOM Structure Analysis */}
      {results && results.domAnalysis && (
        <div className="dom-analysis-section">
          <div className="dom-analysis-header">
            <h2>Page Structure Analysis</h2>
            <p className="dom-analysis-subtitle">
              HTML structure, elements, and accessibility features
            </p>
          </div>
          <DOMAnalysisViewer
            analysis={results.domAnalysis}
            violations={results.violations}
          />
        </div>
      )}

      {/* Results Section */}
      {results && !error && (
        <div className="results-section" role="main">
          <div className="results-header">
            <h2>Scan Results</h2>
            <div className="results-summary">
              <div
                className={`summary-badge ${results.violations.length > 0 ? "error" : "success"}`}
              >
                <span aria-hidden="true">
                  {results.violations.length > 0 ? "❌" : "✅"}
                </span>
                <span>
                  {results.violations.length} Violation
                  {results.violations.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="summary-badge success">
                <span aria-hidden="true">✅</span>
                <span>{results.passes.length} Passed</span>
              </div>
              {results.incomplete.length > 0 && (
                <div className="summary-badge warning">
                  <span aria-hidden="true">⚠️</span>
                  <span>{results.incomplete.length} Incomplete</span>
                </div>
              )}
            </div>
          </div>

          <div className="results-container">
            {results.violations.length === 0 ? (
              <div className="no-issues">
                <div className="no-issues-icon" aria-hidden="true">
                  ✨
                </div>
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
