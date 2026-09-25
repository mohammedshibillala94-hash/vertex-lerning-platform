# Implementation Prompt: Vertex Design System

## Goal
Implement the complete Vertex Design System page and component library based on the design specification in `design/vertex-designsystem.png`, adhering strictly to the AGENTS.md rules and Next.js / Tailwind v4 standards.

## Skills & Documentation Read
- `AGENTS.md` rules
- `node_modules/next/dist/docs/` (App router conventions)
- `design/vertex-designsystem.png` (Visual reference for typography, colors, spacing, radius, shadows, icons, buttons, inputs, badges, status indicators, progress bar, cards, navigation, and principles)

## Code Inspected
- `app/globals.css`: Evaluated `@import "tailwindcss";` and `@theme` configuration for custom design tokens (`--color-primary-*`, `--color-neutral-*`, `--radius-*`, `--shadow-*`, `--font-*`).
- `app/layout.tsx`: Inspected Google Font integration (`Playfair_Display` and `Inter`) and CSS variable binding (`--font-playfair`, `--font-inter`).
- `app/components/Icons.tsx`: Inspected existing custom SVG icon components for 24x24 outline/filled icon styles and status badges.
- `app/page.tsx`: Inspected existing showcase page structure for sections 01 through 14.
- `package.json`: Checked project dependencies (`next`, `react`, `tailwindcss`, `lucide-react`, `clsx`, `tailwind-merge`).

## Decisions & Assumptions
1. **Design Token Alignment**: Ensure Tailwind v4 `@theme` variables in `globals.css` perfectly match the exact hex codes (#F97316, #FB923C, #FDBA74, #FED7AA, #FFEEE5 for Primary; #0F172A, #334155, #64748B, #CBD5E1, #E2E8F0, #F1F5F9, #FAFAFC, #FFFFFF for Neutrals), radii (4px, 8px, 12px, 16px, 24px, full), and box shadows (sm, md, lg, xl).
2. **Typography Setup**: Ensure headers use `Playfair Display` serif font (`Display 1` 48/56 bold, `Display 2` 36/44 bold) and body/ui components use `Inter` sans-serif font (`Heading 1` 28/36 semi-bold down to `Small` 12/16 regular).
3. **Component Specs**:
   - Buttons: Height 44px, radius 12px (md), Inter medium font (14-16px), padding 16px (lg) / 12px (md). Implement Primary, Secondary, Tertiary, and Text variants across Default, Hover, and Disabled states.
   - Inputs: Height 44px, radius 12px, border 1px solid #E2E8F0, focus border #FB923C. Include Search with ⌘K shortcut badge and custom Select dropdown.
   - Badges: VIDEO (#FFEEE5 bg, #F97316 text), LESSON (#F1F5F9 bg, #2563EB text), POPULAR (#FFEEE5 bg, #F97316 text).
   - Status Indicators: In Progress (orange ring), Completed (green check), Now Playing (orange play circle), Locked (lock icon).
   - Progress Bar: Orange (#F97316) fill, light track (#E2E8F0), 35% complete text label.
   - Cards: Course Card, Video Lesson Card, Lesson Card, Resource Card matching reference text, icons, and metadata tags.
   - Navigation: Top bar with logo + nav links, Breadcrumbs with chevrons, Pagination with page pills.
   - Principles: Clarity First, Consistency, Focus & Calm, Accessible cards with 40x40px icon containers.
4. **Responsiveness**: Ensure clean responsive layout down to mobile viewports with flex/grid stacking while maintaining exact desktop design on desktop viewports.

## Files to Touch
- `prompts/vertex-design-system.md` (This implementation prompt)
- `app/globals.css` (Tailwind v4 tokens & root background/typography styles)
- `app/layout.tsx` (Root font declarations and page title metadata)
- `app/components/Icons.tsx` (SVG icon set definition for outline, filled, logo, and utility icons)
- `app/page.tsx` (Complete interactive Vertex Design System showcase page)

## Requirements
- Render all 14 design system sections with exact visual fidelity to `vertex-designsystem.png`.
- Ensure zero console errors, broken styles, or layout shifting.
- Verify proper hover, focus, active, and disabled states on interactive elements.

## Security Considerations
- Purely presentation and component layer implementation; no API keys, secret credentials, or dataset tokens in client components.

## Acceptance Criteria
1. `npm run lint` completes with zero errors.
2. `npx tsc --noEmit` completes with zero TypeScript errors.
3. `npm run build` succeeds cleanly.
4. The dev server (`npm run dev`) serves `http://localhost:3000` displaying all 14 design system sections accurately matching `vertex-designsystem.png`.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Manual Test Steps
1. Navigate to `http://localhost:3000` in the browser.
2. Inspect the page header: Confirm Vertex Logo, "Design System" title, description text, and `VERSION 1.0 • MAY 2025` badge.
3. Section 01 (Colors): Verify swatches for Primary 500-100 and Neutral 900-50 + White with hex labels.
4. Section 02 & 03 (Typography & Type Scale): Verify Playfair Display & Inter specimens and type scale table rows.
5. Section 04 & 05 (Spacing & Radius/Shadows): Verify 4px base unit step visualization, 6 radius preview boxes, and 4 shadow cards with elevation.
6. Section 06 (Icons): Verify outline and filled icon sets and 24x24 icon spec card.
7. Section 07 (Buttons): Test primary, secondary, tertiary, and text buttons in Default, Hover, and Disabled states.
8. Section 08 & 09 (Inputs & Badges): Test text input with ⌘K badge, select dropdown focus rings, and badge tags.
9. Section 10 & 11 (Status & Progress Bar): Confirm 4 status indicator states and progress bar at 35%.
10. Section 12 (Cards): Verify Course Card, Lesson Card (Video), Lesson Card (Lesson), and Resource Card layout and tags.
11. Section 13 (Navigation): Test Top Bar header links, Breadcrumb trail, and Pagination active page [1] styling.
12. Section 14 (Principles): Confirm 4 principle cards with icons.
