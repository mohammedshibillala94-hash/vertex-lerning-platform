# Implementation Prompt: Fix `Unknown at rule @theme` Warning

## 1. Goal
Explain why the `Unknown at rule @theme` warning appears in `app/globals.css` and configure VS Code workspace settings to resolve the editor warning.

## 2. Context & Code Inspected
- **`app/globals.css`**: Uses `@import "tailwindcss";` and `@theme { ... }` directives from Tailwind CSS v4.
- **`package.json`**: Uses Tailwind CSS v4 (`"tailwindcss": "^4"`, `"@tailwindcss/postcss": "^4"`).
- **Issue Cause**: `@theme` is a new official directive introduced in Tailwind CSS v4 to define custom theme tokens directly inside CSS. However, standard IDE CSS validators (such as VS Code's built-in CSS language service) check CSS against official W3C standards, which do not recognize custom at-rules like `@theme` or `@utility`. This results in a harmless cosmetic linter warning `Unknown at rule @theme`.

## 3. Decisions & Implementation Details
- Create `.vscode/settings.json` in the root workspace.
- Add `"css.lint.unknownAtRules": "ignore"` to prevent VS Code's CSS linter from flagging Tailwind v4 custom at-rules (`@theme`, `@utility`, `@import "tailwindcss"`, etc.).

## 4. Files to Touch
- `.vscode/settings.json` (Create)

## 5. Security Considerations
None. This is an IDE configuration file for developer tooling only.

## 6. Acceptance Criteria
- `.vscode/settings.json` correctly created with `"css.lint.unknownAtRules": "ignore"`.
- The warning on line 3 of `app/globals.css` disappears in VS Code.
- Tailwind v4 compilation and Next.js dev server remain unaffected.

## 7. Checks to Run
- Inspect `.vscode/settings.json`.
- Verify `npm run dev` / dev server health.

## 8. Manual Test Steps
1. Open `app/globals.css` in VS Code.
2. Confirm that `@theme` no longer shows a squiggly line / unknown at-rule warning.
