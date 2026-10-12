"use client";

import React, { useEffect, useRef, useState } from "react";
import { getVideoEmbedUrl } from "@/app/utils";
import posthog from "posthog-js";

interface LessonVideoPlayerProps {
  videoUrl?: string;
  title?: string;
  startSeconds?: number;
  lessonSlug?: string;
  courseSlug?: string;
  durationSeconds?: number;
}

function detectVideoProvider(url: string): string {
  if (!url) return "unknown";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("mediadelivery.net")) return "bunny";
  return "embed";
}

export function LessonVideoPlayer({
  videoUrl = "",
  title = "Lesson Video",
  startSeconds,
  lessonSlug = "",
  courseSlug = "",
  durationSeconds = 0,
}: LessonVideoPlayerProps) {
  const embedUrl = getVideoEmbedUrl(videoUrl, startSeconds);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const hasFiredPlay = useRef(false);
  const hasFiredResume = useRef(false);
  const hasFiredCompleted = useRef(false);
  const triggeredMilestones = useRef<Set<number>>(new Set());

  const [isPlaying, setIsPlaying] = useState(false);
  const currentPlaybackSeconds = useRef<number>(startSeconds || 0);
  const videoDuration = useRef<number>(durationSeconds || 300);

  // If startSeconds is provided, fire resume_used on initial mount
  useEffect(() => {
    if (startSeconds && startSeconds > 0 && !hasFiredResume.current) {
      hasFiredResume.current = true;
      posthog.capture("resume_used", {
        lesson_slug: lessonSlug,
        course_slug: courseSlug,
        resume_second: startSeconds,
        source: "url_parameter",
      });
    }
  }, [startSeconds, lessonSlug, courseSlug]);

  // YouTube IFrame API PostMessage Listener
  useEffect(() => {
    const provider = detectVideoProvider(videoUrl);

    // Tell YouTube iframe to begin emitting events
    const handshakeInterval = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "listening" }),
          "*"
        );
      }
    }, 1000);

    const handleMessage = (event: MessageEvent) => {
      let data: Record<string, unknown> | null = null;
      try {
        if (typeof event.data === "string") {
          data = JSON.parse(event.data);
        } else if (typeof event.data === "object" && event.data !== null) {
          data = event.data as Record<string, unknown>;
        }
      } catch {
        return;
      }

      if (!data) return;

      // YouTube onStateChange
      // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
      if (data.event === "onStateChange") {
        const state = Number(data.info);
        if (state === 1) {
          setIsPlaying(true);
          if (!hasFiredPlay.current) {
            hasFiredPlay.current = true;
            posthog.capture("video_played", {
              lesson_slug: lessonSlug,
              lesson_title: title,
              course_slug: courseSlug,
              video_provider: provider,
              start_seconds: startSeconds || 0,
              is_resumed: Boolean(startSeconds && startSeconds > 0),
              duration_seconds: videoDuration.current,
            });
          }
        } else if (state === 2) {
          setIsPlaying(false);
        } else if (state === 0) {
          setIsPlaying(false);
          // 100% milestone
          if (!triggeredMilestones.current.has(100)) {
            triggeredMilestones.current.add(100);
            posthog.capture("video_watch_depth", {
              lesson_slug: lessonSlug,
              lesson_title: title,
              current_seconds: videoDuration.current,
              duration_seconds: videoDuration.current,
              depth_percentage: 100,
            });
          }
          if (!hasFiredCompleted.current) {
            hasFiredCompleted.current = true;
            posthog.capture("lesson_completed", {
              lesson_slug: lessonSlug,
              lesson_title: title,
              course_slug: courseSlug,
              duration_seconds: videoDuration.current,
              completion_trigger: "video_ended",
            });
          }
        }
      }

      // YouTube infoDelivery gives currentTime & duration
      if (data.event === "infoDelivery") {
        const info = data.info as Record<string, unknown> | undefined;
        if (info) {
          if (typeof info.duration === "number" && info.duration > 0) {
            videoDuration.current = info.duration;
          }
          if (typeof info.currentTime === "number") {
            currentPlaybackSeconds.current = info.currentTime;
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      clearInterval(handshakeInterval);
      window.removeEventListener("message", handleMessage);
    };
  }, [videoUrl, title, lessonSlug, courseSlug, startSeconds, durationSeconds]);

  // Periodic watch depth tracker while video is playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      currentPlaybackSeconds.current += 1;
      const current = currentPlaybackSeconds.current;
      const duration = videoDuration.current > 0 ? videoDuration.current : (durationSeconds || 300);
      const percent = Math.min(100, Math.floor((current / duration) * 100));

      const milestones = [25, 50, 75, 90];
      for (const m of milestones) {
        if (percent >= m && !triggeredMilestones.current.has(m)) {
          triggeredMilestones.current.add(m);
          posthog.capture("video_watch_depth", {
            lesson_slug: lessonSlug,
            lesson_title: title,
            current_seconds: Math.floor(current),
            duration_seconds: duration,
            depth_percentage: m,
          });
        }
      }

      if (percent >= 100 && !hasFiredCompleted.current) {
        hasFiredCompleted.current = true;
        if (!triggeredMilestones.current.has(100)) {
          triggeredMilestones.current.add(100);
          posthog.capture("video_watch_depth", {
            lesson_slug: lessonSlug,
            lesson_title: title,
            current_seconds: duration,
            duration_seconds: duration,
            depth_percentage: 100,
          });
        }
        posthog.capture("lesson_completed", {
          lesson_slug: lessonSlug,
          lesson_title: title,
          course_slug: courseSlug,
          duration_seconds: duration,
          completion_trigger: "video_ended",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, lessonSlug, title, courseSlug, durationSeconds]);

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
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => {
          // Send handshake immediately on iframe load
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({ event: "listening" }),
              "*"
            );
          }
        }}
      />
    </div>
  );
}
