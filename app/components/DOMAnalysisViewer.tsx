"use client";

import type { DOMAnalysis, DOMTreeNode } from "@/lib/dom-analyzer";
import type { Violation } from "@/lib/types";
import { getARIARole } from "@/lib/aria-roles-reference";
import { StyledTooltip } from "./StyledTooltip";

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

const SEMANTIC_TAGS = new Set([
  "header",
  "nav",
  "main",
  "section",
  "article",
  "aside",
  "footer",
  "form",
  "label",
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "img",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
]);

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const MAX_ATTRS_PER_NODE = 12;

function getAttributeClass(attributeName: string) {
  if (attributeName === "role") return "dom-attr role";
  if (attributeName.startsWith("aria-")) return "dom-attr aria";
  if (attributeName === "tabindex") return "dom-attr focus";
  if (["alt", "title", "placeholder", "for"].includes(attributeName)) {
    return "dom-attr label";
  }
  if (["id", "name"].includes(attributeName)) {
    return "dom-attr id";
  }
  if (["href", "src"].includes(attributeName)) return "dom-attr link";
  if (["required", "disabled", "readonly"].includes(attributeName)) {
    return "dom-attr state";
  }
  return "dom-attr";
}

function getARIAAttributeTooltip(name: string, value: string): string {
  const ariaAttributeInfo: Record<string, string> = {
    "aria-label":
      "Provides an accessible name. Used when there is no visible text label. Screen readers announce: ",
    "aria-labelledby":
      "Links to element(s) that label this element using their ID. Provides accessible name from linked element(s). Screen readers announce: ",
    "aria-describedby":
      "Links to element(s) that describe this element. Provides extended description. Screen readers announce: ",
    "aria-value":
      "Indicates the current value of a range widget (slider, progress bar, etc.)",
    "aria-valuemin": "Indicates the minimum value for a range widget",
    "aria-valuemax": "Indicates the maximum value for a range widget",
    "aria-valuenow": "Indicates the current numeric value for a range widget",
    "aria-hidden":
      "Tells assistive tech to hide element. Use only on decorative/duplicate content",
    "aria-live":
      "Announces dynamic content updates. polite=waits for pause, assertive=interrupts",
    "aria-atomic":
      "When true, announces entire region on update, not just changes",
    "aria-relevant":
      "Specifies what dynamic changes trigger announcements (additions, removals, text, all)",
    "aria-busy": "Indicates asynchronous operation in progress (true/false)",
    "aria-pressed":
      "For toggle buttons. Indicates button state: true, false, or mixed",
    "aria-current":
      "Marks the element as representing the current item (page, step, location, time, etc.)",
    "aria-expanded": "For collapsible elements. true=expanded, false=collapsed",
    "aria-disabled":
      "Indicates whether element is disabled. Note: use HTML disabled attribute when possible",
    "aria-readonly": "Indicates element should not be modified by user",
    "aria-required":
      "Indicates form field is required. Note: use HTML required attribute when possible",
    "aria-invalid":
      "Indicates field has invalid data. true=invalid, false=valid, grammar/spelling for type",
    "aria-checked":
      "For checkboxes/radio buttons. true=checked, false=unchecked, mixed=partially checked",
    "aria-selected": "For selectable items. true=selected, false=not selected",
    "aria-modal": "For dialogs. true=modal (traps focus), false=modeless",
    "aria-sort":
      "For sortable columns. ascending/descending/none/other to indicate sort direction",
    "aria-rowcount": "Number of rows in a table/grid (use with aria-rowindex)",
    "aria-colcount": "Number of columns in a table/grid",
    "aria-rowindex": "Row position in table/grid structure",
    "aria-colindex": "Column position in table/grid structure",
    "aria-level":
      "For headings in non-h1-h6 elements. Value 1-6 indicates heading level",
    "aria-multiline":
      "For textbox role. Indicates if single-line or multi-line input",
    "aria-owns":
      "Establishes parent-child relationship for elements not in DOM hierarchy",
    "aria-controls": "Indicates this element controls another element by ID",
    "aria-flowto":
      "Indicates reading order. Used to override natural DOM order",
    "aria-haspopup":
      "Indicates this element has a popup menu, dropdown, or dialog. Values: false (default, no popup), true (generic popup), menu (dropdown menu), listbox (listbox popup), tree (tree popup), grid (grid popup), dialog (dialog popup). Helps screen reader users understand that activating this element opens a popup",
  };

  const description = ariaAttributeInfo[name] || `${name} attribute`;
  const tooltip = `${description}"${value}"`;
  return tooltip;
}

function renderAttributes(attributes: Record<string, string>) {
  const entries = Object.entries(attributes).filter(
    ([name]) => name !== "class" && name !== "style",
  );
  const visible = entries.slice(0, MAX_ATTRS_PER_NODE);
  const hiddenCount = entries.length - visible.length;

  if (visible.length === 0 && hiddenCount === 0) {
    return null;
  }

  return (
    <>
      {visible.map(([name, value]) => {
        const isAriaAttribute = name.startsWith("aria-");
        const tooltipContent = isAriaAttribute
          ? getARIAAttributeTooltip(name, value)
          : undefined;

        const badge = (
          <span className={getAttributeClass(name)}>
            <span className="dom-attr-name">{name}</span>
            <span className="dom-attr-equals">=</span>
            <span className="dom-attr-value">&quot;{value}&quot;</span>
          </span>
        );

        return isAriaAttribute && tooltipContent ? (
          <StyledTooltip
            key={name}
            content={`[ARIA] ${tooltipContent}`}
            className="dom-attr-tooltip"
          >
            {badge}
          </StyledTooltip>
        ) : (
          <span key={name} className={getAttributeClass(name)}>
            <span className="dom-attr-name">{name}</span>
            <span className="dom-attr-equals">=</span>
            <span className="dom-attr-value">&quot;{value}&quot;</span>
          </span>
        );
      })}
      {hiddenCount > 0 && (
        <span className="dom-attr dom-attr-more">+{hiddenCount} more</span>
      )}
    </>
  );
}

function buildViolationTargetMap(violations: Violation[]) {
  const map = new Map<
    string,
    { count: number; hasWcag: boolean; hasAxe: boolean }
  >();

  violations.forEach((violation) => {
    const hasWcag = (violation.tags || []).some((tag) =>
      tag.toLowerCase().startsWith("wcag"),
    );
    const hasAxe = true;

    violation.nodes.forEach((node) => {
      (node.target || []).forEach((selector) => {
        const existing = map.get(selector);
        if (existing) {
          existing.count += 1;
          existing.hasWcag = existing.hasWcag || hasWcag;
          existing.hasAxe = existing.hasAxe || hasAxe;
        } else {
          map.set(selector, {
            count: 1,
            hasWcag,
            hasAxe,
          });
        }
      });
    });
  });

  return map;
}

function getARIARoleTooltip(roleName: string): string {
  const roleData = getARIARole(roleName);
  if (!roleData) {
    return `Role: ${roleName}`;
  }
  return `${roleName} (${roleData.category}): ${roleData.description}`;
}

function getSemanticTagDescription(tagName: string): string {
  const semanticTagDescriptions: Record<string, string> = {
    header:
      "Represents introductory content or a group of introductory aids (logo, heading, search form, etc.)",
    nav: "Contains navigation links for the document or site",
    main: "Specifies the main content of the document. Only one per page",
    section: "Defines a thematic grouping of content",
    article:
      "Contains independent, self-contained content that could be distributed on its own",
    aside:
      "Contains content that is tangentially related to the main content (sidebars, related links)",
    footer:
      "Represents a footer for its nearest ancestor sectioning content or root element",
    form: "Contains form controls for user input and submission",
    button: "A clickable button element for user interactions",
    a: "Hyperlink to other pages or resources",
    input: "Form control for user input (text, checkbox, radio, etc.)",
    select: "Dropdown list for form input",
    textarea: "Multi-line text input for forms",
    img: "Embeds an image. Always include alt text for accessibility",
    h1: "Heading level 1 - Main page heading. Use only once per page",
    h2: "Heading level 2 - Major section heading",
    h3: "Heading level 3 - Subsection heading",
    h4: "Heading level 4 - Sub-subsection heading",
    h5: "Heading level 5 - Minor heading",
    h6: "Heading level 6 - Smallest heading",
    ul: "Unordered (bulleted) list",
    ol: "Ordered (numbered) list",
    li: "List item within ul or ol",
    label: "Associates a text label with a form control",
  };
  return semanticTagDescriptions[tagName] || `Semantic HTML5 tag: ${tagName}`;
}

function renderDomTree(
  node: DOMTreeNode,
  depth: number,
  violationTargets: Map<
    string,
    { count: number; hasWcag: boolean; hasAxe: boolean }
  >,
) {
  const isSemantic = SEMANTIC_TAGS.has(node.tagName);
  const isVoid = VOID_ELEMENTS.has(node.tagName);
  const violationMeta = violationTargets.get(node.selector);
  const hasChildren = node.children && node.children.length > 0;
  const lineClass = [
    "dom-tree-line",
    isSemantic ? "dom-tree-semantic" : "",
    violationMeta ? "dom-tree-violation" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // For elements without children (but not void), show complete tag with closing on same line
  if (!hasChildren && !isVoid) {
    return (
      <StyledTooltip
        key={node.selector}
        content={node.selector}
        className="dom-tree-tooltip"
      >
        <div className={lineClass} style={{ paddingLeft: `${depth * 16}px` }}>
          {Object.keys(node.attributes).length === 0 ? (
            <span className="dom-tree-tag">
              &lt;{node.tagName}
              {">"}{" "}
            </span>
          ) : (
            <>
              <span className="dom-tree-tag">&lt;{node.tagName}</span>
              {renderAttributes(node.attributes)}
              <span className="dom-tree-tag">{">"}</span>
            </>
          )}
          {node.textSnippet && (
            <span className="dom-tree-text">{node.textSnippet}</span>
          )}
          <span className="dom-tree-tag">
            &lt;/{node.tagName}
            {">"}
          </span>
          <span className="dom-tree-badges">
            {node.attributes.role && (
              <StyledTooltip
                content={`[ARIA] ${getARIARoleTooltip(node.attributes.role)}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge aria">ROLE</span>
              </StyledTooltip>
            )}
            {isSemantic && (
              <StyledTooltip
                content={`[HTML] ${getSemanticTagDescription(node.tagName)}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge html5">HTML5</span>
              </StyledTooltip>
            )}
            {violationMeta?.hasAxe && (
              <span className="dom-badge axe">AXE</span>
            )}
            {violationMeta?.hasWcag && (
              <span className="dom-badge wcag">WCAG</span>
            )}
          </span>
        </div>
      </StyledTooltip>
    );
  }

  // For void elements (self-closing)
  if (isVoid) {
    return (
      <StyledTooltip
        key={node.selector}
        content={node.selector}
        className="dom-tree-tooltip"
      >
        <div className={lineClass} style={{ paddingLeft: `${depth * 16}px` }}>
          {Object.keys(node.attributes).length === 0 ? (
            <span className="dom-tree-tag">
              &lt;{node.tagName}
              {"/>"}{" "}
            </span>
          ) : (
            <>
              <span className="dom-tree-tag">&lt;{node.tagName}</span>
              {renderAttributes(node.attributes)}
              <span className="dom-tree-tag">{"/>"} </span>
            </>
          )}
          <span className="dom-tree-badges">
            {node.attributes.role && (
              <StyledTooltip
                content={`[ARIA] ${getARIARoleTooltip(node.attributes.role)}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge aria">ROLE</span>
              </StyledTooltip>
            )}
            {isSemantic && (
              <StyledTooltip
                content={`[HTML] ${getSemanticTagDescription(node.tagName)}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge html5">HTML5</span>
              </StyledTooltip>
            )}
            {violationMeta?.hasAxe && (
              <span className="dom-badge axe">AXE</span>
            )}
            {violationMeta?.hasWcag && (
              <span className="dom-badge wcag">WCAG</span>
            )}
          </span>
        </div>
      </StyledTooltip>
    );
  }

  // For elements with children - collapsible
  const lineContent = (
    <>
      {Object.keys(node.attributes).length === 0 ? (
        <span className="dom-tree-tag">
          &lt;{node.tagName}
          {">"}{" "}
        </span>
      ) : (
        <>
          <span className="dom-tree-tag">&lt;{node.tagName}</span>
          {renderAttributes(node.attributes)}
          <span className="dom-tree-tag">{">"}</span>
        </>
      )}
      {node.textSnippet && (
        <span className="dom-tree-text">{node.textSnippet}</span>
      )}
      <span className="dom-tree-badges">
        {node.attributes.role && (
          <StyledTooltip
            content={`[ARIA] ${getARIARoleTooltip(node.attributes.role)}`}
            className="dom-badge-tooltip"
          >
            <span className="dom-badge aria">ROLE</span>
          </StyledTooltip>
        )}
        {isSemantic && (
          <StyledTooltip
            content={`[HTML] ${getSemanticTagDescription(node.tagName)}`}
            className="dom-badge-tooltip"
          >
            <span className="dom-badge html5">HTML5</span>
          </StyledTooltip>
        )}
        {violationMeta?.hasAxe && <span className="dom-badge axe">AXE</span>}
        {violationMeta?.hasWcag && <span className="dom-badge wcag">WCAG</span>}
      </span>
    </>
  );

  return (
    <StyledTooltip
      key={node.selector}
      content={node.selector}
      className="dom-tree-tooltip"
    >
      <details className="dom-tree-details" open={depth < 2}>
        <summary
          className={`dom-tree-summary ${lineClass}`}
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          {lineContent}
        </summary>
        <div className="dom-tree-children">
          {node.children.map((child) =>
            renderDomTree(child, depth + 1, violationTargets),
          )}
          <div
            className="dom-tree-line dom-tree-closing"
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            <span className="dom-tree-tag">
              &lt;/{node.tagName}
              {">"}
            </span>
          </div>
        </div>
      </details>
    </StyledTooltip>
  );
}

export function DOMAnalysisViewer({
  analysis,
  violations = [],
}: DOMAnalysisViewerProps) {
  const { headings, landmarks, roles, forms, focusable, summary, domTree } =
    analysis;
  const aaViolations = violations.filter(isAALevelViolation);
  const violationTargets = buildViolationTargetMap(violations);

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

      {domTree && (
        <div className="dom-section">
          <h3 className="dom-section-title">
            <span className="section-icon">🧭</span> Interactive DOM Tree
          </h3>
          <p className="section-hint">
            Expand any line to explore children. ARIA, WCAG, AXE, and HTML5
            semantics are highlighted.
          </p>
          <div className="dom-tree">
            {renderDomTree(domTree, 0, violationTargets)}
          </div>
        </div>
      )}

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
        focusable.length === 0 &&
        !domTree && (
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
