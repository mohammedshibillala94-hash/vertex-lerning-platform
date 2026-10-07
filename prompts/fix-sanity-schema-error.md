# Fix Sanity Schema Error in Lesson Schema

## Goal
Fix the runtime `SchemaError` occurring when loading NextStudio by resolving the invalid schema definition in `sanity/schemaTypes/lesson.ts`. Specifically, Sanity array fields cannot mix primitive types (e.g., `string`) with object types (e.g., `lessonKeyPoint`).

## Skills Read
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)

## Code Inspected
- `sanity/schemaTypes/lesson.ts`: `keyPoints` field was defined as an array of `[defineArrayMember({ type: "string" }), defineArrayMember({ type: "lessonKeyPoint" })]`.
- `sanity/schemaTypes/lessonKeyPoint.ts`: Defines `lessonKeyPoint` as an object schema with `title` and `description` string fields.
- `sanity/lib/queries.ts`: `GET_LESSON_BY_SLUG_QUERY` fetches `keyPoints[] { title, description }`, confirming that `keyPoints` elements are objects of type `lessonKeyPoint`.
- Output of `npx sanity schema validate`:
  `[ERROR] [lesson] keyPoints × The array type's 'of' property can't have both object types and primitive types (found primitive type "string" and object type "lessonKeyPoint")`

## Decisions and Assumptions
- Fix the `keyPoints` field in `sanity/schemaTypes/lesson.ts` to only contain `defineArrayMember({ type: "lessonKeyPoint" })`, matching the `lessonKeyPoint` object definition and the GROQ queries in `queries.ts`.

## Files to Touch
- `sanity/schemaTypes/lesson.ts`

## Requirements
1. Ensure the `keyPoints` array field in `lesson.ts` contains only `defineArrayMember({ type: "lessonKeyPoint" })`.
2. Ensure `npx sanity schema validate` passes cleanly with zero errors.
3. Ensure NextStudio mounts without `SchemaError` runtime exceptions.

## Security Considerations
- No sensitive keys or auth mechanisms modified.

## Acceptance Criteria
- `npx sanity schema validate` succeeds with 0 errors.
- `npm run dev` builds and runs cleanly without `SchemaError` on `/studio`.

## Checks to Run
- `npx sanity schema validate`
- `npx tsc --noEmit`

## Manual Test Steps
1. Run `npx sanity schema validate` and verify valid schema output with 0 errors.
2. Visit `http://localhost:3000/studio` in browser to confirm NextStudio loads cleanly.
