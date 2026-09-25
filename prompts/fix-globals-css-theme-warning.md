# Implementation Prompt: Fix Tailwind v4 `@theme` Unknown At-Rule Warning in `globals.css`

## Goal
Resolve the IDE CSS validation warning (`Unknown at rule @theme`) for Tailwind CSS v4 custom `@theme` at-rule in `app/globals.css`.

## Skills & Documentation Read
- `AGENTS.md` rules
- Tailwind CSS v4 styling documentation (At-rules `@import "tailwindcss";` and `@theme`)
- VS Code / IDE CSS settings for Tailwind CSS v4 (`css.lint.unknownAtRules`, `files.associations`)

## Code Inspected
- `app/globals.css`: Contains `@import "tailwindcss";` and `@theme` definitions for design tokens.
- `.vscode/settings.json`: Contains `"css.lint.unknownAtRules": "ignore"`.

## Decisions & Assumptions
1. Tailwind v4 introduces `@theme` as a custom CSS at-rule. IDE CSS linters flag `@theme` as an unknown at-rule unless explicitly configured or associated with Tailwind CSS language tooling.
2. Update `.vscode/settings.json` to include `"css.lint.unknownAtRules": "ignore"`, `"scss.lint.unknownAtRules": "ignore"`, and `"files.associations": { "*.css": "tailwindcss" }` so that VS Code and IDE language servers recognize Tailwind v4 `@theme` directives cleanly.
3. Ensure `app/globals.css` retains all custom design token variables (`--font-serif`, `--font-sans`, `--color-primary-*`, `--color-neutral-*`, `--radius-*`, `--shadow-*`) required by the Vertex Design System.

## Files to Touch
- `prompts/fix-globals-css-theme-warning.md` (This implementation prompt)
- `.vscode/settings.json` (IDE configuration for CSS custom at-rules and file associations)
- `app/globals.css` (Tailwind CSS v4 global stylesheet)

## Requirements
- Suppress unknown `@theme` at-rule warnings in the IDE.
- Preserve full functionality of Tailwind CSS v4 styling and custom `@theme` design tokens.
- Ensure zero build or linting errors.

## Security Considerations
- Development environment and CSS stylesheet configuration only; no security impact.

## Acceptance Criteria
1. `npm run lint` finishes with zero errors.
2. `npx tsc --noEmit` finishes with zero TypeScript errors.
3. `npm run build` succeeds cleanly.
4. IDE warning for `Unknown at rule @theme` in `globals.css` is resolved.

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Manual Test Steps
1. Open `app/globals.css` in the editor.
2. Confirm the IDE warning for `Unknown at rule @theme` is cleared.
3. Verify `npm run dev` serves the application at `http://localhost:3000` with design tokens styled correctly.
