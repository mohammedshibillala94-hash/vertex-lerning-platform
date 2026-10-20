# Implementation Prompt: Tune Search Context Document & Shape System Prompt

## Goal
Configure the Sanity Context document (`sanity.agentContext`) with pure delta query instructions and content scope filter using `dial-your-context`, and craft the search agent system prompt using `shape-your-agent` and `AGENTS.md` rules:
1. Context Document Scope Filter (`groqFilter`): Scope access to learning content types (`course`, `lesson`, `category`, `instructor`, `video`) and exclude drafts.
2. Context Document Instructions (`instructions`): Formulate concise, pure deltas covering internal video lookup isolation, two-stage timestamp resolution (chapters first, transcript fallback), reverse course references, Portable Text plain-text projections, and specificity ranking.
3. System Prompt Shaping: Craft the system prompt defining role, voice, groundedness boundaries, output format, query mechanics, and fallback behavior per `shape-your-agent`.
4. Schema & Data Seeding: Register `agentContext` schema in Studio and Web workspace, and seed the `sanity.agentContext.search-agent` document in the Sanity dataset.
5. Search Integration: Wire the system prompt and context configuration into `lib/search-prompt.ts` and `app/api/search/route.ts`.

---

## Skills Read
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`): Pure deltas, content scope filter, GROQ query patterns, and schema notes.
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`): System prompt boundaries, voice, trigger scenarios, separation principle, and concise formatting.
- `AGENTS.md`: Sections 7, 8, 10, 11, 12, 13 (Two-stage timestamp resolution, video documents as internal lookups, groundedness, system prompt escaping, and checks).

---

## Code Inspected
- `studio/schemaTypes/index.ts` & `sanity/schemaTypes/index.ts`: Current schema registrations.
- `sanity/lib/search.ts` & `sanity/lib/queries.ts`: Search logic and GROQ queries.
- `app/api/search/route.ts`: Server-side search API endpoint.
- `.env.local`: Sanity dataset, project ID, and token configuration.

---

## Decisions and Assumptions
1. **Content Scope Filter (`groqFilter`)**:
   - `_type in ["course", "lesson", "category", "instructor", "video"] && !(_id in path("drafts.**"))`
   - Scopes search strictly to learning content types and active published documents.
2. **Context Instructions (`instructions`)**:
   - Organized into clean categories: `Rules`, `Two-Stage Timestamp Resolution`, `Query Patterns & Specificity`, and `Known Limitations`.
   - Explicitly instructs that `video` documents are internal lookups and must be mapped to their parent `lesson`.
   - Mandates chapters first for clean table-of-contents moments, transcript chunks only as noisy fallback.
   - Instructs that `notes` is Portable Text and requires `pt::text(notes)`.
   - Explains that `course` is derived via reverse reference `*[_type == "course" && references(^._id)][0]`.
3. **System Prompt Shaping (`VERTEX_SEARCH_SYSTEM_PROMPT`)**:
   - Role: Vertex Intelligent Search Assistant.
   - Voice & Format: Structured result cards (`video_moment` and `lesson`), not conversational chat.
   - Strict boundaries: Zero hallucinations (never invent courses, lessons, durations, or timestamps).
   - Dual-layer rule: Put critical query and ranking rules in both inline system prompt and Context document (per `AGENTS.md` Section 11/12).
4. **Studio Schema & Seed**:
   - Create `agentContext.ts` in `studio/schemaTypes/` and `sanity/schemaTypes/`.
   - Seed `sanity.agentContext.search-agent` directly to Content Lake using Sanity client with read/write token.

---

## Files Expected to Touch / Create
- `studio/schemaTypes/agentContext.ts` (Create Studio schema for sanity.agentContext)
- `studio/schemaTypes/index.ts` (Register agentContext in Studio schema)
- `sanity/schemaTypes/agentContext.ts` (Create Web schema for sanity.agentContext)
- `sanity/schemaTypes/index.ts` (Register agentContext in Web schema)
- `scripts/seed-agent-context.ts` (Script to seed the sanity.agentContext document to Sanity dataset)
- `lib/search-prompt.ts` (Define VERTEX_SEARCH_SYSTEM_PROMPT and default Context configuration)
- `app/api/search/route.ts` (Wire system prompt into search API route)
- `prompts/tune-search-agent-context.md` (This implementation prompt)

---

## Requirements
1. **Context Document**:
   - Schema defined with `title`, `slug`, `groqFilter`, and `instructions`.
   - Document seeded with slug `search-agent`, filter `_type in ["course", "lesson", "category", "instructor", "video"] && !(_id in path("drafts.**"))`.
   - Instructions formulated as pure deltas without duplicating obvious schema fields.
2. **System Prompt**:
   - Shaped per `shape-your-agent` (< 400 words, concrete boundaries, groundedness, fallback behavior).
   - Escapes any backticks to prevent template literal syntax errors.
3. **Checks**:
   - `npx tsc --noEmit` passes with 0 errors.
   - `npm run lint` passes with 0 errors.
   - `npm run build` succeeds with 0 errors.

---

## Security & Privacy Considerations
- Sanity API tokens remain strictly server-side.
- Zero PII is included in instructions, system prompt, or search queries.
- Public dataset rules respected: read tokens kept private on server.

---

## Acceptance Criteria
- [ ] `sanity.agentContext` schema is registered in Studio and Web workspaces.
- [ ] `sanity.agentContext.search-agent` document is created in the Sanity dataset with scope filter and pure delta instructions.
- [ ] `VERTEX_SEARCH_SYSTEM_PROMPT` is shaped and integrated with role, boundaries, two-stage resolution, and zero-hallucination rules.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Run seed script to verify document in Sanity dataset.

---

## Manual Test Steps
1. Run `npx tsx scripts/seed-agent-context.ts` and verify document is successfully written to Sanity.
2. Run `scripts/check-context.ts` to confirm document is present in the dataset.
3. Test search at `http://localhost:3000/search?q=server+components` and confirm search results adhere to ranking rules.
