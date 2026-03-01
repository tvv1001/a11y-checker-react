import { NextRequest, NextResponse } from "next/server";
import { chromium, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import axeCore from "axe-core";
import { processResults, getConfig } from "@/lib/axe-config";
import { sendLogToStream } from "./stream/route";
import { analyzeDOMStructure, type DOMAnalysis } from "@/lib/dom-analyzer";

export const maxDuration = 60; // Maximum execution time in seconds
export const dynamic = "force-dynamic";

interface LogMessage {
  type: "info" | "success" | "error" | "warning";
  message: string;
  timestamp: number;
}

const logs: Map<string, LogMessage[]> = new Map();

function getSafeAxeSource(): string {
  const rawSource = axeCore.source || "";
  if (!rawSource) {
    return rawSource;
  }

  const withModuleShim =
    "var module = { exports: {} }; var exports = module.exports;\n" + rawSource;

  // Remove the CommonJS export branch to avoid `module` reference errors in page context.
  return withModuleShim.replace(
    /if \(\(typeof module[\s\S]*?module\.exports = axe;\s*\}/,
    "",
  );
}

const axeGlobalInitScript = `
  if (typeof window !== "undefined" && typeof window.module === "undefined") {
    window.module = { exports: {} };
    window.exports = window.module.exports;
  }
`;

function addLog(sessionId: string, type: LogMessage["type"], message: string) {
  if (!logs.has(sessionId)) {
    logs.set(sessionId, []);
  }
  const sessionLogs = logs.get(sessionId)!;
  sessionLogs.push({
    type,
    message,
    timestamp: Date.now(),
  });

  // Keep only last 100 logs per session
  if (sessionLogs.length > 100) {
    sessionLogs.shift();
  }

  // Also send to live stream if available
  sendLogToStream(sessionId, type, message);
}

/**
 * Extract DOM structure for accessibility analysis
 */
async function extractDOMStructure(
  page: Page,
): Promise<DOMAnalysis | undefined> {
  try {
    const domData = await page.evaluate(() => {
      const headings: Array<{ level: number; text: string; id?: string }> = [];
      const landmarks: Array<{
        role: string;
        label?: string;
        ariaLabel?: string;
      }> = [];
      const roles: Array<{
        element: string;
        role: string;
        label?: string;
        ariaLabel?: string;
      }> = [];
      const forms: Array<{
        type: string;
        label?: string;
        ariaLabel?: string;
        name?: string;
        id?: string;
        required?: boolean;
      }> = [];

      const MAX_DOM_DEPTH = 25;
      const MAX_CHILDREN_PER_NODE = 200;
      const MAX_TEXT_LENGTH = 100;

      const escapeId = (value: string) => {
        if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
          return CSS.escape(value);
        }
        return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
      };

      const buildSelector = (el: Element): string => {
        if (el.id) {
          return `#${escapeId(el.id)}`;
        }

        const parts: string[] = [];
        let current: Element | null = el;

        while (current && current.tagName.toLowerCase() !== "html") {
          let selector = current.tagName.toLowerCase();
          if (current.id) {
            selector = `#${escapeId(current.id)}`;
            parts.unshift(selector);
            break;
          }

          const parent: Element | null = current.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter(
              (child: Element) => child.tagName === current!.tagName,
            );
            if (siblings.length > 1) {
              const index = siblings.indexOf(current) + 1;
              selector += `:nth-of-type(${index})`;
            }
          }

          parts.unshift(selector);
          current = parent;
        }

        return parts.join(" > ");
      };

      const getTextSnippet = (el: Element): string | undefined => {
        const text = Array.from(el.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        if (!text) {
          return undefined;
        }

        return text.length > MAX_TEXT_LENGTH
          ? `${text.substring(0, MAX_TEXT_LENGTH)}...`
          : text;
      };

      type DomTreeNode = {
        tagName: string;
        selector: string;
        attributes: Record<string, string>;
        textSnippet?: string;
        children: DomTreeNode[];
      };

      const buildDomTree = (el: Element, depth: number): DomTreeNode | null => {
        if (depth > MAX_DOM_DEPTH) {
          return null;
        }

        const tagName = el.tagName.toLowerCase();
        if (["script", "style", "noscript", "link"].includes(tagName)) {
          return null;
        }

        // Filter out specific meta tags
        if (tagName === "meta") {
          const httpEquiv = el.getAttribute("http-equiv");
          const name = el.getAttribute("name");
          const property = el.getAttribute("property");

          // Filter out origin-trial, next-head-count, application-name
          if (httpEquiv === "origin-trial") {
            return null;
          }
          if (
            name === "next-head-count" ||
            name === "application-name" ||
            name === "robots"
          ) {
            return null;
          }
          // Filter out Open Graph and Twitter meta tags
          if (property?.startsWith("og:") || name?.startsWith("twitter:")) {
            return null;
          }
        }

        const attributes: Record<string, string> = {};
        Array.from(el.attributes).forEach((attr) => {
          if (
            attr.name === "class" ||
            attr.name === "style" ||
            attr.name.startsWith("data-")
          ) {
            return;
          }
          attributes[attr.name] = attr.value;
        });

        const children: DomTreeNode[] = [];
        for (const child of Array.from(el.children)) {
          if (children.length >= MAX_CHILDREN_PER_NODE) {
            break;
          }
          const childNode = buildDomTree(child, depth + 1);
          if (childNode) {
            children.push(childNode);
          }
        }

        return {
          tagName,
          selector: buildSelector(el),
          attributes,
          textSnippet: getTextSnippet(el),
          children,
        };
      };

      // Extract headings
      document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => {
        const level = parseInt(el.tagName[1]);
        headings.push({
          level,
          text: el.textContent?.trim() || "Untitled",
          id: el.id,
        });
      });

      // Extract landmarks
      document
        .querySelectorAll(
          "[role='banner'], [role='navigation'], [role='main'], [role='complementary'], [role='contentinfo'], [role='region'], header, nav, main, aside, footer",
        )
        .forEach((el) => {
          const role =
            el.getAttribute("role") ||
            (el.tagName === "HEADER"
              ? "banner"
              : el.tagName === "NAV"
                ? "navigation"
                : el.tagName === "MAIN"
                  ? "main"
                  : el.tagName === "ASIDE"
                    ? "complementary"
                    : el.tagName === "FOOTER"
                      ? "contentinfo"
                      : "region");

          const label =
            el.getAttribute("aria-label") ||
            el.getAttribute("aria-labelledby") ||
            (el.tagName === "HEADER" ||
            el.tagName === "FOOTER" ||
            el.tagName === "NAV" ||
            el.tagName === "ASIDE"
              ? undefined
              : el.textContent?.trim().substring(0, 50));

          landmarks.push({
            role,
            label,
            ariaLabel: el.getAttribute("aria-label") || undefined,
          });
        });

      // Extract elements with roles
      document.querySelectorAll("[role]").forEach((el) => {
        const role = el.getAttribute("role");
        if (
          ![
            "banner",
            "navigation",
            "main",
            "complementary",
            "contentinfo",
            "region",
          ].includes(role || "")
        ) {
          roles.push({
            element: el.tagName,
            role: role || "unknown",
            label: el.textContent?.trim().substring(0, 100),
            ariaLabel: el.getAttribute("aria-label") || undefined,
          });
        }
      });

      // Extract form elements
      document
        .querySelectorAll("input, select, textarea, button")
        .forEach((el) => {
          const label = (
            el.closest("label")?.textContent ||
            document.querySelector(`label[for="${el.id}"]`)?.textContent ||
            el.getAttribute("aria-label") ||
            el.getAttribute("placeholder") ||
            ""
          ).trim();

          forms.push({
            type:
              el.tagName === "INPUT"
                ? el.getAttribute("type") || "text"
                : el.tagName.toLowerCase(),
            label: label || undefined,
            ariaLabel: el.getAttribute("aria-label") || undefined,
            name: el.getAttribute("name") || undefined,
            id: el.id || undefined,
            required: el.hasAttribute("required"),
          });
        });

      // Extract focusable elements (keyboard navigation)
      const focusableElements: Array<{
        element: HTMLElement;
        tabOrder: number;
      }> = [];

      document
        .querySelectorAll<HTMLElement>(
          "a[href], button, input, select, textarea, [tabindex]",
        )
        .forEach((el) => {
          // Skip hidden, disabled, and elements with tabindex < 0
          const isDisabled =
            "disabled" in el && typeof el.disabled === "boolean" && el.disabled;
          if (
            el.offsetParent === null ||
            isDisabled ||
            el.getAttribute("tabindex") === "-1"
          ) {
            return;
          }

          const tabindex = el.getAttribute("tabindex");
          const tabOrder = tabindex ? parseInt(tabindex) : 0;
          focusableElements.push({ element: el, tabOrder });
        });

      // Sort by tab order: positive tabindex in order, then 0 in document order
      const positiveTabOrder = focusableElements
        .filter((el) => el.tabOrder > 0)
        .sort((a, b) => a.tabOrder - b.tabOrder);
      const zeroTabOrder = focusableElements.filter((el) => el.tabOrder === 0);

      const sortedFocusable = [
        ...positiveTabOrder.map((el, idx) => ({
          tabOrder: idx + 1,
          element: el.element,
        })),
        ...zeroTabOrder.map((el, idx) => ({
          tabOrder: positiveTabOrder.length + idx + 1,
          element: el.element,
        })),
      ];

      const focusable: Array<{
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
      }> = sortedFocusable.map((item) => {
        const el = item.element;
        const label =
          el.getAttribute("aria-label") ||
          el.textContent?.trim() ||
          (el as HTMLInputElement).placeholder ||
          (el as HTMLInputElement).value ||
          el.getAttribute("title") ||
          undefined;

        return {
          tabOrder: item.tabOrder,
          element: el.tagName,
          label: label ? label.substring(0, 100) : undefined,
          ariaLabel: el.getAttribute("aria-label") || undefined,
          id: el.id || undefined,
          name: (el as HTMLInputElement).name || undefined,
          type: (el as HTMLInputElement).type || undefined,
          href: (el as HTMLAnchorElement).href || undefined,
          role: el.getAttribute("role") || undefined,
          tabindex: el.getAttribute("tabindex") || undefined,
        };
      });

      // Build DOM tree from the entire document to capture full rendered HTML
      const domTree = buildDomTree(document.documentElement, 0);

      return { headings, landmarks, roles, forms, focusable, domTree };
    });

    return analyzeDOMStructure(domData as any);
  } catch (error) {
    console.error("Error extracting DOM structure:", error);
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get("url");
  const sessionId = searchParams.get("session") || "default";
  const wcagPreset = searchParams.get("wcag") || "wcag22aa";

  addLog(sessionId, "info", `Scan Request - URL: ${targetUrl}`);

  if (!targetUrl) {
    addLog(sessionId, "error", "Missing url parameter");
    return NextResponse.json(
      { error: "Missing url parameter.", logs: logs.get(sessionId) || [] },
      { status: 400 },
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid URL";
    addLog(sessionId, "error", `Invalid URL: ${message}`);
    return NextResponse.json(
      { error: "Invalid URL.", logs: logs.get(sessionId) || [] },
      { status: 400 },
    );
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    addLog(sessionId, "error", "Only http/https URLs are allowed");
    return NextResponse.json(
      {
        error: "Only http/https URLs are allowed.",
        logs: logs.get(sessionId) || [],
      },
      { status: 400 },
    );
  }

  let browser;
  let context;
  let page;

  try {
    addLog(sessionId, "info", "Launching Chromium browser...");
    browser = await chromium.launch({
      headless: true,
      args: ["--disable-dev-shm-usage", "--no-sandbox"],
    });
    addLog(sessionId, "success", "Browser launched successfully");

    addLog(sessionId, "info", "Creating browser context...");
    context = await browser.newContext({
      userAgent: "a11y-checker-react",
    });
    page = await context.newPage();
    await page.addInitScript(axeGlobalInitScript);
    addLog(sessionId, "success", "Browser context created");

    addLog(sessionId, "info", `Navigating to ${parsedUrl.toString()}...`);
    await page.goto(parsedUrl.toString(), {
      waitUntil: "load",
      timeout: 60000,
    });
    addLog(sessionId, "success", "Page loaded successfully");

    // Wait for network to settle to capture the final rendered DOM
    try {
      await page.waitForLoadState("networkidle", { timeout: 15000 });
    } catch {
      addLog(
        sessionId,
        "warning",
        "Network idle timeout reached; continuing with best-effort DOM snapshot.",
      );
    }

    // Wait for DOM content to fully load (including deferred scripts)
    try {
      await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    } catch {
      // Already loaded or timed out
    }

    // Allow late scripts to flush DOM mutations and dynamic content to render
    await page.waitForTimeout(2000);

    addLog(sessionId, "success", "Final rendered DOM captured");

    // Inject a script to sanitize problematic DOM nodes before scanning
    await page.evaluate(() => {
      // Remove or fix nodes that might cause axe-core issues
      try {
        // Find all elements with problematic attributes
        document.querySelectorAll("*").forEach((el) => {
          // Ensure nodeName exists and is a string
          if (!el.nodeName || typeof el.nodeName !== "string") {
            try {
              el.remove();
            } catch {
              // Ignore if removal fails
            }
          }
        });
      } catch {
        // If sanitization fails, continue anyway
        console.warn("DOM sanitization failed");
      }
    });

    const config = getConfig(wcagPreset);
    addLog(
      sessionId,
      "info",
      `Running accessibility scan with preset: ${wcagPreset}...`,
    );

    // Run the scan using AxeBuilder with error handling
    const axeSource = getSafeAxeSource();
    let rawResults;

    try {
      const axeBuilder = new AxeBuilder({ page, axeSource })
        .withTags(config.runOnly.values as string[])
        .options({
          // Configure axe-core to be more resilient
          iframes: false, // Skip iframes to avoid cross-origin issues
          elementRef: false, // Don't include element references
        });

      rawResults = await axeBuilder.analyze();
    } catch {
      // If axe-core fails, try with a minimal selector excluding problematic elements
      addLog(
        sessionId,
        "warning",
        "Initial scan encountered issues, retrying with safer configuration...",
      );

      try {
        const axeBuilder = new AxeBuilder({ page, axeSource })
          .withTags(config.runOnly.values as string[])
          .exclude("iframe, embed, object, applet, svg, canvas")
          .options({
            iframes: false,
            elementRef: false,
            resultTypes: ["violations", "incomplete"],
          });

        rawResults = await axeBuilder.analyze();
      } catch {
        // Final fallback: scan only the main content area
        addLog(
          sessionId,
          "warning",
          "Retry failed, attempting minimal scan of main content only...",
        );

        try {
          const axeBuilder = new AxeBuilder({ page, axeSource })
            .withTags(config.runOnly.values as string[])
            .include("body")
            .exclude(
              "iframe, embed, object, applet, svg, canvas, script, style, noscript",
            )
            .options({
              iframes: false,
              elementRef: false,
              resultTypes: ["violations"],
              selectors: false,
              ancestry: false,
            });

          rawResults = await axeBuilder.analyze();
          addLog(
            sessionId,
            "warning",
            "Scan completed with minimal configuration. Some issues may not be detected.",
          );
        } catch {
          throw new Error(
            `Unable to scan this page due to problematic DOM structure. The page may contain elements that interfere with accessibility testing tools.`,
          );
        }
      }
    }

    addLog(
      sessionId,
      "success",
      `Scan complete! Found ${rawResults.violations.length} violation(s)`,
    );

    const processedResults = processResults(rawResults);
    addLog(sessionId, "success", "Scan completed successfully");

    // Extract DOM structure for accessibility analysis
    addLog(sessionId, "info", "Capturing full rendered HTML DOM structure...");
    const domAnalysis = await extractDOMStructure(page);
    if (domAnalysis) {
      addLog(
        sessionId,
        "success",
        `DOM structure captured: ${domAnalysis.summary.totalHeadings} headings, ${domAnalysis.summary.totalLandmarks} landmarks, ${domAnalysis.domTree ? "interactive tree available" : "tree unavailable"}`,
      );
    }

    // Clean up
    addLog(sessionId, "info", "Cleaning up resources...");
    await page.close();
    await context.close();
    await browser.close();
    addLog(sessionId, "success", "Cleanup complete");

    const response = {
      violations: processedResults.violations,
      passes: processedResults.passes,
      incomplete: processedResults.incomplete,
      summary: processedResults.summary,
      logs: logs.get(sessionId) || [],
      domAnalysis: domAnalysis || undefined,
    };

    // Clean up logs after sending response
    setTimeout(() => {
      logs.delete(sessionId);
    }, 5000);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to scan the target URL.";
    addLog(sessionId, "error", `Error: ${message}`);
    console.error("[Scan] Error:", error);

    // Cleanup on error
    try {
      if (page) await page.close();
      if (context) await context.close();
      if (browser) await browser.close();
      addLog(sessionId, "success", "Cleanup complete");
    } catch (cleanupError) {
      console.error("[Scan] Cleanup error:", cleanupError);
    }

    return NextResponse.json(
      { error: message, logs: logs.get(sessionId) || [] },
      { status: 500 },
    );
  }
}
