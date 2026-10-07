# Implementation Prompt: Seed Sanity Dataset from seed.ndjson and videos.json

## 1. Goal
Import the course catalog content from `seed.ndjson` into the target Sanity dataset (`production`) using the Sanity CLI import command, verify document counts after import, and keep `seed.ndjson` and `videos.json` unmodified.

## 2. Skills Read
- `sanity-migration`: Followed migration guidelines (NDJSON import, deterministic IDs, verifying document counts, non-destructive import).

## 3. Code Inspected
- `seed.ndjson`: 142 document entries containing categories, instructors, courses, and lessons.
- `videos.json`: Video lookup mapping for lesson videos.
- `sanity/env.ts`: Contains project ID (`d19v1nwt`) and dataset (`production`).
- `sanity.config.ts`: Configured with dataset and project ID.

## 4. Decisions and Assumptions
- Use `npx sanity datasets import seed.ndjson production --replace` to import all documents into Sanity's `production` dataset.
- Do not edit `seed.ndjson` or `videos.json`.
- Verify total document count using Sanity GROQ query via CLI (`npx sanity exec ...` or `npx sanity documents query count(*)`).

## 5. Files to Touch
- `prompts/seed-sanity-dataset.md` (this prompt document)
- No source code or seed data files will be modified.

## 6. Requirements
- Execute `npx sanity datasets import seed.ndjson production --replace`.
- Check and report post-import document counts grouped by `_type`.
- Verify zero errors or skipped documents during import.

## 7. Security Considerations
- Keep dataset tokens and environment credentials secure.
- Sanity CLI uses authenticated local session or project env token.

## 8. Acceptance Criteria
- Sanity dataset contains all documents from `seed.ndjson`.
- Document count verification shows 142 total documents in Sanity matching document types (`category`, `instructor`, `course`, `lesson`, etc.).
- `seed.ndjson` and `videos.json` remain untouched.

## 9. Checks to Run
- `npx sanity datasets import seed.ndjson production --replace`
- `npx sanity documents query "count(*)"`
- `npx sanity documents query "{ 'categories': count(*[_type == 'category']), 'instructors': count(*[_type == 'instructor']), 'courses': count(*[_type == 'course']), 'lessons': count(*[_type == 'lesson']), 'total': count(*) }"`

## 10. Manual Test Steps
1. Execute the Sanity CLI dataset import.
2. Query document counts using Sanity GROQ.
3. Inspect Sanity Studio UI at `http://localhost:3000/studio` to confirm document list display.
