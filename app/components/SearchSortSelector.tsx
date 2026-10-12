"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "./Icons";

interface SearchSortSelectorProps {
  query: string;
  currentSort: string;
}

export function SearchSortSelector({ query, currentSort }: SearchSortSelectorProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    router.push(`/search?q=${encodeURIComponent(query)}&sort=${newSort}`);
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        id="search-sort"
        name="sort"
        value={currentSort}
        onChange={handleChange}
        className="appearance-none h-9 pl-3.5 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-xs sm:text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] focus:outline-none focus:border-[#CBD5E1] shadow-2xs cursor-pointer transition-colors"
      >
        <option value="relevance">Most Relevant</option>
        <option value="duration">Shortest duration</option>
        <option value="title">Alphabetical</option>
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B]">
        <ChevronDownIcon size={14} />
      </div>
    </div>
  );
}
