# Implementation Prompt: Standalone Studio Workspace & Web App Server-Only Read Layer

## Goal
Establish the content foundation for Vertex in two distinct parts:
1. Move/create a standalone Sanity Studio workspace at `studio/` holding all schemas (`course`, embedded `module` object, `lesson`, `instructor`, `category`, `video` transcript document, and supporting objects) and desk structure. Remove the embedded Studio scaffold (`app/studio/` route and root `sanity.config.ts`) from the Next.js web application.
2. Implement a server-only read layer in the Next.js web application (`sanity/lib/`): server Sanity client holding the private read token, typed GROQ queries, image URL builder, and a typed fetch helper with Next.js cache tags and revalidation.

## Skills & Documentation Read
- `AGENTS.md` (Sections 5, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `content-modeling-best-practices` (`.agents/skills/content-modeling-best-practices/SKILL.md`)

## Code Inspected
- `app/studio/[[...tool]]/page.tsx`: Embedded Studio route to be removed.
- `sanity.config.ts` (root): Root Studio config to be removed in favor of `studio/sanity.config.ts`.
- `sanity/schemaTypes/*.ts`: Current schemas to be migrated into `studio/schemaTypes/`.
- `sanity/structure.ts`: Studio desk structure to be migrated into `studio/structure.ts`.
- `sanity/lib/client.ts`: Sanity client setup.
- `sanity/lib/queries.ts`: Typed GROQ queries for catalog, course details, lesson details, instructors, and categories.
- `sanity/lib/fetch.ts`: Server-side fetch helper using `serverClient` with cache tags.

## Decisions & Assumptions
1. **Standalone Studio Workspace (`studio/`)**:
   - Directory structure:
     - `studio/package.json`: Independent workspace package file with `sanity`, `@sanity/vision`, `styled-components`, `react`, `react-dom`, `typescript`. Scripts: `dev` (`sanity dev`), `build` (`sanity build`), `deploy` (`sanity deploy`).
     - `studio/sanity.config.ts`: Sanity Studio config using `defineConfig` targeting `projectId` (`to777lcy` / env) and `dataset` (`production` / env) with `structureTool` and `visionTool`.
     - `studio/sanity.cli.ts`: Sanity CLI config with `projectId` and `dataset`.
     - `studio/tsconfig.json`: TypeScript configuration for Studio workspace.
     - `studio/structure.ts`: Desk structure organizing Courses, Lessons, Instructors, Categories, and Video Transcripts.
     - `studio/schemaTypes/`: Schema definitions (`category.ts`, `instructor.ts`, `learningOutcome.ts`, `module.ts`, `lessonKeyPoint.ts`, `lessonResource.ts`, `lesson.ts`, `course.ts`, `video.ts`, `index.ts`).
2. **Remove Embedded Studio from Web App**:
   - Delete `app/studio/[[...tool]]/page.tsx` and `app/studio/` directory.
   - Delete root `sanity.config.ts`.
3. **Server-Only Read Layer in Web App (`sanity/lib/`)**:
   - `sanity/lib/client.ts`: Exports `client` (public client) and `serverClient` (server client with `SANITY_API_TOKEN` / `SANITY_READ_TOKEN` and `useCdn: false`).
   - `sanity/lib/queries.ts`: Defines typed GROQ queries (`GET_ALL_COURSES_QUERY`, `GET_COURSE_BY_SLUG_QUERY`, `GET_LESSON_BY_SLUG_QUERY`, `GET_ALL_INSTRUCTORS_QUERY`, `GET_INSTRUCTOR_BY_SLUG_QUERY`, `GET_ALL_CATEGORIES_QUERY`). `GET_LESSON_BY_SLUG_QUERY` performs reverse reference lookup for parent course and module position.
   - `sanity/lib/fetch.ts`: Enforces `import "server-only";` boundary and provides typed helper functions (`getAllCourses`, `getCourseBySlug`, `getLessonBySlug`, `getAllInstructors`, `getInstructorBySlug`, `getAllCategories`) with cache tags (e.g., `next: { tags: ["courses"], revalidate: 60 }`).
   - `sanity/lib/image.ts`: Provides `urlFor` helper for building image URLs.

## Files to Touch
- `studio/package.json` (create)
- `studio/sanity.config.ts` (create)
- `studio/sanity.cli.ts` (create)
- `studio/tsconfig.json` (create)
- `studio/structure.ts` (create)
- `studio/schemaTypes/category.ts` (create)
- `studio/schemaTypes/instructor.ts` (create)
- `studio/schemaTypes/learningOutcome.ts` (create)
- `studio/schemaTypes/module.ts` (create)
- `studio/schemaTypes/lessonKeyPoint.ts` (create)
- `studio/schemaTypes/lessonResource.ts` (create)
- `studio/schemaTypes/lesson.ts` (create)
- `studio/schemaTypes/course.ts` (create)
- `studio/schemaTypes/video.ts` (create)
- `studio/schemaTypes/index.ts` (create)
- `app/studio/[[...tool]]/page.tsx` (remove)
- `sanity.config.ts` (remove)
- `sanity/lib/client.ts`
- `sanity/lib/queries.ts`
- `sanity/lib/fetch.ts`
- `sanity/lib/image.ts`
- `prompts/standalone-studio-and-read-layer.md`

## Requirements
- Embedded Studio route `app/studio/` removed from web app.
- Standalone Studio workspace created at `studio/` with clean `sanity schema validate`.
- Array fields in Studio schemas avoid invalid mixed primitive/object types.
- Web app data fetching layer protected with `server-only` and cached using Next.js cache tags and revalidation settings.
- Zero TypeScript or lint errors in web app and studio workspaces.

## Security Considerations
- Sanity read token (`SANITY_READ_TOKEN` / `SANITY_API_TOKEN`) maintained strictly on server-side.
- Data fetching helpers in `sanity/lib/fetch.ts` guarded with `server-only`.

## Acceptance Criteria
1. Embedded Studio scaffold is removed from `app/studio/`.
2. Running `npx sanity schema validate` inside `studio/` succeeds with 0 errors.
3. `npx tsc --noEmit` in root web app succeeds with 0 errors.
4. `npm run lint` in root web app succeeds with 0 errors.
5. Server-only read layer in `sanity/lib/fetch.ts` exports cached data fetchers for catalog, course, lesson, instructor, and category queries.

## Checks to Run
- In `studio/`: `npx sanity schema validate`
- In web app (root): `npx tsc --noEmit`
- In web app (root): `npm run lint`

## Manual Test Steps
1. Navigate into `studio/` directory and verify Sanity CLI commands work (`npx sanity schema validate`).
2. Verify Next.js dev server builds without embedded `/studio` route.
3. Verify `sanity/lib/fetch.ts` provides typed, server-only data fetching functions with cache tags.
