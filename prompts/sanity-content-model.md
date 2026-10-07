# Implementation Prompt: Sanity Content Model & Data Layer for Vertex

## Goal
Implement and verify the full Sanity content model (`course`, `module` object, `lesson`, `instructor`, `category`, `video` document, `learningOutcome` object, `lessonKeyPoint` object, `lessonResource` object), Studio desk structure, server-side Sanity read client, and typed GROQ data access layer for Vertex.

## Skills & Documentation Read
- `AGENTS.md` (Sections 5, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `content-modeling-best-practices` (`.agents/skills/content-modeling-best-practices/SKILL.md`)

## Code Inspected
- `sanity/env.ts`: Project ID, Dataset, API version environment assertions.
- `sanity.config.ts`: Sanity Studio configuration with `structureTool` and `visionTool`.
- `sanity/schemaTypes/*.ts`: Content schemas for `course`, `module`, `lesson`, `instructor`, `category`, `video`, `learningOutcome`, `lessonKeyPoint`, `lessonResource`.
- `sanity/structure.ts`: Studio desk structure organizing document types.
- `sanity/lib/client.ts`: Public and server-side Sanity clients.
- `sanity/lib/queries.ts`: GROQ queries for catalog, course details, lesson details, instructors, and categories.
- `sanity/lib/fetch.ts`: Server-side data access functions.

## Decisions & Assumptions
1. **Content Schema Architecture**:
   - `category`: Title, slug, description.
   - `instructor`: Name, slug, photo (image with hotspot), expertise, bio.
   - `learningOutcome` (object): Icon identifier, title, description.
   - `module` (object inside course): Title, summary, ordered list of lesson references.
   - `lessonKeyPoint` (object): Title, description.
   - `lessonResource` (object): Type (`github`, `link`, `pdf`, `zip`), title, description, url.
   - `lesson` (document): Title, slug, video URL, poster image, duration, free preview flag, student count, Portable Text notes, key points array (objects of type `lessonKeyPoint`), pro tip, resources array.
   - `course` (document): Title, slug, summary, cover image, level, price, popular flag, student count, learning outcomes array, instructor reference, category reference, modules array.
   - `video` (document): Internal video ingestion document with `videoId`, `url`, `chapters` array (`startSeconds`, `label`), and `chunks` array (`startSeconds`, `text`).
2. **Studio Structure**:
   - Organized desk structure in `sanity/structure.ts` with custom list items for Courses, Lessons, Instructors, Categories, and Video Transcripts.
3. **Data Access Layer**:
   - Server-only Sanity client utilizing private read token (`SANITY_API_TOKEN` / `SANITY_READ_TOKEN`).
   - `sanity/lib/fetch.ts` enforcing server-only data fetching with `server-only` boundary.
   - Typed GROQ queries in `sanity/lib/queries.ts` covering catalog courses, course details with modules/lessons, lesson details with reverse parent course lookup, instructors, and categories.

## Files to Touch
- `sanity/lib/fetch.ts`
- `sanity/schemaTypes/lesson.ts`
- `sanity/structure.ts`
- `prompts/sanity-content-model.md`

## Requirements
- `defineType` and `defineField` used for all schemas with proper validation rules.
- Array `of` definitions in schemas avoid invalid mixed primitive and object types.
- Server-side data fetching operates strictly on the server with private dataset read token support.
- Reverse reference GROQ lookups resolve a lesson's parent course and module position.
- Zero TypeScript or lint errors.

## Security Considerations
- Sanity read token kept strictly server-side (never prefixed with `NEXT_PUBLIC_`).
- Data access functions guarded with `server-only`.

## Acceptance Criteria
1. `npx sanity schema validate` succeeds with 0 errors.
2. `npx tsc --noEmit` completes with 0 errors.
3. `npm run lint` completes with 0 errors.
4. `/studio` route loads Sanity Studio with all content schema types present in desk structure.
5. `sanity/lib/fetch.ts` provides server-side fetch helpers for courses, lessons, instructors, and categories.

## Checks to Run
- `npx sanity schema validate`
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Navigate to `http://localhost:3000/studio`.
2. Verify Course, Lesson, Instructor, Category, and Video Transcripts content types exist in the desk structure.
3. Verify `sanity/lib/fetch.ts` data fetching functions can read from Sanity.
