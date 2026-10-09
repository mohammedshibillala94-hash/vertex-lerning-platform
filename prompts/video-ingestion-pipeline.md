# Implementation Prompt: Offline Video Ingestion Pipeline

## Goal
Implement an offline video ingestion pipeline script (`scripts/ingest-videos.ts`) that reads video metadata and URLs (YouTube, Vimeo, Bunny), extracts video IDs, generates timestamped chapter markers (table of contents) and short transcript chunks (`chunks[]`), and upserts `video` documents into the Sanity dataset using deterministic document IDs (`video.<videoId>`).

## Skills Read
- `sanity-migration`: Deterministic IDs, repeatable ETL ingestion scripts, snapshotting source data, and upserting into Sanity datasets with `createOrReplace`.
- `sanity-best-practices`: Sanity content modeling, schema field constraints for `video` document types (`chapters[]` and `chunks[]`).
- `AGENTS.md`: Offline pipeline rule (never runs in request path), provider-specific video ID derivation, timestamped transcript chunking, chapter table of contents generation, and grounded search integration.

## Code Inspected
- `sanity/schemaTypes/video.ts`: Sanity schema definition for `video` documents (`videoId`, `url`, `chapters[]`, `chunks[]`).
- `videos.json`: Master JSON inventory mapping lesson keys to video IDs, titles, channels, durations, and queries.
- `sanity/lib/queries.ts`: `SEARCH_VIDEOS_QUERY` and GROQ fetchers.
- `sanity/lib/client.ts`: `serverClient` and `client` configuration for Sanity API writes.

## Decisions and Assumptions
1. **Offline Tooling**: Implemented as a standalone CLI script (`scripts/ingest-videos.ts`) run via `npm run ingest-videos`. It executes offline and does NOT run in the Next.js request path.
2. **Deterministic Document IDs**: Uses `video.<sanitized_id>` (e.g. `video.9602Yzvd7ik`), stripping invalid characters to ensure reruns converge idempotently using `serverClient.createOrReplace`.
3. **Chapters & Transcript Chunks**:
   - **Chapters**: Generates structured table of contents array (`chapters: [{ startSeconds, label }]`) based on video milestones and key topics.
   - **Transcript Chunks**: Generates timestamped transcript array (`chunks: [{ startSeconds, text }]`) in short ~15-30 second intervals, keeping whole transcripts out of single large fields.
4. **Provider Support**: Supports YouTube (`youtube.com`, `youtu.be`), Vimeo (`vimeo.com`), and Bunny (`mediadelivery.net`).
5. **Sanity Integration**: Uses `SANITY_API_READ_TOKEN` / write token on the server side to perform bulk upserts into the Sanity dataset.

## Files Expected to Touch / Create
- `scripts/ingest-videos.ts` (New - Offline video ingestion pipeline script)
- `package.json` (Update - Add `ingest-videos` npm script)

## Requirements
1. Read all video entries from `videos.json` and Sanity lesson video URLs.
2. Extract clean video IDs and generate deterministic Sanity document IDs.
3. Construct `video` documents with `videoId`, `url`, `chapters[]` (`startSeconds`, `label`), and `chunks[]` (`startSeconds`, `text`).
4. Upsert documents into Sanity via `createOrReplace`.
5. Output detailed progress logs, summary report, and error counts.

## Security Considerations
- The ingestion script runs strictly offline in CLI environments.
- API write tokens stay local/server-side and are never exposed to client bundles.

## Acceptance Criteria
- Running `npm run ingest-videos` parses `videos.json` and ingests all video documents into Sanity without errors.
- Created `video` documents conform strictly to `sanity/schemaTypes/video.ts`.
- `SEARCH_VIDEOS_QUERY` returns matching chapters and transcript chunks when searched.
- TypeScript check (`npx tsc --noEmit`) and production build (`npm run build`) pass with 0 errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run ingest-videos`
- `npm run build`

## Manual Test Steps
1. Run `npm run ingest-videos` in terminal.
2. Verify terminal output shows successful ingestion of video documents.
3. Open `http://localhost:3000/search?q=caching` and verify video moment timestamp cards appear.
4. Click a timestamp result and verify video playback starts at that exact second.
