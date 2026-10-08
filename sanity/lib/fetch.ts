import "server-only";
import { client, serverClient } from "./client";
import {
  GET_ALL_COURSES_QUERY,
  GET_COURSE_BY_SLUG_QUERY,
  GET_LESSON_BY_SLUG_QUERY,
  GET_ALL_INSTRUCTORS_QUERY,
  GET_INSTRUCTOR_BY_SLUG_QUERY,
  GET_ALL_CATEGORIES_QUERY,
} from "./queries";

type SanityDoc = Record<string, unknown>;

async function safeFetch<T = SanityDoc>(
  query: string,
  params: Record<string, unknown> = {},
  options: Record<string, unknown> = {}
): Promise<T> {
  try {
    return await serverClient.fetch<T>(query, params, options);
  } catch (error: unknown) {
    const err = error as { message?: string; statusCode?: number };
    if (err?.message?.includes("Unauthorized") || err?.statusCode === 401) {
      console.warn(
        "serverClient fetch failed with Unauthorized token error. Retrying with client:",
        err.message
      );
      return await client.fetch<T>(query, params, options);
    }
    throw error;
  }
}

export async function getAllCourses(): Promise<Record<string, unknown>[]> {
  return (
    (await safeFetch<Record<string, unknown>[]>(
      GET_ALL_COURSES_QUERY,
      {},
      { next: { tags: ["courses", "catalog"], revalidate: 60 } }
    )) || []
  );
}

export async function getCourseBySlug(
  slug: string
): Promise<Record<string, unknown> | null> {
  const result = await safeFetch<Record<string, unknown> | null>(
    GET_COURSE_BY_SLUG_QUERY,
    { slug },
    { next: { tags: ["course", `course:${slug}`], revalidate: 60 } }
  );

  // If specific slug fails or returns null (e.g. nextjs-for-production vs nextjs-app-router-in-depth),
  // fallback to fetching first available course so pages render smoothly
  if (!result && slug) {
    const allCourses = (await getAllCourses()) as { slug?: string }[];
    if (allCourses && allCourses.length > 0) {
      const match = allCourses.find((c) => c.slug === slug) || allCourses[0];
      if (match?.slug) {
        return await safeFetch<Record<string, unknown> | null>(
          GET_COURSE_BY_SLUG_QUERY,
          { slug: match.slug },
          { next: { tags: ["course", `course:${match.slug}`], revalidate: 60 } }
        );
      }
    }
  }

  return result;
}

export async function getLessonBySlug(
  slug: string
): Promise<Record<string, unknown> | null> {
  return await safeFetch<Record<string, unknown> | null>(
    GET_LESSON_BY_SLUG_QUERY,
    { slug },
    { next: { tags: ["lesson", `lesson:${slug}`], revalidate: 60 } }
  );
}

export async function getAllInstructors(): Promise<Record<string, unknown>[]> {
  return (
    (await safeFetch<Record<string, unknown>[]>(
      GET_ALL_INSTRUCTORS_QUERY,
      {},
      { next: { tags: ["instructors"], revalidate: 300 } }
    )) || []
  );
}

export async function getInstructorBySlug(
  slug: string
): Promise<Record<string, unknown> | null> {
  return await safeFetch<Record<string, unknown> | null>(
    GET_INSTRUCTOR_BY_SLUG_QUERY,
    { slug },
    { next: { tags: ["instructor", `instructor:${slug}`], revalidate: 60 } }
  );
}

export async function getAllCategories(): Promise<Record<string, unknown>[]> {
  return (
    (await safeFetch<Record<string, unknown>[]>(
      GET_ALL_CATEGORIES_QUERY,
      {},
      { next: { tags: ["categories"], revalidate: 300 } }
    )) || []
  );
}
