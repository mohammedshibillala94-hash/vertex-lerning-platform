import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import {
  VertexLogo,
  BellOutline,
  SearchOutline,
  ArrowRightIcon,
} from "@/app/components/Icons";
import { SearchHeroInput } from "@/app/components/SearchHeroInput";
import { SearchResultCard } from "@/app/components/SearchResultCard";
import { SearchSortSelector } from "@/app/components/SearchSortSelector";
import { performSearch } from "@/sanity/lib/search";
import { SearchPageAnalyticsTracker } from "@/app/components/AnalyticsTrackers";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", sort = "relevance" } = await searchParams;
  const searchData = await performSearch(q, sort);
  const { totalResults, courseCount, results } = searchData;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#FFEEE5] selection:text-[#EA580C] pb-20">
      <SearchPageAnalyticsTracker
        query={q}
        sort={sort}
        totalResults={totalResults}
        courseCount={courseCount}
      />
      {/* 1. TOP NAVIGATION */}
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
            <nav className="flex items-center gap-6 shrink-0">
              <Link
                href="/courses"
                className="text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors"
              >
                Courses
              </Link>
              <Link
                href="/my-learning"
                className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                My Learning
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 shrink-0">
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

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="pt-10 pb-6 text-center max-w-3xl w-full mx-auto px-4">
          {/* SEARCH RESULTS Pill Tag */}
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#EA580C] bg-[#FFF1EB] mb-4 select-none">
            SEARCH RESULTS
          </div>

          {/* Heading: Results for “...” */}
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#0F172A] mb-3">
            Results for <span className="text-[#EA580C]">“{q || "All courses"}”</span>
          </h1>

          {/* Subtitle: Found X results across Y courses */}
          <p className="text-xs sm:text-sm text-[#64748B] font-medium mb-8">
            Found {totalResults} result{totalResults === 1 ? "" : "s"} across {courseCount} course{courseCount === 1 ? "" : "s"}
          </p>

          {/* Centered Search Bar with ⌘ K */}
          <SearchHeroInput initialQuery={q} />
        </section>

        {/* RESULTS HEADER ROW (Count on left, Sort selector on right) */}
        {totalResults > 0 && (
          <div className="max-w-4xl w-full mx-auto px-4 mb-5 flex items-center justify-between">
            <span className="text-sm font-medium text-[#0F172A]">
              {totalResults} results
            </span>
            <SearchSortSelector query={q} currentSort={sort} />
          </div>
        )}

        {/* RESULTS LIST */}
        {totalResults > 0 ? (
          <section className="max-w-4xl w-full mx-auto px-4 space-y-4">
            {results.map((item, index) => (
              <SearchResultCard key={item.id} item={item} rankPosition={index + 1} />
            ))}
          </section>
        ) : (
          /* EMPTY STATE */
          <section className="max-w-2xl w-full mx-auto my-8 px-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mx-auto">
                <SearchOutline size={30} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#0F172A]">
                  No matching results found
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t find any lessons or video moments matching &quot;{q}&quot;. Try adjusting your search terms or browse our full catalog.
                </p>
              </div>
              <div>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-6 h-11 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
                >
                  Explore All Courses
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 3. BOTTOM HELP BANNER */}
        <div className="max-w-4xl w-full mx-auto px-4 mt-8">
          <div className="bg-[#FFF7ED]/70 border border-[#FED7AA]/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
                <SearchOutline size={22} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#0F172A]">
                  Can&apos;t find what you&apos;re looking for?
                </h4>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Try different keywords or browse our full course catalog.
                </p>
              </div>
            </div>
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#EA580C] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs hover:bg-[#F8FAFC] transition-colors shrink-0 cursor-pointer"
            >
              <span>Browse all courses</span>
              <ArrowRightIcon size={15} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
