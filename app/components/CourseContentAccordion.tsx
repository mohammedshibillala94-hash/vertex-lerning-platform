"use client";

import React, { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { ChevronDownIcon, PlayCircleIcon, LockIcon } from "./Icons";
import { formatDuration } from "@/app/utils";

export interface LessonItem {
  _id: string;
  title: string;
  slug: string;
  videoUrl?: string;
  duration?: number;
  isFreePreview?: boolean;
}

export interface ModuleItem {
  title: string;
  summary?: string;
  lessons?: LessonItem[];
}

interface CourseContentAccordionProps {
  modules: ModuleItem[];
  initialVisibleCount?: number;
}

export { formatDuration };

export function CourseContentAccordion({
  modules = [],
  initialVisibleCount = 6,
}: CourseContentAccordionProps) {
  // Store indexes of expanded modules. Default index 0 open.
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);
  const [showAll, setShowAll] = useState(false);

  const toggleModule = (index: number) => {
    const isExpanded = !openIndexes.includes(index);

    posthog.capture("course_module_toggled", {
      module_index: index + 1,
      lesson_count: modules[index]?.lessons?.length ?? 0,
      is_expanded: isExpanded,
    });

    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleShowAll = () => {
    const isExpanding = !showAll;
    setShowAll(isExpanding);

    if (isExpanding) {
      posthog.capture("course_content_expanded", {
        total_module_count: modules.length,
        initial_visible_module_count: initialVisibleCount,
      });
    }
  };

  const visibleModules = showAll ? modules : modules.slice(0, initialVisibleCount);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {visibleModules.map((module, idx) => {
          const isOpen = openIndexes.includes(idx);
          const moduleLessons = module.lessons || [];
          const moduleDurationSeconds = moduleLessons.reduce(
            (acc, l) => acc + (l.duration || 0),
            0
          );

          return (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleModule(idx)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#F8FAFC]/80 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#0F172A] font-semibold text-sm flex items-center justify-center shrink-0 select-none">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-sans font-semibold text-base text-[#0F172A] truncate">
                      {module.title}
                    </h4>
                    {module.summary && (
                      <p className="text-xs text-[#64748B] font-normal truncate mt-0.5">
                        {module.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-medium text-[#64748B] select-none">
                    {formatDuration(moduleDurationSeconds)}
                  </span>
                  <div
                    className={`text-[#64748B] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDownIcon size={18} />
                  </div>
                </div>
              </button>

              {isOpen && moduleLessons.length > 0 && (
                <div className="border-t border-[#F1F5F9] divide-y divide-[#F1F5F9] bg-[#FAFAFC]/40">
                  {moduleLessons.map((lesson) => (
                    <Link
                      key={lesson._id}
                      href={`/lessons/${lesson.slug}`}
                      onClick={() =>
                        posthog.capture("course_lesson_selected", {
                          lesson_slug: lesson.slug,
                          duration_seconds: lesson.duration ?? 0,
                          is_free_preview: Boolean(lesson.isFreePreview),
                        })
                      }
                      className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-[#F1F5F9]/60 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <PlayCircleIcon
                          size={18}
                          className="text-[#EA580C] shrink-0 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs sm:text-sm font-medium text-[#0F172A] group-hover:text-[#EA580C] transition-colors truncate">
                          {lesson.title}
                        </span>
                        {lesson.isFreePreview && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FFEEE5] text-[10px] font-bold text-[#EA580C] shrink-0">
                            FREE PREVIEW
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-[#64748B] font-medium">
                          {formatDuration(lesson.duration || 0)}
                        </span>
                        {!lesson.isFreePreview && (
                          <LockIcon size={14} className="text-[#94A3B8]" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modules.length > initialVisibleCount && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={toggleShowAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors shadow-2xs cursor-pointer"
          >
            <span>
              {showAll
                ? "Show fewer modules"
                : `Show all ${modules.length} modules`}
            </span>
            <ChevronDownIcon
              size={16}
              className={`transition-transform duration-200 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
