"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchOutline } from "./Icons";
import posthog from "posthog-js";

interface SearchHeroInputProps {
  initialQuery?: string;
  className?: string;
}

export function SearchHeroInput({ initialQuery = "", className = "" }: SearchHeroInputProps) {
  const [query, setQuery] = useState(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  if (prevInitialQuery !== initialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    posthog.capture("search_performed", {
      query: trimmed,
      source: "search_hero",
    });

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-2xl mx-auto flex items-center bg-white border border-[#E2E8F0] rounded-xl px-4 py-3.5 shadow-xs focus-within:border-[#CBD5E1] focus-within:shadow-sm transition-all group ${className}`}
    >
      <div className="text-[#94A3B8] group-focus-within:text-[#0F172A] transition-colors shrink-0 mr-3">
        <SearchOutline size={20} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses, lessons, topics..."
        className="flex-1 bg-transparent text-sm sm:text-base text-[#0F172A] placeholder-[#94A3B8] font-normal focus:outline-none min-w-0"
      />

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded-md shadow-2xs select-none">
          ⌘ K
        </kbd>
      </div>
    </form>
  );
}
