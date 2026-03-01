"use client";

import { useState, useRef, useEffect } from "react";
import type { DOMAnalysis, DOMTreeNode } from "@/lib/dom-analyzer";
import type { Violation } from "@/lib/types";
import { getARIARole } from "@/lib/aria-roles-reference";
import { StyledTooltip } from "./StyledTooltip";

interface DOMAnalysisViewerProps {
  analysis: DOMAnalysis;
  violations?: Violation[];
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
  // HTML5 Semantic/Structural elements
  "header",
  "nav",
  "search",
  "main",
  "section",
  "article",
  "aside",
  "footer",
  "figure",
  "figcaption",
  "details",
  "summary",
  "dialog",
  "mark",
  "time",
  // Form elements
  "form",
  "label",
  "button",
  "input",
  "select",
  "textarea",
  "datalist",
  "fieldset",
  "legend",
  "meter",
  "output",
  "progress",
  "optgroup",
  "option",
  // Media elements
  "audio",
  "video",
  "canvas",
  "svg",
  "img",
  "picture",
  // Links and navigation
  "a",
  // Headings
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  // Lists
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  // Text content
  "p",
  "blockquote",
  "pre",
  "code",
  "hr",
  // Table
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "colgroup",
  // Text semantics
  "abbr",
  "cite",
  "dfn",
  "em",
  "kbd",
  "samp",
  "strong",
  "var",
  "sub",
  "sup",
  "small",
  "b",
  "i",
  "s",
  "u",
  "q",
  "data",
  "ruby",
  "rt",
  "rp",
  "bdi",
  "bdo",
  // Embedded content
  "iframe",
  "embed",
  "object",
  // Document sections
  "address",
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

function renderAttributes(
  attributes: Record<string, string>,
  elementTag?: string,
  matchInfo?: string[],
  nodeSelector?: string,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
) {
  const entries = Object.entries(attributes).filter(
    ([name]) => name !== "class" && name !== "style" && name !== "inert",
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
        const isRoleAttribute = name === "role";
        const tooltipContent = isAriaAttribute
          ? getARIAAttributeTooltip(name, value)
          : undefined;
        const roleTooltip = isRoleAttribute
          ? getARIARoleTooltip(value, elementTag)
          : undefined;

        // Check if this attribute matches the current filter
        const isRoleMatch = isRoleAttribute && matchInfo?.includes("role");
        const isAriaMatch = isAriaAttribute && matchInfo?.includes("aria");
        const isMatched = isRoleMatch || isAriaMatch;

        // Check if this attribute is an ID that's referenced by other elements
        const isReferencedId =
          name === "id" &&
          (ariaRelationships?.idToReferences.get(value)?.length ?? 0) > 0;

        // Check if this attribute references other IDs via aria-labelledby/describedby
        const isReferencingAttribute =
          (name === "aria-labelledby" || name === "aria-describedby") &&
          (ariaRelationships?.selectorToRelationships.get(nodeSelector ?? "")
            ?.length ?? 0) > 0;

        const hasAssociation = isReferencedId || isReferencingAttribute;

        const attributeClass = getAttributeClass(name);
        const highlightedClass = [
          attributeClass,
          isMatched ? "dom-attr-matched" : "",
          hasAssociation ? "dom-attr-associated" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const badge = (
          <span className={highlightedClass}>
            <span className="dom-attr-name">{name}</span>
            <span className="dom-attr-equals">=</span>
            <span className="dom-attr-value">&quot;{value}&quot;</span>
          </span>
        );

        return tooltipContent || roleTooltip ? (
          <StyledTooltip
            key={name}
            content={`[ARIA] ${roleTooltip ?? tooltipContent}`}
            className="dom-attr-tooltip"
          >
            {badge}
          </StyledTooltip>
        ) : (
          <span key={name} className={highlightedClass}>
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

interface AriaRelationship {
  type: "labelledby" | "describedby";
  targetIds: string[];
  sourceSelector: string;
}

interface DomTreeFilters {
  roles: string[]; // array of selected roles (empty = no filter)
  ariaAttrs: string[]; // array of selected aria attributes (empty = no filter)
  associationId: boolean;
  keyword: string;
}

function buildAriaRelationshipMaps(node: DOMTreeNode | null): {
  idToSelector: Map<string, string>;
  selectorToRelationships: Map<string, AriaRelationship[]>;
  idToReferences: Map<
    string,
    { selector: string; type: "labelledby" | "describedby" }[]
  >;
} {
  const idToSelector = new Map<string, string>();
  const selectorToRelationships = new Map<string, AriaRelationship[]>();
  const idToReferences = new Map<
    string,
    { selector: string; type: "labelledby" | "describedby" }[]
  >();

  function traverse(current: DOMTreeNode) {
    // Track elements with IDs
    if (current.attributes.id) {
      idToSelector.set(current.attributes.id, current.selector);
    }

    // Track elements with aria-labelledby or aria-describedby
    const labelledBy = current.attributes["aria-labelledby"];
    const describedBy = current.attributes["aria-describedby"];

    if (labelledBy) {
      const targetIds = labelledBy.split(/\s+/).filter(Boolean);
      const relationship: AriaRelationship = {
        type: "labelledby",
        targetIds,
        sourceSelector: current.selector,
      };

      const existing = selectorToRelationships.get(current.selector) || [];
      selectorToRelationships.set(current.selector, [
        ...existing,
        relationship,
      ]);

      // Track reverse relationship
      targetIds.forEach((id) => {
        const refs = idToReferences.get(id) || [];
        refs.push({ selector: current.selector, type: "labelledby" });
        idToReferences.set(id, refs);
      });
    }

    if (describedBy) {
      const targetIds = describedBy.split(/\s+/).filter(Boolean);
      const relationship: AriaRelationship = {
        type: "describedby",
        targetIds,
        sourceSelector: current.selector,
      };

      const existing = selectorToRelationships.get(current.selector) || [];
      selectorToRelationships.set(current.selector, [
        ...existing,
        relationship,
      ]);

      // Track reverse relationship
      targetIds.forEach((id) => {
        const refs = idToReferences.get(id) || [];
        refs.push({ selector: current.selector, type: "describedby" });
        idToReferences.set(id, refs);
      });
    }

    // Recurse through children
    if (current.children) {
      current.children.forEach((child) => traverse(child));
    }
  }

  if (node) {
    traverse(node);
  }

  return { idToSelector, selectorToRelationships, idToReferences };
}

function getARIARoleTooltip(roleName: string, element?: string): string {
  const roleData = getARIARole(roleName);
  if (!roleData) {
    return `Role: ${roleName}`;
  }

  let tooltip = `${roleName.toUpperCase()}\n`;
  tooltip += `Purpose: ${roleData.purpose}\n`;
  tooltip += `${roleData.description}\n\n`;

  // Check if using native HTML equivalent
  if (roleData.nativeHTMLEquivalent && element) {
    const nativeTag = roleData.nativeHTMLEquivalent.slice(1, -1); // Remove < >
    if (element.toLowerCase() === nativeTag) {
      tooltip += `✅ Using native ${roleData.nativeHTMLEquivalent} element - good!\n`;
    } else {
      tooltip += `⚠️ Consider using ${roleData.nativeHTMLEquivalent} instead of role="${roleName}"\n`;
    }
    tooltip += `\n`;
  }

  // Add best practices
  if (roleData.bestPractices && roleData.bestPractices.length > 0) {
    tooltip += `Best Practices:\n`;
    roleData.bestPractices.forEach((practice) => {
      tooltip += `• ${practice}\n`;
    });
  }

  // Add related attributes hint
  if (roleData.relatedAttributes && roleData.relatedAttributes.length > 0) {
    tooltip += `\nCommon Attributes: ${roleData.relatedAttributes.join(", ")}`;
  }

  return tooltip;
}

function getSemanticTagDescription(tagName: string): string {
  const semanticTagDescriptions: Record<string, string> = {
    // Semantic/Structural (HTML5)
    header:
      "Represents introductory content or a group of introductory aids (logo, heading, search form, etc.)",
    nav: "Contains navigation links for the document or site",
    search:
      "Contains a set of form controls for searching or filtering content",
    main: "Specifies the main content of the document. Only one per page",
    section: "Defines a thematic grouping of content",
    article:
      "Contains independent, self-contained content that could be distributed on its own",
    aside:
      "Contains content that is tangentially related to the main content (sidebars, related links)",
    footer:
      "Represents a footer for its nearest ancestor sectioning content or root element",
    figure: "Represents self-contained content with optional caption",
    figcaption: "Caption or legend for a figure element",
    details: "Disclosure widget for hiding/showing additional details",
    summary: "Summary, caption, or legend for a details element",
    dialog: "Dialog box or interactive component (HTML5)",
    mark: "Highlighted or marked text for reference purposes",
    time: "Represents a date and/or time with machine-readable format",
    address: "Contact information for author/owner of document",
    // Form elements
    form: "Contains form controls for user input and submission",
    button: "A clickable button element for user interactions",
    input: "Form control for user input (text, checkbox, radio, etc.)",
    select: "Dropdown list for form input",
    textarea: "Multi-line text input for forms",
    label: "Associates a text label with a form control",
    datalist: "Predefined options for input element (HTML5)",
    fieldset: "Groups related form controls together",
    legend: "Caption for a fieldset element",
    meter: "Scalar measurement within a known range (HTML5)",
    output: "Result of a calculation or user action (HTML5)",
    progress: "Progress indicator for a task (HTML5)",
    optgroup: "Group of options within a select element",
    option: "Option within a select or datalist element",
    // Media (HTML5)
    audio: "Embeds sound content (HTML5)",
    video: "Embeds video content (HTML5)",
    canvas: "Graphics canvas for drawing via JavaScript (HTML5)",
    svg: "Scalable Vector Graphics container (HTML5)",
    img: "Embeds an image. Always include alt text for accessibility",
    picture: "Container for multiple image sources (HTML5)",
    // Links
    a: "Hyperlink to other pages or resources",
    // Headings
    h1: "Heading level 1 - Main page heading. Use only once per page",
    h2: "Heading level 2 - Major section heading",
    h3: "Heading level 3 - Subsection heading",
    h4: "Heading level 4 - Sub-subsection heading",
    h5: "Heading level 5 - Minor heading",
    h6: "Heading level 6 - Smallest heading",
    // Lists
    ul: "Unordered (bulleted) list",
    ol: "Ordered (numbered) list",
    li: "List item within ul or ol",
    dl: "Description list (definition list)",
    dt: "Term in a description list",
    dd: "Description of a term in a description list",
    // Text content
    p: "Paragraph of text",
    blockquote: "Extended quotation from another source",
    pre: "Preformatted text with preserved whitespace",
    code: "Fragment of computer code",
    hr: "Thematic break or horizontal rule",
    // Table
    table: "Tabular data organized in rows and columns",
    thead: "Groups header content in a table",
    tbody: "Groups body content in a table",
    tfoot: "Groups footer content in a table",
    tr: "Table row",
    th: "Table header cell",
    td: "Table data cell",
    caption: "Title or caption for a table",
    colgroup: "Group of columns in a table",
    // Text semantics
    abbr: "Abbreviation or acronym",
    cite: "Title of a creative work",
    dfn: "Term being defined",
    em: "Emphasized text (typically italic)",
    kbd: "Keyboard input",
    samp: "Sample output from a computer program",
    strong: "Strong importance (typically bold)",
    var: "Variable in mathematical expression or programming",
    sub: "Subscript text",
    sup: "Superscript text",
    small: "Side comments or small print",
    b: "Bold text without extra importance",
    i: "Italic text (alternate voice/mood)",
    s: "Text that is no longer accurate (strikethrough)",
    u: "Unarticulated annotation (underline)",
    q: "Short inline quotation",
    data: "Machine-readable content (HTML5)",
    ruby: "Ruby annotation for East Asian typography (HTML5)",
    rt: "Ruby text component (HTML5)",
    rp: "Fallback parentheses for ruby annotations (HTML5)",
    bdi: "Isolates text for bidirectional formatting (HTML5)",
    bdo: "Overrides text direction",
    // Embedded content
    iframe: "Nested browsing context (inline frame)",
    embed: "External content plugin (HTML5)",
    object: "External resource (image, video, etc.)",
  };
  return semanticTagDescriptions[tagName] || `HTML5 tag: ${tagName}`;
}

function collectRolesFromDomTree(node: DOMTreeNode | null): string[] {
  if (!node) {
    return [];
  }

  const roles = new Set<string>();

  function traverse(current: DOMTreeNode) {
    const role = current.attributes.role?.trim();
    if (role) {
      roles.add(role);
    }
    current.children?.forEach(traverse);
  }

  traverse(node);
  return Array.from(roles).sort((a, b) => a.localeCompare(b));
}

function collectAriaAttributesFromDomTree(node: DOMTreeNode | null): string[] {
  if (!node) {
    return [];
  }

  const attrs = new Set<string>();

  function traverse(current: DOMTreeNode) {
    Object.keys(current.attributes).forEach((attr) => {
      if (attr.startsWith("aria-")) {
        attrs.add(attr);
      }
    });
    current.children?.forEach(traverse);
  }

  traverse(node);
  return Array.from(attrs).sort((a, b) => a.localeCompare(b));
}

function nodeMatchesDomTreeFilters(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
): boolean {
  if (filters.roles.length > 0) {
    const nodeRole = node.attributes.role?.trim();
    if (!nodeRole || !filters.roles.includes(nodeRole)) {
      return false;
    }
  }

  if (filters.ariaAttrs.length > 0) {
    const hasMatchingAria = Object.keys(node.attributes).some(
      (attr) => attr.startsWith("aria-") && filters.ariaAttrs.includes(attr),
    );
    if (!hasMatchingAria) {
      return false;
    }
  }

  if (filters.associationId) {
    const relationships =
      ariaRelationships?.selectorToRelationships.get(node.selector) || [];
    const isSourceAssociation = relationships.length > 0;

    const elementId = node.attributes.id;
    const isTargetAssociation =
      elementId &&
      (ariaRelationships?.idToReferences.get(elementId)?.length || 0) > 0;

    if (!isSourceAssociation && !isTargetAssociation) {
      return false;
    }
  }

  if (filters.keyword.trim()) {
    const keywordFilter = filters.keyword.trim().toLowerCase();
    const keywordHaystack = [
      node.tagName,
      node.selector,
      node.textSnippet || "",
      ...Object.entries(node.attributes).flatMap(([name, value]) => [
        name,
        value,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    if (!keywordHaystack.includes(keywordFilter)) {
      return false;
    }
  }

  return true;
}

function getNodeMatchInfo(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
): string[] {
  const matches: string[] = [];

  if (filters.roles.length > 0) {
    const nodeRole = node.attributes.role?.trim();
    if (nodeRole && filters.roles.includes(nodeRole)) {
      matches.push("role");
    }
  }

  if (filters.ariaAttrs.length > 0) {
    const hasMatchingAria = Object.keys(node.attributes).some(
      (attr) => attr.startsWith("aria-") && filters.ariaAttrs.includes(attr),
    );
    if (hasMatchingAria) {
      matches.push("aria");
    }
  }

  if (filters.associationId) {
    const relationships =
      ariaRelationships?.selectorToRelationships.get(node.selector) || [];
    const isSourceAssociation = relationships.length > 0;

    const elementId = node.attributes.id;
    const isTargetAssociation =
      elementId &&
      (ariaRelationships?.idToReferences.get(elementId)?.length || 0) > 0;

    if (isSourceAssociation || isTargetAssociation) {
      matches.push("association");
    }
  }

  if (filters.keyword.trim()) {
    const keywordFilter = filters.keyword.trim().toLowerCase();
    const keywordHaystack = [
      node.tagName,
      node.selector,
      node.textSnippet || "",
      ...Object.entries(node.attributes).flatMap(([name, value]) => [
        name,
        value,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    if (keywordHaystack.includes(keywordFilter)) {
      matches.push("keyword");
    }
  }

  return matches;
}

function filterDomTreeByFilters(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
): DOMTreeNode | null {
  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "boolean") {
      return value;
    }
    return value.trim().length > 0;
  });
  if (!hasActiveFilters) {
    return node;
  }

  const filteredChildren = (node.children || [])
    .map((child) => filterDomTreeByFilters(child, filters, ariaRelationships))
    .filter((child): child is DOMTreeNode => child !== null);

  const currentNodeMatches = nodeMatchesDomTreeFilters(
    node,
    filters,
    ariaRelationships,
  );

  if (!currentNodeMatches && filteredChildren.length === 0) {
    return null;
  }

  const resultChildren = currentNodeMatches
    ? (node.children ?? [])
    : filteredChildren;

  return {
    ...node,
    children: resultChildren,
  };
}

function canRoleProduceMatches(
  role: string,
  currentFilters: DomTreeFilters,
  domTree: DOMTreeNode | null,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
): boolean {
  if (!domTree) return false;

  // Create a test filter with just this role + keep other active filters
  const testFilters: DomTreeFilters = {
    roles: [role],
    ariaAttrs: currentFilters.ariaAttrs,
    associationId: currentFilters.associationId,
    keyword: currentFilters.keyword,
  };

  // Check if any node matches this combination
  function hasMatch(node: DOMTreeNode): boolean {
    if (nodeMatchesDomTreeFilters(node, testFilters, ariaRelationships)) {
      return true;
    }
    return (node.children || []).some(hasMatch);
  }

  return hasMatch(domTree);
}

function canAriaAttrProduceMatches(
  ariaAttr: string,
  currentFilters: DomTreeFilters,
  domTree: DOMTreeNode | null,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
): boolean {
  if (!domTree) return false;

  // Create a test filter with just this aria attribute + keep other active filters
  const testFilters: DomTreeFilters = {
    roles: currentFilters.roles,
    ariaAttrs: [ariaAttr],
    associationId: currentFilters.associationId,
    keyword: currentFilters.keyword,
  };

  // Check if any node matches this combination
  function hasMatch(node: DOMTreeNode): boolean {
    if (nodeMatchesDomTreeFilters(node, testFilters, ariaRelationships)) {
      return true;
    }
    return (node.children || []).some(hasMatch);
  }

  return hasMatch(domTree);
}

function collectFilteredNodes(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
  collected: DOMTreeNode[] = [],
): DOMTreeNode[] {
  if (nodeMatchesDomTreeFilters(node, filters, ariaRelationships)) {
    collected.push(node);
  }
  (node.children || []).forEach((child) =>
    collectFilteredNodes(child, filters, ariaRelationships, collected),
  );
  return collected;
}

function renderDomTree(
  node: DOMTreeNode,
  depth: number,
  violationTargets: Map<
    string,
    { count: number; hasWcag: boolean; hasAxe: boolean }
  >,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  },
  forceExpandAll = false,
  filters?: DomTreeFilters,
  lineCounter?: { current: number },
  underHighlightedBranch = false,
) {
  const lineNumber = lineCounter ? ++lineCounter.current : undefined;
  const matchInfo = filters
    ? getNodeMatchInfo(node, filters, ariaRelationships)
    : [];
  const hasMatches = matchInfo.length > 0;
  const isSemantic = SEMANTIC_TAGS.has(node.tagName);
  const isVoid = VOID_ELEMENTS.has(node.tagName);
  const violationMeta = violationTargets.get(node.selector);
  const hasChildren = node.children && node.children.length > 0;
  const hasNonVoidElementChildren =
    node.children &&
    node.children.length > 0 &&
    node.children.some(
      (child) =>
        child.tagName &&
        child.tagName.length > 0 &&
        !VOID_ELEMENTS.has(child.tagName),
    );
  const bodyChildOpenTags = new Set([
    "main",
    "header",
    "nav",
    "section",
    "article",
    "aside",
    "footer",
    "form",
    "search",
  ]);
  const bodyChildOpenRoles = new Set([
    "main",
    "navigation",
    "banner",
    "contentinfo",
    "complementary",
    "search",
  ]);
  const role = (node.attributes.role || "").toLowerCase();
  const shouldOpenByDefault =
    node.tagName === "html" ||
    node.tagName === "body" ||
    (depth === 2 &&
      (bodyChildOpenTags.has(node.tagName) || bodyChildOpenRoles.has(role)));
  // When filters are active and this node matches, don't auto-open it
  const shouldBeOpen =
    forceExpandAll || (shouldOpenByDefault && !(filters && hasMatches));
  const visibleAttributes = Object.entries(node.attributes).filter(
    ([name]) => name !== "class" && name !== "style" && name !== "inert",
  );

  if (
    (node.tagName === "div" ||
      node.tagName === "span" ||
      node.tagName === "p") &&
    !hasChildren &&
    !node.textSnippet &&
    visibleAttributes.length === 0
  ) {
    return null;
  }

  // Check for ARIA relationships
  const relationships = ariaRelationships?.selectorToRelationships.get(
    node.selector,
  );
  const hasRelationship = relationships && relationships.length > 0;
  const hasDescribedByRelationship =
    relationships?.some((rel) => rel.type === "describedby") ?? false;
  const hasLabelledByRelationship =
    relationships?.some((rel) => rel.type === "labelledby") ?? false;

  // Check if this element is referenced by others
  const elementId = node.attributes.id;
  const referencedBy = elementId
    ? ariaRelationships?.idToReferences.get(elementId)
    : undefined;
  const isReferenced = referencedBy && referencedBy.length > 0;

  // Build association info for display
  const associationInfo = (() => {
    const info: string[] = [];
    if (hasRelationship) {
      relationships!.forEach((rel) => {
        info.push(`${rel.type}: ${rel.targetIds.join(", ")}`);
      });
    }
    if (isReferenced) {
      info.push(
        `referenced by: ${referencedBy!.map((r) => r.type).join(", ")}`,
      );
    }
    return info.length > 0 ? info.join(" | ") : null;
  })();

  const showAssociationInfo =
    filters?.associationId && (hasRelationship || isReferenced);

  const lineClass = [
    "dom-tree-line",
    isSemantic ? "dom-tree-semantic" : "",
    violationMeta ? "dom-tree-violation" : "",
    hasRelationship ? "dom-tree-has-relationship" : "",
    isReferenced ? "dom-tree-is-referenced" : "",
    showAssociationInfo ? "dom-tree-association-highlight" : "",
    hasMatches ? "dom-tree-match" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // For elements without non-void children (or with ARIA relationships), show complete tag with closing on same line
  // However, if this node has matches and filters are active, always render as toggleable
  if (
    (!hasNonVoidElementChildren ||
      hasDescribedByRelationship ||
      hasLabelledByRelationship) &&
    !isVoid &&
    !(filters && hasMatches)
  ) {
    return (
      <StyledTooltip
        key={node.selector}
        content={node.selector}
        className="dom-tree-tooltip"
      >
        <div
          className={lineClass}
          style={{ marginLeft: `${depth + 8}px` }}
          data-line={lineNumber}
        >
          {lineNumber !== undefined && (
            <span className="dom-tree-line-number">{lineNumber}</span>
          )}
          {hasMatches && (
            <span
              className="dom-tree-match-indicator"
              title={[...matchInfo, associationInfo]
                .filter(Boolean)
                .join(" | ")}
            >
              ●
            </span>
          )}
          {showAssociationInfo && !hasMatches && (
            <span
              className="dom-tree-match-indicator dom-tree-association-indicator"
              title={associationInfo || ""}
            >
              ◆
            </span>
          )}
          {Object.keys(node.attributes).length === 0 ? (
            <span className="dom-tree-tag">
              &lt;
              {node.attributes.role || isSemantic ? (
                <StyledTooltip
                  content={
                    node.attributes.role && isSemantic
                      ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}\n\n[HTML] ${getSemanticTagDescription(node.tagName)}`
                      : node.attributes.role
                        ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}`
                        : `[HTML] ${getSemanticTagDescription(node.tagName)}`
                  }
                  className="dom-badge-tooltip"
                >
                  <span>{node.tagName}</span>
                </StyledTooltip>
              ) : (
                node.tagName
              )}
              {">"}
              {}
            </span>
          ) : (
            <>
              <span className="dom-tree-tag">
                &lt;
                {node.attributes.role || isSemantic ? (
                  <StyledTooltip
                    content={
                      node.attributes.role && isSemantic
                        ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}\n\n[HTML] ${getSemanticTagDescription(node.tagName)}`
                        : node.attributes.role
                          ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}`
                          : `[HTML] ${getSemanticTagDescription(node.tagName)}`
                    }
                    className="dom-badge-tooltip"
                  >
                    <span>{node.tagName}</span>
                  </StyledTooltip>
                ) : (
                  node.tagName
                )}
              </span>
              {renderAttributes(
                node.attributes,
                node.tagName,
                matchInfo,
                node.selector,
                ariaRelationships,
              )}
              <span className="dom-tree-tag">{">"}</span>
            </>
          )}
          {node.textSnippet && (
            <span className="dom-tree-text">{node.textSnippet}</span>
          )}
          <span className="dom-tree-tag">
            &lt;/
            {isSemantic ? (
              <StyledTooltip
                content={`[HTML] ${getSemanticTagDescription(node.tagName)}`}
                className="dom-badge-tooltip"
              >
                <span>{node.tagName}</span>
              </StyledTooltip>
            ) : (
              node.tagName
            )}
            {">"}
          </span>
          <span className="dom-tree-badges">
            {violationMeta?.hasAxe && (
              <span className="dom-badge axe">AXE</span>
            )}
            {violationMeta?.hasWcag && (
              <span className="dom-badge wcag">WCAG</span>
            )}
            {relationships &&
              relationships.map((rel, idx) => (
                <StyledTooltip
                  key={`rel-${idx}`}
                  content={`[ARIA] This element is ${rel.type === "labelledby" ? "labelled by" : "described by"} element(s) with ID: ${rel.targetIds.join(", ")}`}
                  className="dom-badge-tooltip"
                >
                  <span className="dom-badge aria-relationship">
                    {rel.type === "labelledby" ? "\u2192LABEL" : "\u2192DESC"}
                  </span>
                </StyledTooltip>
              ))}
            {referencedBy && referencedBy.length > 0 && (
              <StyledTooltip
                content={`[ARIA] This element (id="${elementId}") is referenced by ${referencedBy.length} element(s) via ${referencedBy.map((r) => `aria-${r.type}`).join(", ")}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge aria-referenced">
                  {referencedBy.map((r) => `aria-${r.type}`).join(", ")}
                </span>
              </StyledTooltip>
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
        <div
          className={lineClass}
          style={{ marginLeft: `${depth + 8}px` }}
          data-line={lineNumber}
        >
          {lineNumber !== undefined && (
            <span className="dom-tree-line-number">{lineNumber}</span>
          )}
          {hasMatches && (
            <span
              className="dom-tree-match-indicator"
              title={[...matchInfo, associationInfo]
                .filter(Boolean)
                .join(" | ")}
            >
              ●
            </span>
          )}
          {showAssociationInfo && !hasMatches && (
            <span
              className="dom-tree-match-indicator dom-tree-association-indicator"
              title={associationInfo || ""}
            >
              ◆
            </span>
          )}
          {Object.keys(node.attributes).length === 0 ? (
            <span className="dom-tree-tag">
              &lt;
              {node.attributes.role || isSemantic ? (
                <StyledTooltip
                  content={
                    node.attributes.role && isSemantic
                      ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}\n\n[HTML] ${getSemanticTagDescription(node.tagName)}`
                      : node.attributes.role
                        ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}`
                        : `[HTML] ${getSemanticTagDescription(node.tagName)}`
                  }
                  className="dom-badge-tooltip"
                >
                  <span>{node.tagName}</span>
                </StyledTooltip>
              ) : (
                node.tagName
              )}
              {"/>"}{" "}
            </span>
          ) : (
            <>
              <span className="dom-tree-tag">
                &lt;
                {node.attributes.role || isSemantic ? (
                  <StyledTooltip
                    content={
                      node.attributes.role && isSemantic
                        ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}\n\n[HTML] ${getSemanticTagDescription(node.tagName)}`
                        : node.attributes.role
                          ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}`
                          : `[HTML] ${getSemanticTagDescription(node.tagName)}`
                    }
                    className="dom-badge-tooltip"
                  >
                    <span>{node.tagName}</span>
                  </StyledTooltip>
                ) : (
                  node.tagName
                )}
              </span>
              {renderAttributes(node.attributes, node.tagName, matchInfo)}
              <span className="dom-tree-tag">{"/>"} </span>
            </>
          )}
          <span className="dom-tree-badges">
            {violationMeta?.hasAxe && (
              <span className="dom-badge axe">AXE</span>
            )}
            {violationMeta?.hasWcag && (
              <span className="dom-badge wcag">WCAG</span>
            )}
            {relationships &&
              relationships.map((rel, idx) => (
                <StyledTooltip
                  key={`rel-${idx}`}
                  content={`[ARIA] This element is ${rel.type === "labelledby" ? "labelled by" : "described by"} element(s) with ID: ${rel.targetIds.join(", ")}`}
                  className="dom-badge-tooltip"
                >
                  <span className="dom-badge aria-relationship">
                    {rel.type === "labelledby" ? "→LABEL" : "→DESC"}
                  </span>
                </StyledTooltip>
              ))}
            {referencedBy && referencedBy.length > 0 && (
              <StyledTooltip
                content={`[ARIA] This element (id="${elementId}") is referenced by ${referencedBy.length} element(s) via ${referencedBy.map((r) => `aria-${r.type}`).join(", ")}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge aria-referenced">
                  {referencedBy.map((r) => `aria-${r.type}`).join(", ")}
                </span>
              </StyledTooltip>
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
          &lt;
          {node.attributes.role || isSemantic ? (
            <StyledTooltip
              content={
                node.attributes.role && isSemantic
                  ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}\n\n[HTML] ${getSemanticTagDescription(node.tagName)}`
                  : node.attributes.role
                    ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}`
                    : `[HTML] ${getSemanticTagDescription(node.tagName)}`
              }
              className="dom-badge-tooltip"
            >
              <span>{node.tagName}</span>
            </StyledTooltip>
          ) : (
            node.tagName
          )}
          {">"}
          {}
        </span>
      ) : (
        <>
          <span className="dom-tree-tag">
            &lt;
            {node.attributes.role || isSemantic ? (
              <StyledTooltip
                content={
                  node.attributes.role && isSemantic
                    ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}\n\n[HTML] ${getSemanticTagDescription(node.tagName)}`
                    : node.attributes.role
                      ? `[ARIA] ${getARIARoleTooltip(node.attributes.role, node.tagName)}`
                      : `[HTML] ${getSemanticTagDescription(node.tagName)}`
                }
                className="dom-badge-tooltip"
              >
                <span>{node.tagName}</span>
              </StyledTooltip>
            ) : (
              node.tagName
            )}
          </span>
          {renderAttributes(
            node.attributes,
            node.tagName,
            matchInfo,
            node.selector,
            ariaRelationships,
          )}
          <span className="dom-tree-tag">{">"}</span>
        </>
      )}
      {node.textSnippet && (
        <span className="dom-tree-text">{node.textSnippet}</span>
      )}
      <span className="dom-tree-badges">
        {violationMeta?.hasAxe && <span className="dom-badge axe">AXE</span>}
        {violationMeta?.hasWcag && <span className="dom-badge wcag">WCAG</span>}
        {relationships &&
          relationships.map((rel, idx) => (
            <StyledTooltip
              key={`rel-${idx}`}
              content={`[ARIA] This element is ${rel.type === "labelledby" ? "labelled by" : "described by"} element(s) with ID: ${rel.targetIds.join(", ")}`}
              className="dom-badge-tooltip"
            >
              <span className="dom-badge aria-relationship">
                {rel.type === "labelledby" ? "→LABEL" : "→DESC"}
              </span>
            </StyledTooltip>
          ))}
        {referencedBy && referencedBy.length > 0 && (
          <StyledTooltip
            content={`[ARIA] This element (id="${elementId}") is referenced by ${referencedBy.length} element(s) via ${referencedBy.map((r) => `aria-${r.type}`).join(", ")}`}
            className="dom-badge-tooltip"
          >
            <span className="dom-badge aria-referenced">
              {referencedBy.map((r) => `aria-${r.type}`).join(", ")}
            </span>
          </StyledTooltip>
        )}
      </span>
    </>
  );

  return (
    <StyledTooltip
      key={node.selector}
      content={node.selector}
      className="dom-tree-tooltip"
    >
      <details
        className="dom-tree-details"
        data-depth={depth}
        data-has-match={hasMatches ? "true" : "false"}
        data-under-highlight-branch={underHighlightedBranch ? "true" : "false"}
        data-default-open={shouldBeOpen ? "true" : "false"}
        data-initialized="false"
        style={{ marginLeft: `${depth + 8}px` }}
        data-line={lineNumber}
      >
        <summary className={`dom-tree-summary ${lineClass}`}>
          {lineNumber !== undefined && (
            <span className="dom-tree-line-number">{lineNumber}</span>
          )}
          {hasMatches && (
            <span
              className="dom-tree-match-indicator"
              title={[...matchInfo, associationInfo]
                .filter(Boolean)
                .join(" | ")}
            >
              ●
            </span>
          )}
          {showAssociationInfo && !hasMatches && (
            <span
              className="dom-tree-match-indicator dom-tree-association-indicator"
              title={associationInfo || ""}
            >
              ◆
            </span>
          )}
          {lineContent}
        </summary>
        <div className="dom-tree-children">
          {node.children.map((child) =>
            renderDomTree(
              child,
              depth + 1,
              violationTargets,
              ariaRelationships,
              forceExpandAll,
              filters,
              lineCounter,
              underHighlightedBranch || hasMatches,
            ),
          )}
        </div>
        <div className={`${lineClass} dom-tree-closing`}>
          <span className="dom-tree-tag">
            &lt;/
            {isSemantic ? (
              <StyledTooltip
                content={`[HTML] ${getSemanticTagDescription(node.tagName)}`}
                className="dom-badge-tooltip"
              >
                <span>{node.tagName}</span>
              </StyledTooltip>
            ) : (
              node.tagName
            )}
            {">"}
          </span>
        </div>
      </details>
    </StyledTooltip>
  );
}

function FilteredElementItem({
  node,
  ariaRelationships,
  filters,
}: {
  node: DOMTreeNode;
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      { selector: string; type: "labelledby" | "describedby" }[]
    >;
  };
  filters: DomTreeFilters;
}) {
  const relationships =
    ariaRelationships?.selectorToRelationships.get(node.selector) || [];
  const elementId = node.attributes.id;
  const references =
    (elementId && ariaRelationships?.idToReferences.get(elementId)) || [];

  // Check if an attribute matches the active filter
  const isAttributeFiltered = (attrName: string): boolean => {
    if (attrName === "role" && filters.roles.length > 0) return true;
    if (attrName.startsWith("aria-") && filters.ariaAttrs.includes(attrName))
      return true;
    if (attrName === "id" && filters.associationId) return true;
    return false;
  };

  // Render attributes inline
  const renderAttributesInline = () => {
    const attrs = Object.entries(node.attributes);
    if (attrs.length === 0) return null;

    return attrs.map(([name, value]) => {
      const isFiltered = isAttributeFiltered(name);
      return (
        <span key={name}>
          {" "}
          <span
            style={{
              background: isFiltered
                ? "rgba(251, 191, 36, 0.25)"
                : "transparent",
              padding: "2px 4px",
              borderRadius: "3px",
              color: isFiltered ? "#fbbf24" : "#94a3b8",
              fontWeight: isFiltered ? "600" : "normal",
            }}
          >
            {name}=&quot;{value}&quot;
          </span>
        </span>
      );
    });
  };

  // Render children in minimal format
  const renderChildrenMinimal = () => {
    if (!node.children || node.children.length === 0) return null;

    return node.children.map((child, idx) => {
      const childAttrs = Object.entries(child.attributes);
      const hasAttrs = childAttrs.length > 0;

      return (
        <span
          key={idx}
          style={{ marginLeft: "4px", color: "#64748b", opacity: 0.6 }}
        >
          <span>&lt;{child.tagName}</span>
          {hasAttrs &&
            childAttrs.map(([name, value]) => (
              <span key={name}>
                {" "}
                <span>
                  {name}=&quot;
                  {value.length > 30 ? value.substring(0, 30) + "..." : value}
                  &quot;
                </span>
              </span>
            ))}
          <span>&gt;</span>
          {child.textSnippet && <span>{child.textSnippet}</span>}
          <span>&lt;/{child.tagName}&gt;</span>
        </span>
      );
    });
  };

  return (
    <div
      style={{
        marginBottom: "12px",
        padding: "12px",
        background: "rgba(79, 70, 229, 0.05)",
        border: "1px solid rgba(79, 70, 229, 0.2)",
        borderRadius: "6px",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        lineHeight: "1.6",
      }}
    >
      {/* Main element in one line */}
      <div style={{ color: "#cbd5e1", marginBottom: "4px" }}>
        <span style={{ color: "#38bdf8" }}>&lt;{node.tagName}</span>
        {renderAttributesInline()}
        <span style={{ color: "#38bdf8" }}>&gt;</span>
        {node.textSnippet && (
          <span style={{ color: "#cbd5f5", marginLeft: "4px" }}>
            {node.textSnippet}
          </span>
        )}
        {renderChildrenMinimal()}
        <span style={{ color: "#38bdf8" }}>&lt;/{node.tagName}&gt;</span>
      </div>

      {/* Show ARIA relationships */}
      {relationships.length > 0 &&
        relationships.map((rel, idx) => {
          const relType =
            rel.type === "labelledby" ? "aria-labelledby" : "aria-describedby";
          return (
            <div key={idx} style={{ marginTop: "4px", fontSize: "0.8rem" }}>
              <span style={{ color: "#d97706", fontWeight: "600" }}>
                {relType}
              </span>
              {rel.targetIds.map((targetId) => {
                const targetSelector =
                  ariaRelationships?.idToSelector.get(targetId);
                return (
                  <span
                    key={targetId}
                    style={{
                      marginLeft: "8px",
                      color: "#94a3b8",
                    }}
                  >
                    → {targetId}
                    {targetSelector && ` (${targetSelector})`}
                  </span>
                );
              })}
            </div>
          );
        })}

      {/* Show references from other elements */}
      {references.length > 0 && (
        <div style={{ marginTop: "4px", fontSize: "0.8rem" }}>
          <span style={{ color: "#ec4899", fontWeight: "600" }}>
            Referenced by:
          </span>
          {references.map((ref, idx) => (
            <span
              key={idx}
              style={{
                marginLeft: "8px",
                color: "#94a3b8",
              }}
            >
              ←{" "}
              {ref.type === "labelledby"
                ? "aria-labelledby"
                : "aria-describedby"}{" "}
              from {ref.selector}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function DOMAnalysisViewer({
  analysis,
  violations = [],
}: DOMAnalysisViewerProps) {
  const [domTreeFilters, setDomTreeFilters] = useState<DomTreeFilters>({
    roles: [],
    ariaAttrs: [],
    associationId: false,
    keyword: "",
  });
  const [expandedRoleGroups, setExpandedRoleGroups] = useState<
    Record<string, boolean>
  >({});
  const [expandedFilterSections, setExpandedFilterSections] = useState<
    Record<"roles" | "aria", boolean>
  >({
    roles: false,
    aria: false,
  });
  const domTreeContainerRef = useRef<HTMLDivElement | null>(null);
  const { headings, landmarks, roles, forms, focusable, summary, domTree } =
    analysis;
  const violationTargets = buildViolationTargetMap(violations);
  const ariaRelationships = buildAriaRelationshipMaps(domTree || null);

  // Collect available roles and aria attributes
  const availableRoles = collectRolesFromDomTree(domTree || null);
  const availableAriaAttrs = collectAriaAttributesFromDomTree(domTree || null);
  const hasActiveDomTreeFilters =
    domTreeFilters.roles.length > 0 ||
    domTreeFilters.ariaAttrs.length > 0 ||
    domTreeFilters.associationId ||
    domTreeFilters.keyword.trim().length > 0;

  // Sync details elements' open state when filters change
  useEffect(() => {
    const elements =
      domTreeContainerRef.current?.querySelectorAll<HTMLDetailsElement>(
        ".dom-tree-details",
      );

    elements?.forEach((element) => {
      const isMatchNode = element.getAttribute("data-has-match") === "true";
      const isInHighlightedBranch =
        element.getAttribute("data-under-highlight-branch") === "true";

      if (element.getAttribute("data-initialized") !== "true") {
        // If filters are active and this is a matched/highlighted node, initialize as closed
        if (hasActiveDomTreeFilters && (isMatchNode || isInHighlightedBranch)) {
          element.open = false;
        }
        element.setAttribute("data-initialized", "true");
      }

      if (hasActiveDomTreeFilters) {
        // Reset user-opened only for matched/highlighted nodes so they respect the closed default
        if (isMatchNode || isInHighlightedBranch) {
          element.removeAttribute("data-user-opened");
        }

        if (!element.hasAttribute("data-user-opened")) {
          element.open = !(isMatchNode || isInHighlightedBranch);
        }
      } else if (!element.hasAttribute("data-user-opened")) {
        const isMainSection =
          element.getAttribute("data-default-open") === "true";
        if (!isMainSection) {
          element.open = false;
        }
      }
    });
  }, [hasActiveDomTreeFilters, domTreeFilters]);

  // Track user interactions with details elements
  useEffect(() => {
    const getSingleNestedDetails = (
      detailsElement: HTMLDetailsElement,
    ): HTMLDetailsElement | null => {
      const childrenContainer = Array.from(detailsElement.children).find(
        (child) =>
          child instanceof HTMLElement &&
          child.classList.contains("dom-tree-children"),
      ) as HTMLElement | undefined;

      if (!childrenContainer) {
        return null;
      }

      const wrappers = Array.from(childrenContainer.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      );

      if (wrappers.length !== 1) {
        return null;
      }

      const directChildDetails = Array.from(wrappers[0].children).find(
        (child) =>
          child instanceof HTMLDetailsElement &&
          child.classList.contains("dom-tree-details"),
      );

      return directChildDetails instanceof HTMLDetailsElement
        ? directChildDetails
        : null;
    };

    const MAX_AUTO_OPEN_CHAIN_DEPTH = 3;

    const openSingleChildToggleChain = (root: HTMLDetailsElement) => {
      let current: HTMLDetailsElement | null = root;
      let depth = 0;

      while (current && depth < MAX_AUTO_OPEN_CHAIN_DEPTH) {
        const nestedDetails = getSingleNestedDetails(current);
        if (!nestedDetails || nestedDetails.hasAttribute("data-user-opened")) {
          break;
        }

        nestedDetails.open = true;
        nestedDetails.setAttribute("data-user-opened", "true");
        current = nestedDetails;
        depth += 1;
      }
    };

    const handleToggle = (e: Event) => {
      const target = e.target as HTMLDetailsElement;
      if (target.classList.contains("dom-tree-details") && e.isTrusted) {
        target.setAttribute("data-user-opened", "true");
        if (target.open) {
          openSingleChildToggleChain(target);
        }
      }
    };

    const elements =
      domTreeContainerRef.current?.querySelectorAll<HTMLDetailsElement>(
        ".dom-tree-details",
      );

    elements?.forEach((element) => {
      element.addEventListener("toggle", handleToggle);
    });

    return () => {
      elements?.forEach((element) => {
        element.removeEventListener("toggle", handleToggle);
      });
    };
  }, [domTreeFilters]);
  const domTreeFilterChipSource: Array<{
    key: keyof DomTreeFilters;
    label: string;
    isActive: boolean;
    value: string;
  }> = [
    {
      key: "roles",
      label: "Roles",
      isActive: domTreeFilters.roles.length > 0,
      value: `${domTreeFilters.roles.length} selected`,
    },
    {
      key: "ariaAttrs",
      label: "ARIA",
      isActive: domTreeFilters.ariaAttrs.length > 0,
      value: `${domTreeFilters.ariaAttrs.length} selected`,
    },
    {
      key: "associationId",
      label: "ARIA associations",
      isActive: domTreeFilters.associationId,
      value: "association",
    },
    {
      key: "keyword",
      label: "Keyword",
      isActive: domTreeFilters.keyword.trim().length > 0,
      value: domTreeFilters.keyword,
    },
  ];
  const activeDomTreeFilterChips = domTreeFilterChipSource.filter(
    (chip) => chip.isActive,
  );
  const filteredDomTree = domTree
    ? filterDomTreeByFilters(domTree, domTreeFilters, ariaRelationships)
    : null;

  // Collect all nodes that match the filter
  const filteredNodes =
    domTree && hasActiveDomTreeFilters
      ? collectFilteredNodes(domTree, domTreeFilters, ariaRelationships)
      : [];

  const groupedRoles = roles.reduce<
    Array<{
      role: string;
      count: number;
      elements: string[];
      labels: string[];
      ariaLabels: string[];
      entries: Array<{ element: string; label?: string; ariaLabel?: string }>;
    }>
  >((groups, roleItem) => {
    const normalizedRole = roleItem.role.trim().toLowerCase();
    const existingGroup = groups.find(
      (group) => group.role.toLowerCase() === normalizedRole,
    );

    if (!existingGroup) {
      groups.push({
        role: roleItem.role,
        count: 1,
        elements: [roleItem.element],
        labels: roleItem.label ? [roleItem.label] : [],
        ariaLabels: roleItem.ariaLabel ? [roleItem.ariaLabel] : [],
        entries: [
          {
            element: roleItem.element,
            label: roleItem.label,
            ariaLabel: roleItem.ariaLabel,
          },
        ],
      });
      return groups;
    }

    existingGroup.count += 1;
    if (!existingGroup.elements.includes(roleItem.element)) {
      existingGroup.elements.push(roleItem.element);
    }
    if (roleItem.label && !existingGroup.labels.includes(roleItem.label)) {
      existingGroup.labels.push(roleItem.label);
    }
    if (
      roleItem.ariaLabel &&
      !existingGroup.ariaLabels.includes(roleItem.ariaLabel)
    ) {
      existingGroup.ariaLabels.push(roleItem.ariaLabel);
    }
    existingGroup.entries.push({
      element: roleItem.element,
      label: roleItem.label,
      ariaLabel: roleItem.ariaLabel,
    });

    return groups;
  }, []);

  return (
    <div className="dom-analysis-section">
      <div className="dom-analysis-header">
        <h2>🔍 DOM Structure & Regions</h2>
        <p className="dom-analysis-subtitle">
          Page structure including headings, landmark regions, and form controls
        </p>
      </div>

      {domTree && (
        <div className="dom-section">
          <h3 className="dom-section-title">
            <span className="section-icon">🧭</span> Interactive DOM Tree
          </h3>
          <div className="dom-tree-filters">
            {/* Roles Filter Section */}
            <div className="dom-tree-filter-section">
              <button
                className="dom-tree-filter-section-toggle"
                onClick={() =>
                  setExpandedFilterSections((prev) => ({
                    ...prev,
                    roles: !prev.roles,
                  }))
                }
              >
                <span className="toggle-icon">
                  {expandedFilterSections.roles ? "▼" : "▶"}
                </span>
                <span className="dom-tree-filter-label">Roles</span>
                {domTreeFilters.roles.length > 0 && (
                  <span className="filter-count">
                    ({domTreeFilters.roles.length})
                  </span>
                )}
              </button>

              {expandedFilterSections.roles && (
                <div className="dom-tree-filter-group">
                  <label className="dom-tree-filter-all">
                    <input
                      type="checkbox"
                      checked={
                        domTreeFilters.roles.length === availableRoles.length &&
                        availableRoles.length > 0
                      }
                      onChange={(event) =>
                        setDomTreeFilters((prev) => ({
                          ...prev,
                          roles: event.target.checked ? availableRoles : [],
                        }))
                      }
                    />
                    <span>All roles</span>
                  </label>

                  {availableRoles.map((role) => {
                    const canProduce = canRoleProduceMatches(
                      role,
                      domTreeFilters,
                      domTree,
                      ariaRelationships,
                    );
                    return (
                      <label
                        key={role}
                        className="dom-tree-filter-item"
                        style={{ opacity: canProduce ? 1 : 0.5 }}
                      >
                        <input
                          type="checkbox"
                          checked={domTreeFilters.roles.includes(role)}
                          disabled={
                            !canProduce && !domTreeFilters.roles.includes(role)
                          }
                          onChange={(event) =>
                            setDomTreeFilters((prev) => ({
                              ...prev,
                              roles: event.target.checked
                                ? [...prev.roles, role]
                                : prev.roles.filter((r) => r !== role),
                            }))
                          }
                        />
                        <span>{role}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ARIA Attributes Filter Section */}
            <div className="dom-tree-filter-section">
              <button
                className="dom-tree-filter-section-toggle"
                onClick={() =>
                  setExpandedFilterSections((prev) => ({
                    ...prev,
                    aria: !prev.aria,
                  }))
                }
              >
                <span className="toggle-icon">
                  {expandedFilterSections.aria ? "▼" : "▶"}
                </span>
                <span className="dom-tree-filter-label">ARIA</span>
                {domTreeFilters.ariaAttrs.length > 0 && (
                  <span className="filter-count">
                    ({domTreeFilters.ariaAttrs.length})
                  </span>
                )}
              </button>

              {expandedFilterSections.aria && (
                <div className="dom-tree-filter-group">
                  <label className="dom-tree-filter-all">
                    <input
                      type="checkbox"
                      checked={
                        domTreeFilters.ariaAttrs.length ===
                          availableAriaAttrs.length &&
                        availableAriaAttrs.length > 0
                      }
                      onChange={(event) =>
                        setDomTreeFilters((prev) => ({
                          ...prev,
                          ariaAttrs: event.target.checked
                            ? availableAriaAttrs
                            : [],
                        }))
                      }
                    />
                    <span>All ARIA attributes</span>
                  </label>

                  {availableAriaAttrs.map((attr) => {
                    const canProduce = canAriaAttrProduceMatches(
                      attr,
                      domTreeFilters,
                      domTree,
                      ariaRelationships,
                    );
                    return (
                      <label
                        key={attr}
                        className="dom-tree-filter-item"
                        style={{ opacity: canProduce ? 1 : 0.5 }}
                      >
                        <input
                          type="checkbox"
                          checked={domTreeFilters.ariaAttrs.includes(attr)}
                          disabled={
                            !canProduce &&
                            !domTreeFilters.ariaAttrs.includes(attr)
                          }
                          onChange={(event) =>
                            setDomTreeFilters((prev) => ({
                              ...prev,
                              ariaAttrs: event.target.checked
                                ? [...prev.ariaAttrs, attr]
                                : prev.ariaAttrs.filter((a) => a !== attr),
                            }))
                          }
                        />
                        <span>{attr}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <label className="dom-tree-filter dom-tree-filter-checkbox">
              <input
                type="checkbox"
                checked={domTreeFilters.associationId}
                onChange={(event) =>
                  setDomTreeFilters((prev) => ({
                    ...prev,
                    associationId: event.target.checked,
                  }))
                }
              />
              <span className="dom-tree-filter-label">ARIA associations</span>
            </label>

            <label className="dom-tree-filter">
              <span className="dom-tree-filter-label">Keyword search</span>
              <input
                type="text"
                value={domTreeFilters.keyword}
                placeholder="tag, selector, text, attribute"
                onChange={(event) =>
                  setDomTreeFilters((prev) => ({
                    ...prev,
                    keyword: event.target.value,
                  }))
                }
              />
            </label>

            <button
              type="button"
              className="dom-tree-filter-reset"
              disabled={!hasActiveDomTreeFilters}
              onClick={() =>
                setDomTreeFilters({
                  roles: [],
                  ariaAttrs: [],
                  associationId: false,
                  keyword: "",
                })
              }
            >
              Clear filters
            </button>
          </div>
          {activeDomTreeFilterChips.length > 0 && (
            <div className="dom-tree-filter-chips" aria-label="Active filters">
              {activeDomTreeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  className="dom-tree-filter-chip"
                  onClick={() =>
                    setDomTreeFilters((prev) => ({
                      ...prev,
                      [chip.key]:
                        chip.key === "roles" || chip.key === "ariaAttrs"
                          ? []
                          : chip.key === "keyword"
                            ? ""
                            : false,
                    }))
                  }
                >
                  <span>{chip.label}</span>
                  {chip.key !== "roles" && chip.key !== "ariaAttrs" && (
                    <>
                      <span>: </span>
                      <strong>{chip.value}</strong>
                    </>
                  )}
                  <span
                    className="dom-tree-filter-chip-remove"
                    aria-hidden="true"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          )}
          <p className="section-hint">
            Expand any line to explore children. ARIA, WCAG, AXE, and HTML5
            semantics are highlighted. ARIA relationships
            (labelledby/describedby) shown with →LABEL/→DESC and ←REF badges.
          </p>
          {filteredNodes.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                padding: "16px",
                background: "rgba(79, 70, 229, 0.08)",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                borderRadius: "8px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  color: "#4f46e5",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                Filtered Elements ({filteredNodes.length})
              </h4>
              {filteredNodes.map((node, idx) => (
                <FilteredElementItem
                  key={`${node.selector}-${idx}`}
                  node={node}
                  ariaRelationships={ariaRelationships}
                  filters={domTreeFilters}
                />
              ))}
            </div>
          )}
          <div className="dom-tree" ref={domTreeContainerRef}>
            {filteredDomTree ? (
              renderDomTree(
                filteredDomTree,
                0,
                violationTargets,
                ariaRelationships,
                false,
                domTreeFilters,
                { current: 0 },
              )
            ) : (
              <p className="dom-tree-empty">
                No elements match the current filters.
              </p>
            )}
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
          <p className="section-hint">
            Grouped by role to keep similar patterns together
          </p>
          <div className="roles-grid">
            {groupedRoles.map((group, idx) => (
              <div
                key={`${group.role}-${idx}`}
                className="role-card role-card-compact"
              >
                <div className="role-description role-description-compact">
                  <span className="role-badge">{group.role}</span>
                  <span className="role-count">
                    {group.count} item{group.count !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="role-elements-inline">
                  {group.elements.map((elementName) => (
                    <span key={elementName} className="element-badge">
                      &lt;{elementName}&gt;
                    </span>
                  ))}
                </div>

                {group.ariaLabels.length > 0 && (
                  <p className="role-meta-line">
                    <strong>aria-label:</strong> &quot;{group.ariaLabels[0]}
                    &quot;
                    {group.ariaLabels.length > 1
                      ? ` +${group.ariaLabels.length - 1} more`
                      : ""}
                  </p>
                )}

                {group.labels.length > 0 && (
                  <p className="role-meta-line">
                    <strong>Visible label:</strong> &quot;{group.labels[0]}
                    &quot;
                    {group.labels.length > 1
                      ? ` +${group.labels.length - 1} more`
                      : ""}
                  </p>
                )}

                <button
                  type="button"
                  className="role-toggle"
                  onClick={() =>
                    setExpandedRoleGroups((prev) => ({
                      ...prev,
                      [`${group.role}-${idx}`]: !prev[`${group.role}-${idx}`],
                    }))
                  }
                  aria-expanded={Boolean(
                    expandedRoleGroups[`${group.role}-${idx}`],
                  )}
                >
                  {expandedRoleGroups[`${group.role}-${idx}`]
                    ? "Hide affected elements"
                    : `Show all affected elements (${group.entries.length})`}
                </button>

                {expandedRoleGroups[`${group.role}-${idx}`] && (
                  <ul className="role-affected-list">
                    {group.entries.map((entry, entryIdx) => (
                      <li key={`${group.role}-${idx}-${entryIdx}`}>
                        <span className="role-entry-html">
                          <span className="tag-bracket">&lt;</span>
                          <span className="tag-name">{entry.element}</span>
                          <span className="html-attribute role-attribute">
                            {" "}
                            <span className="attr-name highlight-role">
                              role
                            </span>
                            <span className="attr-equals">=</span>
                            <span className="attr-value">
                              &quot;{group.role}&quot;
                            </span>
                          </span>
                          <span className="tag-bracket">&gt;</span>
                        </span>
                        {entry.ariaLabel && (
                          <span className="role-entry-meta">
                            aria-label=&quot;{entry.ariaLabel}&quot;
                          </span>
                        )}
                        {entry.label && !entry.ariaLabel && (
                          <span className="role-entry-meta">
                            label=&quot;{entry.label}&quot;
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
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
