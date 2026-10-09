"use client";

import React, { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import {
  ArrowLeftOutline,
  ChevronDownIcon,
  CheckCircleFilled,
  PlayCircleFilled,
} from "./Icons";
import { formatDuration } from "@/app/utils";

export interface LessonSidebarItem {
  _id: string;
  title: string;
  slug: string;
  duration?: number;
  isFreePreview?: boolean;
}

export interface ModuleSidebarItem {
  title: string;
  summary?: string;
  lessons?: LessonSidebarItem[];
}

interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  modules: ModuleSidebarItem[];
  currentLessonSlug: string;
  progressPercent?: number;
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  modules = [],
  currentLessonSlug,
  progressPercent = 35,
}: LessonSidebarProps) {
  // Find which module index contains the current lesson
  const activeModuleIndex = modules.findIndex((m) =>
    m.lessons?.some((l) => l.slug === currentLessonSlug)
  );

  // Initialize open indexes with active module index (defaulting to 0 if not found)
  const initialOpenIndex = activeModuleIndex >= 0 ? activeModuleIndex : 0;
  const [openIndexes, setOpenIndexes] = useState<number[]>([initialOpenIndex]);

  const toggleModule = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const totalModules = modules.length;

  return (
    <aside className="w-full bg-[#FAFAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 space-y-6 shadow-2xs">
      {/* Back to Course Link */}
      <div>
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#EA580C] hover:text-[#D97706] transition-colors group"
        >
          <ArrowLeftOutline size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to course</span>
        </Link>
      </div>

      {/* Course Summary Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white font-serif text-xl font-bold flex items-center justify-center shrink-0 select-none">
          {courseTitle.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-sans font-bold text-sm text-[#0F172A] truncate">
            {courseTitle}
          </h3>
          <p className="text-xs font-medium text-[#64748B] mt-0.5">
            {progressPercent}% complete
          </p>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((module, mIdx) => {
          const isOpen = openIndexes.includes(mIdx);
          const moduleLessons = module.lessons || [];
          const moduleDuration = moduleLessons.reduce((acc, l) => acc + (l.duration || 0), 0);
          const isCurrentModule = mIdx === activeModuleIndex;

          return (
            <div
              key={mIdx}
              className={`bg-white border rounded-xl overflow-hidden transition-colors ${
                isCurrentModule
                  ? "border-[#FED7AA] bg-[#FFFBF7]"
                  : "border-[#E2E8F0]"
              }`}
            >
              {/* Module Accordion Header */}
              <button
                type="button"
                onClick={() => toggleModule(mIdx)}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Module {mIdx + 1} of {totalModules}
                  </span>
                  <h4 className="font-sans font-semibold text-xs sm:text-sm text-[#0F172A] truncate mt-0.5">
                    {module.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-medium text-[#94A3B8]">
                    {formatDuration(moduleDuration)}
                  </span>
                  <div
                    className={`text-[#64748B] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDownIcon size={16} />
                  </div>
                </div>
              </button>

              {/* Module Lessons List */}
              {isOpen && moduleLessons.length > 0 && (
                <div className="border-t border-[#F1F5F9] divide-y divide-[#F1F5F9] bg-white">
                  {moduleLessons.map((lesson, lIdx) => {
                    const isActive = lesson.slug === currentLessonSlug;
                    // Mock completed indicator for preceding lessons or active module
                    const isCompleted = mIdx < activeModuleIndex || (mIdx === activeModuleIndex && lIdx === 0 && !isActive);

                    return (
                      <Link
                        key={lesson._id}
                        href={`/lessons/${lesson.slug}`}
                        onClick={() => {
                          posthog.capture("course_lesson_selected", {
                            lesson_slug: lesson.slug,
                            module_index: mIdx + 1,
                            duration_seconds: lesson.duration ?? 0,
                          });
                        }}
                        className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                          isActive
                            ? "bg-[#FFEEE5]/60 text-[#EA580C]"
                            : "hover:bg-[#F8FAFC] text-[#0F172A]"
                        }`}
                      >
                        {/* Icon */}
                        <div className="mt-0.5 shrink-0">
                          {isActive ? (
                            <PlayCircleFilled size={18} className="text-[#EA580C]" />
                          ) : isCompleted ? (
                            <CheckCircleFilled size={18} className="text-[#EA580C]" />
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-[#CBD5E1] flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p
                            className={`text-xs sm:text-sm font-medium leading-snug truncate ${
                              isActive ? "font-bold text-[#EA580C]" : "text-[#0F172A]"
                            }`}
                          >
                            {lesson.title}
                          </p>

                          {isActive ? (
                            <span className="inline-block text-[11px] font-bold text-[#EA580C]">
                              Now playing
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-[#64748B]">
                              {formatDuration(lesson.duration || 0)}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
