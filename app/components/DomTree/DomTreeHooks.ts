/**
 * Custom hooks for DOM tree component state management and logic
 * Extracted to improve component composition and testability
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { DomTreeFilters } from "@/lib/dom-tree-types";
import { DEFAULT_DOM_TREE_FILTERS } from "./DomTreeConstants";

/**
 * Manages DOM tree filter state
 */
export function useDomTreeFilters() {
  const [filters, setFilters] = useState<DomTreeFilters>(
    DEFAULT_DOM_TREE_FILTERS,
  );

  const updateFilters = useCallback(
    (updater: (prev: DomTreeFilters) => DomTreeFilters) => {
      setFilters(updater);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_DOM_TREE_FILTERS);
  }, []);

  const hasActiveFilters = useCallback(
    () =>
      filters.roles.length > 0 ||
      filters.ariaAttrs.length > 0 ||
      filters.associationId ||
      filters.keyword.trim().length > 0,
    [filters],
  );

  return {
    filters,
    setFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}

/**
 * Manages details element expansion state in DOM tree
 */
export function useDetailsElements(hasActiveDomTreeFilters: boolean) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const syncDetailsOpen = useCallback(() => {
    const elements =
      containerRef.current?.querySelectorAll<HTMLDetailsElement>(
        ".dom-tree-details",
      );

    elements?.forEach((element) => {
      if (element.getAttribute("data-initialized") !== "true") {
        element.open = element.getAttribute("data-default-open") === "true";
        element.setAttribute("data-initialized", "true");
      }

      if (hasActiveDomTreeFilters) {
        if (!element.hasAttribute("data-user-opened")) {
          const isMatchNode = element.getAttribute("data-has-match") === "true";
          const isInHighlightedBranch =
            element.getAttribute("data-under-highlight-branch") === "true";
          element.open = isMatchNode || !isInHighlightedBranch;
        }
      } else if (!element.hasAttribute("data-user-opened")) {
        const isMainSection =
          element.getAttribute("data-default-open") === "true";
        if (!isMainSection) {
          element.open = false;
        }
      }
    });
  }, [hasActiveDomTreeFilters]);

  // Sync on filter changes
  useEffect(() => {
    syncDetailsOpen();
  }, [hasActiveDomTreeFilters, syncDetailsOpen]);

  // Handle user interactions with details elements
  useEffect(() => {
    const getSingleNestedDetails = (
      detailsElement: HTMLDetailsElement,
    ): HTMLDetailsElement | null => {
      const childrenContainer = Array.from(detailsElement.children).find(
        (child) =>
          child instanceof HTMLElement &&
          child.classList.contains("dom-tree-children"),
      ) as HTMLElement | undefined;

      if (!childrenContainer) {
        return null;
      }

      const wrappers = Array.from(childrenContainer.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      );

      if (wrappers.length !== 1) {
        return null;
      }

      const directChildDetails = Array.from(wrappers[0].children).find(
        (child) =>
          child instanceof HTMLDetailsElement &&
          child.classList.contains("dom-tree-details"),
      );

      return directChildDetails instanceof HTMLDetailsElement
        ? directChildDetails
        : null;
    };

    const openSingleChildToggleChain = (root: HTMLDetailsElement) => {
      let current: HTMLDetailsElement | null = root;

      while (current) {
        const nestedDetails = getSingleNestedDetails(current);
        if (!nestedDetails || nestedDetails.hasAttribute("data-user-opened")) {
          break;
        }

        nestedDetails.open = true;
        nestedDetails.setAttribute("data-user-opened", "true");
        current = nestedDetails;
      }
    };

    const handleToggle = (e: Event) => {
      const target = e.target as HTMLDetailsElement;
      if (target.classList.contains("dom-tree-details") && e.isTrusted) {
        target.setAttribute("data-user-opened", "true");
        if (target.open) {
          openSingleChildToggleChain(target);
        }
      }
    };

    const elements =
      containerRef.current?.querySelectorAll<HTMLDetailsElement>(
        ".dom-tree-details",
      );

    elements?.forEach((element) => {
      element.addEventListener("toggle", handleToggle);
    });

    return () => {
      elements?.forEach((element) => {
        element.removeEventListener("toggle", handleToggle);
      });
    };
  }, []);

  return containerRef;
}

/**
 * Manages expanded/collapsed state for filter sections
 */
export function useFilterSectionExpansion() {
  const [expandedFilterSections, setExpandedFilterSections] = useState<
    Record<"roles" | "aria", boolean>
  >({
    roles: false,
    aria: false,
  });

  const toggleSection = useCallback((section: "roles" | "aria") => {
    setExpandedFilterSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  return {
    expandedFilterSections,
    setExpandedFilterSections,
    toggleSection,
  };
}

/**
 * Manages expanded role groups in filter UI
 */
export function useRoleGroupExpansion() {
  const [expandedRoleGroups, setExpandedRoleGroups] = useState<
    Record<string, boolean>
  >({});

  const toggleRoleGroup = useCallback((role: string) => {
    setExpandedRoleGroups((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  }, []);

  return {
    expandedRoleGroups,
    setExpandedRoleGroups,
    toggleRoleGroup,
  };
}
