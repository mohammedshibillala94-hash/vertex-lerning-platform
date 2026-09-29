# Implementation Prompt: Sanity Content Model & Data Layer for Vertex

## Goal
Implement the full Sanity content model (Course, Module object, Lesson, Instructor, Category, Video document, Learning Outcome object, Lesson Key Point object, Lesson Resource object) and Studio desk structure, along with the server-side Sanity read client and typed GROQ data access layer for Vertex.

## Skills & Documentation Read
- `AGENTS.md` (Sections 5, 8, 12, 13)
- `sanity-best-practices` (`~/.claude/skills/sanity-best-practices/SKILL.md`)
- `content-modeling-best-practices` (`~/.claude/skills/content-modeling-best-practices/SKILL.md`)
- `sanity/env.ts`, `sanity.config.ts`, `sanity/lib/client.ts`

## Code Inspected
- `sanity/env.ts`: Project ID, Dataset, API version environment assertions.
- `sanity.config.ts`: Sanity Studio configuration with `structureTool` and `visionTool`.
- `sanity/schemaTypes/index.ts`: Current schema types entry point.

## Decisions & Assumptions
1. **Content Schema Architecture**:
   - `category`: Title, slug, description.
   - `instructor`: Name, slug, photo (image with hotspot), expertise, bio.
   - `learningOutcome` (object): Icon string, title, description.
   - `module` (embedded object inside course): Title, summary, ordered list of lesson references.
   - `lessonKeyPoint` (object): Title, description.
   - `lessonResource` (object): Type (link, github, pdf, zip), title, description, url.
   - `lesson` (document): Title, slug, video URL, poster image, duration, free preview flag, student count, Portable Text notes, key points array, pro tip, resources array.
   - `course` (document): Title, slug, summary, cover image, level, price, popular flag, student count, learning outcomes array, instructor reference, category reference, modules array.
   - `video` (document): Internal video ingestion document with `videoId`, `url`, `chapters` array (`startSeconds`, `label`), and `chunks` array (`startSeconds`, `text`).
2. **Studio Structure**:
   - Organize desk structure in `sanity/structure.ts` with custom list items for Courses, Lessons, Instructors, Categories, and Video Transcripts.
3. **Data Access Layer**:
   - Server-only Sanity client using `server-only` import assertion and token authentication for reading private dataset.
   - GROQ queries module (`sanity/lib/queries.ts`) with queries for catalog courses, course by slug (with modules & lessons), lesson by slug (with reverse parent course lookup), instructors, and categories.
   - Data access fetchers (`sanity/lib/fetch.ts`) wrapping queries with revalidation options.

## Files to Touch
- `sanity/schemaTypes/category.ts`
- `sanity/schemaTypes/instructor.ts`
- `sanity/schemaTypes/learningOutcome.ts`
- `sanity/schemaTypes/module.ts`
- `sanity/schemaTypes/lessonResource.ts`
- `sanity/schemaTypes/lessonKeyPoint.ts`
- `sanity/schemaTypes/lesson.ts`
- `sanity/schemaTypes/course.ts`
- `sanity/schemaTypes/video.ts`
- `sanity/schemaTypes/index.ts`
- `sanity/structure.ts`
- `sanity/lib/client.ts`
- `sanity/lib/queries.ts`
- `sanity/lib/fetch.ts`
- `prompts/sanity-content-model.md`

## Requirements
- `defineType` and `defineField` used for all schemas with proper validation rules.
- Server-side data fetching operates strictly on the server with private dataset read token support.
- Reverse reference GROQ lookups resolve a lesson's parent course and module position.
- Zero TypeScript or lint errors.

## Security Considerations
- Sanity read token kept strictly server-side (never prefixed with `NEXT_PUBLIC_`).
- Data access functions marked server-side only.

## Acceptance Criteria
1. `npx tsc --noEmit` completes with 0 errors.
2. `npm run lint` completes with 0 errors.
3. `/studio` route loads the Sanity Studio with all schema types present.
4. GROQ data helpers fetch strongly-typed course and lesson documents.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Navigate to `http://localhost:3000/studio`.
2. Verify Course, Lesson, Instructor, Category, and Video content types exist in the desk structure.
3. Create draft documents in Studio to verify schema validation and preview fields.
