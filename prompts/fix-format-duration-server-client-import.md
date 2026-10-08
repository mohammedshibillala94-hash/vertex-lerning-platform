# Implementation Prompt: Fix formatDuration Client Export Server Import Error

## Goal
Fix Next.js runtime error where `formatDuration` (a pure helper function) is exported from a `"use client"` component file (`CourseContentAccordion.tsx`) and imported directly into a Server Component (`app/courses/[slug]/page.tsx`).

## Skills & Documentation Read
- `AGENTS.md` (Sections 4, 5, 12, 13)
- `node_modules/next/dist/docs/` (Server and Client Components boundary rules)

## Code Inspected
- `app/components/CourseContentAccordion.tsx`: Marked with `"use client"`, exports `formatDuration`.
- `app/courses/[slug]/page.tsx`: Async Server Component importing `formatDuration` from `CourseContentAccordion.tsx`.

## Decisions & Assumptions
1. **Root Cause**:
   - Next.js prohibits importing non-component functions exported from `"use client"` files into Server Components.
2. **Fix Strategy**:
   - Extract `formatDuration` into a standalone, pure utility file `app/utils.ts` (or `app/lib/utils.ts`).
   - Import `formatDuration` from `app/utils.ts` in both `CourseContentAccordion.tsx` and `app/courses/[slug]/page.tsx`.

## Files to Touch
- `app/utils.ts` (Create new)
- `app/components/CourseContentAccordion.tsx` (Update import & export)
- `app/courses/[slug]/page.tsx` (Update import)

## Requirements
- `formatDuration` moves to `app/utils.ts`.
- Server Component `app/courses/[slug]/page.tsx` imports `formatDuration` from `@/app/utils` cleanly without server-client boundary errors.
- `npx tsc --noEmit` and `npm run lint` pass cleanly with 0 errors.

## Security Considerations
- Pure utility calculations remain side-effect free and runnable on both server and client.

## Acceptance Criteria
1. Navigating to `http://localhost:3000/courses/nextjs-app-router-in-depth` renders without Next.js runtime errors.
2. Total course duration is displayed correctly in the course header.
3. Type check and lint pass with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Refresh `http://localhost:3000/courses/nextjs-app-router-in-depth` in the browser.
2. Verify page loads and formatted duration shows (e.g. `44m` or `1h 15m`).
