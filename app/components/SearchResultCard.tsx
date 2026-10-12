"use client";

import React from "react";
import Link from "next/link";
import {
  DocumentOutline,
  FolderOutline,
  CheckIcon,
  ChevronRightOutline,
  ExternalLinkIcon,
  PlayFilled,
  PlayCircleFilled,
  NextjsBrandIcon,
  ReactBrandIcon,
  NodejsBrandIcon,
  JavascriptBrandIcon,
  PythonBrandIcon,
  LayersIcon,
} from "./Icons";
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
  rankPosition?: number;
}

function CourseBrandIcon({ courseTitle, courseSlug }: { courseTitle: string; courseSlug: string }) {
  const lower = `${courseTitle} ${courseSlug}`.toLowerCase();
  if (lower.includes("next")) {
    return <NextjsBrandIcon size={18} />;
  }
  if (lower.includes("react")) {
    return <ReactBrandIcon size={18} />;
  }
  if (lower.includes("node")) {
    return <NodejsBrandIcon size={18} />;
  }
  if (lower.includes("javascript") || lower.includes("js")) {
    return <JavascriptBrandIcon size={18} />;
  }
  if (lower.includes("python")) {
    return <PythonBrandIcon size={18} />;
  }
  return (
    <div className="w-[18px] h-[18px] rounded-[4px] bg-[#334155] text-white flex items-center justify-center">
      <LayersIcon size={12} />
    </div>
  );
}

function parseModuleLabel(rawLabel: string) {
  const match = rawLabel.match(/Lesson\s+(\d+(?:\.\d+)?)\s+in\s+(.+)/i);
  if (match) {
    const lessonNum = match[1];
    const modTitle = match[2];
    const modNum = lessonNum.split(".")[0];
    return {
      lessonNumber: `Lesson ${lessonNum}`,
      moduleTitle: modTitle,
      moduleOnly: `Module ${modNum}`,
    };
  }
  return {
    lessonNumber: rawLabel,
    moduleTitle: rawLabel,
    moduleOnly: rawLabel,
  };
}

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds) return "00:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Graphic preview for video cards matching the design screenshot
function VideoThumbnailGraphic({ item }: { item: SearchResultItem }) {
  const lower = `${item.courseTitle} ${item.title}`.toLowerCase();

  if (lower.includes("next")) {
    return (
      <div className="w-full h-full bg-[#050505] flex items-center justify-center relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0,transparent_70%)]" />
        <span className="text-white/20 font-black text-6xl tracking-tighter">N</span>
      </div>
    );
  }

  if (lower.includes("react")) {
    return (
      <div className="w-full h-full bg-[#0a0f1d] p-3 text-[9px] font-mono text-[#94a3b8] leading-tight flex flex-col justify-center select-none overflow-hidden relative">
        <div className="text-[#38bdf8]">{"function DataFetch() {"}</div>
        <div className="pl-2 text-[#cbd5e1]">{"useEffect(() => {"}</div>
        <div className="pl-4 text-[#fbbf24]">{"fetchData().then(...)"}</div>
        <div className="pl-2 text-[#cbd5e1]">{"}, [])"}</div>
        <div className="text-[#38bdf8]">{"}"}</div>
      </div>
    );
  }

  if (lower.includes("node") || lower.includes("api") || lower.includes("rest")) {
    return (
      <div className="w-full h-full bg-[#F8FAFC] flex items-center justify-center p-3 select-none">
        <div className="flex items-center gap-1.5 text-[9px] font-medium text-[#475569]">
          <div className="px-1.5 py-1 rounded bg-white border border-[#CBD5E1] text-[#0284C7] font-semibold">Client</div>
          <span className="text-[#94A3B8] text-[8px]">──▶</span>
          <div className="px-1.5 py-1 rounded bg-white border border-[#CBD5E1] text-[#16A34A] font-semibold">API</div>
          <span className="text-[#94A3B8] text-[8px]">──▶</span>
          <div className="px-1.5 py-1 rounded bg-white border border-[#CBD5E1] text-[#EA580C] font-semibold">Database</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#090D16] p-3 text-[9px] font-mono text-[#94A3B8] leading-tight flex flex-col justify-center select-none overflow-hidden relative">
      <div className="text-[#F59E0B]">{"const data = await fetch('/api')"}</div>
      <div className="pl-2 text-[#38BDF8]">{"  .then(res => res.json())"}</div>
      <div className="pl-2 text-[#EF4444]">{"  .catch(err => error(err))"}</div>
    </div>
  );
}

export function SearchResultCard({ item, rankPosition }: SearchResultCardProps) {
  const isVideoMoment = item.type === "video_moment";
  const { lessonNumber, moduleTitle, moduleOnly } = parseModuleLabel(item.moduleLabel);

  const handleCardClick = () => {
    posthog.capture("search_result_opened", {
      result_type: item.type,
      result_title: item.title,
      lesson_slug: item.lessonSlug,
      course_slug: item.courseSlug,
      course_title: item.courseTitle,
      module_label: item.moduleLabel,
      matched_second: item.matchedMoment?.second,
      timestamp_label: item.matchedMoment?.timestampLabel,
      rank_position: rankPosition,
    });
  };

  // 1. VIDEO RESULT CARD
  if (isVideoMoment) {
    const startSecond = item.matchedMoment?.second || 0;
    const timestampLabel = item.matchedMoment?.timestampLabel || formatDuration(startSecond);
    const watchLink = `/lessons/${item.lessonSlug}?start=${startSecond}`;
    const durationLabel = item.duration ? formatDuration(item.duration) : timestampLabel;

    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 shadow-2xs hover:shadow-md transition-shadow group">
        {/* Left Video Thumbnail (240px x 140px on desktop) */}
        <Link
          href={watchLink}
          onClick={handleCardClick}
          className="w-full md:w-[240px] h-[140px] rounded-xl bg-[#090D16] relative overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
        >
          <VideoThumbnailGraphic item={item} />

          {/* Central Translucent Frosted Play Button */}
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform absolute z-10">
            <PlayFilled size={16} className="translate-x-0.5 text-white" />
          </div>

          {/* Bottom Right Duration Badge */}
          <span className="bg-black/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md absolute bottom-2.5 right-2.5 tracking-tight z-10">
            {durationLabel}
          </span>
        </Link>

        {/* Right Info Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0 space-y-2.5">
          {/* Header Row: Course Chip + VIDEO Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <CourseBrandIcon courseTitle={item.courseTitle} courseSlug={item.courseSlug} />
              <span className="text-xs font-semibold text-[#64748B] truncate">
                {item.courseTitle}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFF1EB] text-[#EA580C] text-[10px] font-bold tracking-wider uppercase shrink-0">
              VIDEO
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors leading-snug">
            <Link href={watchLink} onClick={handleCardClick}>
              {item.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {/* Footer Metadata & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F8FAFC]">
            <div className="flex items-center gap-2 text-xs text-[#64748B] min-w-0">
              <DocumentOutline size={14} className="text-[#64748B] shrink-0" />
              <span className="font-medium shrink-0">{lessonNumber}</span>
              <span className="text-[#CBD5E1]">·</span>
              <FolderOutline size={14} className="text-[#64748B] shrink-0" />
              <span className="font-medium truncate">{moduleTitle}</span>
            </div>

            <Link
              href={watchLink}
              onClick={handleCardClick}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors cursor-pointer shrink-0"
            >
              <PlayCircleFilled size={15} className="text-[#EA580C]" />
              <span>Watch from {timestampLabel}</span>
              <ChevronRightOutline size={13} className="text-[#EA580C] stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. LESSON RESULT CARD
  const lessonLink = `/lessons/${item.lessonSlug}`;
  const displayKeyPoints = item.keyPoints && item.keyPoints.length > 0
    ? item.keyPoints.slice(0, 3)
    : ["Core implementation patterns", "Production best practices", "Hands-on exercises"];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 shadow-2xs hover:shadow-md transition-shadow group">
      {/* Left Concept Summary Box (240px x 140px on desktop) */}
      <Link
        href={lessonLink}
        onClick={handleCardClick}
        className="w-full md:w-[240px] h-[140px] rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] p-4 relative flex flex-col justify-between shrink-0 cursor-pointer"
      >
        <div className="text-[#64748B]">
          <DocumentOutline size={18} />
        </div>

        <div className="space-y-1 my-auto pr-4">
          {displayKeyPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-[#475569] font-medium leading-tight">
              <span className="text-[#94A3B8]">•</span>
              <span className="line-clamp-1">{point}</span>
            </div>
          ))}
        </div>

        {/* Dark Circular Checkmark Badge in bottom right */}
        <div className="w-5 h-5 rounded-full bg-[#334155] text-white flex items-center justify-center absolute bottom-3 right-3 shadow-2xs">
          <CheckIcon size={12} />
        </div>
      </Link>

      {/* Right Info Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0 space-y-2.5">
        {/* Header Row: Course Chip + LESSON Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <CourseBrandIcon courseTitle={item.courseTitle} courseSlug={item.courseSlug} />
            <span className="text-xs font-semibold text-[#64748B] truncate">
              {item.courseTitle}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#6366F1] text-[10px] font-bold tracking-wider uppercase shrink-0">
            LESSON
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors leading-snug">
          <Link href={lessonLink} onClick={handleCardClick}>
            {item.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Footer Metadata & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F8FAFC]">
          <div className="text-xs text-[#64748B] font-medium">
            {moduleOnly}
          </div>

          <Link
            href={lessonLink}
            onClick={handleCardClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors cursor-pointer shrink-0"
          >
            <span>View lesson</span>
            <ExternalLinkIcon size={13} className="text-[#EA580C]" />
            <ChevronRightOutline size={13} className="text-[#EA580C] stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
