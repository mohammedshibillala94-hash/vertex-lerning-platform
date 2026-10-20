"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { getVideoEmbedUrl } from "@/app/utils";
import posthog from "posthog-js";
import { ClockOutline, PlayFilled, PlayCircleFilled } from "./Icons";

export interface ChapterItem {
  startSeconds: number;
  label: string;
}

interface LessonVideoPlayerProps {
  videoUrl?: string;
  title?: string;
  startSeconds?: number;
  lessonSlug?: string;
  courseSlug?: string;
  durationSeconds?: number;
  chapters?: ChapterItem[];
}

function detectVideoProvider(url: string): string {
  if (!url) return "unknown";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("mediadelivery.net")) return "bunny";
  return "embed";
}

function formatTimestamp(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) return "00:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function LessonVideoPlayer({
  videoUrl = "",
  title = "Lesson Video",
  startSeconds,
  lessonSlug = "",
  courseSlug = "",
  durationSeconds = 0,
  chapters = [],
}: LessonVideoPlayerProps) {
  const embedUrl = getVideoEmbedUrl(videoUrl, startSeconds);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const hasFiredPlay = useRef(false);
  const hasFiredResume = useRef(false);
  const hasFiredCompleted = useRef(false);
  const triggeredMilestones = useRef<Set<number>>(new Set());

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(() => {
    if (startSeconds && chapters && chapters.length > 0) {
      let foundIdx = 0;
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].startSeconds <= startSeconds) {
          foundIdx = i;
        }
      }
      return foundIdx;
    }
    return 0;
  });
  const currentPlaybackSeconds = useRef<number>(startSeconds || 0);
  const videoDuration = useRef<number>(durationSeconds || 300);

  // Command the embedded player to seek to a specific second
  const seekToSecond = useCallback(
    (sec: number) => {
      currentPlaybackSeconds.current = sec;
      const provider = detectVideoProvider(videoUrl);

      if (iframeRef.current?.contentWindow) {
        if (provider === "youtube") {
          // YouTube Player API postMessage command
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: "seekTo",
              args: [sec, true],
            }),
            "*"
          );
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: "playVideo",
              args: [],
            }),
            "*"
          );
        } else if (provider === "vimeo") {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              method: "setCurrentTime",
              value: sec,
            }),
            "*"
          );
        }
      }
    },
    [videoUrl]
  );

  // Seek embedded player if startSeconds is passed
  useEffect(() => {
    if (startSeconds !== undefined && startSeconds > 0) {
      seekToSecond(startSeconds);
    }
  }, [startSeconds, seekToSecond]);

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

  // Handle manual chapter clicking on-site
  const handleChapterClick = (sec: number, label: string, index: number) => {
    setActiveChapterIndex(index);
    seekToSecond(sec);

    // Update URL parameter without full page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("start", String(sec));
      window.history.replaceState(null, "", url.toString());
    }

    posthog.capture("resume_used", {
      lesson_slug: lessonSlug,
      course_slug: courseSlug,
      resume_second: sec,
      chapter_label: label,
      source: "chapter_click",
    });
  };

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

      // YouTube onReady
      if (data.event === "onReady" && startSeconds && startSeconds > 0) {
        seekToSecond(startSeconds);
      }

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

            // Sync active chapter with playback time
            if (chapters && chapters.length > 0) {
              let curIdx = 0;
              for (let i = 0; i < chapters.length; i++) {
                if (chapters[i].startSeconds <= info.currentTime) {
                  curIdx = i;
                }
              }
              setActiveChapterIndex(curIdx);
            }
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      clearInterval(handshakeInterval);
      window.removeEventListener("message", handleMessage);
    };
  }, [videoUrl, title, lessonSlug, courseSlug, startSeconds, durationSeconds, chapters, seekToSecond]);

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
    <div className="space-y-4">
      {/* 1. Embed Player Container */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md bg-[#0F172A] relative group">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => {
            // Send handshake and seek immediately on iframe load
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: "listening" }),
                "*"
              );
              if (startSeconds && startSeconds > 0) {
                setTimeout(() => seekToSecond(startSeconds), 600);
              }
            }
          }}
        />
      </div>

      {/* 2. Interactive Chapters Table of Contents */}
      {chapters && chapters.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFEEE5] text-[#EA580C] flex items-center justify-center">
                <ClockOutline size={15} />
              </div>
              <h3 className="font-sans font-bold text-sm text-[#0F172A]">
                Video Chapters
              </h3>
              <span className="text-xs text-[#94A3B8] font-medium">
                ({chapters.length} moments)
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#64748B]">
              Jump directly to any topic in this lesson
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {chapters.map((chap, idx) => {
              const isCurrent = activeChapterIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChapterClick(chap.startSeconds, chap.label, idx)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                    isCurrent
                      ? "bg-[#FFF7ED] border-[#FED7AA] text-[#EA580C] shadow-2xs ring-1 ring-[#EA580C]/20"
                      : "bg-[#F8FAFC] border-[#F1F5F9] hover:bg-white hover:border-[#CBD5E1] text-[#0F172A]"
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold shrink-0 ${
                      isCurrent
                        ? "bg-[#EA580C] text-white"
                        : "bg-white border border-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {formatTimestamp(chap.startSeconds)}
                  </span>
                  <span className="text-xs font-semibold truncate flex-1 leading-snug">
                    {chap.label}
                  </span>
                  {isCurrent ? (
                    <PlayCircleFilled size={15} className="text-[#EA580C] shrink-0" />
                  ) : (
                    <PlayFilled size={11} className="text-[#94A3B8] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
