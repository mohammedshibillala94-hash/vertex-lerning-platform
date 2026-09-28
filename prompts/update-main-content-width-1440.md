# Implementation Prompt: Update Main Content Container Width to 1440px

## Goal
Update the main content container and top navigation bar in `app/page.tsx` to expand to `max-w-[1440px]` as requested by the user.

## Skills & Documentation Read
- `AGENTS.md` rules
- `app/page.tsx` (Layout container widths)

## Code Inspected
- `app/page.tsx`: Header container currently set to `max-w-[1140px]` and main container currently set to `max-w-[1140px]`.

## Decisions & Assumptions
1. Update `max-w-[1140px]` to `max-w-[1440px]` on both the header inner wrapper and main content container.
2. Adjust hero section max-widths (`max-w-4xl` for title/headline and `max-w-3xl` for search bar container) so hero elements scale gracefully within the 1440px layout grid.

## Files to Touch
- `prompts/update-main-content-width-1440.md`
- `app/page.tsx`

## Requirements
- Header navigation bar and main content container take `max-w-[1440px]`.
- All 3 course cards grid scales cleanly across 1440px width on desktop viewports.
- Zero TypeScript or lint errors.

## Security Considerations
- Presentation layout update only; no security impact.

## Acceptance Criteria
1. `npx tsc --noEmit` completes cleanly.
2. `npm run lint` completes cleanly.
3. `npm run build` succeeds.
4. `http://localhost:3000` main content container expands to 1440px max width.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual Test Steps
1. Open `http://localhost:3000` in desktop browser.
2. Inspect the header and main content container width: Confirm container expands to `1440px` max width.
