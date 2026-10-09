import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import {
  VertexLogo,
  BellOutline,
  ChevronRightOutline,
  SearchOutline,
} from "@/app/components/Icons";
import { HeaderSearchInput } from "@/app/components/HeaderSearchInput";
import { SearchResultCard, SearchResultItem } from "@/app/components/SearchResultCard";
import { headers } from "next/headers";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
}

interface SearchApiResponse {
  query: string;
  totalResults: number;
  courseCount: number;
  results: SearchResultItem[];
  error?: string;
}

async function fetchSearchResults(query: string, sort: string): Promise<SearchApiResponse> {
  if (!query) {
    return { query: "", totalResults: 0, courseCount: 0, results: [] };
  }

  try {
    const host = (await headers()).get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, sort }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Search API returned status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Direct fetch search failed, running fallback search:", error);
    return { query, totalResults: 0, courseCount: 0, results: [] };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", sort = "relevance" } = await searchParams;
  const searchData = await fetchSearchResults(q, sort);
  const { totalResults, courseCount, results } = searchData;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#FFEEE5] selection:text-[#EA580C] pb-24">
      {/* TOP NAVIGATION */}
      <header className="w-full border-b border-[#E2E8F0]/60 bg-[#FAFAFC]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90 shrink-0"
            >
              <VertexLogo size={28} />
              <span className="font-sans font-bold text-xl tracking-tight text-[#0F172A]">
                Vertex
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6 shrink-0">
              <Link
                href="/courses"
                className="text-sm font-medium text-[#0F172A] transition-colors hover:text-[#EA580C]"
              >
                Courses
              </Link>
              <Link
                href="/my-learning"
                className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
              >
                My Learning
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end max-w-xl">
            <HeaderSearchInput initialQuery={q} className="hidden sm:flex" />

            <button
              type="button"
              className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Notifications"
            >
              <BellOutline size={20} />
            </button>

            <Show when="signed-out">
              <div className="flex items-center gap-2 shrink-0">
                <SignInButton mode="modal">
                  <button className="px-3.5 py-1.5 text-sm font-medium text-[#0F172A] hover:text-[#EA580C] transition-colors cursor-pointer">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-3.5 py-1.5 text-sm font-medium text-white bg-[#EA580C] hover:bg-[#D97706] rounded-lg transition-colors shadow-xs cursor-pointer">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-[#CBD5E1]",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
          <Link href="/courses" className="hover:text-[#0F172A] transition-colors">
            All Courses
          </Link>
          <ChevronRightOutline size={14} className="text-[#94A3B8]" />
          <span className="text-[#0F172A] font-semibold">Search Results</span>
        </nav>

        {/* Page Header */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-6">
            <div className="space-y-2 min-w-0">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
                {q ? `Results for "${q}"` : "Search"}
              </h1>
              {q && (
                <p className="text-xs sm:text-sm font-medium text-[#64748B]">
                  Found <strong className="text-[#0F172A]">{totalResults}</strong> result
                  {totalResults === 1 ? "" : "s"} across{" "}
                  <strong className="text-[#0F172A]">{courseCount}</strong> course
                  {courseCount === 1 ? "" : "s"}
                </p>
              )}
            </div>

            {/* Mobile Header Search */}
            <div className="sm:hidden w-full">
              <HeaderSearchInput initialQuery={q} />
            </div>

            {/* Sort Selector */}
            {totalResults > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                <label htmlFor="search-sort" className="text-xs font-semibold text-[#64748B]">
                  Sort by:
                </label>
                <form method="GET" action="/search" className="inline-block">
                  <input type="hidden" name="q" value={q} />
                  <select
                    id="search-sort"
                    name="sort"
                    defaultValue={sort}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: any) => e.target.form?.submit()}
                    className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-[#EA580C] shadow-2xs cursor-pointer"
                  >
                    <option value="relevance">Most relevant</option>
                    <option value="duration">Shortest duration</option>
                    <option value="title">Alphabetical</option>
                  </select>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Search Results List */}
        {totalResults > 0 ? (
          <section className="space-y-4">
            {results.map((item) => (
              <SearchResultCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          /* Empty State */
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto my-8 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mx-auto">
              <SearchOutline size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#0F172A]">
                No matching results found
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                We couldn&apos;t find any lessons or video moments matching &quot;{q}&quot;. Try adjusting your search terms or explore our full catalog.
              </p>
            </div>
            <div>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-6 h-12 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
              >
                Explore All Courses
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
