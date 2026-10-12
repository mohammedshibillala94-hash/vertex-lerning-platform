# Implementation Prompt: Comprehensive PostHog Event Tracking

## Goal
Implement comprehensive PostHog product analytics tracking across all recently built Vertex features according to PostHog's Next.js best practices:
1. `search_performed`: search queries with result counts, course count, sort order, and source (captured on both client and server side).
2. `search_result_opened`: clicks on search result cards with result type (`video_moment` vs `lesson`), lesson slug, course slug, module label, matched second, and rank position.
3. `video_played`: when a video begins playback, recording lesson slug, video provider, start timestamp, and resume state.
4. `video_watch_depth`: watch progress milestones at 25%, 50%, 75%, 90%, and 100% of duration.
5. `resume_used`: when a learner resumes from a specific timestamp (via search result moment, query param, or saved progress).
6. `lesson_completed`: when a lesson is completed (via video reaching completion, Next Lesson navigation, or completion toggle).
7. Additional key engagement events: `course_viewed`, `catalog_viewed`, `lesson_viewed`, `lesson_resource_clicked`, and `lesson_tab_switched`.
8. Privacy compliance: Ensure **zero personally identifiable information (PII)** is tracked—identifying learners strictly by their Clerk `user.id` with no emails or names.

---

## Skills & Documentation Read
- `AGENTS.md`: Section 7 (Instrument engagement moments: catalog and lesson views, searches, video playback depth, lesson completions; public PostHog project key in browser, private keys on server), Section 12 (PostHog project key public, private keys server-only), Section 13 (Verification checks).
- `posthog-self-driving-report.md`: Existing PostHog configuration and custom monitor scouts (`signals-scout-learning-engagement`, `signals-scout-course-discovery`).

---

## Code Inspected
- `instrumentation-client.ts` & `instrumentation.ts`: Client and server instrumentation setup.
- `app/components/FloatingProgressBanner.tsx`: Existing Clerk `useUser` identification and progress CTA tracking.
- `app/components/LessonVideoPlayer.tsx`: Lesson video embed player.
- `app/components/SearchResultCard.tsx`: Search results cards for video moments and lesson topics.
- `app/components/SearchHeroInput.tsx` & `app/components/HeaderSearchInput.tsx`: Search inputs.
- `app/components/LessonContentTabs.tsx`: Lesson overview, key points, pro tip, and resources tabs.
- `app/components/LessonSidebar.tsx`: Lesson navigation accordion.
- `app/lessons/[slug]/page.tsx`: Lesson detail page.
- `app/courses/[slug]/page.tsx`: Course detail page.
- `app/courses/page.tsx`: Course catalog page.
- `app/api/search/route.ts`: Server-side search API route.

---

## Decisions and Assumptions
1. **Event Naming & Schema (Snake Case)**:
   - `search_performed`: `{ query, result_count, course_count, sort_by, source }`
   - `search_result_opened`: `{ result_type, result_title, lesson_slug, course_title, course_slug, module_label, matched_second, timestamp_label, rank_position }`
   - `video_played`: `{ lesson_slug, lesson_title, course_slug, video_provider, start_seconds, is_resumed, duration_seconds }`
   - `video_watch_depth`: `{ lesson_slug, lesson_title, current_seconds, duration_seconds, depth_percentage }` (fired once per milestone: 25, 50, 75, 90, 100)
   - `resume_used`: `{ lesson_slug, course_slug, resume_second, timestamp_label, source }`
   - `lesson_completed`: `{ lesson_slug, lesson_title, course_slug, module_title, duration_seconds, watch_time_seconds, completion_trigger }`
   - `course_viewed`: `{ course_slug, course_title, level, module_count, total_lessons }`
   - `catalog_viewed`: `{ course_count }`
   - `lesson_viewed`: `{ lesson_slug, lesson_title, course_slug, module_title, has_start_param, duration_seconds }`
   - `lesson_resource_clicked`: `{ lesson_slug, resource_title, resource_url, resource_type }`
   - `lesson_tab_switched`: `{ lesson_slug, tab_name }`
2. **Video Playback & Milestone Detection**:
   - In `LessonVideoPlayer`, integrate YouTube IFrame API / message event listener for `enablejsapi=1` embeds:
     - Detects when player transitions to `PLAYING` (fires `video_played`).
     - Polls playback time and triggers `video_watch_depth` at 25%, 50%, 75%, 90%, and 100% milestones (each milestone recorded once per lesson view).
     - Detects `ENDED` state to trigger `lesson_completed` with `completion_trigger: "video_ended"`.
   - If `startSeconds > 0` is present on mount, triggers `resume_used`.
3. **Privacy Compliance (No PII)**:
   - In `PostHogUserIdentification` (`FloatingProgressBanner.tsx`), remove `email` and `name` properties:
     `posthog.identify(user.id)` strictly without PII.
4. **Server-Side Tracking Helper (`lib/posthog-server.ts`)**:
   - Provide `captureServerEvent(eventName, properties, distinctId)` using Next.js `fetch` targeting `${NEXT_PUBLIC_POSTHOG_HOST}/capture/`.
   - Call in `app/api/search/route.ts` to log server-side query processing metrics.
   - Non-blocking: catch and log errors without disrupting HTTP responses.

---

## Files to Touch / Create
- `lib/posthog-server.ts` (Create: Server-side PostHog capture utility)
- `app/components/FloatingProgressBanner.tsx` (Update: Remove PII, identify by `user.id` only)
- `app/components/LessonVideoPlayer.tsx` (Update: Track `video_played`, `video_watch_depth`, `resume_used`, `lesson_completed`)
- `app/components/SearchResultCard.tsx` (Update: Rename/enhance event to `search_result_opened` with rank position and metadata)
- `app/search/page.tsx` (Update: Pass card index for rank position tracking)
- `app/components/SearchHeroInput.tsx` & `app/components/HeaderSearchInput.tsx` (Update: Track `search_performed` with source)
- `app/components/LessonContentTabs.tsx` (Update: Track `lesson_resource_clicked` and `lesson_tab_switched`)
- `app/components/LessonSidebar.tsx` (Update: Add completion indicator / lesson selection metrics)
- `app/lessons/[slug]/page.tsx` (Update: Client tracking component for `lesson_viewed` and navigation completion triggers)
- `app/courses/[slug]/page.tsx` (Update: Client tracking component for `course_viewed`)
- `app/courses/page.tsx` (Update: Client tracking component for `catalog_viewed`)
- `app/api/search/route.ts` (Update: Call `captureServerEvent` on search requests)
- `prompts/posthog-event-tracking.md` (This implementation prompt)

---

## Requirements
1. **Search Tracking**:
   - Capture `search_performed` on search submission with query, source, result count, and sort order.
   - Capture server-side `search_performed` in `/api/search`.
   - Capture `search_result_opened` on card click with result type, position, timestamp, and slugs.
2. **Video & Progress Tracking**:
   - Capture `video_played` upon playback start.
   - Capture `video_watch_depth` at 25%, 50%, 75%, 90%, 100% milestones.
   - Capture `resume_used` when seeking or starting from a non-zero timestamp.
   - Capture `lesson_completed` when video finishes or when moving to the next lesson.
3. **Navigation & Exploration**:
   - Capture `course_viewed`, `catalog_viewed`, and `lesson_viewed`.
   - Capture `lesson_resource_clicked` and `lesson_tab_switched`.
4. **Privacy**:
   - Strictly zero PII passed to PostHog: only Clerk `user.id` as distinct identifier.
5. **Stability & Performance**:
   - Zero-overhead, non-blocking telemetry.
   - Pass `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

---

## Security & Privacy Considerations
- No learner emails, names, or IP-linked personal identifiers sent to PostHog.
- Server-side capture uses server-side environment variables and never exposes keys.
- Analytics failures never crash UI or API endpoints.

---

## Acceptance Criteria
- [ ] PostHog identifies users only with Clerk `user.id` (zero email/name attributes).
- [ ] Submitting a search triggers `search_performed` with query and properties.
- [ ] Server route `/api/search` executes `captureServerEvent`.
- [ ] Clicking a search result card triggers `search_result_opened` with `result_type`, `rank_position`, etc.
- [ ] Playing a lesson video triggers `video_played`.
- [ ] Watching past 25%, 50%, 75%, 90% triggers `video_watch_depth`.
- [ ] Starting from a timestamp triggers `resume_used`.
- [ ] Finishing video triggers `lesson_completed`.
- [ ] `course_viewed`, `catalog_viewed`, and `lesson_viewed` trigger on page views.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds without build errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000`.
2. Inspect browser network tab or PostHog capture events.
3. Search for "data fetching": verify `search_performed` event fires with `query: "data fetching"`.
4. Click on a Video Moment result card: verify `search_result_opened` fires with `result_type: "video_moment"`, `matched_second`, and `rank_position: 1`.
5. On the lesson page: verify `lesson_viewed` and `resume_used` fire.
6. Play the video: verify `video_played` fires.
7. Let video advance: verify `video_watch_depth` fires for 25% milestone.
8. Switch tabs to "Resources" and click a resource link: verify `lesson_tab_switched` and `lesson_resource_clicked` fire.
9. Verify in PostHog payload that no email or full name is transmitted.
