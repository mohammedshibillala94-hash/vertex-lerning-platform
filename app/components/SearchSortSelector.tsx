"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center gap-3 shrink-0">
      <label htmlFor="search-sort" className="text-xs font-semibold text-[#64748B]">
        Sort by:
      </label>
      <select
        id="search-sort"
        name="sort"
        value={currentSort}
        onChange={handleChange}
        className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-[#EA580C] shadow-2xs cursor-pointer"
      >
        <option value="relevance">Most relevant</option>
        <option value="duration">Shortest duration</option>
        <option value="title">Alphabetical</option>
      </select>
    </div>
  );
}
