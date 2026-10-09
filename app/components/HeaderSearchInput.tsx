"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchOutline } from "./Icons";
import posthog from "posthog-js";

interface HeaderSearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

function SearchInputForm({
  initialQuery = "",
  placeholder = "Search courses, topics, video moments...",
  className = "",
}: HeaderSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") || initialQuery;
  const [query, setQuery] = useState(queryFromUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    posthog.capture("search_performed", {
      query: trimmed,
      source: "header_input",
    });

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-md ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#FFEEE5] transition-all shadow-2xs"
      />
      <button
        type="submit"
        className="absolute left-3 p-1 text-[#64748B] hover:text-[#EA580C] transition-colors cursor-pointer"
        aria-label="Submit search"
      >
        <SearchOutline size={16} />
      </button>
    </form>
  );
}

export function HeaderSearchInput(props: HeaderSearchInputProps) {
  return (
    <Suspense
      fallback={
        <form className={`relative flex items-center w-full max-w-md ${props.className || ""}`}>
          <input
            type="text"
            defaultValue={props.initialQuery || ""}
            placeholder={props.placeholder || "Search courses, topics, video moments..."}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8]"
            disabled
          />
          <span className="absolute left-3 p-1 text-[#64748B]">
            <SearchOutline size={16} />
          </span>
        </form>
      }
    >
      <SearchInputForm {...props} />
    </Suspense>
  );
}

