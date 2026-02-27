"use client";

import type { DOMAnalysis } from "@/lib/dom-analyzer";
import type { Violation } from "@/lib/types";

interface DOMAnalysisViewerProps {
  analysis: DOMAnalysis;
  violations?: Violation[];
}

function isAALevelViolation(violation: Violation): boolean {
  const tags = violation.tags || [];
  return tags.some(
    (tag) =>
      tag.toLowerCase().includes("wcag") &&
      (tag.toLowerCase().includes("aa") || tag.toLowerCase().includes("aaa")),
  );
}

function generateRoleHTML(
  element: string,
  role: string,
  ariaLabel?: string,
  label?: string,
) {
  return (
    <div className="semantic-html-example">
      <div className="html-tag">
        <span className="tag-bracket">&lt;</span>
        <span className="tag-name">{element}</span>
        <span className="html-attribute role-attribute">
          {" "}
          <span className="attr-name highlight-role">role</span>
          <span className="attr-equals">=</span>
          <span className="attr-value">&quot;{role}&quot;</span>
        </span>
        {ariaLabel && (
          <span className="html-attribute aria-attribute">
            {" "}
            <span className="attr-name highlight-aria">aria-label</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{ariaLabel}&quot;</span>
          </span>
        )}
        <span className="tag-bracket">&gt;</span>
        {label && (
          <>
            <span className="html-text">{label}</span>
          </>
        )}
        <span className="tag-bracket">&lt;/</span>
        <span className="tag-name">{element}</span>
        <span className="tag-bracket">&gt;</span>
      </div>
    </div>
  );
}

function generateFocusableHTML(
  element: string,
  id?: string,
  name?: string,
  type?: string,
  href?: string,
  role?: string,
  ariaLabel?: string,
  tabindex?: string,
  label?: string,
) {
  const tagName = element.toLowerCase();

  return (
    <div className="semantic-html-example compact">
      <div className="html-tag">
        <span className="tag-bracket">&lt;</span>
        <span className="tag-name">{tagName}</span>
        {type && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">type</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{type}&quot;</span>
          </span>
        )}
        {href && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">href</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">
              &quot;{href.length > 40 ? href.substring(0, 40) + "..." : href}
              &quot;
            </span>
          </span>
        )}
        {id && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">id</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{id}&quot;</span>
          </span>
        )}
        {name && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">name</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{name}&quot;</span>
          </span>
        )}
        {role && (
          <span className="html-attribute role-attribute">
            {" "}
            <span className="attr-name highlight-role">role</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{role}&quot;</span>
          </span>
        )}
        {ariaLabel && (
          <span className="html-attribute aria-attribute">
            {" "}
            <span className="attr-name highlight-aria">aria-label</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{ariaLabel}&quot;</span>
          </span>
        )}
        {tabindex && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">tabindex</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{tabindex}&quot;</span>
          </span>
        )}
        {tagName === "input" || tagName === "img" || tagName === "br" ? (
          <span className="tag-bracket"> /&gt;</span>
        ) : (
          <>
            <span className="tag-bracket">&gt;</span>
            {label && (
              <span className="html-text">
                {label.length > 30 ? label.substring(0, 30) + "..." : label}
              </span>
            )}
            <span className="tag-bracket">&lt;/</span>
            <span className="tag-name">{tagName}</span>
            <span className="tag-bracket">&gt;</span>
          </>
        )}
      </div>
    </div>
  );
}

function generateFormHTML(
  type: string,
  name?: string,
  id?: string,
  ariaLabel?: string,
  label?: string,
  required?: boolean,
) {
  const elementTag =
    type === "text" || type === "checkbox" || type === "radio"
      ? "input"
      : type === "textarea"
        ? "textarea"
        : type === "select"
          ? "select"
          : type;

  return (
    <div className="semantic-html-example">
      <div className="html-tag">
        <span className="tag-bracket">&lt;</span>
        <span className="tag-name">{elementTag}</span>
        {(type === "text" || type === "checkbox" || type === "radio") && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">type</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{type}&quot;</span>
          </span>
        )}
        {id && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">id</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{id}&quot;</span>
          </span>
        )}
        {name && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name">name</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{name}&quot;</span>
          </span>
        )}
        {ariaLabel && (
          <span className="html-attribute aria-attribute">
            {" "}
            <span className="attr-name highlight-aria">aria-label</span>
            <span className="attr-equals">=</span>
            <span className="attr-value">&quot;{ariaLabel}&quot;</span>
          </span>
        )}
        {required && (
          <span className="html-attribute">
            {" "}
            <span className="attr-name highlight-required">required</span>
          </span>
        )}
        {elementTag === "input" ? (
          <span className="tag-bracket"> /&gt;</span>
        ) : (
          <>
            <span className="tag-bracket">&gt;</span>
            <span className="tag-bracket">&lt;/</span>
            <span className="tag-name">{elementTag}</span>
            <span className="tag-bracket">&gt;</span>
          </>
        )}
      </div>
      {label && (
        <>
          <div className="html-separator">└─</div>
          <div className="html-tag html-associated">
            <span className="tag-bracket">&lt;</span>
            <span className="tag-name">label</span>
            {id && (
              <span className="html-attribute">
                {" "}
                <span className="attr-name highlight-for">for</span>
                <span className="attr-equals">=</span>
                <span className="attr-value">&quot;{id}&quot;</span>
              </span>
            )}
            <span className="tag-bracket">&gt;</span>
            <span className="html-text">{label}</span>
            <span className="tag-bracket">&lt;/</span>
            <span className="tag-name">label</span>
            <span className="tag-bracket">&gt;</span>
          </div>
        </>
      )}
    </div>
  );
}

function filterSequentialHeadings(
  headings: Array<{
    level: number;
    text: string;
    id?: string;
    announcement: string;
  }>,
) {
  return headings.filter((heading, idx) => {
    // Always show the first heading
    if (idx === 0) return true;
    // Show if the level is different from the previous heading
    return heading.level !== headings[idx - 1].level;
  });
}

export function DOMAnalysisViewer({
  analysis,
  violations = [],
}: DOMAnalysisViewerProps) {
  const { headings, landmarks, roles, forms, focusable, summary } = analysis;
  const aaViolations = violations.filter(isAALevelViolation);

  return (
    <div className="dom-analysis-section">
      <div className="dom-analysis-header">
        <h2>🔍 DOM Structure & Regions</h2>
        <p className="dom-analysis-subtitle">
          Page structure including headings, landmark regions, and form controls
          {aaViolations.length > 0 &&
            " (showing JAWS details for AA level issues)"}
        </p>
      </div>

      {/* Summary */}
      <div className="dom-summary">
        <div className="summary-item">
          <span className="summary-icon">📋</span>
          <div>
            <strong>Headings:</strong>
            <span>{summary.totalHeadings}</span>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">🗺️</span>
          <div>
            <strong>Landmarks:</strong>
            <span>{summary.totalLandmarks}</span>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">📌</span>
          <div>
            <strong>Roles:</strong>
            <span>{summary.totalRoles}</span>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">📝</span>
          <div>
            <strong>Forms:</strong>
            <span>{summary.totalForms}</span>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">⌨️</span>
          <div>
            <strong>Focusable:</strong>
            <span>{summary.totalFocusable}</span>
          </div>
        </div>
      </div>

      {/* Heading Hierarchy */}
      {headings.length > 0 && (
        <div className="dom-section">
          <h3 className="dom-section-title">
            <span className="section-icon">📊</span> Heading Hierarchy
          </h3>
          {summary.missingH1 && (
            <div className="warning-banner">
              ⚠️ <strong>Missing H1:</strong> Every page should have exactly one
              H1 heading
            </div>
          )}
          {summary.skippedHeadingLevels.length > 0 && (
            <div className="warning-banner">
              ⚠️ <strong>Skipped Levels:</strong> Heading hierarchy skips
              levels: {summary.skippedHeadingLevels.join(", ")}
            </div>
          )}
          {summary.headingHierarchyValid && (
            <div className="success-banner">
              ✅ <strong>Valid Hierarchy:</strong> Heading structure is properly
              ordered
            </div>
          )}
          <div className="hierarchy-list">
            {filterSequentialHeadings(headings).map((heading, idx) => (
              <div
                key={idx}
                className={`hierarchy-item level-${heading.level}`}
                style={{ paddingLeft: `${(heading.level - 1) * 20}px` }}
              >
                <span className="heading-level">H{heading.level}</span>
                <span className="heading-text">&quot;{heading.text}&quot;</span>
                {heading.id && (
                  <span className="heading-id">#{heading.id}</span>
                )}
                {aaViolations.length > 0 && (
                  <span className="sr-announcement">
                    JAWS reads: {heading.announcement}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Landmarks */}
      {landmarks.length > 0 && (
        <div className="dom-section">
          <h3 className="dom-section-title">
            <span className="section-icon">🗺️</span> Landmark Regions
          </h3>
          <p className="section-hint">
            Use D key in JAWS to navigate between landmarks
          </p>
          <div className="landmarks-grid">
            {landmarks.map((landmark, idx) => (
              <div key={idx} className="landmark-card">
                <div className="landmark-role">{landmark.role}</div>
                {landmark.ariaLabel && (
                  <div className="landmark-label">
                    <strong>aria-label:</strong> &quot;{landmark.ariaLabel}
                    &quot;
                  </div>
                )}
                {landmark.label && !landmark.ariaLabel && (
                  <div className="landmark-label">
                    <strong>Label:</strong> &quot;{landmark.label}&quot;
                  </div>
                )}
                {aaViolations.length > 0 && (
                  <div className="sr-announcement">
                    JAWS reads: {landmark.announcement}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles */}
      {roles.length > 0 && (
        <div className="dom-section">
          <h3 className="dom-section-title">
            <span className="section-icon">📌</span> Custom Roles
          </h3>
          <p className="section-hint">Elements with explicit ARIA roles</p>
          <div className="roles-grid">
            {roles.map((role, idx) => (
              <div key={idx} className="role-card">
                <div className="role-description">
                  <span className="role-badge">{role.role}</span>
                  <span className="element-badge">
                    {" "}
                    on &lt;{role.element}&gt;
                  </span>
                </div>
                {generateRoleHTML(
                  role.element,
                  role.role,
                  role.ariaLabel,
                  role.label,
                )}
                {aaViolations.length > 0 && (
                  <div className="sr-announcement">
                    JAWS reads: {role.announcement}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forms */}
      {forms.length > 0 && (
        <div className="dom-section">
          <h3 className="dom-section-title">
            <span className="section-icon">📝</span> Form Controls
          </h3>
          <p className="section-hint">
            Form fields with their HTML structure and accessibility attributes
          </p>
          <div className="forms-list">
            {forms
              .filter(
                (form) =>
                  form.id ||
                  form.name ||
                  form.ariaLabel ||
                  form.label ||
                  form.required,
              )
              .map((form, idx) => (
                <div key={idx} className="form-item">
                  <div className="form-header">
                    <span className="form-type-badge">
                      {form.type === "text" ||
                      form.type === "checkbox" ||
                      form.type === "radio"
                        ? `<input type="${form.type}">`
                        : `<${form.type}>`}
                    </span>
                    {form.required && (
                      <span className="required-badge">Required</span>
                    )}
                  </div>
                  {generateFormHTML(
                    form.type,
                    form.name,
                    form.id,
                    form.ariaLabel,
                    form.label,
                    form.required,
                  )}
                  {aaViolations.length > 0 && (
                    <div className="sr-announcement">
                      JAWS reads: {form.announcement}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Focusable Elements / Keyboard Tab Order */}
      {focusable.length > 0 && (
        <div className="dom-section">
          <h3 className="dom-section-title">
            <span className="section-icon">⌨️</span> Keyboard Tab Order
          </h3>
          <p className="section-hint">
            Press TAB to navigate through focusable elements in this order
          </p>
          <div className="focusable-list">
            {focusable.map((item, idx) => (
              <div key={idx} className="focusable-item compact">
                <div className="tab-order-badge">{item.tabOrder}</div>
                <div className="focusable-content">
                  {generateFocusableHTML(
                    item.element,
                    item.id,
                    item.name,
                    item.type,
                    item.href,
                    item.role,
                    item.ariaLabel,
                    item.tabindex,
                    item.label,
                  )}
                  <div className="sr-announcement compact">
                    🔊 JAWS: &quot;{item.announcement}&quot;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No content */}
      {headings.length === 0 &&
        landmarks.length === 0 &&
        roles.length === 0 &&
        forms.length === 0 &&
        focusable.length === 0 && (
          <div className="empty-state">
            <p>
              No DOM structure elements found. The page may not have headings,
              landmarks, roles, or form elements.
            </p>
          </div>
        )}
    </div>
  );
}
