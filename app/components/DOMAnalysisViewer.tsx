"use client";

import React from "react";
import { useEffect, useMemo } from "react";
import type { DOMAnalysis, DOMTreeNode } from "@/lib/dom-analyzer";
import type { Violation } from "@/lib/types";
import type { DomTreeFilters } from "@/lib/dom-tree-types";
import { getARIARole } from "@/lib/aria-roles-reference";
import {
  getARIAAttributeTooltip,
  getSemanticTagDescription,
} from "@/lib/aria-tooltips";
import { buildAriaRelationshipMaps } from "@/lib/aria-relationships";
import {
  filterDomTreeByFilters,
  collectFilteredNodes,
  canRoleProduceMatches,
  canAriaAttrProduceMatches,
  collectRolesFromDomTree,
  collectAriaAttributesFromDomTree,
  getNodeMatchInfo,
  buildViolationTargetMap,
} from "@/lib/dom-tree-utils";
import {
  SEMANTIC_TAGS,
  VOID_ELEMENTS,
  MAX_ATTRS_PER_NODE,
} from "./DomTree/DomTreeConstants";
import {
  useDomTreeFilters,
  useDetailsElements,
  useFilterSectionExpansion,
  useRoleGroupExpansion,
} from "./DomTree/DomTreeHooks";
import { StyledTooltip } from "./StyledTooltip";

interface DOMAnalysisViewerProps {
  analysis: DOMAnalysis;
  violations?: Violation[];
}

interface AriaRelationship {
  type: "labelledby" | "describedby" | "controls" | "haspopup";
  targetIds: string[];
  sourceSelector: string;
  popupType?: string;
  validation?: {
    expectedRole?: string;
    roleMatches?: boolean;
    expectedChildRole?: string;
    itemsHaveExpectedChildRole?: boolean;
    details?: string;
  };
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

// Constants imported from ./DomTree/DomTreeConstants
// SEMANTIC_TAGS, VOID_ELEMENTS, MAX_ATTRS_PER_NODE

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

// getARIAAttributeTooltip imported from @/lib/aria-tooltips

// Scroll to and briefly highlight an attribute element inside the dom tree container
function scrollToAndHighlightAttribute(
  container: HTMLElement | null | undefined,
  selector: string,
  attrName: string,
) {
  if (!container) {
    const docWrap = document.querySelector<HTMLElement>(".dom-tree");
    container = docWrap || undefined;
  }
  if (!container) return;

  // Find the element wrapper that has data-selector attribute equal to selector
  const wrappers = Array.from(
    container.querySelectorAll<HTMLElement>("[data-selector]"),
  );
  const wrapper = wrappers.find(
    (w) => w.getAttribute("data-selector") === selector,
  );
  if (!wrapper) return;

  const target = wrapper.querySelector<HTMLElement>(
    `[data-attr-name="${attrName}"]`,
  );
  if (!target) return;

  try {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {
    // ignore if not supported
  }

  const prevOutline = target.style.outline;
  target.style.outline = "3px solid rgba(59,130,246,0.8)";
  setTimeout(() => {
    target.style.outline = prevOutline || "";
  }, 2500);
  // Try to focus so tooltip components that show on focus can appear
  try {
    (target as HTMLElement).focus();
  } catch {}
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
      {
        selector: string;
        type: "labelledby" | "describedby" | "controls" | "haspopup";
      }[]
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

        // Validation: aria-label and aria-labelledby MUST NOT be used on role="presentation" or role="none"
        let invalidAttrMessage: string | undefined = undefined;
        const roleOnElement = (attributes["role"] || "").toLowerCase();
        if (
          (name === "aria-label" || name === "aria-labelledby") &&
          (roleOnElement === "presentation" || roleOnElement === "none")
        ) {
          invalidAttrMessage = `${name} is not allowed on elements with role='${roleOnElement}'. Use a visible label on a non-presentational element instead.`;
        }

        // Check if this attribute matches the current filter
        const isRoleMatch = isRoleAttribute && matchInfo?.includes("role");
        const isAriaMatch = isAriaAttribute && matchInfo?.includes("aria");
        const isMatched = isRoleMatch || isAriaMatch;

        // Check if this attribute is an ID that's referenced by other elements
        const isReferencedId =
          name === "id" &&
          (ariaRelationships?.idToReferences.get(value)?.length ?? 0) > 0;

        // Check if this attribute is part of ARIA associations
        const nodeRelationships =
          ariaRelationships?.selectorToRelationships.get(nodeSelector ?? "") ||
          [];
        const isAriaAssociationAttribute =
          (name === "aria-labelledby" ||
            name === "aria-describedby" ||
            name === "aria-controls" ||
            name === "aria-haspopup") &&
          nodeRelationships.length > 0;

        // Check for menu-related associations
        const isMenuRole =
          (name === "role" && (value === "menu" || value === "menuitem")) ||
          (name === "aria-haspopup" && value === "menu");

        const hasAssociation =
          isReferencedId || isAriaAssociationAttribute || isMenuRole;

        const attributeClass = getAttributeClass(name);
        const highlightedClass = [
          attributeClass,
          isMatched ? "dom-attr-matched" : "",
          hasAssociation ? "dom-attr-associated" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const finalTooltip = invalidAttrMessage
          ? invalidAttrMessage
          : roleTooltip
            ? roleTooltip
            : tooltipContent;

        const invalidClass = invalidAttrMessage ? " dom-attr-invalid" : "";

        return finalTooltip ? (
          <StyledTooltip
            key={name}
            content={`[ARIA] ${finalTooltip}`}
            className="dom-attr-tooltip"
          >
            <span
              className={highlightedClass + invalidClass}
              data-selector={nodeSelector}
              data-attr-name={name}
              tabIndex={0}
            >
              <span className="dom-attr-name">{name}</span>
              <span className="dom-attr-equals">=</span>
              <span className="dom-attr-value">&quot;{value}&quot;</span>
            </span>
          </StyledTooltip>
        ) : (
          <span
            key={name}
            className={highlightedClass + invalidClass}
            data-selector={nodeSelector}
            data-attr-name={name}
            tabIndex={0}
          >
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

// buildViolationTargetMap imported from @/lib/dom-tree-utils

// buildAriaRelationshipMaps is imported from @/lib/aria-relationships

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

// getSemanticTagDescription imported from @/lib/aria-tooltips

// collectRolesFromDomTree imported from @/lib/dom-tree-utils

// collectAriaAttributesFromDomTree imported from @/lib/dom-tree-utils

// nodeMatchesDomTreeFilters imported from @/lib/dom-tree-utils

// getNodeMatchInfo imported from @/lib/dom-tree-utils

// filterDomTreeByFilters imported from @/lib/dom-tree-utils

// canAriaAttrProduceMatches imported from @/lib/dom-tree-utils
// collectFilteredNodes imported from @/lib/dom-tree-utils

function renderDomTree(
  node: DOMTreeNode,
  depth: number,
  violationTargets: Map<
    string,
    {
      count: number;
      hasWcag: boolean;
      hasAxe: boolean;
      relatedAttributes: string[];
    }
  >,
  ariaRelationships?: {
    idToSelector: Map<string, string>;
    selectorToRelationships: Map<string, AriaRelationship[]>;
    idToReferences: Map<
      string,
      {
        selector: string;
        type: "labelledby" | "describedby" | "controls" | "haspopup";
      }[]
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
  const shouldBeOpen = forceExpandAll || shouldOpenByDefault;
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
  const hasControlsRelationship =
    relationships?.some((rel) => rel.type === "controls") ?? false;
  const hasHasPopupRelationship =
    relationships?.some((rel) => rel.type === "haspopup") ?? false;

  // Check if this element is referenced by others
  const elementId = node.attributes.id;
  const referencedBy = elementId
    ? ariaRelationships?.idToReferences.get(elementId)
    : undefined;
  const isReferenced = referencedBy && referencedBy.length > 0;

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
  if (
    (!hasNonVoidElementChildren ||
      hasDescribedByRelationship ||
      hasLabelledByRelationship ||
      hasControlsRelationship ||
      hasHasPopupRelationship) &&
    !isVoid
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
          data-selector={node.selector}
        >
          {lineNumber !== undefined && (
            <span className="dom-tree-line-number">{lineNumber}</span>
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
            {violationMeta?.relatedAttributes &&
              violationMeta.relatedAttributes.map((attr) => (
                <button
                  key={attr}
                  className="dom-badge attr-link"
                  onClick={() =>
                    scrollToAndHighlightAttribute(
                      undefined,
                      node.selector,
                      attr,
                    )
                  }
                >
                  {attr}
                </button>
              ))}
            {violationMeta?.hasWcag && (
              <span className="dom-badge wcag">WCAG</span>
            )}
            {relationships &&
              relationships.map((rel, idx) => {
                const label =
                  rel.type === "labelledby"
                    ? "labelled by"
                    : rel.type === "describedby"
                      ? "described by"
                      : rel.type === "controls"
                        ? "controls"
                        : "haspopup";
                const badge =
                  rel.type === "labelledby"
                    ? "\u2192LABEL"
                    : rel.type === "describedby"
                      ? "\u2192DESC"
                      : rel.type === "controls"
                        ? "\u2192CTRL"
                        : "\u2192HPUP";
                const tooltipContent =
                  rel.type === "haspopup"
                    ? `[ARIA] This element has aria-haspopup: ${rel.popupType || rel.targetIds.join(", ")}` +
                      (rel.validation?.details
                        ? ` — ${rel.validation.details}`
                        : "")
                    : `[ARIA] This element is ${label} element(s) with ID: ${rel.targetIds.join(", ")}` +
                      (rel.validation?.details
                        ? ` — ${rel.validation.details}`
                        : "");
                return (
                  <StyledTooltip
                    key={`rel-${idx}`}
                    content={tooltipContent}
                    className="dom-badge-tooltip"
                  >
                    <span className="dom-badge aria-relationship">{badge}</span>
                  </StyledTooltip>
                );
              })}
            {referencedBy && referencedBy.length > 0 && (
              <StyledTooltip
                content={`[ARIA] This element (id="${elementId}") is referenced by ${referencedBy.length} element(s) via ${referencedBy
                  .map((r) =>
                    r.type === "labelledby"
                      ? "aria-labelledby"
                      : r.type === "describedby"
                        ? "aria-describedby"
                        : r.type === "controls"
                          ? "aria-controls"
                          : "aria-haspopup",
                  )
                  .join(", ")}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge aria-referenced">
                  {referencedBy
                    .map((r) =>
                      r.type === "labelledby"
                        ? "aria-labelledby"
                        : r.type === "describedby"
                          ? "aria-describedby"
                          : r.type === "controls"
                            ? "aria-controls"
                            : "aria-haspopup",
                    )
                    .join(", ")}
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
          data-selector={node.selector}
        >
          {lineNumber !== undefined && (
            <span className="dom-tree-line-number">{lineNumber}</span>
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
              relationships.map((rel, idx) => {
                const label =
                  rel.type === "labelledby"
                    ? "labelled by"
                    : rel.type === "describedby"
                      ? "described by"
                      : rel.type === "controls"
                        ? "controls"
                        : "haspopup";
                const badge =
                  rel.type === "labelledby"
                    ? "→LABEL"
                    : rel.type === "describedby"
                      ? "→DESC"
                      : rel.type === "controls"
                        ? "→CTRL"
                        : "→HPUP";
                const tooltipContent =
                  rel.type === "haspopup"
                    ? `[ARIA] This element has aria-haspopup: ${rel.popupType || rel.targetIds.join(", ")}` +
                      (rel.validation?.details
                        ? ` — ${rel.validation.details}`
                        : "")
                    : `[ARIA] This element is ${label} element(s) with ID: ${rel.targetIds.join(", ")}` +
                      (rel.validation?.details
                        ? ` — ${rel.validation.details}`
                        : "");
                return (
                  <StyledTooltip
                    key={`rel-${idx}`}
                    content={tooltipContent}
                    className="dom-badge-tooltip"
                  >
                    <span className="dom-badge aria-relationship">{badge}</span>
                  </StyledTooltip>
                );
              })}
            {referencedBy && referencedBy.length > 0 && (
              <StyledTooltip
                content={`[ARIA] This element (id="${elementId}") is referenced by ${referencedBy.length} element(s) via ${referencedBy
                  .map((r) =>
                    r.type === "labelledby"
                      ? "aria-labelledby"
                      : r.type === "describedby"
                        ? "aria-describedby"
                        : r.type === "controls"
                          ? "aria-controls"
                          : "aria-haspopup",
                  )
                  .join(", ")}`}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge aria-referenced">
                  {referencedBy
                    .map((r) =>
                      r.type === "labelledby"
                        ? "aria-labelledby"
                        : r.type === "describedby"
                          ? "aria-describedby"
                          : r.type === "controls"
                            ? "aria-controls"
                            : "aria-haspopup",
                    )
                    .join(", ")}
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
          relationships.map((rel, idx) => {
            const label =
              rel.type === "labelledby"
                ? "labelled by"
                : rel.type === "describedby"
                  ? "described by"
                  : rel.type === "controls"
                    ? "controls"
                    : "haspopup";
            const badge =
              rel.type === "labelledby"
                ? "→LABEL"
                : rel.type === "describedby"
                  ? "→DESC"
                  : rel.type === "controls"
                    ? "→CTRL"
                    : "→HPUP";
            const tooltipContent =
              rel.type === "haspopup"
                ? `[ARIA] This element has aria-haspopup: ${rel.popupType || rel.targetIds.join(", ")}` +
                  (rel.validation?.details
                    ? ` — ${rel.validation.details}`
                    : "")
                : `[ARIA] This element is ${label} element(s) with ID: ${rel.targetIds.join(", ")}` +
                  (rel.validation?.details
                    ? ` — ${rel.validation.details}`
                    : "");
            return (
              <StyledTooltip
                key={`rel-${idx}`}
                content={tooltipContent}
                className="dom-badge-tooltip"
              >
                <span className="dom-badge aria-relationship">{badge}</span>
              </StyledTooltip>
            );
          })}
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
        data-selector={node.selector}
        style={{ marginLeft: `${depth + 8}px` }}
        data-line={lineNumber}
      >
        <summary className={`dom-tree-summary ${lineClass}`}>
          {lineNumber !== undefined && (
            <span className="dom-tree-line-number">{lineNumber}</span>
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
      {
        selector: string;
        type: "labelledby" | "describedby" | "controls" | "haspopup";
      }[]
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
            rel.type === "labelledby"
              ? "aria-labelledby"
              : rel.type === "describedby"
                ? "aria-describedby"
                : rel.type === "haspopup"
                  ? "aria-haspopup"
                  : "aria-controls";
          return (
            <div key={idx} style={{ marginTop: "4px", fontSize: "0.8rem" }}>
              <span style={{ color: "#d97706", fontWeight: "600" }}>
                {relType}
              </span>
              {rel.type === "haspopup" ? (
                <span style={{ marginLeft: "8px", color: "#94a3b8" }}>
                  → {rel.popupType || "(popup)"}
                </span>
              ) : (
                rel.targetIds.map((targetId) => {
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
                })
              )}
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
  const {
    filters: domTreeFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useDomTreeFilters();
  const { expandedRoleGroups, toggleRoleGroup } = useRoleGroupExpansion();
  const { expandedFilterSections, toggleSection } = useFilterSectionExpansion();
  const hasActiveDomTreeFilters = hasActiveFilters();
  const domTreeContainerRef = useDetailsElements(hasActiveDomTreeFilters);
  const { headings, landmarks, roles, forms, focusable, summary, domTree } =
    analysis;
  const violationTargets = buildViolationTargetMap(violations);
  const ariaRelationships = useMemo(
    () => buildAriaRelationshipMaps(domTree || null),
    [domTree],
  );
  // Debug: print relationship maps to help verify aria-controls / aria-haspopup
  useEffect(() => {
    try {
      console.debug("[DOMAnalysisViewer] ariaRelationships:", {
        idToSelector: Array.from(ariaRelationships.idToSelector.entries()),
        selectorToRelationships: Array.from(
          ariaRelationships.selectorToRelationships.entries(),
        ).map(([sel, rels]) => [sel, rels]),
        idToReferences: Array.from(ariaRelationships.idToReferences.entries()),
      });
    } catch {
      // ignore in environments without console
    }
  }, [domTree, ariaRelationships]);

  // Collect available roles and aria attributes (memoized)
  const availableRoles = useMemo(
    () => collectRolesFromDomTree(domTree || null),
    [domTree],
  );
  const availableAriaAttrs = useMemo(
    () => collectAriaAttributesFromDomTree(domTree || null),
    [domTree],
  );

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
                onClick={() => toggleSection("roles")}
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
                        updateFilters((prev) => ({
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
                            updateFilters((prev) => ({
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
                onClick={() => toggleSection("aria")}
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
                        updateFilters((prev) => ({
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
                            updateFilters((prev) => ({
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
                  updateFilters((prev) => ({
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
                  updateFilters((prev) => ({
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
              onClick={clearFilters}
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
                    updateFilters((prev) => ({
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
                hasActiveDomTreeFilters,
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
                  onClick={() => toggleRoleGroup(`${group.role}-${idx}`)}
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
