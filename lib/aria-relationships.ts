/**
 * Utilities for building and managing ARIA relationships between DOM elements
 */

import type { DOMTreeNode } from "./dom-analyzer";
import type {
  AriaRelationshipsMap,
  AriaRelationship,
  AriaRelationshipValidation,
} from "./dom-tree-types";

/**
 * Helper to determine expected role for aria-haspopup value
 */
function getExpectedRoleForPopupType(
  popupType: string | undefined,
): string | undefined {
  if (!popupType) return undefined;
  const v = popupType.toLowerCase();
  if (v === "false") return undefined;
  if (v === "true" || v === "menu") return "menu";
  if (v === "listbox") return "listbox";
  if (v === "tree") return "tree";
  if (v === "grid") return "grid";
  if (v === "dialog") return "dialog";
  return undefined;
}

/**
 * Helper to determine expected child role for a popup container role
 */
function getExpectedChildRoleForPopup(
  expectedRole?: string,
): string | undefined {
  if (!expectedRole) return undefined;
  if (expectedRole === "menu") return "menuitem";
  if (expectedRole === "listbox") return "option";
  if (expectedRole === "tree") return "treeitem";
  if (expectedRole === "grid") return "gridcell";
  return undefined;
}

/**
 * Build ARIA relationship maps from a DOM tree
 * This tracks labelledby, describedby, controls, and haspopup relationships
 */
export function buildAriaRelationshipMaps(
  node: DOMTreeNode | null,
): AriaRelationshipsMap {
  const idToSelector = new Map<string, string>();
  const idToNode = new Map<string, DOMTreeNode>();
  const selectorToRelationships = new Map<string, AriaRelationship[]>();
  const idToReferences = new Map<
    string,
    {
      selector: string;
      type: "labelledby" | "describedby" | "controls" | "haspopup";
    }[]
  >();

  // First pass: collect id -> selector and id -> node maps
  function collectIds(current: DOMTreeNode) {
    if (current.attributes.id) {
      idToSelector.set(current.attributes.id, current.selector);
      idToNode.set(current.attributes.id, current);
    }
    current.children?.forEach(collectIds);
  }

  // Second pass: build relationships and validations
  function collectRelationships(current: DOMTreeNode) {
    const labelledBy = current.attributes["aria-labelledby"];
    const describedBy = current.attributes["aria-describedby"];
    const controls = current.attributes["aria-controls"];
    const haspopup = current.attributes["aria-haspopup"];

    // Handle aria-labelledby
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
      targetIds.forEach((id) => {
        const refs = idToReferences.get(id) || [];
        refs.push({ selector: current.selector, type: "labelledby" });
        idToReferences.set(id, refs);
      });
    }

    // Handle aria-describedby
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
      targetIds.forEach((id) => {
        const refs = idToReferences.get(id) || [];
        refs.push({ selector: current.selector, type: "describedby" });
        idToReferences.set(id, refs);
      });
    }

    // Handle aria-controls
    if (controls) {
      const targetIds = controls.split(/\s+/).filter(Boolean);
      const relationship: AriaRelationship = {
        type: "controls",
        targetIds,
        sourceSelector: current.selector,
      };

      // Validate aria-controls targets
      const validation: AriaRelationshipValidation = {
        roleMatches: true,
        details: "",
      };
      const sourceRole = (current.attributes.role || "").toLowerCase();
      if (sourceRole === "tab") {
        validation.expectedRole = "tabpanel";
      }

      for (const id of targetIds) {
        const targetNode = idToNode.get(id);
        if (!targetNode) {
          validation.roleMatches = false;
          validation.details += `Target id=${id} not found. `;
          continue;
        }
        if (validation.expectedRole) {
          const roleAttr = (targetNode.attributes.role || "").toLowerCase();
          if (roleAttr !== validation.expectedRole) {
            validation.roleMatches = false;
            validation.details += `Target ${id} role='${roleAttr || "(none)"}' expected '${validation.expectedRole}'. `;
          }
        }
      }

      if (validation.details) {
        relationship.validation = validation;
      }

      const existing = selectorToRelationships.get(current.selector) || [];
      selectorToRelationships.set(current.selector, [
        ...existing,
        relationship,
      ]);

      targetIds.forEach((id) => {
        const refs = idToReferences.get(id) || [];
        refs.push({ selector: current.selector, type: "controls" });
        idToReferences.set(id, refs);
      });
    }

    // Handle aria-haspopup
    if (haspopup) {
      const popupType = String(haspopup).trim();
      const relationship: AriaRelationship = {
        type: "haspopup",
        targetIds: [],
        popupType,
        sourceSelector: current.selector,
      };

      // Validate aria-haspopup if it has controls
      if (controls) {
        const targetIds = controls.split(/\s+/).filter(Boolean);
        relationship.targetIds = targetIds;

        const expectedRole = getExpectedRoleForPopupType(popupType);
        const expectedChildRole = getExpectedChildRoleForPopup(expectedRole);

        const validation: AriaRelationshipValidation = {
          expectedRole,
          roleMatches: true,
          expectedChildRole,
          itemsHaveExpectedChildRole: true,
          details: "",
        };

        for (const id of targetIds) {
          const targetNode = idToNode.get(id);
          if (!targetNode) {
            validation.roleMatches = false;
            validation.details += `Target id=${id} not found. `;
            continue;
          }
          if (expectedRole) {
            const roleAttr = (targetNode.attributes.role || "").toLowerCase();
            if (roleAttr !== expectedRole) {
              validation.roleMatches = false;
              validation.details += `Target ${id} role='${roleAttr || "(none)"}' expected '${expectedRole}'. `;
            }
          }

          if (expectedChildRole) {
            const descendants = targetNode.children || [];
            const nonMatchingChildren = descendants.filter((d) => {
              const r = (d.attributes.role || "").toLowerCase();
              const likelyItemTag = [
                "li",
                "a",
                "button",
                "div",
                "span",
              ].includes(d.tagName);
              return likelyItemTag && r !== expectedChildRole;
            });
            if (nonMatchingChildren.length > 0) {
              validation.itemsHaveExpectedChildRole = false;
              validation.details += `Some children of ${id} lack role='${expectedChildRole}'. `;
            }
          }
        }

        relationship.validation = validation;
      }

      const existing = selectorToRelationships.get(current.selector) || [];
      selectorToRelationships.set(current.selector, [
        ...existing,
        relationship,
      ]);
    }

    current.children?.forEach(collectRelationships);
  }

  if (node) {
    collectIds(node);
    collectRelationships(node);
  }

  return { idToSelector, selectorToRelationships, idToReferences };
}
