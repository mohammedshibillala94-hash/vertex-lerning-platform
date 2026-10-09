import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { getAllCourses } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import {
  VertexLogo,
  BellOutline,
  SearchOutline,
  BarChartOutline,
  DocumentOutline,
  ArrowRightIcon,
  StarIcon,
} from "./components/Icons";

interface SanityCourse {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: unknown;
  level?: string;
  moduleCount?: number;
  totalLessons?: number;
}

export default async function HomePage() {
  const courses = ((await getAllCourses()) as unknown as SanityCourse[]) || [];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#FFEEE5] selection:text-[#EA580C]">
      {/* TOP NAVIGATION */}
      <header className="w-full border-b border-[#E2E8F0]/60 bg-[#FAFAFC]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <VertexLogo size={28} />
              <span className="font-sans font-bold text-xl tracking-tight text-[#0F172A]">
                Vertex
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
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

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <BellOutline size={20} />
            </button>
            <Show when="signed-out">
              <div className="flex items-center gap-2">
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center space-y-8 pt-4 sm:pt-8">
          {/* Badge */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFEEE5] border border-[#FED7AA]/80 shadow-xs">
            <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
              INTELLIGENT LEARNING
            </span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#0F172A] tracking-tight leading-[1.12]">
              Search your learning <br className="hidden sm:inline" />
              in plain English.
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#64748B] max-w-xl mx-auto leading-relaxed">
              Vertex understands what you want to learn and finds the exact lessons across all your courses.
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <Link
              href="#courses"
              className="inline-flex items-center gap-2 px-6 h-[46px] rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-medium text-sm shadow-md shadow-[#EA580C]/15 hover:shadow-lg hover:shadow-[#EA580C]/20 transition-all cursor-pointer"
            >
              <span>Explore Courses</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          {/* Intelligent Search Input Bar */}
          <div className="w-full max-w-2xl pt-4">
            <form
              action="/search"
              method="GET"
              className="relative flex items-center bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] focus-within:border-[#EA580C] focus-within:ring-2 focus-within:ring-[#EA580C]/20 transition-all px-4 h-14"
            >
              <SearchOutline size={20} className="text-[#64748B] mr-3 shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Ask anything about your learning (e.g. data fetching, caching)..."
                className="w-full text-sm text-[#0F172A] placeholder-[#94A3B8] bg-transparent focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#D97706] text-white text-xs font-semibold shrink-0 ml-2 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

        </section>

        {/* ALL COURSES SECTION */}
        <section id="courses" className="space-y-6 pt-4">
          <div className="flex items-end justify-between border-b border-[#E2E8F0]/40 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              All Courses
            </h2>
            <Link
              href="/courses"
              className="text-xs font-semibold text-[#EA580C] hover:text-[#D97706] flex items-center gap-1 group transition-colors"
            >
              <span>View all courses</span>
              <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Link
                  key={course._id}
                  href={`/courses/${course.slug}`}
                  className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all p-6 flex flex-col justify-between space-y-6 group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#0F172A] text-white font-bold text-2xl flex items-center justify-center shadow-sm overflow-hidden">
                      {course.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={urlFor(course.coverImage).url()}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{course.title.charAt(0)}</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                        {course.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B] font-medium">
                    <div className="flex items-center gap-1.5">
                      <BarChartOutline size={14} className="text-[#94A3B8]" />
                      <span>{course.level || "Intermediate"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DocumentOutline size={14} className="text-[#94A3B8]" />
                      <span>{course.moduleCount || 0} modules</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-[#64748B] col-span-3 py-8 text-center">
                No courses found in dataset.
              </p>
            )}
          </div>
        </section>

        {/* BOTTOM ANNOUNCEMENT / DIVIDER */}
        <section className="pt-6 pb-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative bg-[#FAFAFC] px-4 flex items-center gap-2 text-xs text-[#64748B]">
              <StarIcon size={16} className="text-[#EA580C]" />
              <span>New courses and lessons added every week.</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER WARM GRADIENT BAR ACCENT */}
      <footer className="w-full h-24 bg-gradient-to-t from-[#FFEEE5] via-[#FFEEE5]/40 to-transparent pointer-events-none mt-8" />
    </div>
  );
}
