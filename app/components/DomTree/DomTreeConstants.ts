/**
 * Constants for DOM tree rendering and analysis
 * Extracted to reduce duplication and improve maintainability
 */

export const SEMANTIC_TAGS = new Set([
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

export const VOID_ELEMENTS = new Set([
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

export const MAX_ATTRS_PER_NODE = 12;

export const DEFAULT_DOM_TREE_FILTERS = {
  roles: [] as string[],
  ariaAttrs: [] as string[],
  associationId: false,
  keyword: "",
};

export const BODY_CHILD_OPEN_TAGS = new Set([
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

export const BODY_CHILD_OPEN_ROLES = new Set([
  "main",
  "navigation",
  "banner",
  "contentinfo",
  "complementary",
  "search",
]);

// CSS-in-JS style objects
export const STYLES = {
  filterChipBase: {
    padding: "8px 12px",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
    color: "#4f46e5",
  } as const,

  filterButtonBase: {
    padding: "8px 12px",
    backgroundColor: "transparent",
    border: "1px solid rgba(148, 163, 184, 0.3)",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
  } as const,

  attrBadgeBase: {
    display: "inline-block",
    padding: "2px 6px",
    marginRight: "4px",
    borderRadius: "3px",
    fontSize: "0.7rem",
    fontWeight: "600",
  } as const,

  filteredAttributeStyle: {
    background: "rgba(251, 191, 36, 0.25)",
    padding: "2px 4px",
    borderRadius: "3px",
    color: "#fbbf24",
    fontWeight: "600",
  } as const,

  unfilteredAttributeStyle: {
    background: "transparent",
    padding: "2px 4px",
    borderRadius: "3px",
    color: "#94a3b8",
  } as const,

  domTreeLineBase: {
    marginBottom: "4px",
    color: "#cbd5e1",
  } as const,

  filteredElementsContainerStyle: {
    padding: "16px",
    background: "rgba(79, 70, 229, 0.08)",
    border: "1px solid rgba(79, 70, 229, 0.3)",
    borderRadius: "8px",
  } as const,

  filteredElementItemStyle: {
    marginBottom: "12px",
    padding: "12px",
    background: "rgba(79, 70, 229, 0.05)",
    border: "1px solid rgba(79, 70, 229, 0.2)",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "0.85rem",
    lineHeight: "1.6",
  } as const,
};
