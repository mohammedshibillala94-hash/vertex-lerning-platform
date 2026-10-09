# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for Vertex: Session Replay, Error Tracking, and Support are enabled; health, error, and support signal sources are enabled; and a focused scout troop plus Replay Vision monitors are active. Findings will begin appearing in the [Self-driving inbox](https://us.posthog.com/project/652884/inbox) within about 30 minutes as scouts run and recordings arrive.

## AI data processing

Approved.

## GitHub

The PostHog GitHub App was already connected before this setup. GitHub Issues was not selected as a connected-tool responder in this run.

## Products enabled

| Product | Status | Notes |
| --- | --- | --- |
| Session Replay | enabled | Web `posthog-js` initialization is clean: it does not disable session recording. No recordings exist yet. |
| Error Tracking | enabled | Web `posthog-js` initialization has `capture_exceptions: true`. |
| Support (Conversations) | enabled | Tickets will begin arriving only after an inbound email, inbox, or Slack channel is connected in PostHog. |

## Signal sources

| Source product | Source type | Action |
| --- | --- | --- |
| `signals_scout` | `cross_source_issue` | On by default; no opt-out row was created. |
| `health_checks` | `health_issue` | Enabled (`01a11b2d-2e37-7057-9b8b-5a1c738dd90d`). |
| `error_tracking` | `issue_created` | Enabled (`01a11b2d-2dad-7eb6-bb4c-f30d55e17653`). |
| `error_tracking` | `issue_reopened` | Enabled (`01a11b2d-2e87-7ba5-8c45-272236319533`). |
| `error_tracking` | `issue_spiking` | Enabled (`01a11b2d-2e58-789d-99a5-ab0ee9efa55d`). |
| `conversations` | `ticket` | Enabled (`01a11b2d-2e89-7fab-b3ef-6e6ac6abddb9`); remains idle until an inbound Support channel is connected. |
| `session_replay` | `session_analysis_cluster` | Deliberately skipped; Replay Vision scanners provide replay coverage. |
| `replay_vision` | scanner configuration | Deliberately not created as a source row; each scanner is self-authorizing through `emits_signals: true`. |

## Connected tools

No connected tools were selected in the setup prompt. No warehouse sources were detected or created. GitHub Issues, Linear, Jira, Sentry, and Zendesk remain not used as Self-driving responders.

## Scout troop

**Enabled (6):**

- `signals-scout-general` — cross-product correlations and surfaces without a specialist.
- `signals-scout-product-analytics` — product-flow, funnel, retention, lifecycle, and path regressions.
- `signals-scout-web-analytics` — traffic, attribution, landing-page, bounce, and 404 regressions.
- `signals-scout-logs` — application log patterns, error shifts, volume bursts, and service silence.
- `signals-scout-learning-engagement` — custom monitor for learning starts and returns.
- `signals-scout-course-discovery` — custom monitor for course browsing progressing to lesson selection.

**Disabled (24):**

| Scout | Reason |
| --- | --- |
| AI observability | No LLM telemetry was found. |
| Anomaly detection | No established dashboards or insights were found to watch. |
| APM | No tracing surface was found. |
| Conversations | Support was enabled, but no inbound channel or ticket activity exists yet. |
| CSP violations | No CSP reporting configuration was found. |
| Customer analytics | No account/group analytics surface was found. |
| Data pipelines | No CDP destinations, batch exports, or Hog flows were found. |
| Data warehouse | No warehouse sources are connected. |
| Error tracking | Covered by the native Error Tracking responders above. |
| Experiments | No active experiment surface was found. |
| Feature flags | No active feature-flag surface was found. |
| Inbox validation | Fresh setup; there are no shipped Self-driving fixes to validate yet. |
| Insight alerts | No configured insight-alert surface was found. |
| MCP tool calls | No product MCP telemetry surface was found. |
| Observability gaps | Kept off to avoid duplicating the focused product scouts at this early stage. |
| PR follow-up | No Self-driving implementation PRs exist yet. |
| Replay Vision | No prior Replay Vision observations exist; the two scanners below provide direct replay coverage. |
| Revenue analytics | No payment or revenue integration was found. |
| Session replay | Covered by the Replay Vision scanners below. |
| Skills store | No project skill-maintenance surface is in scope. |
| Surveys | No surveys are configured. |
| Tasks | No PostHog Tasks surface is in scope. |
| Web vitals | No web-vitals surface was confirmed. |
| Workflows | No workflow surface was found. |

**Run budget:** 100 runs/day enforced; 0 used today and 100 remaining. Announcement: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Scout | Watches | Discriminator | Why it adds coverage |
| --- | --- | --- | --- |
| `signals-scout-learning-engagement` | `course_learning_started` and `learning_continued` from `app/components/FloatingProgressBanner.tsx` | Continuation-to-start ratio and distinct learner reach against completed-window baselines | The generic Product Analytics scout watches saved flows; this scout explicitly detects learning-start and return regressions. |
| `signals-scout-course-discovery` | `course_module_toggled`, `course_content_expanded`, and `course_lesson_selected` from `app/components/CourseContentAccordion.tsx` | Lesson-selection rate relative to browsing activity, with browsing holding steady | This isolates course-content discoverability and navigation friction, rather than generic traffic changes. |

Both proposed custom scouts were approved and created. Error bursts and replay friction were ruled out as custom-scout candidates because native Error Tracking responders and Replay Vision scanners own those routes. Revenue, AI, surveys, CSP, experiments, feature flags, and warehouse surfaces were ruled out because the repository and project state did not show them in use.

If either custom scout is noisy, set its `emit` configuration to `false` in PostHog to switch it to dry-run without disabling its scheduled analysis.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes strong findings to the inbox. These are the only items in this setup that spend Replay Vision quota. Each finding arrives at half weight and requires independent corroboration before it promotes to a Self-driving report.

| Scanner | Status | Watches | Query scope | Sampling | Estimate |
| --- | --- | --- | --- | --- | --- |
| [Course learning breakage](https://us.posthog.com/project/652884/replay-vision/01a11b32-4a3d-702b-8dc5-743e9708dbec) | created | Visible breakage while learners view course details and try to start learning: blank or failed content, non-responsive course controls, and failed navigation. | URLs containing `/courses/`, the product’s course-detail and immediate learning-start flow. | 0.5 | 0 observations/month; 0 credits/month at present. |
| [Learner navigation frustration](https://us.posthog.com/project/652884/replay-vision/01a11b32-486b-79a3-bf8f-5ee7a107644c) | created | Clear struggle while opening courses, expanding content, choosing lessons, or starting/continuing learning. | `$rageclick` sessions only; intentionally no URL filter to keep it distinct from the breakage monitor. | 1.0 | 0 observations/month; 0 credits/month at present. |

The organization has 2,500 Replay Vision credits remaining and is not exhausted. There are no session recordings yet, so both monitors are armed and will begin working when recordings arrive. Rate early observations thumbs up or down in each scanner to improve the monitors over time.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so Support tickets can reach the enabled Conversations responder.
- [ ] Generate browser traffic with the configured PostHog client so Session Replay recordings and the Replay Vision monitors have recordings to analyze.
- [ ] If needed later, add a selected connected-tool warehouse source from [Data warehouse sources](https://us.posthog.com/project/652884/pipeline/new/source); the responder can then be enabled for that tool.

## Files modified or created

- Created `posthog-self-driving-report.md`.
- No application source files were modified.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scout runs draw from the daily run budget, and replay monitors start with future recordings. Findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/652884/inbox); immediately actionable reports can start coding tasks.
