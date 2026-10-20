import { serverClient, client } from "@/sanity/lib/client";
import { GET_ALL_CONTENT_FOR_SEARCH_QUERY, SEARCH_VIDEOS_QUERY } from "@/sanity/lib/queries";
import { SearchResultItem } from "@/app/components/SearchResultCard";

function formatTimestamp(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

async function safeFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  try {
    return await serverClient.fetch<T>(query, params);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.warn("Server client search fetch fallback to public client:", err?.message);
    return await client.fetch<T>(query, params);
  }
}

function scoreMatch(text: string, fullQuery: string, terms: string[]): number {
  if (!text) return 0;
  const lowerText = text.toLowerCase();
  let score = 0;
  const lowerFull = fullQuery.toLowerCase();

  // 1. Exact full phrase match gets high priority
  if (lowerText.includes(lowerFull)) {
    score += 30;
  }

  // 2. Individual term matches
  let matchedTermsCount = 0;
  for (const term of terms) {
    if (lowerText === term) {
      score += 15;
      matchedTermsCount++;
    } else if (lowerText.includes(term)) {
      score += 6;
      matchedTermsCount++;
    }
  }

  // Bonus if all terms matched
  if (terms.length > 1 && matchedTermsCount >= terms.length) {
    score += 20;
  }

  return score;
}

function extractSnippet(text: string, terms: string[], maxLength: number = 130): string {
  if (!text) return "";
  const lowerText = text.toLowerCase();
  let firstIdx = -1;
  for (const t of terms) {
    const idx = lowerText.indexOf(t);
    if (idx >= 0 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
    }
  }

  if (firstIdx === -1 || text.length <= maxLength) {
    return text.slice(0, maxLength);
  }

  const start = Math.max(0, firstIdx - 30);
  const end = Math.min(text.length, start + maxLength);
  return text.slice(start, end).trim();
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  courseCount: number;
  results: SearchResultItem[];
}

export async function performSearch(queryTerm: string, sortBy: string = "relevance"): Promise<SearchResponse> {
  const trimmed = queryTerm.trim();
  if (!trimmed) {
    return {
      query: "",
      totalResults: 0,
      courseCount: 0,
      results: [],
    };
  }

  const terms = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((t: string) => t.length > 1);

  const wildcards = `*${trimmed}*`;

  // Fetch all lessons with parent courses and resolved video docs in parallel
  const [allLessons, videoDocs] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    safeFetch<any[]>(GET_ALL_CONTENT_FOR_SEARCH_QUERY),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    safeFetch<any[]>(SEARCH_VIDEOS_QUERY, { term: wildcards }),
  ]);

  const results: SearchResultItem[] = [];
  const courseSlugsSet = new Set<string>();

  for (const lesson of allLessons || []) {
    const course = lesson.course;
    if (!course) continue;

    // Find module label
    let moduleLabel = `Lesson in ${course.title}`;
    if (course.modules) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      course.modules.forEach((mod: any, mIdx: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lIdx = (mod.lessons || []).findIndex((l: any) => l.slug === lesson.slug);
        if (lIdx >= 0) {
          moduleLabel = `Lesson ${mIdx + 1}.${lIdx + 1} in ${mod.title}`;
        }
      });
    }

    // 1. Process Lesson Topic Results
    const titleScore = scoreMatch(lesson.title, trimmed, terms) * 3;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyPointScore = (lesson.keyPoints || []).reduce((acc: number, kp: any) => {
      const text = typeof kp === "string" ? kp : kp?.title || kp?.description || "";
      return acc + scoreMatch(text, trimmed, terms) * 2;
    }, 0);
    const notesScore = scoreMatch(lesson.notesText, trimmed, terms);
    const proTipScore = scoreMatch(lesson.proTip, trimmed, terms);

    const totalTopicScore = titleScore + keyPointScore + notesScore + proTipScore;
    const minTopicThreshold = terms.length > 1 ? 12 : 3;

    if (totalTopicScore >= minTopicThreshold) {
      courseSlugsSet.add(course.slug);
      results.push({
        type: "lesson",
        id: `lesson-${lesson._id}`,
        title: lesson.title,
        lessonSlug: lesson.slug,
        courseTitle: course.title,
        courseSlug: course.slug,
        moduleLabel,
        description:
          lesson.notesText?.slice(0, 160) ||
          lesson.proTip ||
          "Learn key concepts and practical implementations in this lesson.",
        duration: lesson.duration || 0,
        keyPoints: (lesson.keyPoints || [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((kp: any) => (typeof kp === "string" ? kp : kp?.title || kp?.description))
          .filter(Boolean)
          .slice(0, 4),
        score: totalTopicScore,
      });
    }

    // 2. Two-Stage Timestamp Resolution for Video Moments
    // Resolves internally mapped video document
    const matchedVideo = lesson.video || (videoDocs || []).find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (v: any) => v.url === lesson.videoUrl || (v.videoId && lesson.videoUrl?.includes(v.videoId))
    );

    if (matchedVideo) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chapters: any[] = matchedVideo.chapters || matchedVideo.matchedChapters || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chunks: any[] = matchedVideo.chunks || matchedVideo.matchedChunks || [];

      // STAGE 1: Match chapters (table of contents) first
      let bestChapter: { startSeconds: number; label: string; score: number } | null = null;
      const minChapThreshold = terms.length > 1 ? 8 : 3;

      for (const chap of chapters) {
        if (!chap?.label) continue;
        const chapScore = scoreMatch(chap.label, trimmed, terms);
        if (chapScore >= minChapThreshold && (!bestChapter || chapScore > bestChapter.score)) {
          bestChapter = {
            startSeconds: chap.startSeconds,
            label: chap.label,
            score: chapScore,
          };
        }
      }

      if (bestChapter) {
        // Stage 1 success: Chapter matched!
        courseSlugsSet.add(course.slug);
        const startSec = bestChapter.startSeconds;
        results.push({
          type: "video_moment",
          id: `video-chap-${lesson._id}-${startSec}`,
          title: lesson.title,
          lessonSlug: lesson.slug,
          courseTitle: course.title,
          courseSlug: course.slug,
          moduleLabel,
          description: `Matched chapter: "${bestChapter.label}"`,
          duration: lesson.duration || 0,
          thumbnailUrl: lesson.poster
            ? undefined
            : matchedVideo.videoId
              ? `https://img.youtube.com/vi/${matchedVideo.videoId}/hqdefault.jpg`
              : undefined,
          matchedMoment: {
            second: startSec,
            timestampLabel: formatTimestamp(startSec),
            label: bestChapter.label,
          },
          score: bestChapter.score * 4 + 20, // Prioritize clean chapter matches
        });
      } else {
        // STAGE 2: Fall back to transcript chunks ONLY if no chapters matched
        let bestChunk: { startSeconds: number; text: string; score: number } | null = null;
        const minChunkThreshold = terms.length > 1 ? 12 : 3;

        for (const chunk of chunks) {
          if (!chunk?.text) continue;
          const chunkScore = scoreMatch(chunk.text, trimmed, terms);
          if (chunkScore >= minChunkThreshold && (!bestChunk || chunkScore > bestChunk.score)) {
            bestChunk = {
              startSeconds: chunk.startSeconds,
              text: chunk.text,
              score: chunkScore,
            };
          }
        }

        if (bestChunk) {
          // Stage 2 success: Transcript fallback matched!
          courseSlugsSet.add(course.slug);
          const startSec = bestChunk.startSeconds;
          const snippet = extractSnippet(bestChunk.text, terms, 130);
          results.push({
            type: "video_moment",
            id: `video-chunk-${lesson._id}-${startSec}`,
            title: lesson.title,
            lessonSlug: lesson.slug,
            courseTitle: course.title,
            courseSlug: course.slug,
            moduleLabel,
            description: `"...${snippet}..."`,
            duration: lesson.duration || 0,
            thumbnailUrl: lesson.poster
              ? undefined
              : matchedVideo.videoId
                ? `https://img.youtube.com/vi/${matchedVideo.videoId}/hqdefault.jpg`
                : undefined,
            matchedMoment: {
              second: startSec,
              timestampLabel: formatTimestamp(startSec),
              label: snippet,
            },
            score: bestChunk.score * 2 + 5, // Lower baseline than chapter matches
          });
        }
      }
    }
  }

  // Sort results
  if (sortBy === "duration") {
    results.sort((a, b) => (a.duration || 0) - (b.duration || 0));
  } else if (sortBy === "title") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Relevance default (chapters and high specificity matches first)
    results.sort((a, b) => b.score - a.score);
  }

  return {
    query: trimmed,
    totalResults: results.length,
    courseCount: courseSlugsSet.size,
    results,
  };
}
