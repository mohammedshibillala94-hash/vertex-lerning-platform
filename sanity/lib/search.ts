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
    score += 25;
  }

  // 2. Individual term matches
  let matchedTermsCount = 0;
  for (const term of terms) {
    if (lowerText === term) {
      score += 10;
      matchedTermsCount++;
    } else if (lowerText.includes(term)) {
      score += 4;
      matchedTermsCount++;
    }
  }

  // Bonus if all terms matched
  if (terms.length > 1 && matchedTermsCount >= terms.length) {
    score += 15;
  }

  return score;
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

  // Fetch all lessons with parent courses and video docs in parallel
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

    // 2. Process Video Moments for this Lesson
    const matchedVideo = (videoDocs || []).find(
      (v) => v.url === lesson.videoUrl || lesson.videoUrl?.includes(v.videoId)
    );

    if (matchedVideo) {
      // Stage 1: Match chapters first (table of contents)
      const chapterMatches = matchedVideo.matchedChapters || [];
      const minChapThreshold = terms.length > 1 ? 10 : 3;
      let hadChapterMatch = false;

      for (const chap of chapterMatches) {
        const chapScore = scoreMatch(chap.label, trimmed, terms) * 4;
        if (chapScore >= minChapThreshold) {
          hadChapterMatch = true;
          courseSlugsSet.add(course.slug);
          results.push({
            type: "video_moment",
            id: `video-chap-${lesson._id}-${chap.startSeconds}`,
            title: lesson.title,
            lessonSlug: lesson.slug,
            courseTitle: course.title,
            courseSlug: course.slug,
            moduleLabel,
            description: `Matched chapter: "${chap.label}"`,
            duration: lesson.duration || 0,
            thumbnailUrl: lesson.poster ? undefined : `https://img.youtube.com/vi/${matchedVideo.videoId}/hqdefault.jpg`,
            matchedMoment: {
              second: chap.startSeconds,
              timestampLabel: formatTimestamp(chap.startSeconds),
              label: chap.label,
            },
            score: chapScore + 10, // boost chapters over transcript chunks
          });
        }
      }

      // Stage 2: Fall back to transcript chunks only if no chapters matched
      if (!hadChapterMatch) {
        const chunkMatches = matchedVideo.matchedChunks || [];
        const minChunkThreshold = terms.length > 1 ? 16 : 4;
        for (const chunk of chunkMatches) {
          const chunkScore = scoreMatch(chunk.text, trimmed, terms) * 2;
          if (chunkScore >= minChunkThreshold) {
            courseSlugsSet.add(course.slug);
            results.push({
              type: "video_moment",
              id: `video-chunk-${lesson._id}-${chunk.startSeconds}`,
              title: lesson.title,
              lessonSlug: lesson.slug,
              courseTitle: course.title,
              courseSlug: course.slug,
              moduleLabel,
              description: `"...${chunk.text.slice(0, 140)}..."`,
              duration: lesson.duration || 0,
              matchedMoment: {
                second: chunk.startSeconds,
                timestampLabel: formatTimestamp(chunk.startSeconds),
                label: chunk.text.slice(0, 60),
              },
              score: chunkScore,
            });
          }
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
    // Relevance default
    results.sort((a, b) => b.score - a.score);
  }

  return {
    query: trimmed,
    totalResults: results.length,
    courseCount: courseSlugsSet.size,
    results,
  };
}
