/**
 * Utility functions for DOM tree manipulation and filtering
 * Extracted from DOMAnalysisViewer for reusability and testability
 */

import type { DOMTreeNode } from "./dom-analyzer";
import type {
  DomTreeFilters,
  AriaRelationshipsMap,
  ViolationTargetMap,
} from "./dom-tree-types";

/**
 * Checks if a node matches the current filter criteria
 */
export function nodeMatchesDomTreeFilters(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: AriaRelationshipsMap,
): boolean {
  // Filter by roles
  if (filters.roles.length > 0) {
    const nodeRole = node.attributes.role?.trim();
    if (!nodeRole || !filters.roles.includes(nodeRole)) {
      return false;
    }
  }

  // Filter by ARIA attributes
  if (filters.ariaAttrs.length > 0) {
    const hasMatchingAria = Object.keys(node.attributes).some(
      (attr) => attr.startsWith("aria-") && filters.ariaAttrs.includes(attr),
    );
    if (!hasMatchingAria) {
      return false;
    }
  }

  // Filter by ARIA associations
  if (filters.associationId) {
    const relationships =
      ariaRelationships?.selectorToRelationships.get(node.selector) || [];
    const isSourceAssociation = relationships.length > 0;

    const elementId = node.attributes.id;
    const isTargetAssociation =
      elementId &&
      (ariaRelationships?.idToReferences.get(elementId)?.length || 0) > 0;

    // Check for aria-haspopup="menu" and menu-related roles
    const hasPopupMenu = node.attributes["aria-haspopup"] === "menu";
    const isMenuRole = node.attributes.role === "menu";
    const isMenuItemRole = node.attributes.role === "menuitem";

    if (
      !isSourceAssociation &&
      !isTargetAssociation &&
      !hasPopupMenu &&
      !isMenuRole &&
      !isMenuItemRole
    ) {
      return false;
    }
  }

  // Filter by keyword
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

/**
 * Gets the match info for a node (which filters it matched)
 */
export function getNodeMatchInfo(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: AriaRelationshipsMap,
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

/**
 * Checks if a filter has any active criteria
 */
export function hasActiveFilters(filters: DomTreeFilters): boolean {
  return (
    filters.roles.length > 0 ||
    filters.ariaAttrs.length > 0 ||
    filters.associationId ||
    filters.keyword.trim().length > 0
  );
}

/**
 * Recursively filters a DOM tree based on filter criteria
 */
export function filterDomTreeByFilters(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: AriaRelationshipsMap,
): DOMTreeNode | null {
  if (!hasActiveFilters(filters)) {
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

/**
 * Collects all nodes matching the filter criteria from the tree
 */
export function collectFilteredNodes(
  node: DOMTreeNode,
  filters: DomTreeFilters,
  ariaRelationships?: AriaRelationshipsMap,
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

/**
 * Checks if a role produces any matches with current filters
 */
export function canRoleProduceMatches(
  role: string,
  currentFilters: DomTreeFilters,
  domTree: DOMTreeNode | null,
  ariaRelationships?: AriaRelationshipsMap,
): boolean {
  if (!domTree) return false;

  const testFilters: DomTreeFilters = {
    roles: [role],
    ariaAttrs: currentFilters.ariaAttrs,
    associationId: currentFilters.associationId,
    keyword: currentFilters.keyword,
  };

  function hasMatch(node: DOMTreeNode): boolean {
    if (nodeMatchesDomTreeFilters(node, testFilters, ariaRelationships)) {
      return true;
    }
    return (node.children || []).some(hasMatch);
  }

  return hasMatch(domTree);
}

/**
 * Checks if an ARIA attribute produces any matches with current filters
 */
export function canAriaAttrProduceMatches(
  ariaAttr: string,
  currentFilters: DomTreeFilters,
  domTree: DOMTreeNode | null,
  ariaRelationships?: AriaRelationshipsMap,
): boolean {
  if (!domTree) return false;

  const testFilters: DomTreeFilters = {
    roles: currentFilters.roles,
    ariaAttrs: [ariaAttr],
    associationId: currentFilters.associationId,
    keyword: currentFilters.keyword,
  };

  function hasMatch(node: DOMTreeNode): boolean {
    if (nodeMatchesDomTreeFilters(node, testFilters, ariaRelationships)) {
      return true;
    }
    return (node.children || []).some(hasMatch);
  }

  return hasMatch(domTree);
}

/**
 * Collects all roles from the DOM tree
 */
export function collectRolesFromDomTree(node: DOMTreeNode | null): string[] {
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

/**
 * Collects all ARIA attributes from the DOM tree
 */
export function collectAriaAttributesFromDomTree(
  node: DOMTreeNode | null,
): string[] {
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

/**
 * Builds a map of violations by target selector
 */
export function buildViolationTargetMap(
  violations: Array<{ nodes: Array<{ target: string[] }>; tags?: string[] }>,
): ViolationTargetMap {
  const map: ViolationTargetMap = new Map();

  violations.forEach((violation) => {
    const hasWcag = (violation.tags || []).some((tag) =>
      tag.toLowerCase().startsWith("wcag"),
    );

    violation.nodes.forEach((node) => {
      (node.target || []).forEach((selector) => {
        const existing = map.get(selector);
        if (existing) {
          existing.count += 1;
          existing.hasWcag = existing.hasWcag || hasWcag;
        } else {
          map.set(selector, {
            count: 1,
            hasWcag,
            hasAxe: true,
            relatedAttributes: [],
          });
        }
      });
    });
  });

  return map;
}
