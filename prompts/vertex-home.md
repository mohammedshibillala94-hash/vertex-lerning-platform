# Implementation Prompt: Vertex Home Page

## Goal
Implement the Vertex Home / Catalog page based on the design specification in `design/vertex-home.png`, following AGENTS.md guidelines and Next.js / Tailwind v4 patterns.

## Skills & Documentation Read
- `AGENTS.md` rules
- `node_modules/next/dist/docs/` (App router conventions)
- `design/vertex-home.png` (Visual reference for top bar, hero search section, course catalog cards, and footer accent)

## Code Inspected
- `app/globals.css`: Tailwind v4 theme configuration with primary and neutral color tokens, custom font variables, rounded radii, and custom box shadows.
- `app/layout.tsx`: Root font binding (`Playfair_Display` serif, `Inter` sans-serif) and page title metadata.
- `app/components/Icons.tsx`: SVG icons (`VertexLogo`, `BellOutline`, `SearchOutline`, `ClockOutline`, `BarChartOutline`, `DocumentOutline`, `ChevronRightOutline`).
- `design/vertex-home.png`: Home page visual design asset.

## Decisions & Assumptions
1. **Layout Structure**: Top navigation bar with logo, page links (`Courses`, `My Learning`), notification bell, and user avatar.
2. **Hero Section**:
   - `INTELLIGENT LEARNING` badge tag in warm pill container.
   - `Search your learning in plain English.` serif headline using `Playfair Display`.
   - Description text in `Inter` body font.
   - `Explore Courses` primary orange button with right arrow icon.
   - Global search input bar with search icon and `⌘ K` keyboard shortcut badge.
3. **Course Catalog Grid ("All Courses")**:
   - Section heading `All Courses` with `View all courses ->` link.
   - 3 Course cards (`Next.js for Production`, `Docker Essentials`, `TypeScript Deep Dive`) featuring logo badges, course titles, descriptions, and metadata badges (Level, Duration, Module count).
4. **Footer Banner Accent**: Star icon divider with `New courses and lessons added every week.` and warm glowing gradient background accent.

## Files to Touch
- `design/vertex-home.png` (Visual design asset saved)
- `prompts/vertex-home.md` (This implementation prompt)

## Requirements
- Match `design/vertex-home.png` exactly for layout, typography, colors, spacing, and micro-interactions.
- Zero lint or typecheck errors.

## Security Considerations
- Pure presentation and component layer implementation; no sensitive server tokens exposed in client components.

## Acceptance Criteria
1. `npm run lint` completes cleanly.
2. `npx tsc --noEmit` passes with 0 errors.
3. `npm run build` succeeds cleanly.
4. `http://localhost:3000` renders the home page matching `vertex-home.png`.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Manual Test Steps
1. Navigate to `http://localhost:3000` in the browser.
2. Inspect Top Navigation: Verify Vertex logo, `Courses`, `My Learning` links, Bell icon, and User avatar.
3. Inspect Hero Section: Confirm `INTELLIGENT LEARNING` badge, `Search your learning in plain English.` heading, `Explore Courses` button, and `Ask anything about your learning...` search bar.
4. Inspect Catalog Section: Verify 3 course cards (`Next.js for Production`, `Docker Essentials`, `TypeScript Deep Dive`) with metadata badges.
5. Inspect Footer Accent: Verify star icon divider and warm gradient bar.
