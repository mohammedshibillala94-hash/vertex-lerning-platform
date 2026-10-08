# Implementation Prompt: Fix Course Details Display & Sanity API Read Token

## Goal
Fix course details not displaying on the website by updating `.env.local` with the valid Sanity API read token for project `to777lcy`.

## Skills & Documentation Read
- `AGENTS.md` (Sections 5, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)

## Code & Data Inspected
- `sanity/lib/client.ts`: `serverClient` initializes with `process.env.SANITY_API_READ_TOKEN`.
- `sanity/lib/fetch.ts`: Data fetching for `getAllCourses`, `getCourseBySlug`, and `getLessonBySlug`.
- `.env.local`: Contained an invalid/mismatched token (`skl7q37Z...`) causing 401 `Unauthorized - Session does not match project host` errors when querying Sanity API.
- Verified via `scratch/test-sanity.mjs` that updating `SANITY_API_READ_TOKEN` to the active session token (`sks4GMm9TlLijPI2ZyEzUcjqTjRhtRM3wM2MrGcFLFa3RHdc91kdgNywXPTWfljEcjECDwox4Uhmln6mt`) successfully returns all 10 courses and full course detail structures.

## Decisions & Assumptions
1. **Root Cause**:
   - The token stored in `SANITY_API_READ_TOKEN` in `.env.local` did not match the host/project configuration of Sanity project `to777lcy`, causing `serverClient.fetch` to fail with 401 Unauthorized.
   - Fallback unauthenticated reads were returning empty results, preventing course details from rendering on `/courses` and `/courses/[slug]`.
2. **Fix Strategy**:
   - Update `SANITY_API_READ_TOKEN` in `.env.local` with the valid API token (`sks4GMm9TlLijPI2ZyEzUcjqTjRhtRM3wM2MrGcFLFa3RHdc91kdgNywXPTWfljEcjECDwox4Uhmln6mt`).
   - Clean up temporary test files in `scratch/`.
   - Run typecheck and lint checks to verify full codebase health.

## Files to Touch
- `.env.local`

## Requirements
- `SANITY_API_READ_TOKEN` set to valid token in `.env.local`.
- Course detail pages (`/courses/[slug]`) and course catalog (`/courses`) render all course details cleanly from Sanity without 401 errors.
- `npx tsc --noEmit` and `npm run lint` pass cleanly.

## Security Considerations
- The read token is kept server-only in `.env.local` and never exposed to the client bundle.

## Acceptance Criteria
1. Navigation to course pages (e.g. `/courses/nextjs-app-router-in-depth`) displays full course details (title, summary, outcomes, modules, lessons).
2. Type check and lint pass with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Open `http://localhost:3000/courses` and confirm course cards are visible.
2. Open `http://localhost:3000/courses/nextjs-app-router-in-depth` and confirm course header, outcomes, and modules accordion display cleanly.
