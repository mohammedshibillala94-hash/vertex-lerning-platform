"use client";

import React from "react";

interface SearchSortSelectProps {
  q: string;
  sort: string;
}

export function SearchSortSelect({ q, sort }: SearchSortSelectProps) {
  return (
    <form method="GET" action="/search" className="inline-block">
      <input type="hidden" name="q" value={q} />
      <select
        id="search-sort"
        name="sort"
        defaultValue={sort}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-[#EA580C] shadow-2xs cursor-pointer"
      >
        <option value="relevance">Most relevant</option>
        <option value="duration">Shortest duration</option>
        <option value="title">Alphabetical</option>
      </select>
    </form>
  );
}
