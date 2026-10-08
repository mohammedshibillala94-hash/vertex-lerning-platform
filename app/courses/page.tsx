import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { getAllCourses } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import {
  VertexLogo,
  BellOutline,
  BarChartOutline,
  DocumentOutline,
  StarIcon,
} from "@/app/components/Icons";

interface CourseCardItem {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: unknown;
  level?: string;
  moduleCount?: number;
}

export default async function CatalogPage() {
  const courses = ((await getAllCourses()) as unknown as CourseCardItem[]) || [];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#FFEEE5] selection:text-[#EA580C]">
      {/* TOP NAVIGATION */}
      <header className="w-full border-b border-[#E2E8F0]/60 bg-[#FAFAFC]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
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
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        {/* HEADER SECTION */}
        <section className="space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Explore All Courses
          </h1>
          <p className="font-sans text-base text-[#64748B] max-w-xl leading-relaxed">
            Master modern technologies with structured, production-ready courses built for engineers.
          </p>
        </section>

        {/* COURSES GRID */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: CourseCardItem) => (
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
                    <h2 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors line-clamp-1">
                      {course.title}
                    </h2>
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
            ))}
          </div>
        </section>

        {/* BOTTOM ANNOUNCEMENT */}
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
