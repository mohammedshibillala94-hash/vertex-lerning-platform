# Implementation Prompt: Wire Homepage Courses to Sanity Content Lake

## Goal
Fetch and render courses dynamically on the homepage (`app/page.tsx`) from the seeded Sanity dataset using `getAllCourses()`, and fix `SANITY_API_READ_TOKEN` environment variable resolution so server data fetching works seamlessly.

## Skills & Documentation Read
- `AGENTS.md` (Sections 5, 7, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)

## Code Inspected
- `app/page.tsx`: Currently renders hardcoded course cards.
- `sanity/lib/client.ts`: `serverClient` token check currently missing `process.env.SANITY_API_READ_TOKEN`.
- `.env.local`: Line 7 has space before `=` in `SANITY_API_READ_TOKEN ="skl7q..."`.
- `sanity/lib/fetch.ts`: Server-side `getAllCourses` data fetch helper.

## Decisions & Assumptions
1. **Sanity Server Client Token Resolution**:
   - Update `sanity/lib/client.ts` to include `process.env.SANITY_API_READ_TOKEN` in the fallback chain for `serverClient`.
   - Fix `.env.local` line 7 to `SANITY_API_READ_TOKEN="skl7q..."` (no space before `=`).
2. **Homepage Data Integration**:
   - Make `app/page.tsx` an async server component.
   - Fetch courses using `const courses = await getAllCourses()`.
   - Map fetched courses dynamically into the course cards grid, displaying `course.title`, `course.summary`, `course.level`, `course.moduleCount`, and linking to `/courses/${course.slug}`.

## Files to Touch
- `sanity/lib/client.ts`
- `.env.local`
- `app/page.tsx`

## Requirements
- `serverClient` successfully authenticates with Sanity API read token.
- Homepage course grid displays dynamic Sanity courses.
- Clicking any course card opens `/courses/[slug]` with seeded content.
- 0 TypeScript (`npx tsc --noEmit`) and lint (`npm run lint`) errors.

## Security Considerations
- Read token is accessed only in server-side data fetching (`sanity/lib/client.ts` / `server-only`).

## Acceptance Criteria
1. Homepage course cards render Sanity courses (e.g. `Next.js App Router in Depth`).
2. Navigating to a course page from the homepage loads the course detail page without 404 errors.
3. `npx tsc --noEmit` and `npm run lint` pass cleanly.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Navigate to `http://localhost:3000/`.
2. Verify courses displayed on the homepage are fetched from Sanity.
3. Click a course card and verify it opens `/courses/[slug]` successfully.
