/**
 * WAI-ARIA Roles Reference
 * Comprehensive guide to ARIA roles with categories, descriptions, and best practices
 */

export type ARIARoleCategory =
  | "landmark"
  | "widget"
  | "window"
  | "document"
  | "live-region"
  | "abstract";

export interface ARIARole {
  name: string;
  category: ARIARoleCategory;
  description: string;
  purpose: string;
  example: string;
  bestPractices: string[];
  relatedAttributes?: string[];
  nativeHTMLEquivalent?: string;
}

export const ARIA_ROLES_REFERENCE: Record<string, ARIARole> = {
  // Landmark Roles
  banner: {
    name: "banner",
    category: "landmark",
    description:
      "Informative content at the top of a page (logo, title, navigation)",
    purpose: "Helps users locate and jump to site header content",
    example:
      '<div role="banner"><img src="logo.png" /><h1>Site Title</h1></div>',
    bestPractices: [
      "Use at the top of the page",
      "Contains logo and site title",
      "Use native <header> when possible",
      "Only one per page",
    ],
    nativeHTMLEquivalent: "<header>",
  },
  navigation: {
    name: "navigation",
    category: "landmark",
    description: "A group of links used to navigate through the document",
    purpose: "Helps users quickly access navigation sections",
    example:
      '<nav role="navigation"><ul><li><a href="#">Home</a></li></ul></nav>',
    bestPractices: [
      "Contains navigation links",
      "Use native <nav> when possible",
      "Can have multiple per page",
      "Consider aria-label for multiple navigations",
    ],
    nativeHTMLEquivalent: "<nav>",
  },
  search: {
    name: "search",
    category: "landmark",
    description: "A landmark region that contains search functionality",
    purpose: "Helps users quickly locate and access search",
    example:
      '<div role="search"><input type="search" /><button>Search</button></div>',
    bestPractices: [
      "Contains search form elements",
      "Should include search button",
      "Only one typically per page",
    ],
  },
  main: {
    name: "main",
    category: "landmark",
    description: "The main content of the document",
    purpose: "Helps users navigate to primary content",
    example: "<main><h1>Main Content</h1></main>",
    bestPractices: [
      "Use native <main> element",
      "Only one per page",
      "Contains primary document content",
      "Assistive tech skips navigation when jumping to main",
    ],
    nativeHTMLEquivalent: "<main>",
  },
  complementary: {
    name: "complementary",
    category: "landmark",
    description:
      "Content that complements the main content (sidebar, related info)",
    purpose: "Helps users access supplementary content",
    example: '<aside role="complementary">Related Articles</aside>',
    bestPractices: [
      "Use native <aside> when possible",
      "Contains secondary content",
      "Can have multiple per page",
      "Use aria-label to distinguish multiple complementary sections",
    ],
    nativeHTMLEquivalent: "<aside>",
  },
  contentinfo: {
    name: "contentinfo",
    category: "landmark",
    description:
      "Information at the end of the page (copyright, privacy, contact)",
    purpose: "Helps users find site-wide information",
    example: '<div role="contentinfo"><p>&copy; 2024 Company</p></div>',
    bestPractices: [
      "Use native <footer> when possible",
      "Located at end of page",
      "Contains copyright, contact, privacy info",
      "Only one per page",
    ],
    nativeHTMLEquivalent: "<footer>",
  },
  form: {
    name: "form",
    category: "landmark",
    description: "A group of form elements",
    purpose: "Helps users identify and navigate to forms",
    example: '<form role="form"><input type="text" /></form>',
    bestPractices: [
      "Use native <form> element when possible",
      "Only if form elements not in <form> tag",
      "Should have aria-label or aria-labelledby",
    ],
    nativeHTMLEquivalent: "<form>",
  },
  region: {
    name: "region",
    category: "landmark",
    description: "A generic section of the document",
    purpose: "Marks an area of significance",
    example: '<div role="region" aria-label="Special Offers">Content</div>',
    bestPractices: [
      "Must have aria-label or aria-labelledby",
      "Use semantic elements first",
      "Fallback when no other region fits",
    ],
    relatedAttributes: ["aria-label", "aria-labelledby"],
  },

  // Widget Roles
  button: {
    name: "button",
    category: "widget",
    description: "A clickable element that triggers an action",
    purpose: "Makes non-native buttons accessible",
    example: '<div role="button" tabindex="0">Click Me</div>',
    bestPractices: [
      "Use native <button> when possible",
      "Must be keyboard accessible (tabindex, enter/space)",
      "Should have aria-pressed for toggle buttons",
      "Announce action to screen readers",
    ],
    nativeHTMLEquivalent: "<button>",
    relatedAttributes: ["aria-pressed", "tabindex"],
  },
  menu: {
    name: "menu",
    category: "widget",
    description:
      "A list of choices or commands, typically used for application-style menus",
    purpose: "Groups menu items for keyboard-accessible command menus",
    example:
      '<ul role="menu" aria-label="Actions"><li role="menuitem">Edit</li></ul>',
    bestPractices: [
      "Use for application-style command menus, not site navigation",
      "Manage focus within the menu with arrow key navigation",
      "Children should be menuitem, menuitemcheckbox, or menuitemradio",
      "Provide aria-label or aria-labelledby when needed",
      "Use <nav> for navigation links instead of role=menu",
    ],
    relatedAttributes: ["aria-label", "aria-labelledby"],
  },
  checkbox: {
    name: "checkbox",
    category: "widget",
    description: "A user interface element that can be checked or unchecked",
    purpose: "Makes custom checkboxes accessible",
    example: '<div role="checkbox" aria-checked="false">Accept Terms</div>',
    bestPractices: [
      'Use native <input type="checkbox"> when possible',
      "Must have aria-checked attribute",
      "Must be keyboard accessible",
      "Provide visual feedback for checked state",
    ],
    nativeHTMLEquivalent: '<input type="checkbox">',
    relatedAttributes: ["aria-checked", "tabindex"],
  },
  radio: {
    name: "radio",
    category: "widget",
    description: "A single selectable item in a group of options",
    purpose: "Makes custom radio buttons accessible",
    example: '<div role="radio" aria-checked="false">Option 1</div>',
    bestPractices: [
      'Use native <input type="radio"> when possible',
      "Must have aria-checked attribute",
      "Part of a radiogroup",
      "Keyboard arrow key navigation",
    ],
    nativeHTMLEquivalent: '<input type="radio">',
    relatedAttributes: ["aria-checked", "tabindex"],
  },
  switch: {
    name: "switch",
    category: "widget",
    description: "A checkbox that represents on/off state",
    purpose: "Shows toggle between on/off states",
    example: '<div role="switch" aria-checked="false">Notifications</div>',
    bestPractices: [
      "More specific than checkbox",
      "Represents on/off or enabled/disabled",
      "Must have aria-checked attribute",
      "Use aria-label to describe what is being toggled",
    ],
    relatedAttributes: ["aria-checked", "aria-label"],
  },
  textbox: {
    name: "textbox",
    category: "widget",
    description: "A single or multi-line text input field",
    purpose: "Makes custom text inputs accessible",
    example: '<div role="textbox" contenteditable>Type here</div>',
    bestPractices: [
      "Use native <input> or <textarea> when possible",
      "Must be keyboard accessible",
      "Should indicate if multi-line",
      "Provide associated label",
    ],
    nativeHTMLEquivalent: '<input type="text">, <textarea>',
    relatedAttributes: [
      "aria-label",
      "aria-multiline",
      "aria-placeholder",
      "aria-autocomplete",
      "aria-valuetext",
    ],
  },
  grid: {
    name: "grid",
    category: "widget",
    description: "A container with rows and columns of cells",
    purpose: "Enables keyboard navigation through data grids",
    example:
      '<div role="grid"><div role="row"><div role="gridcell">Data</div></div></div>',
    bestPractices: [
      "Use native <table> when possible for data",
      "Enables arrow key navigation",
      "Cells must be gridcell role",
      "Provide row and column headers",
    ],
    nativeHTMLEquivalent: "<table>",
    relatedAttributes: ["tabindex", "aria-label"],
  },
  gridcell: {
    name: "gridcell",
    category: "widget",
    description: "A cell within a grid",
    purpose: "Marks individual cells in grid structures",
    example: '<div role="gridcell">Data Point</div>',
    bestPractices: [
      "Must be within a grid role",
      "Can be focusable with tabindex",
      "Use native <td> when in <table>",
    ],
  },
  application: {
    name: "application",
    category: "widget",
    description: "A web application with desktop-like keyboard interactions",
    purpose: "Indicates complete keyboard control over children",
    example: '<div role="application">Rich Text Editor</div>',
    bestPractices: [
      "Use only when full keyboard control needed",
      "Example: Google Docs, code editors",
      "Assistive tech switches to application mode",
      "Developer has full responsibility for keyboard",
    ],
  },

  // Window Roles
  dialog: {
    name: "dialog",
    category: "window",
    description: "A dialog box or alert box (modal or non-modal)",
    purpose: "Marks modal content separated from main page",
    example: '<div role="dialog" aria-labelledby="title">Dialog content</div>',
    bestPractices: [
      "Must have aria-labelledby or aria-label",
      "Focus management (trap focus in modal)",
      "Provide close button or escape key",
      "Use native <dialog> when possible",
    ],
    relatedAttributes: ["aria-labelledby", "aria-modal"],
  },
  alertdialog: {
    name: "alertdialog",
    category: "window",
    description: "A dialog containing an alert message",
    purpose: "Signals urgent information requiring user action",
    example:
      '<div role="alertdialog" aria-labelledby="alert">Confirm action?</div>',
    bestPractices: [
      "Use for alerts that require response",
      "Must have aria-labelledby or aria-label",
      "Focus moves to dialog",
      "Should have primary action button",
    ],
    relatedAttributes: ["aria-labelledby", "aria-describedby"],
  },

  // Document Structure Roles
  article: {
    name: "article",
    category: "document",
    description: "A self-contained composition (article, comment, post)",
    purpose: "Marks distinct article content",
    example: "<article><h2>Article Title</h2><p>Content</p></article>",
    bestPractices: [
      "Use native <article> element",
      "Self-contained, may be syndicated",
      "Can be nested",
      "No keyboard interaction",
    ],
    nativeHTMLEquivalent: "<article>",
  },
  heading: {
    name: "heading",
    category: "document",
    description: "A heading for a section of content",
    purpose: "Makes non-header elements accessible as headings",
    example: '<div role="heading" aria-level="2">Section Title</div>',
    bestPractices: [
      "Use native <h1>-<h6> when possible",
      "Must include aria-level (1-6)",
      "Helps with page navigation",
      "Should follow logical heading hierarchy",
    ],
    nativeHTMLEquivalent: "<h1> to <h6>",
    relatedAttributes: ["aria-level"],
  },
  img: {
    name: "img",
    category: "document",
    description: "Multiple elements treated as a single image",
    purpose: "Groups image components into cohesive image",
    example:
      '<div role="img" aria-label="Chart description">SVG elements</div>',
    bestPractices: [
      "Must have aria-label or aria-labelledby",
      "Use for complex graphics (SVG, canvas)",
      "Alt text via aria-label required",
      "Use native <img> for simple images",
    ],
    relatedAttributes: ["aria-label", "aria-labelledby"],
  },
  table: {
    name: "table",
    category: "document",
    description: "Data arranged in rows and columns",
    purpose: "Marks tabular data structures",
    example:
      '<table role="table"><thead><tr><th>Header</th></tr></thead></table>',
    bestPractices: [
      "Use native <table> when possible",
      "Include <thead>, <tbody>, <tfoot>",
      "Provide table summary or caption",
      "Use <th> for headers with scope attribute",
    ],
    nativeHTMLEquivalent: "<table>",
  },
  cell: {
    name: "cell",
    category: "document",
    description: "A cell within a table structure",
    purpose: "Marks cells in custom table markup",
    example: '<div role="cell">Data</div>',
    bestPractices: [
      "Use native <td> in tables",
      "Must be within row role",
      "Establish relationship to headers",
    ],
    nativeHTMLEquivalent: "<td>",
  },
  row: {
    name: "row",
    category: "document",
    description: "A row of cells in a table or grid",
    purpose: "Groups cells as a row",
    example:
      '<div role="row"><div role="cell">Cell 1</div><div role="cell">Cell 2</div></div>',
    bestPractices: [
      "Use native <tr> in tables",
      "Contains cell or gridcell children",
      "Part of table or grid",
    ],
    nativeHTMLEquivalent: "<tr>",
  },
  rowgroup: {
    name: "rowgroup",
    category: "document",
    description: "A group of rows (like thead, tbody, tfoot)",
    purpose: "Groups related rows in table structure",
    example: '<div role="rowgroup"><div role="row">...</div></div>',
    bestPractices: [
      "Use native <thead>, <tbody>, <tfoot>",
      "Groups rows with similar function",
      "Helps communicate table structure",
    ],
    nativeHTMLEquivalent: "<thead>, <tbody>, <tfoot>",
  },
  list: {
    name: "list",
    category: "document",
    description: "A list of items",
    purpose: "Groups items as a collection",
    example: '<div role="list"><div role="listitem">Item 1</div></div>',
    bestPractices: [
      "Use native <ul> or <ol> when possible",
      "Children must be listitem role",
      "Only contains listitems",
      "Announces number of items",
    ],
    nativeHTMLEquivalent: "<ul>, <ol>",
    relatedAttributes: ["aria-posinset", "aria-setsize"],
  },
  listitem: {
    name: "listitem",
    category: "document",
    description: "An item in a list",
    purpose: "Marks individual list items",
    example: '<div role="listitem">Item</div>',
    bestPractices: [
      "Use native <li> when possible",
      "Must be child of list role",
      "Announces item number in list",
    ],
    nativeHTMLEquivalent: "<li>",
    relatedAttributes: ["aria-posinset", "aria-setsize"],
  },
  figure: {
    name: "figure",
    category: "document",
    description: "An image or diagram with caption",
    purpose: "Associates image with explanatory content",
    example:
      '<figure role="figure"><img /><figcaption>Caption</figcaption></figure>',
    bestPractices: [
      "Use native <figure> when possible",
      "Should include caption or description",
      "Use aria-label if no caption",
      "Images, diagrams, code examples",
    ],
    nativeHTMLEquivalent: "<figure>",
  },
  document: {
    name: "document",
    category: "document",
    description: "Content to be read normally (like an article)",
    purpose: "Indicates read vs interactive content",
    example: '<div role="document">Read-only content</div>',
    bestPractices: [
      "Similar to article but for static documents",
      "No keyboard interaction expected",
      "Think PDFs or e-books in web",
    ],
  },
  feed: {
    name: "feed",
    category: "document",
    description: "Dynamic scrollable section with articles (like Twitter feed)",
    purpose: "Marks infinite-scroll or feed-like content",
    example: '<div role="feed"><article>...</article></div>',
    bestPractices: [
      "Contains articles that load dynamically",
      "Enables screen reader browse mode",
      "Articles scrollable/loadable",
      "Use aria-busy for loading state",
    ],
    relatedAttributes: ["aria-busy"],
  },
  mark: {
    name: "mark",
    category: "document",
    description: "Highlighted or marked text",
    purpose: "Identifies highlighted sections",
    example: '<mark role="mark">Highlighted text</mark>',
    bestPractices: [
      "Use native <mark> element",
      "Indicates relevance or importance",
      "Visual highlighting usually applied",
    ],
    nativeHTMLEquivalent: "<mark>",
  },

  // Live Region Roles
  alert: {
    name: "alert",
    category: "live-region",
    description: "Important status information that updates dynamically",
    purpose: "Announces errors and important updates immediately",
    example: '<div role="alert">Error: Please correct fields</div>',
    bestPractices: [
      "Only for important alerts",
      "Screen reader reads immediately",
      "Do not use on static content",
      "Often used with form validation",
    ],
    relatedAttributes: ["aria-live", "aria-atomic"],
  },
  log: {
    name: "log",
    category: "live-region",
    description: "A log of events (chat, system messages)",
    purpose: "Announces new log entries to assistive tech",
    example: '<div role="log" aria-live="polite">New message received</div>',
    bestPractices: [
      "Updates with new information over time",
      "Announce politely, not assertively",
      "Used for chat, logs, status",
      "Only announce new items, not entire log",
    ],
    relatedAttributes: ["aria-live", "aria-atomic"],
  },
  marquee: {
    name: "marquee",
    category: "live-region",
    description: "Non-essential information that scrolls",
    purpose: "Marks scrolling informational content",
    example: '<div role="marquee">Stock ticker</div>',
    bestPractices: [
      "Use for non-critical scrolling content",
      "Announcements, crawling text",
      "Not announced frequently",
    ],
    relatedAttributes: ["aria-live"],
  },
  status: {
    name: "status",
    category: "live-region",
    description: "Current status information",
    purpose: "Announces status updates politely",
    example: '<div role="status">Loading... 50%</div>',
    bestPractices: [
      "Non-critical status information",
      "Uses polite aria-live",
      "Updated periodically",
      "Progress indicators, clock, etc.",
    ],
    relatedAttributes: ["aria-live"],
  },
  timer: {
    name: "timer",
    category: "live-region",
    description: "A numerical counter that counts up or down",
    purpose: "Marks countdown or timing display",
    example: '<div role="timer" aria-label="Time left">5:00</div>',
    bestPractices: [
      "Displays elapsed or remaining time",
      "Value updates dynamically",
      "Assistive tech can read time",
      "Use aria-label to describe purpose",
    ],
    relatedAttributes: ["aria-label", "aria-live"],
  },

  // Abstract Roles (not used by developers)
  roletype: {
    name: "roletype",
    category: "abstract",
    description: "Superclass of all other roles (internal use only)",
    purpose: "Foundation for role taxonomy",
    example: "N/A - Not used by developers",
    bestPractices: ["Browser/implementation use only", "Do not use in HTML"],
  },
  widget: {
    name: "widget",
    category: "abstract",
    description: "Base widget role (internal use only)",
    purpose: "Foundation for widget roles",
    example: "N/A - Not used by developers",
    bestPractices: ["Browser/implementation use only", "Do not use in HTML"],
  },
  landmark: {
    name: "landmark",
    category: "abstract",
    description: "Base landmark role (internal use only)",
    purpose: "Foundation for landmark roles",
    example: "N/A - Not used by developers",
    bestPractices: ["Browser/implementation use only", "Do not use in HTML"],
  },
  structure: {
    name: "structure",
    category: "abstract",
    description: "Base structure role (internal use only)",
    purpose: "Foundation for document structure roles",
    example: "N/A - Not used by developers",
    bestPractices: ["Browser/implementation use only", "Do not use in HTML"],
  },
  window: {
    name: "window",
    category: "abstract",
    description: "Base window role (internal use only)",
    purpose: "Foundation for window roles",
    example: "N/A - Not used by developers",
    bestPractices: ["Browser/implementation use only", "Do not use in HTML"],
  },
  composite: {
    name: "composite",
    category: "abstract",
    description: "Widget containing multiple focusable elements",
    purpose: "Foundation for complex widgets",
    example: "N/A - Not used by developers",
    bestPractices: ["Browser/implementation use only", "Do not use in HTML"],
  },
};

export const ARIA_CATEGORY_DESCRIPTIONS: Record<
  ARIARoleCategory,
  { name: string; description: string }
> = {
  landmark: {
    name: "Landmark Roles",
    description:
      "Denote large areas of a document for navigation (banner, navigation, main, etc.)",
  },
  widget: {
    name: "Widget Roles",
    description:
      "Make interactive elements accessible (button, checkbox, radio, grid, etc.)",
  },
  window: {
    name: "Window Roles",
    description: "Create sub-windows within webpages (dialog, alertdialog)",
  },
  document: {
    name: "Document Structure Roles",
    description:
      "Give information about static page structure (article, heading, table, etc.)",
  },
  "live-region": {
    name: "Live Region Roles",
    description:
      "Inform assistive tech about dynamic content (alert, log, status, timer)",
  },
  abstract: {
    name: "Abstract Roles",
    description:
      "Foundation for other roles - used by browsers, not developers",
  },
};

export const FIVE_RULES_OF_ARIA = [
  "Use built-in HTML attributes over ARIA whenever possible",
  "Do not change the native role of an HTML element - use a wrapper if needed",
  "All ARIA functionality and roles must be keyboard accessible",
  'Do not use role="presentation" or aria-hidden="true" on focusable elements',
  "All interactive elements must have an accessible name describing what it does",
];

export function getARIARole(roleName: string): ARIARole | undefined {
  return ARIA_ROLES_REFERENCE[roleName.toLowerCase()];
}

export function getRolesByCategory(category: ARIARoleCategory): ARIARole[] {
  return Object.values(ARIA_ROLES_REFERENCE).filter(
    (role) => role.category === category,
  );
}

export function isAbstractRole(roleName: string): boolean {
  const role = getARIARole(roleName);
  return role?.category === "abstract";
}

// Landmark roles mapping to native HTML equivalents
export const LANDMARK_HTML_MAPPING: Record<string, string> = {
  banner: "<header>",
  complementary: "<aside>",
  contentinfo: "<footer>",
  form: "<form>",
  main: "<main>",
  navigation: "<nav>",
  region: "<section>",
  search: "<search>",
};

// Common issues and warnings for landmark roles
export const LANDMARK_COMMON_ISSUES = [
  {
    issue: "Role misuse",
    description:
      'Do not create or use non-standard roles like role="landmark". Always use specific roles like role="banner", role="navigation", or role="main".',
    mitigation: "Refer to MDN docs and ARIA spec for valid role names",
  },
  {
    issue: "Missing labels for duplicate landmarks",
    description:
      "When using multiple instances of the same landmark role on a page (e.g., two navbars), you must provide unique labels.",
    mitigation:
      'Use aria-label="Primary Navigation" or aria-labelledby="nav-id" to differentiate landmarks',
    example:
      '<nav role="navigation" aria-label="Primary"><ul>...</ul></nav>\n<nav role="navigation" aria-label="Footer"><ul>...</ul></nav>',
  },
  {
    issue: "Excessive landmark usage",
    description:
      "Too many landmarks can clutter navigation and confuse users. Be selective and only mark key areas.",
    mitigation:
      "Limit landmarks to main page sections - think of them like signs in a building",
  },
  {
    issue: "Not combining with semantic HTML",
    description:
      "For maximum compatibility with older browsers and assistive tech, combine landmark roles with native HTML elements.",
    mitigation:
      'Use role="main" with <main>, role="banner" with <header>, role="navigation" with <nav>, etc.',
    example:
      '<main role="main">\n  <header role="banner">...</header>\n  <nav role="navigation">...</nav>\n  <footer role="contentinfo">...</footer>\n</main>',
  },
];

export function getValidRoles(): string[] {
  return Object.keys(ARIA_ROLES_REFERENCE).filter(
    (role) => !isAbstractRole(role),
  );
}

export function isValidRole(roleName: string): boolean {
  return getARIARole(roleName) !== undefined && !isAbstractRole(roleName);
}

export function isLandmarkRole(roleName: string): boolean {
  const role = getARIARole(roleName);
  return role?.category === "landmark";
}

export function getNativeHTMLEquivalent(roleName: string): string | undefined {
  return LANDMARK_HTML_MAPPING[roleName.toLowerCase()];
}

export function shouldHaveUniqueLabel(roleName: string): boolean {
  // Landmark roles that can appear multiple times and need unique labels
  const rolesRequiringLabels = [
    "region",
    "complementary",
    "navigation",
    "form",
  ];
  return rolesRequiringLabels.includes(roleName.toLowerCase());
}
