/**
 * DOM Analyzer for JAWS Screen Reader
 * Extracts DOM structure and what would be announced by screen readers
 */

export interface HeadingItem {
  level: number;
  text: string;
  id?: string;
  announcement: string;
}

export interface LandmarkItem {
  role: string;
  label?: string;
  ariaLabel?: string;
  announcement: string;
}

export interface RoleItem {
  element: string;
  role: string;
  label?: string;
  ariaLabel?: string;
  announcement: string;
}

export interface FormItem {
  type: string;
  label?: string;
  ariaLabel?: string;
  name?: string;
  id?: string;
  required?: boolean;
  announcement: string;
}

export interface FocusableElement {
  tabOrder: number;
  element: string;
  label?: string;
  ariaLabel?: string;
  id?: string;
  name?: string;
  type?: string;
  href?: string;
  role?: string;
  tabindex?: string;
  announcement: string;
}

export interface DOMTreeNode {
  tagName: string;
  selector: string;
  attributes: Record<string, string>;
  textSnippet?: string;
  children: DOMTreeNode[];
}

export interface DOMAnalysis {
  headings: HeadingItem[];
  landmarks: LandmarkItem[];
  roles: RoleItem[];
  forms: FormItem[];
  focusable: FocusableElement[];
  domTree?: DOMTreeNode;
  summary: {
    totalHeadings: number;
    totalLandmarks: number;
    totalRoles: number;
    totalForms: number;
    totalFocusable: number;
    headingHierarchyValid: boolean;
    missingH1: boolean;
    skippedHeadingLevels: number[];
  };
}

/**
 * Generate JAWS announcement based on element properties
 */
function getScreenReaderAnnouncement(element: {
  tagName?: string;
  textContent?: string;
  ariaLabel?: string;
  label?: string;
  role?: string;
  title?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}): string {
  // aria-label takes precedence
  if (element.ariaLabel) {
    return `"${element.ariaLabel}"`;
  }

  // For form elements
  if (element.label) {
    if (element.type === "checkbox") {
      return `"${element.label}" checkbox`;
    }
    if (element.type === "radio") {
      return `"${element.label}" radio button`;
    }
    if (element.type === "text" || element.type === "email") {
      return `"${element.label}" ${element.type === "email" ? "email" : "text"} edit${element.required ? ", required" : ""}`;
    }
    return `"${element.label}"`;
  }

  // For landmarks
  if (element.role === "banner") {
    return `"banner" region`;
  }
  if (element.role === "navigation") {
    return `"navigation" landmark`;
  }
  if (element.role === "main") {
    return `"main" content region`;
  }
  if (element.role === "region" && element.title) {
    return `"${element.title}" region`;
  }
  if (element.role === "complementary") {
    return `"complementary" sidebar region`;
  }
  if (element.role === "contentinfo") {
    return `"content info" footer region`;
  }

  // For headings
  if (element.tagName?.match(/^H[1-6]$/i)) {
    const level = element.tagName.charAt(1);
    return `"${element.textContent || "Untitled"}" heading level ${level}`;
  }

  // For buttons
  if (element.role === "button" || element.tagName === "BUTTON") {
    return `"${element.textContent || element.title || "Button"}" button`;
  }

  // For links
  if (element.tagName === "A") {
    return `"${element.textContent || element.title || "Link"}" link`;
  }

  // Default
  return `"${element.textContent || element.title || "Element"}"`;
}

/**
 * Analyze DOM structure extracted from page
 */
export function analyzeDOMStructure(domData: {
  headings: Array<{ level: number; text: string; id?: string }>;
  landmarks: Array<{ role: string; label?: string; ariaLabel?: string }>;
  roles: Array<{
    element: string;
    role: string;
    label?: string;
    ariaLabel?: string;
  }>;
  forms: Array<{
    type: string;
    label?: string;
    ariaLabel?: string;
    name?: string;
    id?: string;
    required?: boolean;
  }>;
  focusable: Array<{
    tabOrder: number;
    element: string;
    label?: string;
    ariaLabel?: string;
    id?: string;
    name?: string;
    type?: string;
    href?: string;
    role?: string;
    tabindex?: string;
  }>;
  domTree?: DOMTreeNode;
}): DOMAnalysis {
  const headings = domData.headings.map((h) => ({
    ...h,
    announcement: `Heading level ${h.level}: "${h.text}"`,
  }));

  const landmarks = domData.landmarks.map((l) => {
    let announcement = "";
    switch (l.role) {
      case "banner":
        announcement = `Banner region`;
        break;
      case "navigation":
        announcement = `Navigation landmark`;
        break;
      case "main":
        announcement = `Main content region`;
        break;
      case "complementary":
        announcement = `Complementary sidebar region`;
        break;
      case "contentinfo":
        announcement = `Content info footer region`;
        break;
      case "region":
        announcement = `Region${l.label ? `: "${l.label}"` : ""}`;
        break;
      default:
        announcement = `Landmark: ${l.role}`;
    }

    return {
      ...l,
      announcement,
    };
  });

  const roles = domData.roles.map((r) => ({
    ...r,
    announcement: getScreenReaderAnnouncement({
      role: r.role,
      ariaLabel: r.ariaLabel,
      label: r.label,
    }),
  }));

  const forms = domData.forms.map((f) => ({
    ...f,
    announcement: getScreenReaderAnnouncement({
      type: f.type,
      label: f.label,
      ariaLabel: f.ariaLabel,
      required: f.required,
    }),
  }));

  const focusable = domData.focusable.map((el) => ({
    ...el,
    announcement: getScreenReaderAnnouncement({
      label: el.label,
      ariaLabel: el.ariaLabel,
    }),
  }));

  // Validate heading hierarchy
  const headingLevels = headings.map((h) => h.level);
  const skippedLevels: number[] = [];
  let prevLevel = 0;

  for (const level of headingLevels) {
    if (level > prevLevel + 1) {
      for (let i = prevLevel + 1; i < level; i++) {
        if (!skippedLevels.includes(i)) {
          skippedLevels.push(i);
        }
      }
    }
    prevLevel = level;
  }

  const missingH1 = !headingLevels.includes(1);

  return {
    headings,
    landmarks,
    roles,
    forms,
    focusable,
    domTree: domData.domTree,
    summary: {
      totalHeadings: headings.length,
      totalLandmarks: landmarks.length,
      totalRoles: roles.length,
      totalForms: forms.length,
      totalFocusable: focusable.length,
      headingHierarchyValid: !missingH1 && skippedLevels.length === 0,
      missingH1,
      skippedHeadingLevels: skippedLevels,
    },
  };
}
