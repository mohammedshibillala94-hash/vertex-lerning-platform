"use client";

import React from "react";
import Link from "next/link";
import {
  PlayCircleFilled,
  ClockOutline,
  CheckCircleFilled,
  ExternalLinkIcon,
  LayersIcon,
} from "./Icons";
import { formatDuration } from "@/app/utils";
import posthog from "posthog-js";

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

interface SearchResultCardProps {
  item: SearchResultItem;
}

export function SearchResultCard({ item }: SearchResultCardProps) {
  const isVideoMoment = item.type === "video_moment";

  const handleCardClick = () => {
    posthog.capture("search_result_clicked", {
      type: item.type,
      lesson_slug: item.lessonSlug,
      course_slug: item.courseSlug,
      matched_second: item.matchedMoment?.second,
    });
  };

  if (isVideoMoment) {
    const startSecond = item.matchedMoment?.second || 0;
    const timestampLabel = item.matchedMoment?.timestampLabel || "00:00";
    const watchLink = `/lessons/${item.lessonSlug}?start=${startSecond}`;

    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start justify-between gap-6 shadow-2xs hover:border-[#FED7AA] hover:shadow-md transition-all group">
        {/* Left Column: Video Moment Summary */}
        <div className="space-y-3 flex-1 min-w-0">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#64748B]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#0F172A]">
              <LayersIcon size={14} className="text-[#EA580C]" />
              {item.courseTitle}
            </span>
            <span className="text-[#94A3B8]">•</span>
            <span className="text-[#64748B] font-medium truncate max-w-[280px]">
              {item.moduleLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors leading-snug">
            {item.title}
          </h3>

          {/* Matched Moment Callout */}
          <div className="bg-[#FFF7ED] border border-[#FED7AA]/80 rounded-xl p-3.5 flex items-start gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EA580C] text-white text-[11px] font-bold shrink-0">
              <ClockOutline size={12} />
              {timestampLabel}
            </span>
            <p className="text-xs sm:text-sm font-medium text-[#0F172A] leading-relaxed italic truncate">
              {item.matchedMoment?.label || item.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#64748B] pt-1">
            <span className="flex items-center gap-1.5">
              <ClockOutline size={14} className="text-[#94A3B8]" />
              Clip length: {formatDuration(item.duration || 0)}
            </span>
          </div>
        </div>

        {/* Right Column: Action CTA */}
        <div className="w-full md:w-auto shrink-0 flex md:flex-col justify-end items-stretch md:items-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1F5F9]">
          <Link
            href={watchLink}
            onClick={handleCardClick}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors shadow-sm cursor-pointer"
          >
            <PlayCircleFilled size={18} />
            <span>Watch from {timestampLabel}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Lesson Topic Result Card
  const lessonLink = `/lessons/${item.lessonSlug}`;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start justify-between gap-6 shadow-2xs hover:border-[#CBD5E1] hover:shadow-md transition-all group">
      {/* Left Column: Lesson Topic Details */}
      <div className="space-y-3 flex-1 min-w-0">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#64748B]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#0F172A]">
            <LayersIcon size={14} className="text-[#64748B]" />
            {item.courseTitle}
          </span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#64748B] font-medium truncate max-w-[280px]">
            {item.moduleLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors leading-snug">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Key Points */}
        {item.keyPoints && item.keyPoints.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {item.keyPoints.slice(0, 3).map((kp, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#0F172A]">
                <CheckCircleFilled size={14} className="text-[#EA580C] shrink-0 mt-0.5" />
                <span className="truncate">{kp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Action CTA */}
      <div className="w-full md:w-auto shrink-0 flex md:flex-col justify-end items-stretch md:items-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1F5F9]">
        <Link
          href={lessonLink}
          onClick={handleCardClick}
          className="w-full md:w-auto px-5 py-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
        >
          <span>View Lesson</span>
          <ExternalLinkIcon size={16} className="text-[#64748B]" />
        </Link>
      </div>
    </div>
  );
}
