/**
 * WCAG Remediation Guide based on axe-core 4.11
 * Detailed fix guidance, related rules, and impact analysis for each violation
 * Source: https://dequeuniversity.com/rules/axe/html/4.11
 */

export interface RemediationStep {
  step: number;
  title: string;
  description: string;
  example?: string;
}

export interface WcagRuleDetail {
  id: string;
  title: string;
  wcagCriteria: string[];
  severity: "critical" | "serious" | "moderate" | "minor";
  description: string;
  impact: string;
  remediationSteps: RemediationStep[];
  relatedRules: string[]; // IDs of related rules
  elementTypes: string[]; // HTML elements this affects
  commonIssues: string[];
  jawsSupport?: {
    announcement: string;
    keyboardShortcuts?: string[];
    formsMode?: string;
    notes?: string;
  };
  resources: {
    name: string;
    url: string;
  }[];
}

/**
 * Comprehensive WCAG remediation database aligned with axe-core 4.11
 */
export const wcagRemediationGuide: Record<string, WcagRuleDetail> = {
  // Text Alternatives
  "image-alt": {
    id: "image-alt",
    title: "Ensure <img> elements have alternative text",
    wcagCriteria: ["1.1.1 Non-text Content"],
    severity: "critical",
    description:
      "Images must have alternative text that describes their content and function for users using screen readers.",
    impact:
      "Users with visual impairments cannot understand the purpose or content of images without alt text.",
    remediationSteps: [
      {
        step: 1,
        title: "Add alt attribute to all <img> elements",
        description:
          "Every img tag must have an alt attribute. For meaningful images, describe the image content.",
        example:
          '<img src="chart.png" alt="Sales chart showing 30% growth in Q4">',
      },
      {
        step: 2,
        title: "Write meaningful alt text",
        description:
          "Alt text should be concise (under 150 characters) but descriptive. Avoid starting with 'image of' or 'picture of'.",
        example: '<img src="logo.png" alt="Company Name">',
      },
      {
        step: 3,
        title: "Use empty alt for decorative images",
        description:
          'If an image is purely decorative, use an empty alt attribute (alt="") so screen readers skip it.',
        example: '<img src="decoration.png" alt="" aria-hidden="true">',
      },
      {
        step: 4,
        title: "For complex images, provide extended description",
        description:
          "For charts, graphs, or complex images, consider adding a text description nearby or using aria-describedby.",
        example:
          '<img src="complex-chart.png" alt="Annual revenue chart" aria-describedby="chart-desc"><p id="chart-desc">2023 revenue increased 25%...</p>',
      },
    ],
    relatedRules: ["role-img-alt", "input-image-alt", "svg-img-alt"],
    elementTypes: ["<img>", "[role='img']", "<svg>", "<input type='image'>"],
    commonIssues: [
      "Missing alt attributes",
      "Unhelpful alt text (e.g., 'image123.jpg')",
      "Alt text that repeats nearby text",
      "Missing descriptions for complex visualizations",
    ],
    resources: [
      {
        name: "WebAIM: Alternative Text",
        url: "https://webaim.org/articles/alttext/",
      },
      {
        name: "Deque University: alt Text and Images",
        url: "https://dequeuniversity.com/rules/axe/html/4.11/image-alt",
      },
    ],
  },

  "button-name": {
    id: "button-name",
    title: "Ensure buttons have discernible text",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "critical",
    description:
      "All buttons must have accessible text content that describes their purpose, either visible text or ARIA labels.",
    impact:
      "Screen reader users cannot understand what action a button performs if it lacks descriptive text.",
    remediationSteps: [
      {
        step: 1,
        title: "Add visible text to buttons",
        description:
          "Button content should be descriptive and indicate the action.",
        example: "<button>Submit Form</button>",
      },
      {
        step: 2,
        title: "Use aria-label for icon-only buttons",
        description:
          "If a button contains only an icon, add aria-label to describe its purpose.",
        example: '<button aria-label="Close dialog"><icon>×</icon></button>',
      },
      {
        step: 3,
        title: "Use aria-labelledby for complex buttons",
        description:
          "Reference nearby text using aria-labelledby for more complex scenarios.",
        example:
          '<button aria-labelledby="btn-title"><icon>•••</icon></button><span id="btn-title">More options</span>',
      },
      {
        step: 4,
        title: "Avoid empty or non-descriptive text",
        description:
          "Avoid buttons with text like 'Click here', 'OK', or '→'. Be specific.",
        example:
          "<button>Save Document</button> <!-- Good, not <button>OK</button> -->",
      },
    ],
    relatedRules: ["link-name", "aria-command-name", "input-button-name"],
    elementTypes: ["<button>", "<input type='button'>", "[role='button']"],
    commonIssues: [
      "Icon-only buttons without labels",
      "Buttons with empty text nodes",
      "Non-descriptive text like 'Click', 'OK', or 'Submit'",
      "Missing aria-label on buttons with visual text",
    ],
    resources: [
      {
        name: "WebAIM: Button Labels",
        url: "https://webaim.org/articles/link/",
      },
      {
        name: "MDN: ARIA: button role",
        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role",
      },
    ],
  },

  "form-field-multiple-labels": {
    id: "form-field-multiple-labels",
    title: "Ensure form field does not have multiple label elements",
    wcagCriteria: ["3.3.2 Labels or Instructions"],
    severity: "moderate",
    description:
      "Form fields should have only one associated label element to avoid confusion for screen reader users.",
    impact:
      "Multiple labels can cause screen readers to announce conflicting or redundant information.",
    remediationSteps: [
      {
        step: 1,
        title: "Use only one <label> element per form field",
        description:
          "Each form input should be associated with exactly one label.",
        example:
          '<label for="email">Email: <input id="email" type="email"></label>',
      },
      {
        step: 2,
        title: "Remove duplicate labels",
        description:
          "If there are multiple labels, consolidate them into a single label element.",
        example:
          '<!-- Bad: Multiple labels -->\n<label for="name">Name</label>\n<label for="name">First Name</label>\n\n<!-- Good: Single label -->\n<label for="name">Name</label>',
      },
      {
        step: 3,
        title: "Use aria-labelledby if you cannot use <label>",
        description:
          "If you cannot use a label element, reference the labeling element with aria-labelledby.",
        example:
          '<span id="field-label">Date</span>\n<input aria-labelledby="field-label">',
      },
    ],
    relatedRules: ["label", "aria-input-field-name"],
    elementTypes: ["<input>", "<textarea>", "<select>"],
    commonIssues: [
      "Multiple <label> elements with the same for attribute",
      "Labels appended without removing old ones",
      "Mixing <label> with aria-label on same field",
    ],
    resources: [
      {
        name: "WebAIM: Creating Accessible Forms",
        url: "https://webaim.org/articles/form/",
      },
    ],
  },

  label: {
    id: "label",
    title: "Ensure every form element has a label",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "critical",
    description:
      "All form fields must be associated with a label element or have an accessible name using ARIA attributes.",
    impact:
      "Form fields without labels are confusing for screen reader users, who cannot understand the field's purpose.",
    remediationSteps: [
      {
        step: 1,
        title: "Add <label> element with for attribute",
        description: "Create a label that references the input's id.",
        example:
          '<label for="username">Username:</label>\n<input id="username" type="text">',
      },
      {
        step: 2,
        title: "Nest input inside label (implicit labeling)",
        description: "You can also nest the input inside the label element.",
        example: '<label>\n  Email:\n  <input type="email">\n</label>',
      },
      {
        step: 3,
        title: "Use aria-label as fallback",
        description: "If a visible label is not possible, use aria-label.",
        example: '<input type="search" aria-label="Search website">',
      },
      {
        step: 4,
        title: "Include required and error information",
        description:
          "Ensure labels indicate if a field is required and include error messages.",
        example:
          '<label for="email">Email <span aria-label="required">*</span></label>\n<input id="email" required aria-describedby="email-error">\n<span id="email-error">Invalid email format</span>',
      },
    ],
    relatedRules: [
      "form-field-multiple-labels",
      "aria-input-field-name",
      "select-name",
    ],
    elementTypes: ["<input>", "<textarea>", "<select>"],
    commonIssues: [
      "No label element or ARIA labeling",
      "Label not properly associated with input",
      "Missing labels on hidden or dynamically added fields",
      "Labels that don't clearly describe the field purpose",
    ],
    resources: [
      {
        name: "MDN: HTML <label>",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label",
      },
      {
        name: "WCAG: Labels or Instructions",
        url: "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",
      },
    ],
  },

  "color-contrast": {
    id: "color-contrast",
    title:
      "Ensure the contrast between foreground and background colors meets WCAG AA",
    wcagCriteria: ["1.4.3 Contrast (Minimum)"],
    severity: "serious",
    description:
      "Text and interactive elements must have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.",
    impact:
      "Low contrast text is difficult or impossible to read for people with low vision and color blindness.",
    remediationSteps: [
      {
        step: 1,
        title: "Test color contrast",
        description:
          "Use tools like WebAIM Contrast Checker or axe DevTools to measure contrast ratios.",
        example:
          "Black text (#000000) on white (#FFFFFF) = 21:1 ratio ✓\nGray text (#808080) on white (#FFFFFF) = 4.48:1 ratio ✓",
      },
      {
        step: 2,
        title: "Increase contrast by darkening or lightening",
        description:
          "Adjust either the foreground or background color to meet the 4.5:1 minimum.",
        example:
          "Instead of #777777 on #FFFFFF, use #555555 or #666666 to pass WCAG AA",
      },
      {
        step: 3,
        title: "Use sufficient contrast for interactive elements",
        description:
          "Buttons, links, and form fields need the same contrast ratio.",
        example:
          '<button style="background: #0066CC; color: #FFFFFF;">Submit</button> <!-- 8.59:1 ratio ✓ -->',
      },
      {
        step: 4,
        title: "Consider WCAG AAA for enhanced contrast",
        description:
          "For better accessibility, aim for 7:1 contrast ratio (WCAG AAA standard).",
        example:
          "AAA ratio example: Black (#000000) on white = 21:1 ✓ (exceeds AAA requirement)",
      },
    ],
    relatedRules: ["link-in-text-block", "color-contrast-enhanced"],
    elementTypes: ["<p>", "<a>", "<button>", "<label>", "<span>"],
    commonIssues: [
      "Gray text on light backgrounds",
      "Light colored text on light backgrounds",
      "Placeholder text with insufficient contrast",
      "Hover/focus states with low contrast",
      "Icons that rely only on color without sufficient contrast",
    ],
    resources: [
      {
        name: "WebAIM: Contrast Checker",
        url: "https://webaim.org/resources/contrastchecker/",
      },
      {
        name: "WCAG: Contrast (Minimum)",
        url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
      },
    ],
  },

  "aria-required-attr": {
    id: "aria-required-attr",
    title: "Ensure elements with ARIA roles have all required ARIA attributes",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "critical",
    description:
      "ARIA roles require certain attributes to function properly. Each role has mandatory attributes that must be present.",
    impact:
      "Missing required ARIA attributes prevent assistive technologies from properly communicating the element's state and purpose.",
    remediationSteps: [
      {
        step: 1,
        title: "Identify required attributes for each ARIA role",
        description:
          "Consult ARIA specification to determine which attributes your role requires.",
        example:
          'role="slider" requires: aria-valuemin, aria-valuemax, aria-valuenow',
      },
      {
        step: 2,
        title: "Add all required ARIA attributes",
        description:
          "Implement each required attribute with appropriate values.",
        example:
          '<div role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>',
      },
      {
        step: 3,
        title: "Update attributes dynamically when state changes",
        description:
          "Keep ARIA attributes synchronized with the element's state.",
        example:
          'element.setAttribute("aria-valuenow", newValue);\nelement.setAttribute("aria-expanded", isExpanded);',
      },
    ],
    relatedRules: [
      "aria-required-children",
      "aria-allowed-attr",
      "aria-prohibited-attr",
    ],
    elementTypes: ["[role]"],
    commonIssues: [
      "Missing aria-valuemin/max/now on range roles",
      "Missing aria-expanded on expandable elements",
      "Missing aria-label on generic roles",
      "Not updating required attributes when element state changes",
    ],
    resources: [
      {
        name: "WAI-ARIA: Roles",
        url: "https://www.w3.org/WAI/ARIA/apg/patterns/",
      },
      {
        name: "MDN: ARIA Attributes",
        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes",
      },
    ],
  },

  "heading-order": {
    id: "heading-order",
    title: "Ensure the order of headings is semantically correct",
    wcagCriteria: ["1.3.1 Info and Relationships"],
    severity: "moderate",
    description:
      "Page headings should follow a logical hierarchy (h1 → h2 → h3) without skipping levels.",
    impact:
      "Screen reader users rely on heading structure to navigate and understand page organization. Skipped levels create confusion.",
    remediationSteps: [
      {
        step: 1,
        title: "Start with h1 at the top level",
        description:
          "Each page should have exactly one h1 that represents the main topic.",
        example: "<h1>About Our Company</h1>",
      },
      {
        step: 2,
        title: "Follow sequential heading levels",
        description:
          "Progress through heading levels without skipping (h1 → h2 → h3 → h4).",
        example:
          "<h1>Main Title</h1>\n<h2>Section A</h2>\n<h3>Subsection A1</h3>\n<h2>Section B</h2>",
      },
      {
        step: 3,
        title: "Don't use headings for styling",
        description:
          "Don't use heading tags to make text larger. Use CSS for visual styling instead.",
        example:
          '<!-- Bad: Using h2 for styling -->\n<h2 style="font-size: 14px;">Regular text</h2>\n\n<!-- Good: Use span with CSS -->\n<p><strong>Regular text</strong></p>',
      },
      {
        step: 4,
        title: "Use heading levels to indicate hierarchy",
        description:
          "Heading level should reflect content structure, not visual appearance.",
        example:
          "<h1>Products</h1>\n<h2>Electronics</h2>\n<h3>Laptops</h3>\n<h3>Phones</h3>\n<h2>Furniture</h2>",
      },
    ],
    relatedRules: ["page-has-heading-one", "empty-heading"],
    elementTypes: ["<h1>", "<h2>", "<h3>", "<h4>", "<h5>", "<h6>"],
    commonIssues: [
      "Skipping heading levels (h1 → h3)",
      "Multiple h1 elements on one page",
      "No h1 on the page",
      "Using headings purely for visual styling",
      "Inconsistent heading structure across pages",
    ],
    resources: [
      {
        name: "WebAIM: Semantic Structure",
        url: "https://webaim.org/articles/semanticstructure/",
      },
      {
        name: "WCAG: Headings and Labels",
        url: "https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html",
      },
    ],
  },

  "link-name": {
    id: "link-name",
    title: "Ensure links have discernible text",
    wcagCriteria: ["2.4.4 Link Purpose (In Context)"],
    severity: "serious",
    description:
      "All links must have descriptive text that explains their destination or purpose.",
    impact:
      "Screen reader users cannot understand where a link goes if it lacks descriptive text.",
    remediationSteps: [
      {
        step: 1,
        title: "Use descriptive link text",
        description:
          "Link text should clearly indicate the destination or action. Avoid generic text.",
        example:
          '<!-- Good -->\n<a href="/products">Browse our products</a>\n\n<!-- Bad -->\n<a href="/products">Click here</a>',
      },
      {
        step: 2,
        title: "Add aria-label to ambiguous links",
        description: "If link text is not descriptive enough, use aria-label.",
        example:
          '<a href="/about" aria-label="Learn more about our company">Read more</a>',
      },
      {
        step: 3,
        title: "Provide context for shorthand links",
        description: "Icon-only links need aria-label or hidden text.",
        example:
          '<a href="/search" aria-label="Search"><span aria-hidden="true">🔍</span></a>',
      },
    ],
    relatedRules: ["link-in-text-block", "aria-command-name"],
    elementTypes: ["<a>"],
    commonIssues: [
      "Generic link text like 'Click here', 'Read more', 'Link'",
      "Icon-only links without labels",
      "Links that only say the URL",
      "Missing context for abbreviations in links",
    ],
    resources: [
      {
        name: "WebAIM: Links and Anchors",
        url: "https://webaim.org/articles/link/",
      },
    ],
  },

  "html-has-lang": {
    id: "html-has-lang",
    title: "Ensure every HTML document has a lang attribute",
    wcagCriteria: ["3.1.1 Language of Page"],
    severity: "serious",
    description:
      "The <html> element must have a lang attribute that specifies the primary language of the page.",
    impact:
      "Without a language declaration, screen readers may use the wrong pronunciation and text-to-speech may sound incorrect.",
    remediationSteps: [
      {
        step: 1,
        title: "Add lang attribute to <html> element",
        description: "Specify the language code (e.g., 'en' for English).",
        example: '<html lang="en">',
      },
      {
        step: 2,
        title: "Use correct language codes",
        description: "Use BCP 47 language tags for accuracy.",
        example:
          '<html lang="en"> <!-- English -->\n<html lang="es"> <!-- Spanish -->\n<html lang="fr-CA"> <!-- French (Canada) -->',
      },
      {
        step: 3,
        title: "Mark sections in different languages",
        description:
          "Use lang attribute on elements with content in other languages.",
        example:
          '<p>Welcome to our site. <span lang="es">Bienvenido</span></p>',
      },
    ],
    relatedRules: ["html-lang-valid", "valid-lang"],
    elementTypes: ["<html>"],
    commonIssues: [
      "Missing lang attribute on <html>",
      "Invalid language code",
      "Not marking multilingual content",
      "Using incorrect BCP 47 format",
    ],
    resources: [
      {
        name: "W3C: Language Tags",
        url: "https://www.w3.org/International/questions/qa-html-language-declarations",
      },
    ],
  },

  list: {
    id: "list",
    title: "Ensure that lists are structured correctly",
    wcagCriteria: ["1.3.1 Info and Relationships"],
    severity: "serious",
    description:
      "Lists must use proper list elements (<ul>, <ol>, <li>) rather than div or other elements.",
    impact:
      "Screen readers use list structure to communicate how many items are in a list and allow jumping between items.",
    remediationSteps: [
      {
        step: 1,
        title: "Use <ul> for unordered lists",
        description:
          "Use <ul> (unordered list) for lists without a specific order.",
        example:
          "<ul>\n  <li>Red</li>\n  <li>Green</li>\n  <li>Blue</li>\n</ul>",
      },
      {
        step: 2,
        title: "Use <ol> for ordered lists",
        description: "Use <ol> (ordered list) when sequence matters.",
        example:
          "<ol>\n  <li>First step</li>\n  <li>Second step</li>\n  <li>Third step</li>\n</ol>",
      },
      {
        step: 3,
        title: "Always wrap items in <li>",
        description: "Direct children of <ul> or <ol> must be <li> elements.",
        example:
          "<!-- Good -->\n<ul>\n  <li>Item 1</li>\n</ul>\n\n<!-- Bad: li outside ul -->\n<ul></ul>\n<li>Item 1</li>",
      },
    ],
    relatedRules: ["listitem", "definition-list"],
    elementTypes: ["<ul>", "<ol>", "<li>"],
    commonIssues: [
      "Using <div> instead of <ul>/<ol>",
      "Nested <div> elements inside <ul>",
      "Non-<li> children in lists",
      "Missing structural list elements",
    ],
    resources: [
      {
        name: "MDN: HTML Lists",
        url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals#lists",
      },
    ],
  },

  "document-title": {
    id: "document-title",
    title: "Ensure each HTML document contains a non-empty <title> element",
    wcagCriteria: ["2.4.2 Page Titled"],
    severity: "serious",
    description:
      "Every page must have a descriptive <title> element in the <head> that identifies the page.",
    impact:
      "Without a page title, screen reader users and people with multiple tabs don't know what page they're on.",
    remediationSteps: [
      {
        step: 1,
        title: "Add a <title> element to <head>",
        description: "Create a descriptive title for the page.",
        example: "<head>\n  <title>Products - Example Company</title>\n</head>",
      },
      {
        step: 2,
        title: "Make titles descriptive and unique",
        description:
          "Each page should have a unique title describing its content.",
        example:
          "<!-- Homepage -->\n<title>Home - Example Company</title>\n\n<!-- Products page -->\n<title>Products - Example Company</title>",
      },
      {
        step: 3,
        title: "Put site name after page description",
        description:
          "Format: Page Name | Site Name for better readability in tabs.",
        example: "<title>Contact Us | Example Company</title>",
      },
    ],
    relatedRules: ["frame-title"],
    elementTypes: ["<title>"],
    commonIssues: [
      "Empty or missing <title>",
      "Generic title like 'Page 1' or 'New Document'",
      "Same title on every page",
      "Title that doesn't match page content",
    ],
    resources: [
      {
        name: "WCAG: Page Titled",
        url: "https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html",
      },
    ],
  },

  "select-name": {
    id: "select-name",
    title: "Ensure select element has an accessible name",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "critical",
    description:
      "All <select> elements must have an associated label or accessible name.",
    impact:
      "Screen reader users cannot understand what a dropdown menu is for without a label.",
    remediationSteps: [
      {
        step: 1,
        title: "Add a <label> element",
        description:
          "Create a label with a for attribute that matches the select id.",
        example:
          '<label for="country">Select your country:</label>\n<select id="country">\n  <option>USA</option>\n  <option>Canada</option>\n</select>',
      },
      {
        step: 2,
        title: "Use aria-label if visible label is not possible",
        description: "Add aria-label to the select element as a fallback.",
        example:
          '<select aria-label="Choose country">\n  <option>USA</option>\n</select>',
      },
      {
        step: 3,
        title: "Ensure options are meaningful",
        description: "Option text should be clear and describe the value.",
        example:
          '<select>\n  <option value="">-- Select an option --</option>\n  <option value="us">United States</option>\n</select>',
      },
    ],
    relatedRules: ["label", "aria-input-field-name"],
    elementTypes: ["<select>"],
    commonIssues: [
      "Missing label element",
      "No aria-label attribute",
      "Unclear option values",
      "Empty first option without placeholder text",
    ],
    resources: [
      {
        name: "WebAIM: Select Elements",
        url: "https://webaim.org/articles/form/",
      },
    ],
  },

  "role-img-alt": {
    id: "role-img-alt",
    title: "Ensure [role='img'] elements have alternative text",
    wcagCriteria: ["1.1.1 Non-text Content"],
    severity: "serious",
    description:
      "Elements with role='img' must have alt text or aria-label describing the image.",
    impact:
      "Screen reader users cannot understand the purpose of image elements without alternative text.",
    remediationSteps: [
      {
        step: 1,
        title: "Add aria-label to role='img' elements",
        description: "Provide descriptive text for the image.",
        example: '<div role="img" aria-label="Company logo">🏢</div>',
      },
      {
        step: 2,
        title: "Use aria-labelledby for complex images",
        description: "Reference nearby text that describes the image.",
        example:
          '<div role="img" aria-labelledby="chart-title">\n  <svg>...</svg>\n</div>\n<h2 id="chart-title">Annual Sales Chart 2024</h2>',
      },
      {
        step: 3,
        title: "Avoid empty role='img' elements",
        description: "Always provide text content or ARIA labels.",
        example:
          '<!-- Bad: <div role="img"></div> -->\n\n<!-- Good: -->\n<div role="img" aria-label="Description">content</div>',
      },
    ],
    relatedRules: ["image-alt", "svg-img-alt"],
    elementTypes: ["[role='img']", "<div role='img'>", "<span role='img'>"],
    commonIssues: [
      "Missing aria-label on role='img'",
      "Empty elements with role='img'",
      "Decorative images marked as role='img'",
      "Using role='img' instead of <img>",
    ],
    resources: [
      {
        name: "WAI-ARIA: img role",
        url: "https://www.w3.org/WAI/ARIA/apg/patterns/img/",
      },
    ],
  },

  "input-image-alt": {
    id: "input-image-alt",
    title: "Ensure <input type='image'> elements have alternative text",
    wcagCriteria: ["1.1.1 Non-text Content", "4.1.2 Name, Role, Value"],
    severity: "critical",
    description:
      "Image buttons (<input type='image'>) must have alt text or aria-label.",
    impact: "Screen reader users cannot understand what an image button does.",
    remediationSteps: [
      {
        step: 1,
        title: "Add alt attribute to <input type='image'>",
        description: "Describe the button's action in the alt text.",
        example: '<input type="image" src="submit.png" alt="Submit form">',
      },
      {
        step: 2,
        title: "Make alt text action-oriented",
        description: "Describe what happens when the button is clicked.",
        example:
          '<!-- Good -->\n<input type="image" src="arrow.png" alt="Go to next page">\n\n<!-- Bad -->\n<input type="image" src="arrow.png" alt="arrow">',
      },
      {
        step: 3,
        title: "Use <button> with <img> instead",
        description:
          "Consider using a regular button with an image for better semantics.",
        example: '<button>Submit <img src="icon.png" alt=""></button>',
      },
    ],
    relatedRules: ["image-alt", "button-name"],
    elementTypes: ["<input type='image'>"],
    commonIssues: [
      "Missing alt attribute",
      "Generic or unhelpful alt text",
      "Using filename as alt text",
      "Empty alt attribute on image buttons",
    ],
    resources: [
      {
        name: "MDN: input type='image'",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image",
      },
    ],
  },

  "svg-img-alt": {
    id: "svg-img-alt",
    title: "Ensure <svg> elements with role='img' have accessible text",
    wcagCriteria: ["1.1.1 Non-text Content"],
    severity: "serious",
    description:
      "SVG images must have descriptive text via <title>, <desc>, or ARIA labels.",
    impact:
      "Screen readers cannot interpret SVG content without accessible text.",
    remediationSteps: [
      {
        step: 1,
        title: "Add <title> and <desc> inside SVG",
        description: "Include descriptive elements within the SVG.",
        example:
          '<svg role="img">\n  <title>Sales Chart</title>\n  <desc>Shows quarterly sales growth</desc>\n  <circle cx="50" cy="50" r="40"/>\n</svg>',
      },
      {
        step: 2,
        title: "Use aria-label for simple SVGs",
        description: "For uncomplicated SVGs, aria-label is sufficient.",
        example: '<svg aria-label="Play button" role="img">...</svg>',
      },
      {
        step: 3,
        title: "Use aria-labelledby to reference text",
        description: "Point to nearby text that describes the SVG.",
        example:
          '<h2 id="svg-title">Chart Title</h2>\n<svg aria-labelledby="svg-title" role="img">...</svg>',
      },
      {
        step: 4,
        title: "Mark decorative SVGs appropriately",
        description: "Use aria-hidden='true' for purely decorative SVGs.",
        example: '<svg aria-hidden="true" role="presentation">...</svg>',
      },
    ],
    relatedRules: ["image-alt", "role-img-alt"],
    elementTypes: ["<svg>"],
    commonIssues: [
      "Missing title and desc elements",
      "No aria-label on SVG images",
      "Decorative SVGs not hidden from screen readers",
      "SVG with role='img' but no accessible name",
    ],
    resources: [
      {
        name: "WebAIM: SVG Accessibility",
        url: "https://webaim.org/articles/svg/",
      },
    ],
  },

  "area-alt": {
    id: "area-alt",
    title: "Ensure <area> elements have alternative text",
    wcagCriteria: ["1.1.1 Non-text Content", "2.4.4 Link Purpose"],
    severity: "critical",
    description: "Each <area> element in an image map must have alt text.",
    impact:
      "Screen reader users cannot understand clickable areas in image maps without alt text.",
    remediationSteps: [
      {
        step: 1,
        title: "Add alt attribute to each <area>",
        description: "Describe what each clickable region represents.",
        example:
          '<map name="shapes">\n  <area shape="circle" alt="Click for circle info" href="#circle">\n  <area shape="rect" alt="Click for rectangle info" href="#rect">\n</map>',
      },
      {
        step: 2,
        title: "Make alt text descriptive",
        description: "Indicate both what the area shows and what it does.",
        example:
          '<!-- Good -->\n<area alt="Click to view product details">\n\n<!-- Bad -->\n<area alt="link">',
      },
      {
        step: 3,
        title: "Consider using clickable elements instead",
        description: "Image maps are outdated; use modern HTML elements.",
        example:
          "<!-- Modern approach -->\n<button>Circle Info</button>\n<button>Rectangle Info</button>",
      },
    ],
    relatedRules: ["image-alt"],
    elementTypes: ["<area>"],
    commonIssues: [
      "Missing alt attributes on area elements",
      "Generic alt text like 'link' or 'click here'",
      "Alt text that doesn't describe the region",
      "Image maps used instead of semantic HTML",
    ],
    resources: [
      {
        name: "MDN: <area> element",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area",
      },
    ],
  },

  "video-caption": {
    id: "video-caption",
    title: "Ensure <video> elements have captions",
    wcagCriteria: ["1.2.2 Captions (Prerecorded)"],
    severity: "critical",
    description:
      "Videos must have captions for deaf and hard-of-hearing users.",
    impact:
      "Users who are deaf or hard of hearing cannot access video content without captions.",
    remediationSteps: [
      {
        step: 1,
        title: "Create a captions file (VTT format)",
        description: "Create a .vtt file with timed captions for your video.",
        example:
          "WEBVTT\n\n00:00:00.500 --> 00:00:07.000\nCaption here\n\n00:00:08.000 --> 00:00:14.000\nNext caption",
      },
      {
        step: 2,
        title: "Add <track> element to <video>",
        description: "Reference the caption file using the track element.",
        example:
          '<video controls>\n  <source src="video.mp4" type="video/mp4">\n  <track kind="captions" src="captions.vtt" srclang="en">\n</video>',
      },
      {
        step: 3,
        title: "Use kind='captions' for audio content",
        description: "Ensure the track type is set correctly.",
        example:
          '<!-- Captions for dialogue and sounds -->\n<track kind="captions" src="captions.vtt">\n\n<!-- Subtitles for dialogue only -->\n<track kind="subtitles" src="subtitles.vtt">',
      },
      {
        step: 4,
        title: "Label the captions track",
        description: "Add a label so users can enable captions.",
        example:
          '<track kind="captions" src="captions.vtt" srclang="en" label="English">',
      },
    ],
    relatedRules: ["no-autoplay-audio"],
    elementTypes: ["<video>", "<track>"],
    commonIssues: [
      "Missing <track> element",
      "Captions not synced with video",
      "Captions that are incomplete or illegible",
      "Using subtitles instead of captions",
      "No fallback for browsers that don't support captions",
    ],
    resources: [
      {
        name: "MDN: <track> element",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track",
      },
      {
        name: "WebAIM: Captions",
        url: "https://webaim.org/articles/captions/",
      },
    ],
  },

  bypass: {
    id: "bypass",
    title: "Ensure each page has at least one mechanism to bypass navigation",
    wcagCriteria: ["2.4.1 Bypass Blocks"],
    severity: "serious",
    description:
      "Users must have a way to skip repeated navigation blocks and jump to main content.",
    impact:
      "Keyboard and screen reader users waste time navigating through repeated content.",
    remediationSteps: [
      {
        step: 1,
        title: "Add a 'Skip to main content' link",
        description: "Create a link that jumps to the main content area.",
        example:
          '<a href="#main-content" class="skip-link">Skip to main content</a>\n\n<main id="main-content">\n  <!-- Page content -->\n</main>',
      },
      {
        step: 2,
        title: "Make the skip link keyboard-accessible",
        description: "Ensure it's visible on focus and appears at the top.",
        example:
          ".skip-link {\n  position: absolute;\n  top: -40px;\n  left: 0;\n  background: #000;\n  color: white;\n  padding: 8px;\n  z-index: 100;\n}\n\n.skip-link:focus {\n  top: 0;\n}",
      },
      {
        step: 3,
        title: "Place it before navigation",
        description: "The skip link should be the first focusable element.",
        example:
          '<body>\n  <a href="#main-content" class="skip-link">Skip to main content</a>\n  <nav>...</nav>\n  <main id="main-content">...</main>\n</body>',
      },
      {
        step: 4,
        title: "Add skip links for major sections",
        description: "Provide multiple skip links for complex page structures.",
        example:
          '<a href="#main">Skip to main</a>\n<a href="#footer">Skip to footer</a>\n<a href="#search">Skip to search</a>',
      },
    ],
    relatedRules: ["region", "landmark-main-is-top-level"],
    elementTypes: ["<a>", "<nav>", "<main>"],
    commonIssues: [
      "No skip link present",
      "Skip link not keyboard-accessible",
      "Skip link not visible on focus",
      "Skip link placed after navigation elements",
    ],
    resources: [
      {
        name: "WebAIM: Skip Links",
        url: "https://webaim.org/articles/skipnav/",
      },
      {
        name: "WCAG: Bypass Blocks",
        url: "https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html",
      },
    ],
  },

  "meta-viewport": {
    id: "meta-viewport",
    title:
      "Ensure <meta name='viewport'> does not disable text scaling and zooming",
    wcagCriteria: ["1.4.4 Resize Text"],
    severity: "moderate",
    description:
      "The viewport meta tag should allow users to zoom and scale text.",
    impact:
      "Users cannot magnify text if zooming is disabled, affecting people with low vision.",
    remediationSteps: [
      {
        step: 1,
        title: "Add viewport meta tag",
        description: "Include the meta viewport tag in your head.",
        example:
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      },
      {
        step: 2,
        title: "Allow user zooming",
        description: "Never set user-scalable=no.",
        example:
          '<!-- Good -->\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n<!-- Bad -->\n<meta name="viewport" content="width=device-width, user-scalable=no">',
      },
      {
        step: 3,
        title: "set reasonable maximum zoom",
        description: "Allow at least 2x zoom.",
        example:
          '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">',
      },
    ],
    relatedRules: ["meta-refresh"],
    elementTypes: ["<meta name='viewport'>"],
    commonIssues: [
      "user-scalable=no in viewport",
      "maximum-scale less than 2",
      "Missing viewport meta tag",
      "Preventing pinch-zoom on mobile",
    ],
    resources: [
      {
        name: "MDN: Viewport Meta Tag",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",
      },
    ],
  },

  "frame-title": {
    id: "frame-title",
    title: "Ensure <iframe> and <frame> elements have an accessible name",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "serious",
    description: "Every iframe must have a title attribute or accessible name.",
    impact:
      "Screen reader users cannot identify the purpose of an embedded frame.",
    remediationSteps: [
      {
        step: 1,
        title: "Add title attribute to <iframe>",
        description: "Provide a descriptive title for the frame.",
        example:
          '<iframe title="Company video player" src="https://example.com/video"></iframe>',
      },
      {
        step: 2,
        title: "Make titles descriptive",
        description: "Clearly indicate what content the frame contains.",
        example:
          '<!-- Good -->\n<iframe title="Google Maps: Office Location"></iframe>\n\n<!-- Bad -->\n<iframe title="Frame"></iframe>',
      },
      {
        step: 3,
        title: "Use aria-label if title attribute is not suitable",
        description: "ARIA label can provide the frame name.",
        example: '<iframe aria-label="Embedded content"></iframe>',
      },
    ],
    relatedRules: ["frame-title-unique", "frame-focusable-content"],
    elementTypes: ["<iframe>", "<frame>"],
    commonIssues: [
      "Missing title attribute",
      "Generic or empty titles",
      "Using src URL as the title",
      "Frame elements without any name",
    ],
    resources: [
      {
        name: "MDN: <iframe> element",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe",
      },
    ],
  },

  "html-lang-valid": {
    id: "html-lang-valid",
    title: "Ensure the lang attribute has a valid value",
    wcagCriteria: ["3.1.1 Language of Page"],
    severity: "serious",
    description: "The lang attribute must use valid BCP 47 language codes.",
    impact:
      "Screen readers use language codes to apply correct pronunciation rules.",
    remediationSteps: [
      {
        step: 1,
        title: "Use valid BCP 47 codes",
        description:
          "Language codes must be recognized and properly formatted.",
        example:
          '<html lang="en"> <!-- English -->\n<html lang="es"> <!-- Spanish -->\n<html lang="fr-CA"> <!-- French (Canada) -->',
      },
      {
        step: 2,
        title: "Avoid invalid formats",
        description: "Don't use custom or misspelled language codes.",
        example:
          '<!-- Bad -->\n<html lang="inglés">\n<html lang="en_US">\n<html lang="english">\n\n<!-- Good -->\n<html lang="en">\n<html lang="en-US">',
      },
      {
        step: 3,
        title: "Use correct region codes",
        description: "For region-specific languages, use valid country codes.",
        example:
          '<html lang="en-US"> <!-- US English -->\n<html lang="en-GB"> <!-- British English -->\n<html lang="pt-BR"> <!-- Brazilian Portuguese -->',
      },
    ],
    relatedRules: ["html-has-lang", "valid-lang"],
    elementTypes: ["<html>"],
    commonIssues: [
      "Invalid language code format",
      "Misspelled language codes",
      "Using underscores instead of hyphens",
      "Custom or undefined language codes",
    ],
    resources: [
      {
        name: "IANA Language Subtag Registry",
        url: "https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry",
      },
    ],
  },

  listitem: {
    id: "listitem",
    title: "Ensure <li> elements are used semantically",
    wcagCriteria: ["1.3.1 Info and Relationships"],
    severity: "serious",
    description:
      "<li> elements must be direct children of <ul>, <ol>, or <menu> elements.",
    impact:
      "Misplaced list items break the semantic structure and confuse screen readers.",
    remediationSteps: [
      {
        step: 1,
        title: "Nest <li> directly in <ul> or <ol>",
        description: "List items must be direct children of list elements.",
        example:
          "<!-- Good -->\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n\n<!-- Bad -->\n<ul>\n  <div>\n    <li>Item 1</li>\n  </div>\n</ul>",
      },
      {
        step: 2,
        title: "Don't nest other elements between list and items",
        description: "Avoid divs or other wrappers around list items.",
        example:
          "<!-- Bad -->\n<ul>\n  <div class='item-group'>\n    <li>Item</li>\n  </div>\n</ul>\n\n<!-- Good -->\n<ul>\n  <li>Item</li>\n</ul>",
      },
      {
        step: 3,
        title: "Ensure all list children are <li> elements",
        description: "Don't mix text or other elements at the list level.",
        example:
          "<!-- Bad -->\n<ul>\n  Some text\n  <li>Item 1</li>\n</ul>\n\n<!-- Good -->\n<ul>\n  <li>Item 1</li>\n</ul>",
      },
    ],
    relatedRules: ["list", "definition-list"],
    elementTypes: ["<li>"],
    commonIssues: [
      "<li> outside of <ul>/<ol>",
      "Nested divs between list and items",
      "Non-list elements as list children",
      "Mixing list items with non-list content",
    ],
    resources: [
      {
        name: "MDN: <li> element",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li",
      },
    ],
  },

  "definition-list": {
    id: "definition-list",
    title: "Ensure <dl> elements are structured correctly",
    wcagCriteria: ["1.3.1 Info and Relationships"],
    severity: "serious",
    description:
      "Definition lists must have proper structure with <dt> and <dd> elements.",
    impact:
      "Improper definition list structure confuses screen readers about relationships.",
    remediationSteps: [
      {
        step: 1,
        title: "Use correct definition list structure",
        description: "Structure: <dl> > <dt> + <dd>",
        example:
          "<dl>\n  <dt>HTML</dt>\n  <dd>HyperText Markup Language</dd>\n  <dt>CSS</dt>\n  <dd>Cascading Style Sheets</dd>\n</dl>",
      },
      {
        step: 2,
        title: "Pair each term with at least one definition",
        description: "<dt> elements should have corresponding <dd> elements.",
        example:
          "<!-- Good -->\n<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>\n\n<!-- Bad -->\n<dl>\n  <dt>Term</dt>\n  <dt>Another term</dt>\n  <dd>Single definition</dd>\n</dl>",
      },
      {
        step: 3,
        title: "Avoid nesting non-list elements",
        description: "Don't place divs or other elements between dl and dt/dd.",
        example:
          "<!-- Bad -->\n<dl>\n  <div>\n    <dt>Term</dt>\n    <dd>Definition</dd>\n  </div>\n</dl>\n\n<!-- Good -->\n<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>",
      },
    ],
    relatedRules: ["dlitem", "list"],
    elementTypes: ["<dl>", "<dt>", "<dd>"],
    commonIssues: [
      "Wrong structure (dt/dd outside dl)",
      "No definitions for terms",
      "Nested divs between dl and dt/dd",
      "Using dl for non-definition content",
    ],
    resources: [
      {
        name: "MDN: <dl> element",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl",
      },
    ],
  },

  dlitem: {
    id: "dlitem",
    title: "Ensure <dt> and <dd> are contained by <dl>",
    wcagCriteria: ["1.3.1 Info and Relationships"],
    severity: "serious",
    description:
      "<dt> and <dd> elements must be direct children of <dl> elements.",
    impact: "Screen readers cannot interpret orphaned definition list items.",
    remediationSteps: [
      {
        step: 1,
        title: "Nest dt/dd inside dl",
        description: "<dt> and <dd> must be direct children of <dl>.",
        example:
          "<!-- Good -->\n<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>\n\n<!-- Bad -->\n<dt>Term</dt>\n<dd>Definition</dd>",
      },
      {
        step: 2,
        title: "Don't use dt/dd outside definition lists",
        description: "These elements are only valid inside <dl>.",
        example:
          "<!-- Bad: dt/dd without dl -->\n<div>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</div>\n\n<!-- Good: Use dl -->\n<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>",
      },
    ],
    relatedRules: ["definition-list"],
    elementTypes: ["<dt>", "<dd>"],
    commonIssues: [
      "dt/dd elements not inside dl",
      "dt/dd as direct body children",
      "dt/dd in wrong container elements",
    ],
    resources: [
      {
        name: "MDN: Definition Lists",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl",
      },
    ],
  },

  "aria-valid-attr": {
    id: "aria-valid-attr",
    title: "Ensure attributes that begin with aria- are valid ARIA attributes",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "critical",
    description: "Only valid ARIA attribute names should be used.",
    impact: "Invalid ARIA attributes are ignored by assistive technologies.",
    remediationSteps: [
      {
        step: 1,
        title: "Check ARIA attribute names",
        description: "Use only official ARIA attributes from the spec.",
        example:
          '<!-- Good -->\n<button aria-label="Close">×</button>\n<div aria-expanded="false"></div>\n\n<!-- Bad -->\n<button aria-close="true">×</button>\n<div aria-current-filter="active"></div>',
      },
      {
        step: 2,
        title: "Check spelling",
        description: "ARIA attributes are case-sensitive and specific.",
        example:
          '<!-- Bad (misspelled) -->\n<div aria-exapnded="true"></div>\n\n<!-- Good -->\n<div aria-expanded="true"></div>',
      },
      {
        step: 3,
        title: "Verify role compatibility",
        description: "Ensure the attribute is valid for the element's role.",
        example:
          '<!-- Good: aria-label on button -->\n<button aria-label="Close"></button>\n\n<!-- Bad: aria-valuenow on button (should be slider) -->\n<button aria-valuenow="50"></button>',
      },
    ],
    relatedRules: ["aria-valid-attr-value", "aria-allowed-attr"],
    elementTypes: ["[aria-*]"],
    commonIssues: [
      "Misspelled ARIA attributes",
      "Using unsupported ARIA attributes",
      "Invalid attribute names",
      "Typos in aria- prefix",
    ],
    resources: [
      {
        name: "WAI-ARIA: Attributes",
        url: "https://www.w3.org/WAI/ARIA/apg/practices/naming/",
      },
    ],
  },

  "aria-valid-attr-value": {
    id: "aria-valid-attr-value",
    title: "Ensure all ARIA attributes have valid values",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "critical",
    description:
      "ARIA attributes must be set to allowed values according to the spec.",
    impact:
      "Invalid ARIA values cause assistive technologies to misinterpret element state.",
    remediationSteps: [
      {
        step: 1,
        title: "Use valid enum values",
        description: "Some ARIA attributes only accept specific values.",
        example:
          '<!-- Good -->\n<div aria-expanded="true"></div>\n<div aria-expanded="false"></div>\n\n<!-- Bad -->\n<div aria-expanded="yes"></div>\n<div aria-expanded="1"></div>',
      },
      {
        step: 2,
        title: "Use correct value types",
        description: "Boolean attributes, strings, or IDs as appropriate.",
        example:
          '<!-- Good boolean -->\n<button aria-pressed="true">Toggle</button>\n\n<!-- Good reference -->\n<button aria-labelledby="label-id">Button</button>\n\n<!-- Bad: wrong type -->\n<button aria-pressed="1">Toggle</button>',
      },
      {
        step: 3,
        title: "Check ARIA spec for each attribute",
        description: "Each attribute has specific allowed values.",
        example:
          '<!-- aria-current: page, step, location, date, time, or false -->\n<a href="/" aria-current="page">Home</a>\n\n<!-- Bad -->\n<a href="/" aria-current="true">Home</a>',
      },
    ],
    relatedRules: ["aria-valid-attr", "aria-allowed-attr"],
    elementTypes: ["[aria-*]"],
    commonIssues: [
      "Using 'yes'/'no' instead of 'true'/'false'",
      "Using 1/0 instead of boolean",
      "Invalid enum values",
      "Wrong ID references in aria-labelledby",
    ],
    resources: [
      {
        name: "WAI-ARIA: Attribute Values",
        url: "https://www.w3.org/WAI/ARIA/apg/practices/naming/",
      },
    ],
  },

  "aria-roles": {
    id: "aria-roles",
    title: "Ensure all elements with a role attribute use a valid value",
    wcagCriteria: ["4.1.2 Name, Role, Value"],
    severity: "critical",
    description: "Only valid ARIA role names from the spec should be used.",
    impact:
      "Invalid roles cause assistive technologies to not understand element purpose.",
    remediationSteps: [
      {
        step: 1,
        title: "Use valid role names",
        description: "Roles must match official ARIA role definitions.",
        example:
          '<!-- Good -->\n<div role="button">Click me</div>\n<nav role="navigation">...</nav>\n\n<!-- Bad -->\n<div role="btn">Click me</div>\n<nav role="navbar">...</nav>',
      },
      {
        step: 2,
        title: "Prefer semantic HTML",
        description: "Use HTML elements instead of ARIA roles when possible.",
        example:
          '<!-- Good: semantic HTML -->\n<button>Click me</button>\n<nav>...</nav>\n\n<!-- Less good: ARIA role -->\n<div role="button">Click me</div>\n<div role="navigation">...</div>',
      },
      {
        step: 3,
        title: "Check role requirements",
        description: "Some roles have required child roles or attributes.",
        example:
          '<!-- role="menu" requires ARIA parent/child role structure -->\n<div role="menu">\n  <div role="menuitem">Option 1</div>\n  <div role="menuitem">Option 2</div>\n</div>',
      },
    ],
    relatedRules: ["aria-required-attr", "aria-deprecated-role"],
    elementTypes: ["[role]"],
    commonIssues: [
      "Misspelled role names",
      "Using HTML attribute names as roles",
      "Roles that don't exist in ARIA spec",
      "Using deprecated roles",
    ],
    resources: [
      {
        name: "WAI-ARIA: Roles",
        url: "https://www.w3.org/WAI/ARIA/apg/patterns/",
      },
    ],
  },
};

/**
 * Get remediation details for a specific rule
 */
export function getRemediationGuide(
  ruleId: string,
): WcagRuleDetail | undefined {
  return wcagRemediationGuide[ruleId];
}

/**
 * Get all related rules
 */
export function getRelatedRules(ruleId: string): WcagRuleDetail[] {
  const rule = getRemediationGuide(ruleId);
  if (!rule) return [];

  return rule.relatedRules
    .map((id) => getRemediationGuide(id))
    .filter((r) => r !== undefined) as WcagRuleDetail[];
}

/**
 * Get rules that affect a specific HTML element type
 */
export function getRulesByElementType(elementType: string): WcagRuleDetail[] {
  return Object.values(wcagRemediationGuide).filter((rule) =>
    rule.elementTypes.includes(elementType),
  );
}

/**
 * Get rules by severity level
 */
export function getRulesBySeverity(
  severity: "critical" | "serious" | "moderate" | "minor",
): WcagRuleDetail[] {
  return Object.values(wcagRemediationGuide).filter(
    (rule) => rule.severity === severity,
  );
}

/**
 * Get rules by WCAG criteria
 */
export function getRulesByWcagCriteria(criteria: string): WcagRuleDetail[] {
  return Object.values(wcagRemediationGuide).filter((rule) =>
    rule.wcagCriteria.includes(criteria),
  );
}
