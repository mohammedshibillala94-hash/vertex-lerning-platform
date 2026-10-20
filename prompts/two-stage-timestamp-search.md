# Implementation Prompt: Two-Stage Timestamp Resolution Search & On-Site Playback

## Goal
Upgrade the search engine with two-stage timestamp resolution (chapters first, transcript fallback) and on-site timestamped playback:
1. Two-Stage Resolution: In search queries, match video chapters (table of contents) first. Fall back to matching transcript chunks only if no chapter matches for that video.
2. Result Cards Deep Linking: Search result cards link directly to `/lessons/[slug]?start=[startSeconds]` at the exact matched second.
3. On-Site Timestamped Playback & Seeking: The embedded player on the lesson page initializes at the start second using the provider embed parameter and programmatically commands `seekTo` on load and prop change.
4. Interactive On-Site Chapter Seeking: Display the video's chapters / table of contents on the lesson page allowing learners to seek between chapters on-site without page reloads.

---

## Skills Read
- `sanity-best-practices` (`~/.claude/skills/sanity-best-practices/SKILL.md`): Schema, GROQ queries, projections.
- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`): Grounded Sanity content access.
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`): Query guidance and content scope.
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`): Groundedness, tone, and guardrails.
- `AGENTS.md`: Sections 7, 8, 9, 11, 12, 13 (Two-stage timestamp resolution, video documents as internal lookups, provider embed on-site playback, private dataset tokens, and checks).

---

## Code Inspected
- `sanity/lib/search.ts`: Current search scoring and video moment matching.
- `sanity/lib/queries.ts`: `SEARCH_VIDEOS_QUERY`, `GET_ALL_CONTENT_FOR_SEARCH_QUERY`, `GET_LESSON_BY_SLUG_QUERY`.
- `app/components/LessonVideoPlayer.tsx`: Video player embed and postMessage listener.
- `app/components/SearchResultCard.tsx`: Deep link generation (`/lessons/${lessonSlug}?start=${startSecond}`).
- `app/lessons/[slug]/page.tsx`: Lesson page layout, parameter handling for `start` / `t`.
- `app/utils.ts`: `getVideoEmbedUrl` handling of start parameters across YouTube, Vimeo, and Bunny.

---

## Decisions and Assumptions
1. **Two-Stage Timestamp Resolution**:
   - Tokenize query into normalized keywords.
   - Search across Sanity content (lessons and video documents).
   - **Stage 1 (Chapters First)**: For each video document mapped to a lesson, check the `chapters` array (table of contents). Chapter titles are clean, authoritative, and structured. If a chapter matches the query tokens above threshold:
     - Resolve the timestamp to that chapter's `startSeconds`.
     - Use the chapter title in the result card description: `Matched chapter: "..."`.
     - Give chapter matches a strong specificity score boost.
     - **Bypass transcript chunk evaluation** for that video to prevent noisy transcript matches from diluting the clean chapter match.
   - **Stage 2 (Transcript Fallback)**: If and only if no chapter matches for that video, search the timestamped `chunks` array (transcript pieces):
     - Match query tokens against chunk text.
     - Select the highest-relevance chunk, take its `startSeconds`, and format an excerpt quote for the description.
     - Transcript matches receive lower baseline score than chapter matches.
   - **Grounded Mapping**: Video documents are never shown as standalone results. They are strictly resolved to the parent lesson document that references the video.
2. **On-Site Timestamped Playback & Seeking**:
   - Deep links: Result cards carry `href="/lessons/${lessonSlug}?start=${startSecond}"` and CTA `Watch from MM:SS`.
   - Embed URL generation: `getVideoEmbedUrl` appends the provider's native start parameter (`&start=N` for YouTube, `#t=Ns` for Vimeo, `&t=N` for Bunny).
   - Active programmatic seek:
     - In `LessonVideoPlayer`, when iframe loads or when `startSeconds` changes, dispatch `seekTo(startSeconds, true)` via `postMessage` to the YouTube iframe to guarantee exact timestamp positioning.
   - Interactive Table of Contents:
     - In `GET_LESSON_BY_SLUG_QUERY`, resolve the referenced video's `chapters` array.
     - Render an interactive `LessonChaptersList` component on the lesson page below the player with time markers.
     - Clicking any chapter marker immediately seeks the video player on-site via `seekTo` without reloading the page.
   - Playback stays 100% on-site; never redirect learners to external providers.

---

## Files Expected to Touch / Create
- `sanity/lib/queries.ts` (Update `GET_LESSON_BY_SLUG_QUERY` with video chapters projection; update `SEARCH_VIDEOS_QUERY` with token-friendly GROQ match)
- `sanity/lib/search.ts` (Upgrade two-stage timestamp resolution, tokenized scoring, and chapter-first precedence)
- `app/components/LessonVideoPlayer.tsx` (Implement programmatic `seekTo` postMessage on load, prop change, and expose seek handler)
- `app/components/LessonChaptersList.tsx` (Create interactive on-site chapter list / table of contents for timestamped seeking)
- `app/lessons/[slug]/page.tsx` (Pass video chapters to player and render `LessonChaptersList`)
- `prompts/two-stage-timestamp-search.md` (This implementation prompt)

---

## Requirements
1. **Search Upgrades**:
   - Multi-word tokenization and OR matching.
   - Stage 1: Matches chapters (table of contents) first with clean label and high specificity.
   - Stage 2: Falls back to transcript chunks only when no chapters match.
   - Grounded results: Video docs mapped to lessons, never shown standalone.
2. **Deep Linking**:
   - Result cards link to `/lessons/[slug]?start=[second]`.
   - Result card CTA reflects formatted timestamp `Watch from MM:SS`.
3. **On-Site Playback & Seeking**:
   - Embed starts at the matched second via provider parameter.
   - Embed player programmatically seeks to `startSeconds` via `seekTo` postMessage on load and on prop updates.
   - Interactive chapters list on the lesson page allows instant on-site seeking to any chapter moment.
4. **Checks**:
   - TypeScript (`tsc`), lint (`npm run lint`), and build (`npm run build`) pass cleanly.

---

## Security & Privacy Considerations
- Sanity read tokens remain server-side only.
- No PII is tracked or transmitted.
- PostMessage communication uses structured JSON parsing with error guards to avoid XSS or runtime crashes.

---

## Acceptance Criteria
- [ ] Query matching a video's chapter resolves to the chapter timestamp and clean chapter label.
- [ ] Query matching content found only in transcript falls back to the transcript chunk timestamp.
- [ ] Clicking a video moment card opens the lesson page at `/lessons/[slug]?start=[second]`.
- [ ] On the lesson page, the video player embeds on-site and begins / seeks to the specified start second.
- [ ] The lesson page displays interactive chapters allowing learners to click and seek to any chapter moment on-site.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/search?q=routing`.
2. Verify that video moment cards show clean chapter labels (e.g., `Matched chapter: "..."`) with timestamps resolved via chapters.
3. Search for a phrase specific to transcript text (e.g. "caching revalidation").
4. Verify that video moment cards fall back to transcript snippets with the chunk's start timestamp.
5. Click a video moment card ("Watch from MM:SS").
6. Verify URL is `/lessons/[slug]?start=[second]`.
7. Verify embedded player on the lesson page begins at or seeks to that second.
8. On the lesson page, click another chapter from the interactive chapter list and observe the player seek to that second on-site.
