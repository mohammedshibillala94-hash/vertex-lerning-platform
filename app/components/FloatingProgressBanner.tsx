"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { ArrowRightIcon } from "./Icons";

export function PostHogUserIdentification() {
  const { isLoaded, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      if (identifiedUserId.current) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    if (identifiedUserId.current && identifiedUserId.current !== user.id) {
      posthog.reset();
    }

    if (identifiedUserId.current !== user.id) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      });
      identifiedUserId.current = user.id;
    }
  }, [isLoaded, user]);

  return null;
}

interface FloatingProgressBannerProps {
  firstLessonSlug?: string;
  progressPercent?: number;
}

interface CourseLearningStartLinkProps {
  firstLessonSlug: string;
}

export function CourseLearningStartLink({
  firstLessonSlug,
}: CourseLearningStartLinkProps) {
  const targetHref = firstLessonSlug ? `/lessons/${firstLessonSlug}` : "#";

  return (
    <Link
      href={targetHref}
      onClick={() => {
        if (firstLessonSlug) {
          posthog.capture("course_learning_started", {
            has_lesson_target: true,
          });
        }
      }}
      className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-medium text-sm shadow-md shadow-[#EA580C]/15 transition-all cursor-pointer"
    >
      <span>Continue Learning</span>
      <ArrowRightIcon size={16} />
    </Link>
  );
}

export function FloatingProgressBanner({
  firstLessonSlug = "",
  progressPercent = 35,
}: FloatingProgressBannerProps) {
  const targetHref = firstLessonSlug
    ? `/lessons/${firstLessonSlug}`
    : "#";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[1440px] w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] mx-auto z-40">
      <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 sm:px-6 sm:py-4 shadow-xl shadow-[#0F172A]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Progress info */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="space-y-0.5 shrink-0">
            <p className="text-[11px] font-medium text-[#64748B]">Your Progress</p>
            <p className="text-sm font-bold text-[#0F172A]">{progressPercent}% complete</p>
          </div>
          <div className="flex-1 sm:w-56 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#EA580C] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="w-full sm:w-auto flex justify-end">
          <Link
            href={targetHref}
            onClick={() =>
              posthog.capture("learning_continued", {
                progress_percent: progressPercent,
                has_lesson_target: Boolean(firstLessonSlug),
              })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-medium text-sm shadow-md shadow-[#EA580C]/15 transition-all cursor-pointer"
          >
            <span>Continue Learning</span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
