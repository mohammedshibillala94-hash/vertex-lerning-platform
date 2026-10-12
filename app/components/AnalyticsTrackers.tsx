"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { ArrowRightIcon } from "./Icons";

export function SearchPageAnalyticsTracker({
  query,
  sort,
  totalResults,
  courseCount,
}: {
  query: string;
  sort: string;
  totalResults: number;
  courseCount: number;
}) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    posthog.capture("search_performed", {
      query,
      sort_by: sort,
      result_count: totalResults,
      course_count: courseCount,
      source: "search_page",
    });
  }, [query, sort, totalResults, courseCount]);

  return null;
}

export function CoursePageAnalyticsTracker({
  courseSlug,
  courseTitle,
  level,
  moduleCount,
  totalLessons,
}: {
  courseSlug: string;
  courseTitle: string;
  level?: string;
  moduleCount?: number;
  totalLessons?: number;
}) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    posthog.capture("course_viewed", {
      course_slug: courseSlug,
      course_title: courseTitle,
      level: level || "All Levels",
      module_count: moduleCount || 0,
      total_lessons: totalLessons || 0,
    });
  }, [courseSlug, courseTitle, level, moduleCount, totalLessons]);

  return null;
}

export function CatalogPageAnalyticsTracker({
  courseCount,
}: {
  courseCount: number;
}) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    posthog.capture("catalog_viewed", {
      course_count: courseCount,
    });
  }, [courseCount]);

  return null;
}

export function LessonPageAnalyticsTracker({
  lessonSlug,
  lessonTitle,
  courseSlug,
  moduleTitle,
  hasStartParam,
  durationSeconds,
}: {
  lessonSlug: string;
  lessonTitle: string;
  courseSlug?: string;
  moduleTitle?: string;
  hasStartParam?: boolean;
  durationSeconds?: number;
}) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    posthog.capture("lesson_viewed", {
      lesson_slug: lessonSlug,
      lesson_title: lessonTitle,
      course_slug: courseSlug || "",
      module_title: moduleTitle || "",
      has_start_param: Boolean(hasStartParam),
      duration_seconds: durationSeconds || 0,
    });
  }, [lessonSlug, lessonTitle, courseSlug, moduleTitle, hasStartParam, durationSeconds]);

  return null;
}

export function LessonNextButton({
  href,
  lessonTitle,
  lessonSlug,
  courseSlug,
  nextLessonTitle,
  durationSeconds,
}: {
  href: string;
  lessonTitle: string;
  lessonSlug: string;
  courseSlug: string;
  nextLessonTitle: string;
  durationSeconds?: number;
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        posthog.capture("lesson_completed", {
          lesson_slug: lessonSlug,
          lesson_title: lessonTitle,
          course_slug: courseSlug,
          duration_seconds: durationSeconds || 0,
          completion_trigger: "next_lesson",
        });
      }}
      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-md group cursor-pointer"
    >
      <div className="text-right">
        <span className="block text-[11px] font-medium opacity-90">
          Next Lesson
        </span>
        <span>{nextLessonTitle}</span>
      </div>
      <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
