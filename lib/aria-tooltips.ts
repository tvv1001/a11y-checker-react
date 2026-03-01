/**
 * ARIA Attribute tooltips and descriptions
 * Centralized for maintainability and reusability
 */

const ARIA_ATTRIBUTE_TOOLTIPS: Record<string, string> = {
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
  "aria-flowto": "Indicates reading order. Used to override natural DOM order",
  "aria-haspopup":
    "Indicates this element has a popup menu, dropdown, or dialog. Values: false (default, no popup), true (generic popup), menu (dropdown menu), listbox (listbox popup), tree (tree popup), grid (grid popup), dialog (dialog popup). Helps screen reader users understand that activating this element opens a popup",
  "aria-activedescendant":
    "Identifies the currently active descendant of a composite widget (used with roving focus patterns)",
  "aria-autocomplete":
    "Indicates whether user input completion suggestions are provided (none, inline, list, both)",
  "aria-orientation":
    "Indicates orientation of a widget (horizontal or vertical)",
  "aria-keyshortcuts":
    "Provides a space-separated list of keyboard shortcuts that activate or focus the element",
  "aria-posinset": "Position of an item within a set (used with aria-setsize)",
  "aria-setsize": "Total number of items in the set (used with aria-posinset)",
  "aria-valuetext":
    "Human-readable text alternative of the current value for range widgets",
  "aria-roledescription":
    "Allows authors to provide a human readable, author-localized description for the role",
  "aria-errormessage":
    "References the element that provides an error message for a form field",
  "aria-multiselectable":
    "Indicates that the user may select more than one item from the current set",
  "aria-placeholder":
    "Provides a short hint describing the expected value of an input",
  "aria-dropeffect":
    "(Deprecated) Historically indicated expected drag-and-drop operation; avoid using",
  "aria-grabbed":
    "(Deprecated) Indicates whether an element is grabbed for a drag-and-drop operation",
  "aria-description":
    "References or contains a short description of the element's purpose or content",
  "aria-details":
    "References an element that provides a detailed, extended description",
};

const SEMANTIC_TAG_DESCRIPTIONS: Record<string, string> = {
  header:
    "Represents introductory content or a group of introductory aids (logo, heading, search form, etc.)",
  nav: "Contains navigation links for the document or site",
  search: "Contains a set of form controls for searching or filtering content",
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
  audio: "Embeds sound content (HTML5)",
  video: "Embeds video content (HTML5)",
  canvas: "Graphics canvas for drawing via JavaScript (HTML5)",
  svg: "Scalable Vector Graphics container (HTML5)",
  img: "Embeds an image. Always include alt text for accessibility",
  picture: "Container for multiple image sources (HTML5)",
  a: "Hyperlink to other pages or resources",
  h1: "Heading level 1 - Main page heading. Use only once per page",
  h2: "Heading level 2 - Major section heading",
  h3: "Heading level 3 - Subsection heading",
  h4: "Heading level 4 - Sub-subsection heading",
  h5: "Heading level 5 - Minor heading",
  h6: "Heading level 6 - Smallest heading",
  ul: "Unordered (bulleted) list",
  ol: "Ordered (numbered) list",
  li: "List item within ul or ol",
  dl: "Description list (definition list)",
  dt: "Term in a description list",
  dd: "Description of a term in a description list",
  p: "Paragraph of text",
  blockquote: "Extended quotation from another source",
  pre: "Preformatted text with preserved whitespace",
  code: "Fragment of computer code",
  hr: "Thematic break or horizontal rule",
  table: "Tabular data organized in rows and columns",
  thead: "Groups header content in a table",
  tbody: "Groups body content in a table",
  tfoot: "Groups footer content in a table",
  tr: "Table row",
  th: "Table header cell",
  td: "Table data cell",
  caption: "Title or caption for a table",
  colgroup: "Group of columns in a table",
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
  iframe: "Nested browsing context (inline frame)",
  embed: "External content plugin (HTML5)",
  object: "External resource (image, video, etc.)",
};

export function getARIAAttributeTooltip(name: string, value: string): string {
  const description = ARIA_ATTRIBUTE_TOOLTIPS[name] || `${name} attribute`;
  return `${description}"${value}"`;
}

export function getSemanticTagDescription(tagName: string): string {
  return SEMANTIC_TAG_DESCRIPTIONS[tagName] || `HTML5 tag: ${tagName}`;
}

export { ARIA_ATTRIBUTE_TOOLTIPS, SEMANTIC_TAG_DESCRIPTIONS };
