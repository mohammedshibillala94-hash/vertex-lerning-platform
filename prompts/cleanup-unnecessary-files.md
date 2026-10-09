# Implementation Prompt: Clean Up Unnecessary & Duplicate Files

## Goal
Remove unnecessary, temporary, duplicate, and leftover files from the repository to keep the codebase clean, lean, and free of runtime side-effects.

## Skills & Documentation Read
- `AGENTS.md` (Section 13)

## Code & Files Inspected
- `gemini_generated_video_e9da05c5.mp4`: Temporary 3.5MB video file in root.
- `vertex-course.png`: Duplicate 1.4MB image file in root (`design/vertex-course.png` already exists).
- `CLAUDE.md`: Unused 11-byte stub file containing only "vertex\n".
- `.posthog-wizard-cache/`: Leftover temporary CLI cache directory from aborted PostHog wizard setup.
- `scratch/`: Temporary scratch directory.
- `instrumentation-client.ts`: Leftover PostHog wizard file that throws errors when `NEXT_PUBLIC_POSTHOG_KEY` is not configured.

## Decisions & Assumptions
1. Delete root-level duplicate asset `vertex-course.png` (retaining `design/vertex-course.png`).
2. Delete root-level temporary video `gemini_generated_video_e9da05c5.mp4`.
3. Delete unused stub `CLAUDE.md`.
4. Delete temporary CLI cache directory `.posthog-wizard-cache/` and `scratch/`.
5. Remove incomplete PostHog setup file `instrumentation-client.ts`.

## Files to Touch
- `gemini_generated_video_e9da05c5.mp4` (Remove)
- `vertex-course.png` (Remove root duplicate)
- `CLAUDE.md` (Remove)
- `.posthog-wizard-cache/` (Remove)
- `scratch/` (Remove)
- `instrumentation-client.ts` (Remove)

## Requirements
- All target unnecessary and leftover files are removed.
- `npx tsc --noEmit` and `npm run lint` pass cleanly with 0 errors.

## Security Considerations
- No environment files (`.env`, `.env.local`), configuration files, or active source code components are deleted.

## Acceptance Criteria
1. Project root is clean without leftover temporary assets or incomplete instrumentation files.
2. `npx tsc --noEmit` and `npm run lint` pass cleanly.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

## Manual Test Steps
1. Verify root directory listing is clean.
2. Confirm dev server starts cleanly with `npm run dev`.
