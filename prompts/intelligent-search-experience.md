# Implementation Prompt: Intelligent Search Experience

## Goal
Implement the intelligent search feature for Vertex, connecting Sanity content, video transcripts, the Sanity Context MCP / search API route, and a full search results page (`/search?q=...`). Search will return ranked, clickable result cards for both **Video Moments** (timestamped moments linking straight to the exact second in the lesson video) and **Lesson Results** (topic-matched lessons), grounded strictly in real Sanity data.

## Skills Read
- `create-agent-with-sanity-context`: Sanity Context MCP setup, initial context, tool execution, and dataset scoping.
- `dial-your-context`: Instructions field content, pure deltas, content filters (`_type in ["course", "lesson", "category", "instructor"]`), and query patterns.
- `shape-your-agent`: System prompt structure, boundaries, read-only behavior, and response style.
- `AGENTS.md`: Platform rules, search decisions, two-stage timestamp resolution (chapters first, fallback to transcript chunks), video documents as internal lookups, grounded output, and full results page UI requirements.

## Code Inspected
- `sanity/schemaTypes/video.ts`: Schema for video documents holding `videoId`, `url`, `chapters[]` (`startSeconds`, `label`), and `chunks[]` (`startSeconds`, `text`).
- `sanity/schemaTypes/lesson.ts`: Schema for lesson documents with `title`, `slug`, `videoUrl`, `duration`, `notes`, `keyPoints`, `resources`.
- `sanity/schemaTypes/course.ts`: Course document schema with modules and referenced lessons.
- `sanity/lib/queries.ts` & `sanity/lib/fetch.ts`: Data fetching functions and GROQ queries.
- `app/layout.tsx` & `app/page.tsx`: Navigation header and global styling.

## Decisions and Assumptions
1. **Search UI Architecture**: Full results page at `/search?q=<query>` with header search bar, result count summary (e.g., `Found 12 results across 4 courses`), sort selector (`Most relevant`, `Shortest duration`), and structured cards for Video Moments and Lesson Results.
2. **Search API Route**: `POST /api/search` server route that executes token-based wildcard search over Sanity data with two-stage timestamp resolution:
   - Stage 1: Matches lesson topic fields (`title`, `notes` plain text projection, `keyPoints`).
   - Stage 2: Matches video chapters first (clean chapter label matches), falling back to transcript chunks (`chunks[].text`).
   - Internal Video Lookup: Video documents (`video`) are treated as internal lookups and always mapped to the parent lesson (`lesson`) that references the video URL.
3. **Structured Card Actions**:
   - **Video Moment Card**: Displays course icon/name, module & lesson label (e.g. `Lesson 5.1 in Data Fetching & Caching`), timestamp badge (e.g. `02:15`), chapter/transcript snippet, clip duration, and primary action `Watch from 02:15` linking to `/lessons/[slug]?start=135`.
   - **Lesson Card**: Displays course icon/name, module & lesson label, key points checklist, description, duration, and action `View Lesson` linking to `/lessons/[slug]`.
4. **Sanity Context Config**: Create and configure `sanity.agentContext` document in Sanity with content scope filter `_type in ["course", "lesson", "category", "instructor"]` and query guidance deltas.
5. **No Hallucinations**: Grounded strictly in actual Sanity records. If no results match, present a clean empty state pointing users to browse the full course catalog.

## Files Expected to Touch / Create
- `app/api/search/route.ts` (New - Search API endpoint executing GROQ & timestamp matching)
- `app/search/page.tsx` (New - Full Search Results Page)
- `app/components/HeaderSearchInput.tsx` (New - Client search input component for top navigation header)
- `app/components/SearchResultCard.tsx` (New - Cards for video moments and lesson topics)
- `sanity/lib/queries.ts` (Update with search GROQ queries)
- `sanity/lib/fetch.ts` (Update with server-side search helpers)

## Requirements
1. **Header Search Integration**: Universal search input in top header allowing users to type plain language queries and press Enter or click search.
2. **Search Results Route (`/search?q=query`)**:
   - Displays query string in input and page title.
   - Summary count: `Found X results across Y courses`.
   - Sort dropdown: `Most relevant` (default), `Shortest duration`, `Alphabetical`.
3. **Video Moment Results**:
   - Shows parent course name, lesson title, module label (`Lesson X.Y in Module Title`).
   - Matched timestamp label (e.g. `02:15`).
   - Excerpt snippet of matched chapter or transcript chunk.
   - Action link to `/lessons/${slug}?start=${startSeconds}` which auto-plays video from that second.
4. **Lesson Topic Results**:
   - Shows parent course name, lesson title, module label.
   - Lesson key points and overview summary.
   - Action link to `/lessons/${slug}`.
5. **Empty State**: Friendly empty state when no results match, with a button to `Explore All Courses`.
6. **Analytics & Performance**: Track `search_performed` event in PostHog with query term and result counts.

## Security Considerations
- All Sanity data fetching stays server-side inside `POST /api/search` and server components.
- Sanity API tokens and LLM secret keys remain strictly on the server.
- Grounded query execution prevents prompt injection or unauthorized content leakage.

## Acceptance Criteria
- Typing a search query in the header search input navigates to `/search?q=query`.
- `/search?q=data+fetching` returns ranked Video Moment and Lesson Topic cards.
- Clicking "Watch from XX:YY" on a video result card opens `/lessons/[slug]?start=seconds` and plays from that timestamp.
- Clicking "View Lesson" on a lesson card opens the lesson page.
- Empty search query gracefully redirects or displays all courses.
- TypeScript check (`npx tsc --noEmit`) and production build (`npm run build`) pass cleanly with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run build`

## Manual Test Steps
1. Navigate to `http://localhost:3000`.
2. Enter "data fetching" into the top header search bar and press Enter.
3. Verify navigation to `/search?q=data+fetching`.
4. Verify summary count displays results count and courses count.
5. Verify Video Moment cards show timestamp badges (e.g. `02:15`) and action button `Watch from ...`.
6. Click a Video Moment card and verify the video plays starting from the specified timestamp on `/lessons/[slug]?start=seconds`.
7. Verify Lesson Topic cards show key points and link to `/lessons/[slug]`.
