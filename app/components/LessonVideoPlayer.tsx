"use client";

import React from "react";
import { getVideoEmbedUrl } from "@/app/utils";

interface LessonVideoPlayerProps {
  videoUrl?: string;
  title?: string;
  startSeconds?: number;
}

export function LessonVideoPlayer({
  videoUrl = "",
  title = "Lesson Video",
  startSeconds,
}: LessonVideoPlayerProps) {
  const embedUrl = getVideoEmbedUrl(videoUrl, startSeconds);

  if (!embedUrl) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-[#0F172A] border border-[#E2E8F0] shadow-md flex items-center justify-center text-white">
        <p className="text-sm font-medium text-[#94A3B8]">
          No video URL configured for this lesson.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md bg-[#0F172A] relative group">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
