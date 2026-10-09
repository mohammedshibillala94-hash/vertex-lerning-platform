# Implementation Prompt: Vertex Lesson Page (`/lessons/[slug]`)

## Goal
Implement the production-grade lesson page (`/lessons/[slug]`) matching the provided desktop design (`vertex-lesson.png`) exactly. The page will fetch data from Sanity via `getLessonBySlug`, render the course sidebar with expandable modules and lesson progress, embed and play the lesson video (supporting YouTube, Vimeo, Bunny embeds and timestamp deep linking via `?start=` query parameter), render Portable Text notes, key points, pro tips, and resources, track PostHog analytics, and provide previous/next lesson navigation.

## Skills Read
- `sanity-best-practices`: Structured GROQ querying, TypeGen, Portable Text rendering.
- `portable-text-serialization`: Rendering Portable Text blocks in React with `@portabletext/react`.
- `AGENTS.md`: Platform architecture, strict boundaries, visual reproduction from `vertex-lesson.png`, video embed guidelines, server/client boundaries, and test requirements.

## Code Inspected
- `c:\Users\USER\OneDrive\Desktop\vertex\design\vertex-lesson.png`: Design reference image for layout, spacing, typography, colors, sidebar, header, tabs, and lesson content.
- `sanity/lib/queries.ts`: `GET_LESSON_BY_SLUG_QUERY` fetches lesson details and reverse-lookup parent course with modules & nested lessons.
- `sanity/lib/fetch.ts`: Server-side `getLessonBySlug(slug)` helper using `safeFetch`.
- `app/courses/[slug]/page.tsx`: Top header navigation pattern, Clerk auth integration, and meta formatting helpers.
- `app/components/CourseContentAccordion.tsx`: Module and lesson data structures and icon styles.
- `app/utils.ts`: `formatDuration` helper.

## Decisions and Assumptions
1. **Route Location**: `/lessons/[slug]/page.tsx` for viewing individual lessons, matching `CourseContentAccordion` link destinations.
2. **Video Embed**: Use standard responsive iframe embed (`aspect-video`) supporting YouTube, Vimeo, and Bunny URLs with optional `?start=` or `?t=` timestamp start seconds parameter as specified in Section 7 of `AGENTS.md`. No custom video player controls required.
3. **Sidebar Module Accordion**: Client component (`LessonSidebarAccordion`) that automatically expands the module containing the currently active lesson, displays completion indicators (`✓` for completed, red play indicator for active/now playing, `o` for pending), and allows expanding/collapsing other modules.
4. **Tabs & Presentational Surfaces**: "Lesson Content" tab displays the Portable Text notes/overview, key points checklist, pro tip callout, and resources grid. The "Notes" tab is presentational only as defined in Section 7.
5. **Portable Text Rendering**: Use `@portabletext/react` (`PortableText`) for rendering rich text notes.
6. **Analytics Integration**: Track PostHog engagement events (`lesson_viewed`, `lesson_completed`, `next_lesson_clicked`, `previous_lesson_clicked`) using client-side helpers.

## Files Expected to Touch / Create
- `app/lessons/[slug]/page.tsx` (New - Server Component for the lesson page)
- `app/components/LessonSidebar.tsx` (New - Client component for left course sidebar accordion & progress)
- `app/components/LessonVideoPlayer.tsx` (New - Video iframe embed with start time support)
- `app/components/PortableTextRenderer.tsx` (New - PortableText renderer for lesson notes)
- `app/utils.ts` (Update if video embed URL helper is added)

## Requirements
1. **Design Precision**: Match `vertex-lesson.png` layout, colors (`#0F172A`, `#EA580C`, `#FAFAFC`, `#E2E8F0`, `#FFEEE5`), typography, card styling, icons, and buttons.
2. **Responsive Layout**: Two-column layout on desktop (`lg:grid-cols-12` with 4-col sidebar and 8-col content area), stacking cleanly on mobile/tablet.
3. **Data Fetching**: Server-side fetch of lesson data by slug via `getLessonBySlug`.
4. **Video Playback**: Embed provider video iframe with start timestamp support (`?start=seconds`).
5. **Lesson Sidebar**:
   - Back to course link (`<- Back to course`).
   - Course title & completion progress badge.
   - Module list with module titles and durations.
   - Active lesson highlighted with red play icon and "Now playing" indicator.
6. **Content Sections**:
   - Breadcrumbs (`All Courses > Course Title > Module Title > Lesson Title`).
   - Lesson tag badge (`LESSON X.Y`).
   - Title, summary, bookmark button, and metadata row (duration, level, student count).
   - "Lesson Content" and "Notes" tabs.
   - Overview text, "In this lesson you will:" key points checklist, "Pro Tip" box, and "Resources" grid.
7. **Previous / Next Navigation**: Footer buttons with lesson titles and durations navigating to adjacent lessons in sequence across modules.
8. **Auth & Analytics**: Top nav Clerk integration and PostHog event logging.

## Security Considerations
- All Sanity data fetching stays server-side via `getLessonBySlug`.
- No sensitive keys exposed to the client.
- Secure iframe embeds with proper `allow` attributes (`allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"`).

## Acceptance Criteria
- `/lessons/[slug]` renders smoothly with correct course sidebar and lesson content.
- Video iframe embeds and plays video correctly (with `?start=` seconds support).
- Module containing the active lesson is expanded by default with "Now playing" indicator.
- Previous and Next lesson buttons navigate correctly to adjacent lessons.
- TypeScript check (`npx tsc --noEmit`) and production build (`npm run build`) pass cleanly with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run build`

## Manual Test Steps
1. Navigate to `http://localhost:3000/courses/nextjs-app-router-in-depth`.
2. Click on a lesson link (e.g. `Fetching data in server components`).
3. Verify `/lessons/nextjs-app-router-in-depth-fetching-in-server-components` loads.
4. Verify video iframe renders and plays video.
5. Verify sidebar shows active module expanded with "Now playing" badge on current lesson.
6. Click "Next Lesson" and verify navigation to the next lesson in sequence.
7. Test URL with `?start=60` and verify embed starts at 60 seconds.
