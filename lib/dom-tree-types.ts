/**
 * Type definitions for DOM tree analysis, ARIA relationships, and filtering
 * Extracted to reduce duplication across the codebase
 */

export interface AriaRelationshipReference {
  selector: string;
  type: "labelledby" | "describedby" | "controls" | "haspopup";
}

export interface AriaRelationshipValidation {
  expectedRole?: string;
  roleMatches?: boolean;
  expectedChildRole?: string;
  itemsHaveExpectedChildRole?: boolean;
  details?: string;
}

export interface AriaRelationship {
  type: "labelledby" | "describedby" | "controls" | "haspopup";
  targetIds: string[];
  sourceSelector: string;
  popupType?: string;
  validation?: AriaRelationshipValidation;
}

/**
 * Maps for tracking ARIA relationships in the DOM tree.
 * This type is used extensively throughout the component to avoid prop-drilling
 */
export interface AriaRelationshipsMap {
  idToSelector: Map<string, string>;
  selectorToRelationships: Map<string, AriaRelationship[]>;
  idToReferences: Map<string, AriaRelationshipReference[]>;
}

export interface DomTreeFilters {
  roles: string[];
  ariaAttrs: string[];
  associationId: boolean;
  keyword: string;
}

export interface ViolationMetadata {
  count: number;
  hasWcag: boolean;
  hasAxe: boolean;
  relatedAttributes: string[];
}

export type ViolationTargetMap = Map<string, ViolationMetadata>;
