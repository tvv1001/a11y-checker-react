import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Map to store log streams for each session
const logStreams = new Map<
  string,
  { controller: ReadableStreamDefaultController; logs: string[] }
>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session") || "default";

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Store the controller for this session
      logStreams.set(sessionId, { controller, logs: [] });

      // Send initial connection message
      const data = JSON.stringify({
        type: "info",
        message: "Connected to log stream",
        timestamp: Date.now(),
      });
      controller.enqueue(`data: ${data}\n\n`);

      // Keep connection alive with periodic heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`: heartbeat\n\n`);
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        logStreams.delete(sessionId);
        try {
          controller.close();
        } catch {
          // Controller already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

// Helper function to send logs to a specific session
export function sendLogToStream(
  sessionId: string,
  type: "info" | "success" | "error" | "warning",
  message: string,
) {
  const streamData = logStreams.get(sessionId);
  if (streamData?.controller) {
    const data = JSON.stringify({
      type,
      message,
      timestamp: Date.now(),
    });
    try {
      streamData.controller.enqueue(`data: ${data}\n\n`);
      streamData.logs.push(data);
    } catch (error) {
      // Stream closed or error
      console.error("Error sending log to stream:", error);
    }
  }
}
