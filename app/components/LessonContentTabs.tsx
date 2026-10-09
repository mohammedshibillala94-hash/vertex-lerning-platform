"use client";

import React, { useState } from "react";
import { PortableTextRenderer } from "./PortableTextRenderer";
import {
  CheckCircleFilled,
  LightbulbOutline,
  DocumentOutline,
  ExternalLinkIcon,
  GitHubIcon,
} from "./Icons";

export interface KeyPointItem {
  title?: string;
  description?: string;
}

export interface ResourceItem {
  type?: string;
  title: string;
  description?: string;
  url: string;
}

interface LessonContentTabsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes?: any;
  keyPoints?: (string | KeyPointItem)[];
  proTip?: string;
  resources?: ResourceItem[];
}

export function LessonContentTabs({
  notes,
  keyPoints = [],
  proTip,
  resources = [],
}: LessonContentTabsProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");

  return (
    <div className="space-y-8">
      {/* Tabs Header */}
      <div className="border-b border-[#E2E8F0] flex items-center gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`pb-3.5 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "content"
              ? "text-[#EA580C]"
              : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          Lesson Content
          {activeTab === "content" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EA580C] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`pb-3.5 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "notes"
              ? "text-[#EA580C]"
              : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          Notes
          {activeTab === "notes" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EA580C] rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Panel Content */}
      {activeTab === "content" ? (
        <div className="space-y-10">
          {/* Overview Section */}
          {notes && (
            <section className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">
                Overview
              </h3>
              <PortableTextRenderer value={notes} />
            </section>
          )}

          {/* Key Points Checklist Section */}
          {keyPoints && keyPoints.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-sans font-bold text-base text-[#0F172A]">
                In this lesson you will:
              </h3>
              <div className="space-y-3">
                {keyPoints.map((kp, idx) => {
                  const text = typeof kp === "string" ? kp : kp.title || kp.description || "";
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircleFilled
                        size={20}
                        className="text-[#EA580C] shrink-0 mt-0.5"
                      />
                      <span className="text-sm font-medium text-[#0F172A] leading-snug">
                        {text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Pro Tip Box */}
          {proTip && (
            <section className="bg-[#FFF7ED] border border-[#FED7AA]/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFEEE5] text-[#EA580C] flex items-center justify-center shrink-0">
                <LightbulbOutline size={22} />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-sans font-bold text-sm text-[#0F172A]">
                  Pro Tip
                </h4>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {proTip}
                </p>
              </div>
            </section>
          )}

          {/* Resources Section */}
          {resources && resources.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">
                Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resources.map((res, idx) => {
                  const isGithub =
                    res.type === "github" ||
                    res.title?.toLowerCase().includes("repository") ||
                    res.url?.includes("github.com");

                  return (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs hover:border-[#CBD5E1] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center border border-[#E2E8F0] shrink-0">
                          {isGithub ? (
                            <GitHubIcon size={18} />
                          ) : (
                            <DocumentOutline size={18} className="text-[#EA580C]" />
                          )}
                        </div>
                        <ExternalLinkIcon
                          size={16}
                          className="text-[#94A3B8] group-hover:text-[#0F172A] transition-colors"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#EA580C] transition-colors truncate">
                          {res.title}
                        </h4>
                        {res.description && (
                          <p className="text-[11px] text-[#64748B] line-clamp-2 leading-snug">
                            {res.description}
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Presentational Notes Tab */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center space-y-3">
          <h4 className="font-sans font-bold text-base text-[#0F172A]">
            Personal Notes
          </h4>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
            Take notes during your lesson. Personal notes are saved locally to your profile as you watch.
          </p>
        </div>
      )}
    </div>
  );
}
