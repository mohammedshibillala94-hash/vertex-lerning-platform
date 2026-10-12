# Implementation Prompt: Vertex Search Page from Design Reference

## Goal
Implement the Vertex search page (`app/search/page.tsx`) and supporting components to match the exact visual design reference provided in `design/vertex-search.png`. The page will be fully wired to Sanity content via the server-side search API (`app/api/search/route.ts`), presenting grounded Video Moment results and Lesson Topic results with exact layout, spacing, colors, badges, typography, sort controls, and responsive adaptations down to mobile.

---

## Skills & Documentation Read
- `AGENTS.md`: Section 3 (UI Work: exact desktop reproduction from reference image `design/vertex-search.png`, sensible mobile responsiveness, reuse Tailwind tokens), Section 7 (Grounded search, result cards instead of chatbox, two-stage timestamps, video embeds on lesson page with `start` param), Section 11 (Search results page behaviors, sort controls, result counts, video moments vs lesson topics), Section 13 (Verification checks).
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`): Typed GROQ projections, Portable Text plain-text projections.

---

## Code & Assets Inspected
- `design/vertex-search.png`: Visual design source of truth:
  1. **Top Nav**: Vertex logo, active "Courses" link (`#EA580C`), "My Learning", notifications bell, user avatar.
  2. **Page Hero**:
     - Centered pill tag: `SEARCH RESULTS` in orange on soft orange background (`#FFF1EB`).
     - Centered Serif headline: `Results for “<query>”` with query wrapped in vibrant orange (`#EA580C`).
     - Centered subtitle: `Found X results across Y courses` in muted slate (`#64748B`).
     - Centered Search Bar: Large white rounded container, search icon, placeholder/query, and right `⌘ K` keyboard shortcut badge.
  3. **Results Header Row**:
     - Left: `X results` count label (`#0F172A`).
     - Right: `Most Relevant` dropdown selector with chevron.
  4. **Video Result Card (`VIDEO`)**:
     - Left: 16:9 dark preview thumbnail with central translucent play button and bottom-right duration badge (e.g. `12:45`).
     - Right:
       - Header row: Course icon + course title (e.g. `Next.js for Production`), right `VIDEO` tag in orange pill (`#FFF1EB` / `#EA580C`).
       - Title: Bold font (e.g. `Data Fetching in Server Components`).
       - Description: 2-line clean summary (`#64748B`).
       - Footer: Metadata `📄 Lesson X.Y · 📁 Module Title` on left; Action `▶ Watch from MM:SS >` in orange on right, linking to `/lessons/[slug]?start=[seconds]`.
  5. **Lesson Result Card (`LESSON`)**:
     - Left: Slate/gray concept summary box (`#F8FAFC`) with top icon, bulleted key points (e.g. `• Fetching strategies`, `• Caching techniques`), and bottom-right dark circular checkmark badge.
     - Right:
       - Header row: Course icon + course title, right `LESSON` tag in soft indigo pill (`#EEF2FF` / `#6366F1`).
       - Title: Bold font (e.g. `Data Fetching & Caching`).
       - Description: Clean summary text.
       - Footer: Metadata `Module X` on left; Action `View lesson ↗ >` in orange on right, linking to `/lessons/[slug]`.
  6. **Bottom Help Banner**:
     - Rounded container with warm background, orange search icon circle, `Can't find what you're looking for?` heading, `Try different keywords or browse our full course catalog.` subtext, and white `Browse all courses →` button.
- `app/search/page.tsx`: Existing search page structure to be updated.
- `app/components/SearchResultCard.tsx`: Existing card components to be refactored to match reference designs.
- `app/components/SearchSortSelector.tsx`: Dropdown sort component.
- `app/api/search/route.ts`: Server-side search API delivering video moments and lesson topics.
- `app/components/Icons.tsx`: SVG icon components.

---

## Decisions & Assumptions
1. **Visual Fidelity**:
   - Match `design/vertex-search.png` layout and styling 1:1 on desktop (max width container 1440px with centered content ~896px max-w-4xl for the results list, or exact proportions matching the screenshot).
   - Use Serif font (`font-serif`, Newsreader/Playfair/Georgia) for the `Results for “...”` headline.
   - Use custom course icon chips: Next.js (black badge with white N), React (blue atom), Node.js (green hexagon), JavaScript (yellow badge), Python (blue/yellow badge).
2. **Video Moment Thumbnail & Playback**:
   - For video moments, display a styled video card with dark code preview / thumbnail, centered play circle icon, and bottom-right duration badge `MM:SS`.
   - The CTA `Watch from MM:SS >` directs to `/lessons/${item.lessonSlug}?start=${item.matchedMoment.second}`.
3. **Lesson Topic Card**:
   - Left panel renders the bulleted key points list extracted from the lesson's `keyPoints` array with a dark circular checkmark badge.
   - The CTA `View lesson ↗ >` directs to `/lessons/${item.lessonSlug}`.
4. **Search Bar & Keyboard Shortcut**:
   - Search bar includes the `⌘ K` / `Ctrl K` pill badge and focuses on press of `Cmd+K` or `Ctrl+K`.
   - Submitting the form navigates to `/search?q=${query}`.
5. **Mobile Responsiveness**:
   - Stack the left preview/key-points container and right details vertically on small screens (<md).
   - Collapse header navigation into clean mobile layout.
   - Maintain desktop layout identically for screens >= 768px.
6. **Data Wiring**:
   - Keep data fetching strictly server-side using `/api/search` / direct Sanity fetch.
   - Grounded strictly in real Sanity course and lesson documents.

---

## Files to Touch / Create
- `app/search/page.tsx`: Update page layout, hero, centered search bar with `⌘ K`, count header, results list, and bottom help banner.
- `app/components/SearchResultCard.tsx`: Rebuild `SearchResultCard` with separate pixel-perfect designs for `video_moment` and `lesson` types.
- `app/components/SearchHeroInput.tsx`: Create or update client search input for the hero section with `⌘ K` keyboard listener.
- `app/components/Icons.tsx`: Ensure all necessary icons (document icon, folder icon, external link, checkmark, play icon) are available.
- `prompts/vertex-search-page.md`: This implementation prompt.

---

## Requirements
1. Exact reproduction of `design/vertex-search.png` on desktop.
2. Search hero with `SEARCH RESULTS` pill, serif headline with orange query text, result/course count subtitle, and centered search bar with `⌘ K`.
3. Results row with `X results` and `Most Relevant` dropdown.
4. Video Moment card with:
   - Left: 16:9 thumbnail with play button overlay and duration badge.
   - Right: Course chip, `VIDEO` badge, lesson title, description, `📄 Lesson X.Y · 📁 Module Title`, and `▶ Watch from MM:SS >` button.
5. Lesson Topic card with:
   - Left: Concept box with key points bullets and circular checkmark.
   - Right: Course chip, `LESSON` badge, lesson title, description, `Module X`, and `View lesson ↗ >` button.
6. Bottom banner: `Can't find what you're looking for?` with `Browse all courses →` CTA.
7. Mobile responsiveness: Clean stack layout below md breakpoint.
8. Analytics: Track `search_performed` and `search_result_clicked` via PostHog.

---

## Security Considerations
- Read-only public access to search results.
- No client-side tokens or secret keys exposed.
- Query inputs sanitized.

---

## Acceptance Criteria
- [ ] `/search?q=data+fetching` matches `design/vertex-search.png` layout and aesthetics.
- [ ] Video cards display `VIDEO` pill, thumbnail with duration badge, and `Watch from MM:SS >` link.
- [ ] Clicking `Watch from MM:SS >` opens `/lessons/[slug]?start=[seconds]`.
- [ ] Lesson cards display `LESSON` pill, bulleted key points, and `View lesson ↗ >` link.
- [ ] Bottom help banner displays and navigates to `/courses`.
- [ ] `⌘ K` / `Ctrl+K` focuses the search input.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/search?q=data+fetching`.
2. Verify visual match with `design/vertex-search.png`:
   - `SEARCH RESULTS` orange badge
   - `Results for “data fetching”` serif headline with orange quote
   - `Found 28 results across 8 courses`
   - Hero search input with `⌘ K` badge
   - `28 results` count and `Most Relevant` sort dropdown
   - Video cards with `VIDEO` tag and `Watch from MM:SS >`
   - Lesson cards with `LESSON` tag, key points checklist, and `View lesson ↗ >`
   - Bottom `Can't find what you're looking for?` banner
3. Click `Watch from 12:45 >` and verify navigation to lesson page with timestamp seeking.
4. Click `View lesson ↗ >` and verify navigation to lesson page.
5. Test responsive view on mobile viewport (375px width).
