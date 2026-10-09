import posthog from "posthog-js";

const projectToken =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  process.env.NEXT_PUBLIC_POSTHOG_KEY;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const assetsHost =
  process.env.NEXT_PUBLIC_POSTHOG_ASSETS_HOST || "https://us-assets.i.posthog.com";

if (typeof window !== "undefined") {
  if (!projectToken) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured."
      );
    }
  } else {
    posthog.init(projectToken, {
      api_host: apiHost,
      asset_host: assetsHost,
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_exceptions: true,
      defaults: "2026-01-30",
      debug: false,
    });

  }
}

