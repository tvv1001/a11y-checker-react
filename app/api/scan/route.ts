import { NextRequest, NextResponse } from "next/server";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import axeCore from "axe-core";
import { processResults, getConfig } from "@/lib/axe-config";

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
      waitUntil: "networkidle",
      timeout: 45000,
    });
    addLog(sessionId, "success", "Page loaded successfully");

    const config = getConfig(wcagPreset);
    addLog(
      sessionId,
      "info",
      `Running accessibility scan with preset: ${wcagPreset}...`,
    );

    // Run the scan using AxeBuilder
    const axeSource = getSafeAxeSource();
    const axeBuilder = new AxeBuilder({ page, axeSource }).withTags(
      config.runOnly.values as string[],
    );

    const rawResults = await axeBuilder.analyze();

    addLog(
      sessionId,
      "success",
      `Scan complete! Found ${rawResults.violations.length} violation(s)`,
    );

    const processedResults = processResults(rawResults);
    addLog(sessionId, "success", "Scan completed successfully");

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
