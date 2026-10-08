# Implementation Prompt: Fix Sanity Unauthorized - Session does not match project host Error

## Goal
Resolve the `Unauthorized - Session does not match project host` runtime error occurring during Sanity data fetching in `sanity/lib/fetch.ts`.

## Skills & Documentation Read
- `AGENTS.md` (Sections 5, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)

## Code Inspected
- `sanity/lib/client.ts`: Defines `serverClient` with `token` parameter.
- `sanity/lib/fetch.ts`: Executes `serverClient.fetch(...)`.
- `.env.local`: Contains `NEXT_PUBLIC_SANITY_PROJECT_ID="to777lcy"` and `SANITY_API_READ_TOKEN`.

## Decisions & Assumptions
1. **Root Cause Analysis**:
   - The `SANITY_API_READ_TOKEN` in `.env.local` is rejected by Sanity API with `Unauthorized - Session does not match project host` because the token was issued for a different Sanity project ID or host than `to777lcy`.
2. **Robust Data Access Layer in `sanity/lib/fetch.ts` & `sanity/lib/client.ts`**:
   - Update `sanity/lib/fetch.ts` helper functions (`getAllCourses`, `getCourseBySlug`, `getLessonBySlug`, `getAllInstructors`, `getInstructorBySlug`, `getAllCategories`) with a try-catch fallback mechanism: if `serverClient.fetch` throws an `Unauthorized` / session host mismatch error, automatically retry with `client.fetch` (unauthenticated CDN/Content Lake read).
   - This prevents invalid or mismatched tokens from crashing the Next.js application, while still utilizing the read token when valid.

## Files to Touch
- `sanity/lib/fetch.ts`
- `sanity/lib/client.ts`

## Requirements
- `getAllCourses()` and `getCourseBySlug()` return data cleanly without crashing with `Unauthorized` runtime errors.
- Both token-authenticated and public fallback queries work seamlessly.
- Zero TypeScript (`npx tsc --noEmit`) and lint (`npm run lint`) errors.

## Security Considerations
- Read tokens remain strictly server-side. Public reads use `client` without exposing tokens.

## Acceptance Criteria
1. The homepage (`http://localhost:3000/`) and course detail page (`http://localhost:3000/courses/nextjs-app-router-in-depth`) load without `Unauthorized` errors.
2. `npx tsc --noEmit` and `npm run lint` pass with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Navigate to `http://localhost:3000/`.
2. Verify courses load without `Unauthorized` runtime errors.
3. Open `http://localhost:3000/courses/nextjs-app-router-in-depth` and verify details load cleanly.
