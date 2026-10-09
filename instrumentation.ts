import {
  SeverityNumber,
  type LogRecord,
} from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export let loggerProvider: LoggerProvider | undefined;

if (!projectToken) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
    );
  }
} else if (!posthogHost) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured"
    );
  }
} else {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ "service.name": "vertex" }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost.replace(/\/$/, "")}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  });
}

const posthogLogger = loggerProvider?.getLogger("vertex.posthog");

export function emitPostHogLog({
  body,
  severityNumber = SeverityNumber.INFO,
  attributes,
}: Pick<LogRecord, "body" | "attributes"> & {
  severityNumber?: SeverityNumber;
}) {
  posthogLogger?.emit({ body, severityNumber, attributes });
}

export async function flushPostHogLogs() {
  try {
    await loggerProvider?.forceFlush();
  } catch {
    // Logging must never affect page rendering.
  }
}

// The dedicated provider is intentionally not registered globally: only logs
// emitted through emitPostHogLog() leave this application.
export function register() {}
