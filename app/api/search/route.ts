import { NextResponse } from "next/server";
import { serverClient, client } from "@/sanity/lib/client";
import { GET_ALL_CONTENT_FOR_SEARCH_QUERY, SEARCH_VIDEOS_QUERY } from "@/sanity/lib/queries";

export interface SearchResultItem {
  type: "video_moment" | "lesson";
  id: string;
  title: string;
  lessonSlug: string;
  courseTitle: string;
  courseSlug: string;
  moduleLabel: string;
  description: string;
  duration?: number;
  thumbnailUrl?: string;
  matchedMoment?: {
    second: number;
    timestampLabel: string;
    label: string;
  };
  keyPoints?: string[];
  score: number;
}

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
    console.warn("Server client search fetch failed, falling back to public client:", err?.message);
    return await client.fetch<T>(query, params);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scoreMatch(text: string, terms: string[]): number {
  if (!text) return 0;
  const lowerText = text.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (lowerText === term) score += 10;
    else if (lowerText.includes(term)) score += 3;
  }
  return score;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const queryTerm = (body.query || "").trim();
    const sortBy = body.sort || "relevance";

    if (!queryTerm) {
      return NextResponse.json({
        query: "",
        totalResults: 0,
        courseCount: 0,
        results: [],
      });
    }

    const terms = queryTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((t: string) => t.length > 1);

    const wildcards = `*${queryTerm}*`;

    // Fetch all lessons with parent courses and video docs in parallel
    const [allLessons, videoDocs] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      safeFetch<any[]>(GET_ALL_CONTENT_FOR_SEARCH_QUERY),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      safeFetch<any[]>(SEARCH_VIDEOS_QUERY, { term: wildcards }),
    ]);

    const results: SearchResultItem[] = [];
    const courseSlugsSet = new Set<string>();

    // 1. Process Lesson Topic Results
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

      // Calculate score across title, keyPoints, notes, proTip
      const titleScore = scoreMatch(lesson.title, terms) * 3;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const keyPointScore = (lesson.keyPoints || []).reduce((acc: number, kp: any) => {
        const text = typeof kp === "string" ? kp : kp?.title || kp?.description || "";
        return acc + scoreMatch(text, terms) * 2;
      }, 0);
      const notesScore = scoreMatch(lesson.notesText, terms);
      const proTipScore = scoreMatch(lesson.proTip, terms);

      const totalTopicScore = titleScore + keyPointScore + notesScore + proTipScore;

      if (totalTopicScore > 0) {
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
      // Find matching video doc by videoUrl or videoId
      const matchedVideo = (videoDocs || []).find(
        (v) => v.url === lesson.videoUrl || lesson.videoUrl?.includes(v.videoId)
      );

      if (matchedVideo) {
        // Stage 1: Match chapters first (table of contents)
        const chapterMatches = matchedVideo.matchedChapters || [];
        for (const chap of chapterMatches) {
          const chapScore = scoreMatch(chap.label, terms) * 4;
          if (chapScore > 0) {
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
              score: chapScore + 5, // chapters get boost over transcript chunks
            });
          }
        }

        // Stage 2: Fall back to transcript chunks if no chapters matched
        if (chapterMatches.length === 0) {
          const chunkMatches = matchedVideo.matchedChunks || [];
          for (const chunk of chunkMatches) {
            const chunkScore = scoreMatch(chunk.text, terms) * 2;
            if (chunkScore > 0) {
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

    return NextResponse.json({
      query: queryTerm,
      totalResults: results.length,
      courseCount: courseSlugsSet.size,
      results,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Search API Error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal search error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "relevance";

  const fakeReq = new Request(request.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q, sort }),
  });

  return POST(fakeReq);
}
