# Implementation Prompt: Fix Unknown Field 'popular' in Course Schema

## Goal
Fix the "Unknown field found: popular" error/warning in Sanity Studio by defining `popular` in the `course` schema and updating GROQ queries to handle both `popular` and `isPopular`.

## Skills & Documentation Read
- `AGENTS.md` (Sections 2, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)

## Code Inspected
- `studio/schemaTypes/course.ts`: Currently defines `name: "isPopular"` instead of `name: "popular"`.
- `sanity/schemaTypes/course.ts`: Currently defines `name: "isPopular"`.
- `sanity/lib/queries.ts`: Currently queries `isPopular`.

## Decisions & Assumptions
1. Update `studio/schemaTypes/course.ts` and `sanity/schemaTypes/course.ts` to define `name: "popular"` (title: "Popular Course", type: "boolean", initialValue: false).
2. Update `sanity/lib/queries.ts` to project `"isPopular": coalesce(popular, isPopular, false)` so existing frontend components expecting `isPopular` receive the boolean seamlessly.
3. Ensure both `studio` and `sanity` workspaces stay in sync.

## Files to Touch
- `studio/schemaTypes/course.ts`
- `sanity/schemaTypes/course.ts`
- `sanity/lib/queries.ts`

## Requirements
- `popular` boolean field is recognized in Sanity Studio for course documents.
- GROQ queries in `queries.ts` map `popular` / `isPopular` cleanly.
- Zero TypeScript (`tsc`) or lint errors.

## Security Considerations
- Pure schema definition update; no sensitive security implications.

## Acceptance Criteria
1. Sanity Studio displays the "Popular Course" field properly without "Unknown field found" warning.
2. Next.js app queries receive `isPopular` flag derived from `popular` or `isPopular` in Sanity dataset.
3. `npx tsc --noEmit` passes with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Refresh Sanity Studio at `http://localhost:3333/`.
2. Inspect a Course document.
3. Confirm the "Unknown field found: popular" warning is gone and the field can be edited in Studio.
