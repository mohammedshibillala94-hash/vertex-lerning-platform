# Implementation Prompt: Intelligent Search with Sanity Context MCP & AI SDK

## Goal
Implement the end-to-end intelligent search experience for Vertex:
1. Deploy the Sanity Studio application and configure the Sanity Context document (`sanity.agentContext`) with content scope filter and query guidance to satisfy the Sanity Context MCP prerequisite.
2. Connect the Sanity Context MCP HTTP endpoint (`https://api.sanity.io/v2026-03-03/context/mcp/:projectId/:dataset/:slug`) into the server-side search API route (`app/api/search/route.ts`) using the Vercel AI SDK (`ai`, `@ai-sdk/openai`, `zod`), with cached initial-context injection, structured output, and a resilient server-side GROQ fallback.
3. Wire the full search results page (`app/search/page.tsx`), header search input, and result cards for both **Video Moments** (timestamped moments linking straight to `/lessons/[slug]?start=seconds`) and **Lesson Results** (topic-matched lessons), grounded strictly in real Sanity data.
4. Track product analytics with PostHog for `search_performed` and `search_result_clicked`.

---

## Skills Read
- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`): MCP HTTP transport connection, `/initial-context` caching, tool execution, and dataset scoping.
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`): Instructions field deltas, content filters (`_type in ["course", "lesson", "category", "instructor"]`), and query patterns.
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`): System prompt structure, boundaries, read-only behavior, and response formatting rules.
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`): Schema definitions, GROQ projections (`pt::text(notes)`), and studio configuration.
- `AGENTS.md`: Sections 5, 6, 7, 8, 9, 10, 11, 12, 13 rules regarding search architecture, grounded output, two-stage timestamp resolution (chapters first, then transcript chunks), video documents as internal lookups, and private dataset token boundaries.

---

## Code Inspected
- `app/api/search/route.ts`: Current search endpoint with GROQ query logic.
- `app/search/page.tsx`: Current search results page UI layout, header search bar, breadcrumbs, result count, sort selector, and result cards.
- `app/components/SearchResultCard.tsx`: Video moment and lesson topic card components with PostHog event capture.
- `app/components/HeaderSearchInput.tsx`: Top navigation search input.
- `sanity/lib/queries.ts` & `sanity/lib/client.ts`: GROQ queries and server/client Sanity instances.
- `studio/sanity.cli.ts` & `studio/sanity.config.ts`: Sanity Studio workspace configuration.
- `studio/schemaTypes/video.ts` & `lesson.ts` & `course.ts`: Existing content schemas.
- `.env.local`: Environment variables containing `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `OPENAI_API_KEY`, and PostHog tokens.

---

## Decisions and Assumptions
1. **Sanity Studio Deployment & Context MCP**:
   - Sanity Context MCP requires a deployed Studio application (`STUDIO_NOT_DEPLOYED` error if not deployed). We will configure `studioHost: "vertex-learning-studio"` (or unique project hostname) in `studio/sanity.cli.ts` and run `npx sanity deploy` to register the Studio on Sanity hosting.
   - We will define the `sanity.agentContext` schema in both `studio/schemaTypes/` and `sanity/schemaTypes/` and seed a document with slug `search-agent`, content filter `_type in ["course", "lesson", "category", "instructor"]`, and query instructions.
2. **AI SDK & OpenAI Integration**:
   - Install `ai`, `@ai-sdk/openai`, and `zod` in the web application workspace.
   - In `app/api/search/route.ts`, implement an LLM-assisted search engine:
     - Fetches and caches `/initial-context` from Sanity Context MCP HTTP endpoint: `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}/search-agent/initial-context` with `Bearer ${token}`.
     - Connects to OpenAI (`gpt-4o-mini`) using the AI SDK with tools from the MCP endpoint (or direct schema-aware GROQ execution).
     - Enforces structured JSON output matching `SearchResultItem[]` validated with Zod.
3. **Resilient Grounded Fallback**:
   - If the MCP endpoint or OpenAI API encounters network limits, billing constraints, or cold starts, the route automatically executes the deterministic two-stage GROQ search engine:
     - Stage 1 (Lesson Topics): searches `title`, `keyPoints`, `pt::text(notes)`, and `proTip`.
     - Stage 2 (Video Moments): matches video `chapters` (table of contents) first, falling back to `chunks` (transcript chunks). Video documents are strictly treated as internal lookups mapped to the parent lesson.
   - This ensures 100% search uptime, ultra-fast response times, and zero hallucinations.
4. **Timestamped Embed Playback**:
   - Video Moment results include `startSeconds`. The CTA button `Watch from MM:SS` links to `/lessons/[slug]?start=[startSeconds]`.
   - The lesson page (`app/lessons/[slug]/page.tsx`) already accepts `start` search param and initializes video embed playback from that exact second.
5. **Analytics**:
   - Instrument `search_performed` event in PostHog with `query`, `result_count`, `course_count`, and `sort_by`.
   - Instrument `search_result_clicked` event in `SearchResultCard` with `type`, `lesson_slug`, `course_slug`, and `matched_second`.

---

## Files Expected to Touch / Create
- `package.json` (add `ai`, `@ai-sdk/openai`, `zod`)
- `studio/sanity.cli.ts` (configure `studioHost` for deployment)
- `studio/schemaTypes/agentContext.ts` (create schema for `sanity.agentContext`)
- `studio/schemaTypes/index.ts` (register `agentContext`)
- `sanity/schemaTypes/agentContext.ts` (sync schema in web workspace)
- `scripts/seed-agent-context.ts` (create/import `sanity.agentContext` document)
- `app/api/search/route.ts` (integrate Sanity Context MCP, OpenAI AI SDK, initial-context cache, and resilient fallback)
- `app/search/page.tsx` (ensure seamless integration, error handling, and search analytics)
- `app/components/SearchResultCard.tsx` (ensure design fidelity and event capture)
- `prompts/intelligent-search.md` (this implementation prompt)

---

## Requirements
1. **Prerequisite Fulfillment**:
   - Deploy Studio workspace so Sanity Context MCP HTTP endpoint is active.
   - Create and seed `sanity.agentContext` document with slug `search-agent` containing content filter and instructions.
2. **Server-Side Search API (`/api/search`)**:
   - Accepts `POST` with `{ query: string, sort?: "relevance" | "duration" | "title" }` and `GET ?q=...&sort=...`.
   - Fetches and caches initial context from MCP endpoint.
   - Generates ranked, grounded search results via AI SDK / MCP or deterministic two-stage GROQ engine.
   - Resolves timestamps: chapters first (clean labels), fallback to transcript chunks.
   - Returns structured JSON: `{ query, totalResults, courseCount, results: SearchResultItem[] }`.
3. **Full Results Page UI (`/search?q=...`)**:
   - Header with query title and summary count (`Found X results across Y courses`).
   - Sort dropdown (`Most relevant`, `Shortest duration`, `Alphabetical`).
   - Video Moment Cards: course icon/title, module/lesson label, timestamp pill (`MM:SS`), matched chapter/transcript excerpt, clip length, and action `Watch from MM:SS`.
   - Lesson Topic Cards: course icon/title, module/lesson label, key points checklist, description, and action `View Lesson`.
   - Empty state when no matches found with `Explore All Courses` CTA.
4. **Security & Data Integrity**:
   - Zero client-side tokens.
   - No hallucinated courses, lessons, or timestamps.
   - Video documents remain internal lookups and are never shown standalone.

---

## Security Considerations
- All Sanity tokens (`SANITY_API_READ_TOKEN`, write tokens) and `OPENAI_API_KEY` remain strictly server-side.
- The browser only receives sanitized, structured search result card data.
- User input is sanitized and tokenized to prevent injection attacks or malformed GROQ syntax.

---

## Acceptance Criteria
- [ ] `ai`, `@ai-sdk/openai`, and `zod` are installed and configured.
- [ ] `sanity.agentContext` schema and document are created in Sanity.
- [ ] Studio application deploy is executed or verified.
- [ ] `POST /api/search` responds with valid JSON containing ranked `video_moment` and `lesson` items.
- [ ] Querying `/search?q=data+fetching` returns ranked result cards.
- [ ] Video moment card action button opens `/lessons/[slug]?start=[seconds]` and begins video from that timestamp.
- [ ] Lesson topic card action opens `/lessons/[slug]`.
- [ ] Sort selector re-orders results by relevance, duration, or title.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds without build errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Endpoint check: `curl http://localhost:3000/api/search?q=data+fetching`

---

## Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open browser at `http://localhost:3000`.
3. Enter query `data fetching` in top header search input and press Enter.
4. Verify navigation to `/search?q=data+fetching`.
5. Check summary count banner: `Found X results across Y courses`.
6. Verify Video Moment cards show timestamp pills (e.g., `02:15`) and action button `Watch from 02:15`.
7. Click `Watch from 02:15` on a Video Moment card; verify lesson page loads with `?start=135` and video player plays from that exact moment.
8. Verify Lesson Topic cards show bulleted key points and open lesson page on click.
9. Test sort selector by switching to "Shortest duration" and verify result reordering.
10. Search for a nonexistent term (e.g. `xyznonexistentterm`); verify clean empty state appears with "Explore All Courses" button.
