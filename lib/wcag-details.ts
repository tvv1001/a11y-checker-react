/**
 * Comprehensive WCAG Success Criteria Details
 * Integrates WCAG 2.0, 2.1, and 2.2 with JAWS screen reader guidance and Section 508/ADA compliance
 * Sources:
 * - https://www.w3.org/TR/WCAG22/
 * - https://www.w3.org/TR/WCAG21/
 * - https://www.w3.org/TR/WCAG20/
 */

export interface WCAGSuccessCriterion {
  id: string; // e.g., "1.1.1"
  number: string; // e.g., "1.1.1"
  name: string; // e.g., "Non-text Content"
  level: "A" | "AA" | "AAA";
  version: "2.0" | "2.1" | "2.2"; // When it was introduced
  url: string; // Official W3C URL
  understanding: string; // Understanding document URL
  description: string;
  purpose: string;

  // JAWS Screen Reader Information
  jawsImpact: {
    severity: "critical" | "high" | "medium" | "low";
    description: string;
    announcement: string; // How JAWS announces this when implemented correctly
    announcementWhenBroken: string; // How JAWS behaves when this fails
    shortcuts?: string[]; // Relevant JAWS keyboard shortcuts
    virtualCursorMode?: string; // How JAWS behaves in virtual cursor mode
    formsMode?: string; // How JAWS behaves in forms mode
    tips: string[];
  };

  // Legal Compliance
  compliance: {
    section508: boolean; // US Federal Section 508
    ada: boolean; // Americans with Disabilities Act
    adaTitle: string; // Specific ADA title reference
    en301549: boolean; // EU EN 301 549 standard
    notes: string;
  };

  // Technical Implementation
  techniques: {
    sufficient: string[]; // Sufficient techniques to meet this criterion
    advisory: string[]; // Advisory techniques
    failures: string[]; // Common failure examples
  };

  // Related Success Criteria
  related: string[]; // IDs of related success criteria
}

/**
 * Comprehensive WCAG 2.0, 2.1, 2.2 Success Criteria Database
 */
export const wcagSuccessCriteriaDetails: Record<string, WCAGSuccessCriterion> =
  {
    "1.1.1": {
      id: "1.1.1",
      number: "1.1.1",
      name: "Non-text Content",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
      description:
        "All non-text content presented to the user has a text alternative that serves the equivalent purpose.",
      purpose:
        "Ensures that people who cannot see, recognize, or process images, icons, and other non-text content can still access the information.",

      jawsImpact: {
        severity: "critical",
        description:
          "Without text alternatives, JAWS users receive no information about images, icons, or graphics.",
        announcement:
          "JAWS reads: 'Image, [alt text]' or 'Graphic, [alt text]' allowing users to understand the content",
        announcementWhenBroken:
          "JAWS reads: 'Graphic' or 'Image [filename.jpg]' providing no meaningful information",
        shortcuts: [
          "G (next graphic)",
          "Shift+G (previous graphic)",
          "Insert+F5 (list all graphics)",
        ],
        virtualCursorMode:
          "JAWS announces images as users arrow through content. Without alt text, only 'graphic' or filename is spoken.",
        tips: [
          "Use descriptive alt text that conveys the same information as the image",
          "For decorative images, use empty alt (alt='') so JAWS skips them",
          "Complex images need both alt and longer descriptions using aria-describedby",
          "Test by listening to JAWS - would you understand without seeing?",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title III - Public Accommodations",
        en301549: true,
        notes:
          "Required under Section 508 §1194.22(a) and ADA Title III for all web applications",
      },

      techniques: {
        sufficient: [
          "H37: Using alt attributes on img elements",
          "ARIA6: Using aria-label to provide labels",
          "ARIA10: Using aria-labelledby to provide text alternative",
          "G94: Providing short text alternative for non-text content",
        ],
        advisory: [
          "C9: Using CSS to include decorative images",
          "H2: Combining adjacent image and text links for the same resource",
        ],
        failures: [
          "F3: Failure of Success Criterion 1.1.1 due to using CSS to include images that convey important information",
          "F13: Failure of Success Criterion 1.1.1 and 1.4.1 due to having a text alternative that does not include information conveyed by color differences in the image",
          "F30: Failure of Success Criterion 1.1.1 and 1.2.1 due to using text alternatives that are not alternatives",
          "F38: Failure of Success Criterion 1.1.1 due to not marking up decorative images in HTML in a way that allows assistive technology to ignore them",
          "F39: Failure of Success Criterion 1.1.1 due to providing a text alternative that is not null for images that should be ignored by assistive technology",
          "F65: Failure of Success Criterion 1.1.1 due to omitting the alt attribute or text alternative on img elements, area elements, and input elements of type 'image'",
        ],
      },

      related: ["1.4.5", "1.4.9", "2.4.4"],
    },

    "1.3.1": {
      id: "1.3.1",
      number: "1.3.1",
      name: "Info and Relationships",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
      description:
        "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.",
      purpose:
        "Ensures that information conveyed through visual formatting (headings, lists, tables, etc.) is also available to screen reader users.",

      jawsImpact: {
        severity: "critical",
        description:
          "JAWS relies on semantic HTML to understand page structure, navigate efficiently, and convey relationships between content.",
        announcement:
          "JAWS announces: 'Heading level 1', 'List with 5 items', 'Table with 3 columns and 10 rows', 'Form field: label, edit'",
        announcementWhenBroken:
          "With improper markup, JAWS treats everything as plain text, missing structure and making navigation extremely difficult",
        shortcuts: [
          "H (next heading), Shift+H (previous)",
          "1-6 (jump to heading level)",
          "L (next list), Shift+L (previous)",
          "T (next table), Shift+T (previous)",
          "F (next form field), Shift+F (previous)",
          "Insert+F6 (list headings)",
          "Insert+F5 (list form fields)",
        ],
        virtualCursorMode:
          "JAWS announces structural elements and allows quick navigation using shortcut keys. Semantic HTML is essential.",
        formsMode:
          "JAWS automatically enters forms mode when focus enters form fields, announcing labels and field types",
        tips: [
          "Use semantic HTML elements (<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>)",
          "Mark up headings with <h1>-<h6> in hierarchical order",
          "Use <ul>, <ol>, <dl> for lists, not <div> or <br>",
          "Use proper table markup: <table>, <th>, <tr>, <td>, with scope attributes",
          "Associate form labels with inputs using <label for='id'> or wrapping",
          "Test navigation using JAWS heading list (Insert+F6) and forms list (Insert+F5)",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Equal Access to Information",
        en301549: true,
        notes:
          "Critical for Section 508 §1194.22(g)(h)(i) compliance requiring programmatically determined structure",
      },

      techniques: {
        sufficient: [
          "ARIA11: Using ARIA landmarks to identify regions of a page",
          "ARIA12: Using role=heading to identify headings",
          "ARIA13: Using aria-labelledby to name regions and landmarks",
          "ARIA16: Using aria-labelledby to provide a name for user interface controls",
          "ARIA17: Using grouping roles to identify related form controls",
          "H42: Using h1-h6 to identify headings",
          "H43: Using id and headers attributes to associate data cells with header cells in data tables",
          "H44: Using label elements to associate text labels with form controls",
          "H48: Using ol, ul and dl for lists or groups of links",
          "H51: Using table markup to present tabular information",
        ],
        advisory: [
          "ARIA1: Using the aria-describedby property to provide a descriptive label",
          "H49: Using semantic markup to mark emphasized or special text",
        ],
        failures: [
          "F2: Failure of Success Criterion 1.3.1 due to using changes in text presentation to convey information without using appropriate markup",
          "F43: Failure of Success Criterion 1.3.1 due to using structural markup in a way that does not represent relationships in the content",
          "F46: Failure of Success Criterion 1.3.1 due to using th elements, caption elements, or non-empty summary attributes in layout tables",
          "F48: Failure of Success Criterion 1.3.1 due to using the pre element to markup tabular information",
          "F68: Failure of Success Criterion 1.3.1 and 4.1.2 due to the association of label and user interface controls not being programmatically determined",
          "F87: Failure of Success Criterion 1.3.1 due to inserting non-decorative content by using :before and :after pseudo-elements and the 'content' property in CSS",
          "F92: Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information",
        ],
      },

      related: ["1.3.2", "2.4.6", "4.1.2"],
    },

    "1.4.3": {
      id: "1.4.3",
      number: "1.4.3",
      name: "Contrast (Minimum)",
      level: "AA",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
      description:
        "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1 (or 3:1 for large text).",
      purpose:
        "Ensures text is readable for people with moderately low vision, color deficiencies, or viewing in bright sunlight.",

      jawsImpact: {
        severity: "low",
        description:
          "JAWS itself doesn't detect color contrast, but many JAWS users have low vision and rely on sufficient contrast.",
        announcement:
          "JAWS announces text content normally but cannot help users see low-contrast text",
        announcementWhenBroken:
          "Low contrast doesn't change JAWS behavior, but users with low vision who use JAWS may struggle to read",
        shortcuts: [
          "JAWS users often use screen magnification alongside JAWS for low vision",
        ],
        tips: [
          "Many JAWS users also have low vision - they need both screen reader AND visible text",
          "Test contrast using browser DevTools or WebAIM Contrast Checker",
          "Normal text needs 4.5:1 contrast ratio minimum",
          "Large text (18pt+ or 14pt+ bold) needs 3:1 minimum",
          "JAWS users with low vision may increase system text size - ensure text remains readable",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Effective Communication",
        en301549: true,
        notes:
          "Required for AA compliance under Section 508 and ADA Title II/III",
      },

      techniques: {
        sufficient: [
          "G18: Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background",
          "G145: Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text",
        ],
        advisory: [
          "G156: Using a technology that has commonly-available user agents that can change the foreground and background of blocks of text",
        ],
        failures: [
          "F24: Failure of Success Criterion 1.4.3, 1.4.6 and 1.4.8 due to specifying foreground colors without specifying background colors or vice versa",
          "F83: Failure of Success Criterion 1.4.3 and 1.4.6 due to using background images that do not provide sufficient contrast with foreground text",
        ],
      },

      related: ["1.4.6", "1.4.11"],
    },

    "2.1.1": {
      id: "2.1.1",
      number: "2.1.1",
      name: "Keyboard",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
      description:
        "All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.",
      purpose:
        "Ensures people who cannot use a mouse (including screen reader users, motor disabilities, and power users) can access all functionality.",

      jawsImpact: {
        severity: "critical",
        description:
          "JAWS users rely entirely on keyboard navigation. Without keyboard access, content is completely unusable.",
        announcement:
          "JAWS announces focusable elements: 'Button', 'Link', 'Edit', 'Check box' as users tab through",
        announcementWhenBroken:
          "Mouse-only controls are invisible to JAWS users - they cannot find or activate them",
        shortcuts: [
          "Tab (next focusable element)",
          "Shift+Tab (previous)",
          "Enter (activate buttons/links)",
          "Space (toggle checkboxes, activate buttons)",
          "Arrow keys (navigate within components like radio groups, menus)",
          "Escape (close dialogs, exit menus)",
        ],
        virtualCursorMode:
          "In virtual mode, JAWS intercepts most keys. Interactive elements must be accessible via Tab or arrow keys.",
        formsMode:
          "JAWS enters forms mode on form fields, allowing direct keyboard input while announcing labels",
        tips: [
          "All interactive elements must be keyboard accessible",
          "Custom controls need tabindex and keyboard event handlers",
          "Use native HTML elements when possible - they're keyboard accessible by default",
          "Test by tabbing through entire page without using mouse",
          "Ensure Tab order follows logical reading order",
          "Arrow keys should work within custom components (menus, sliders, tabs)",
          "Provide keyboard shortcuts but don't require them - Tab should work everywhere",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Equal Access",
        en301549: true,
        notes:
          "Absolutely required under Section 508 §1194.21(a) and ADA for all interactive content",
      },

      techniques: {
        sufficient: [
          "G202: Ensuring keyboard control for all functionality",
          "H91: Using HTML form controls and links",
          "SCR20: Using both keyboard and other device-specific functions",
          "SCR35: Making actions keyboard accessible by using the onclick event of anchors and buttons",
          "ARIA16: Using aria-labelledby to provide a name for user interface controls",
        ],
        advisory: [
          "SCR29: Adding keyboard-accessible actions to static HTML elements",
        ],
        failures: [
          "F42: Failure of Success Criteria 1.3.1, 2.1.1, 2.1.3, or 4.1.2 when emulating links",
          "F54: Failure of Success Criterion 2.1.1 due to using only pointing-device-specific event handlers",
          "F55: Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using script to remove focus when focus is received",
        ],
      },

      related: ["2.1.2", "2.1.3", "2.4.3", "2.4.7"],
    },

    "2.4.1": {
      id: "2.4.1",
      number: "2.4.1",
      name: "Bypass Blocks",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
      description:
        "A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.",
      purpose:
        "Allows keyboard and screen reader users to skip past navigation menus and repeated content to reach main content quickly.",

      jawsImpact: {
        severity: "high",
        description:
          "Without bypass mechanisms, JAWS users must tab through dozens of links on every page to reach main content.",
        announcement:
          "JAWS reads 'Skip to main content, link' at top of page, or announces landmarks: 'Main region'",
        announcementWhenBroken:
          "Users forced to tab through entire navigation menu on every single page - extremely frustrating",
        shortcuts: [
          "Semicolon (;) - Next region/landmark",
          "Shift+Semicolon - Previous region/landmark",
          "Q - Next landmark",
          "Insert+F7 - List of links",
          "R - Next region",
          "Insert+Ctrl+Semicolon - List all landmarks",
        ],
        virtualCursorMode:
          "Landmarks allow JAWS users to jump between major page sections instantly",
        tips: [
          "Add 'Skip to main content' link as first focusable element",
          "Use HTML5 landmarks: <header>, <nav>, <main>, <aside>, <footer>",
          "Single <main> landmark is essential - JAWS users jump directly to it",
          "Multiple <nav> landmarks need aria-label to differentiate them",
          "ARIA landmarks work: role='banner', 'navigation', 'main', 'complementary', 'contentinfo'",
          "Skip link can be visually hidden but must appear on focus",
          "Test: Can you reach main content in 1-2 tab presses?",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Program Accessibility",
        en301549: true,
        notes:
          "Required under Section 508 §1194.22(o) for pages with repeated navigation",
      },

      techniques: {
        sufficient: [
          "ARIA11: Using ARIA landmarks to identify regions of a page",
          "H69: Providing heading elements at the beginning of each section of content",
          "G1: Adding a link at the top of each page that goes directly to the main content area",
          "G123: Adding a link at the beginning of a block of repeated content to go to the end of the block",
          "G124: Adding links at the top of the page to each area of the content",
        ],
        advisory: [
          "H97: Grouping related links using the nav element",
          "SCR28: Using an expandable and collapsible menu",
        ],
        failures: [],
      },

      related: ["2.4.2", "2.4.3", "2.4.6"],
    },

    "2.4.2": {
      id: "2.4.2",
      number: "2.4.2",
      name: "Page Titled",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
      description: "Web pages have titles that describe topic or purpose.",
      purpose:
        "Helps users understand what page they're on, especially important for screen reader users with multiple browser tabs.",

      jawsImpact: {
        severity: "high",
        description:
          "JAWS announces page title on page load and when switching browser tabs. Essential for multi-tab browsing.",
        announcement:
          "JAWS announces on page load: 'Contact Us - Company Name' followed by first heading",
        announcementWhenBroken:
          "Missing titles: JAWS says 'untitled' or page URL. Generic titles don't help user identify pages.",
        shortcuts: [
          "Insert+T - Read page title",
          "Alt+Tab (Windows tabs) - JAWS announces each page title as user switches tabs",
        ],
        tips: [
          "Page title is THE most important way JAWS users identify pages",
          "Format: 'Specific Page - Section - Site Name' (e.g., 'Shopping Cart - Store - Amazon')",
          "Most specific information first (reverse breadcrumb)",
          "Keep titles unique across site - don't repeat company name alone",
          "Update title for single-page apps when content changes",
          "Error pages should indicate error in title: 'Error 404 - Page Not Found - Site Name'",
          "Test by opening multiple tabs - can you identify each page from title alone?",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Effective Communication",
        en301549: true,
        notes:
          "Required under Section 508 §1194.22(i) - web pages must be titled",
      },

      techniques: {
        sufficient: [
          "G88: Providing descriptive titles for Web pages",
          "H25: Providing a title using the title element",
        ],
        advisory: [],
        failures: [
          "F25: Failure of Success Criterion 2.4.2 due to the title of a Web page not identifying the contents",
        ],
      },

      related: ["2.4.4", "2.4.6"],
    },

    "2.4.3": {
      id: "2.4.3",
      number: "2.4.3",
      name: "Focus Order",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
      description:
        "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.",
      purpose:
        "Ensures logical keyboard navigation that makes sense to screen reader users and keyboard-only users.",

      jawsImpact: {
        severity: "high",
        description:
          "JAWS users rely on logical Tab order to understand relationships and navigate efficiently.",
        announcement:
          "JAWS announces each element as focus moves: 'First name, edit' → 'Last name, edit' → 'Submit, button'",
        announcementWhenBroken:
          "Illogical order confuses users: focus jumps around page randomly, breaking mental model",
        shortcuts: [
          "Tab - Next focusable element",
          "Shift+Tab - Previous focusable element",
        ],
        formsMode:
          "Forms mode activates automatically as focus moves between form fields. Order must match visual layout.",
        tips: [
          "Tab order should follow visual reading order (top to bottom, left to right in LTR languages)",
          "Form fields should follow logical completion order",
          "Don't use tabindex > 0 - it breaks natural flow",
          "Use tabindex='-1' for programmatic focus only",
          "Modal dialogs should trap focus until closed",
          "Dropdown menus should allow arrow key navigation",
          "Test by tabbing through page - does order make sense?",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Effective Communication",
        en301549: true,
        notes: "Section 508 §1194.21 requires logical navigation order",
      },

      techniques: {
        sufficient: [
          "G59: Placing the interactive elements in an order that follows sequences and relationships within the content",
          "H4: Creating a logical tab order through links, form controls, and objects",
          "C27: Making the DOM order match the visual order",
          "SCR26: Inserting dynamic content into the Document Object Model immediately following its trigger element",
          "SCR37: Creating Custom Dialogs in a Device Independent Way",
        ],
        advisory: [],
        failures: [
          "F44: Failure of Success Criterion 2.4.3 due to using tabindex to create a tab order that does not preserve meaning and operability",
          "F85: Failure of Success Criterion 2.4.3 due to using dialogs or menus that are not adjacent to their trigger control in the sequential navigation order",
        ],
      },

      related: ["1.3.2", "2.1.1", "2.4.7"],
    },

    "3.3.2": {
      id: "3.3.2",
      number: "3.3.2",
      name: "Labels or Instructions",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
      description:
        "Labels or instructions are provided when content requires user input.",
      purpose:
        "Ensures users understand what information to enter in form fields.",

      jawsImpact: {
        severity: "critical",
        description:
          "JAWS cannot convey form field purpose without proper labels. Users won't know what to enter.",
        announcement:
          "JAWS announces: 'First name, edit, required' combining label, field type, and requirements",
        announcementWhenBroken:
          "Without labels: 'Edit' or 'Edit, required'. User has no idea what information to provide.",
        shortcuts: [
          "F (next form field)",
          "Shift+F (previous form field)",
          "Insert+F5 (list all form fields)",
          "Insert+Tab (read current form field label)",
        ],
        formsMode:
          "JAWS enters forms mode on form fields, announcing label + field type + state. Labels are ESSENTIAL.",
        tips: [
          "Every input needs a visible label - use <label> element",
          "Associate labels: <label for='email'>Email</label><input id='email'>",
          "Or wrap: <label>Email <input></label>",
          "Placeholder is NOT a label - it disappears when typing starts",
          "aria-label for icon buttons without visible text",
          "aria-describedby for additional instructions or format hints",
          "Required fields: use required attribute + visible indicator",
          "Group related fields with <fieldset> and <legend>",
          "Test: Tab through form with eyes closed - do you know what to enter?",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Effective Communication",
        en301549: true,
        notes:
          "Critical requirement under Section 508 §1194.22(n) for form fields",
      },

      techniques: {
        sufficient: [
          "G131: Providing descriptive labels",
          "ARIA1: Using the aria-describedby property to provide a descriptive label",
          "ARIA9: Using aria-labelledby to concatenate a label from several text nodes",
          "ARIA17: Using grouping roles to identify related form controls",
          "H44: Using label elements to associate text labels with form controls",
          "H71: Providing a description for groups of form controls using fieldset and legend elements",
          "H90: Indicating required form controls using label or legend",
        ],
        advisory: [
          "G184: Providing text instructions at the beginning of a form or set of fields",
          "G162: Positioning labels to maximize predictability of relationships",
          "G83: Providing text descriptions to identify required fields that were not completed",
        ],
        failures: [
          "F82: Failure of Success Criterion 3.3.2 by visually formatting a set of phone number fields but not including a text label",
          "F68: Failure of Success Criterion 1.3.1 and 4.1.2 due to the association of label and user interface controls not being programmatically determined",
        ],
      },

      related: ["1.3.1", "2.4.6", "3.3.1", "4.1.2"],
    },

    "4.1.2": {
      id: "4.1.2",
      number: "4.1.2",
      name: "Name, Role, Value",
      level: "A",
      version: "2.0",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
      understanding:
        "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
      description:
        "For all user interface components, the name and role can be programmatically determined; states, properties, and values can be programmatically set; and notification of changes are available to user agents, including assistive technologies.",
      purpose:
        "Ensures screen readers can identify and announce custom controls correctly.",

      jawsImpact: {
        severity: "critical",
        description:
          "JAWS must know what each control is (role), what it's called (name), and its current state (value) to announce it properly.",
        announcement:
          "Properly implemented: 'Search, button, expanded' or 'Volume, slider, 50 percent'",
        announcementWhenBroken:
          "Without proper attributes: 'Clickable' or just the text with no indication it's interactive",
        shortcuts: [
          "Tab (moves to control - JAWS announces name + role + state)",
          "Insert+Tab (repeat current control info)",
          "Insert+F9 (list all buttons)",
          "Insert+Ctrl+Enter (JAWS context menu for current element)",
        ],
        virtualCursorMode:
          "JAWS announces control type as user arrows through. Custom controls need proper roles.",
        formsMode:
          "Native form controls automatically have correct name/role/value. Custom controls need ARIA.",
        tips: [
          "Use native HTML when possible - built-in semantics",
          "Custom controls need ARIA: role='button', role='slider', role='checkbox'",
          "Name via: visible label, aria-label, or aria-labelledby",
          "State communicated via: aria-expanded, aria-checked, aria-pressed, aria-valuenow",
          "Role determines what keyboard behavior users expect",
          "Update dynamic values: JAWS monitors aria-valuenow, aria-checked, aria-expanded",
          "Common roles: button, checkbox, radio, slider, tab, tabpanel, dialog, menu, menuitem",
          "Test each custom control: Tab to it - does JAWS announce what it is and its state?",
        ],
      },

      compliance: {
        section508: true,
        ada: true,
        adaTitle: "Title II and III - Effective Communication",
        en301549: true,
        notes:
          "Fundamental requirement under Section 508 §1194.21(d) for programmatically exposed UI information",
      },

      techniques: {
        sufficient: [
          "ARIA4: Using a WAI-ARIA role to expose the role of a user interface component",
          "ARIA5: Using WAI-ARIA state and property attributes to expose the state of a user interface component",
          "ARIA16: Using aria-labelledby to provide a name for user interface controls",
          "G108: Using markup features to expose the name and role",
          "H91: Using HTML form controls and links",
          "H44: Using label elements to associate text labels with form controls",
          "H64: Using the title attribute of the frame and iframe elements",
          "H65: Using the title attribute to identify form controls when the label element cannot be used",
          "H88: Using HTML according to spec",
        ],
        advisory: [],
        failures: [
          "F15: Failure of Success Criterion 4.1.2 due to implementing custom controls that do not use an accessibility API",
          "F20: Failure of Success Criterion 1.1.1 and 4.1.2 due to not updating text alternatives when changes to non-text content occur",
          "F59: Failure of Success Criterion 4.1.2 due to using script to make div or span a user interface control in HTML without providing a role",
          "F68: Failure of Success Criterion 1.3.1 and 4.1.2 due to the association of label and user interface controls not being programmatically determined",
          "F79: Failure of Success Criterion 4.1.2 due to the focus state of a user interface component not being programmatically determinable",
          "F86: Failure of Success Criterion 4.1.2 due to not providing names for each part of a multi-part form field",
          "F89: Failure of Success Criteria 2.4.4, 2.4.9 and 4.1.2 due to not providing an accessible name for an image which is the only content in a link",
        ],
      },

      related: ["1.3.1", "3.3.2", "4.1.3"],
    },
  };

/**
 * Get detailed information about a WCAG success criterion
 */
export function getWCAGDetails(
  criterionId: string,
): WCAGSuccessCriterion | undefined {
  return wcagSuccessCriteriaDetails[criterionId];
}

/**
 * Get all success criteria for a specific conformance level
 */
export function getSuccessCriteriaByLevel(
  level: "A" | "AA" | "AAA",
): WCAGSuccessCriterion[] {
  return Object.values(wcagSuccessCriteriaDetails).filter(
    (sc) => sc.level === level,
  );
}

/**
 * Get all success criteria introduced in a specific WCAG version
 */
export function getSuccessCriteriaByVersion(
  version: "2.0" | "2.1" | "2.2",
): WCAGSuccessCriterion[] {
  return Object.values(wcagSuccessCriteriaDetails).filter(
    (sc) => sc.version === version,
  );
}

/**
 * Get Section 508 compliant success criteria
 */
export function getSection508Criteria(): WCAGSuccessCriterion[] {
  return Object.values(wcagSuccessCriteriaDetails).filter(
    (sc) => sc.compliance.section508,
  );
}

/**
 * Get success criteria by JAWS impact severity
 */
export function getCriteriaByJAWSImpact(
  severity: "critical" | "high" | "medium" | "low",
): WCAGSuccessCriterion[] {
  return Object.values(wcagSuccessCriteriaDetails).filter(
    (sc) => sc.jawsImpact.severity === severity,
  );
}
