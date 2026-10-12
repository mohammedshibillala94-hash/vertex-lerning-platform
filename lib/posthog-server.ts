interface CaptureServerEventParams {
  event: string;
  properties?: Record<string, unknown>;
  distinctId?: string;
}

export async function captureServerEvent({
  event,
  properties = {},
  distinctId = "server",
}: CaptureServerEventParams): Promise<void> {
  const apiKey =
    process.env.POSTHOG_API_KEY ||
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.POSTHOG_HOST ||
    process.env.NEXT_PUBLIC_POSTHOG_HOST ||
    "https://us.i.posthog.com";

  if (!apiKey) {
    return;
  }

  try {
    const endpoint = `${host.replace(/\/$/, "")}/capture/`;
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        event,
        properties: {
          distinct_id: distinctId,
          ...properties,
          $lib: "vertex-server",
        },
      }),
    });
  } catch (error) {
    // Analytics failures must never disrupt server routes or page rendering
    console.error(`[PostHog Server] Failed to capture event '${event}':`, error);
  }
}
