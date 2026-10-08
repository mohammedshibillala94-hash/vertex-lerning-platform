# Implementation Prompt: Vertex Course Page Implementation

## Goal
Implement the course detail page at `/courses/[slug]` matching the reference UI design (`design/vertex-course.png`) and fully wired to the seeded Sanity content lake.

## Skills & Documentation Read
- `AGENTS.md` (Sections 1, 3, 5, 7, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)

## Code Inspected
- `design/vertex-course.png`: Reference desktop design screenshot.
- `app/page.tsx`: Existing layout, header, fonts, colors, and styling patterns.
- `app/components/Icons.tsx`: Icon library for Vertex UI.
- `sanity/lib/queries.ts`: `GET_COURSE_BY_SLUG_QUERY` and `GET_ALL_COURSES_QUERY`.
- `sanity/lib/fetch.ts`: Server-side `getCourseBySlug` and `getAllCourses`.
- `seed.ndjson`: Seed dataset containing `nextjs-app-router-in-depth` course and lessons.

## Decisions & Assumptions
1. **Routing**:
   - `app/courses/[slug]/page.tsx`: Dynamic course detail page fetching course data by slug.
   - `app/courses/page.tsx`: Course catalog page.
2. **Server / Client Architecture**:
   - `app/courses/[slug]/page.tsx` is an async Server Component fetching Sanity data.
   - Interactive components (`CourseContentAccordion` for collapsible module lists, `FloatingProgressBanner` for bottom sticky progress bar) will be Client Components (`"use client"`).
3. **UI Fidelity to `vertex-course.png`**:
   - Header with `Vertex` logo, `Courses`, `My Learning`, notification bell, and Clerk `UserButton` / Auth trigger.
   - Breadcrumb: `All Courses` > `{Course Title}`.
   - Hero Header:
     - Left: Cover image with fallback dark stylized box.
     - Right: `POPULAR` pill badge, serif heading, summary description, meta stats (Level, total calculated duration `Xh Ym`, module count, formatted student count), `Continue Learning ->` and `Bookmark` buttons.
   - "What you'll learn": 2x2 grid card showing learning outcomes with icons, titles, and descriptions from Sanity `learningOutcomes`.
   - "Course Content":
     - Header showing total module count and total course duration (`12 modules • 18h 24m`).
     - Accordion modules with number badge, title, summary, total duration, and expandable lesson list (showing titles, durations, and free preview badges).
     - "Show all modules" expand toggle.
   - Floating Progress Banner: Bottom fixed card displaying `Your Progress 35% complete`, progress bar, and `Continue Learning ->` button.
4. **Icons & Helpers**:
   - Add any missing outcome icons (`LayersIcon`, `DatabaseIcon`, `GaugeIcon`, `CloudIcon`, `BookmarkOutline`) to `app/components/Icons.tsx`.

## Files to Touch
- `app/courses/[slug]/page.tsx`
- `app/courses/page.tsx`
- `app/components/CourseContentAccordion.tsx`
- `app/components/FloatingProgressBanner.tsx`
- `app/components/Icons.tsx`
- `sanity/lib/queries.ts`

## Requirements
- Dynamic Sanity data binding using `getCourseBySlug`.
- Responsive layout adapting smoothly to smaller viewports.
- 0 TypeScript errors (`npx tsc --noEmit`).
- 0 Lint errors (`npm run lint`).

## Security Considerations
- Data fetching performed strictly on the server with private token / server client.

## Acceptance Criteria
1. Navigating to `/courses/nextjs-app-router-in-depth` displays the complete course detail page corresponding to `vertex-course.png`.
2. Module items can be expanded/collapsed interactively to view lessons.
3. Floating progress banner anchors to bottom of page.
4. `npx tsc --noEmit` and `npm run lint` succeed without errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Open browser to `http://localhost:3000/courses/nextjs-app-router-in-depth`.
2. Compare page layout, fonts, colors, and elements with `design/vertex-course.png`.
3. Click module accordion items to expand/collapse lesson lists.
4. Verify total course duration and module stats render accurately.
