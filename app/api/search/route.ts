import { NextResponse } from "next/server";
import { performSearch } from "@/sanity/lib/search";
import { captureServerEvent } from "@/lib/posthog-server";
import { auth } from "@clerk/nextjs/server";
export { VERTEX_SEARCH_SYSTEM_PROMPT } from "@/lib/search-prompt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const queryTerm = (body.query || "").trim();
    const sortBy = body.sort || "relevance";

    let distinctId = "anonymous";
    try {
      const { userId } = await auth();
      if (userId) distinctId = userId;
    } catch {
      // In case auth cannot resolve
    }

    const data = await performSearch(queryTerm, sortBy);

    captureServerEvent({
      event: "search_performed",
      distinctId,
      properties: {
        query: queryTerm,
        sort_by: sortBy,
        result_count: data.totalResults,
        course_count: data.courseCount,
        source: "api_post",
      },
    }).catch(() => {});

    return NextResponse.json(data);
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

  let distinctId = "anonymous";
  try {
    const { userId } = await auth();
    if (userId) distinctId = userId;
  } catch {
    // In case auth cannot resolve
  }

  const data = await performSearch(q, sort);

  captureServerEvent({
    event: "search_performed",
    distinctId,
    properties: {
      query: q,
      sort_by: sort,
      result_count: data.totalResults,
      course_count: data.courseCount,
      source: "api_get",
    },
  }).catch(() => {});

  return NextResponse.json(data);
}

