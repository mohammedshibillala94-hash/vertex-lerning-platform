import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { getCourseBySlug } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import {
  VertexLogo,
  BellOutline,
  BarChartOutline,
  ClockOutline,
  DocumentOutline,
  UserOutline,
  ArrowRightIcon,
  BookmarkOutline,
  ChevronRightOutline,
  LayersIcon,
  DatabaseIcon,
  SpeedometerIcon,
  CloudIcon,
  WorkflowIcon,
} from "@/app/components/Icons";
import {
  CourseContentAccordion,
  ModuleItem,
  LessonItem,
} from "@/app/components/CourseContentAccordion";
import { formatDuration } from "@/app/utils";
import { FloatingProgressBanner } from "@/app/components/FloatingProgressBanner";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatStudentCount(count: number = 0): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k students`;
  }
  return `${count} students`;
}

function getOutcomeIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "layers":
      return <LayersIcon size={24} />;
    case "database":
    case "db":
      return <DatabaseIcon size={24} />;
    case "gauge":
    case "speedometer":
    case "performance":
      return <SpeedometerIcon size={24} />;
    case "cloud":
    case "deployment":
      return <CloudIcon size={24} />;
    case "workflow":
      return <WorkflowIcon size={24} />;
    default:
      return <LayersIcon size={24} />;
  }
}

interface LearningOutcomeItem {
  icon?: string;
  title: string;
  description?: string;
}

interface CourseData {
  title: string;
  summary?: string;
  coverImage?: unknown;
  level?: string;
  isPopular?: boolean;
  studentCount?: number;
  learningOutcomes?: LearningOutcomeItem[];
  modules?: ModuleItem[];
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = (await getCourseBySlug(slug)) as unknown as CourseData | null;

  if (!course) {
    notFound();
  }

  const modules: ModuleItem[] = course.modules || [];
  const moduleCount = modules.length;

  // Calculate total course duration across all modules and lessons
  const totalDurationSeconds = modules.reduce((totalAcc: number, mod: ModuleItem) => {
    const lessons = mod.lessons || [];
    return totalAcc + lessons.reduce((lAcc: number, l: LessonItem) => lAcc + (l.duration || 0), 0);
  }, 0);

  const formattedTotalDuration = formatDuration(totalDurationSeconds);
  const firstLessonSlug = modules[0]?.lessons?.[0]?.slug || "";

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#FFEEE5] selection:text-[#EA580C] pb-28">
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
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-8 space-y-12">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
          <Link href="/courses" className="hover:text-[#0F172A] transition-colors">
            All Courses
          </Link>
          <ChevronRightOutline size={14} className="text-[#94A3B8]" />
          <span className="text-[#0F172A] font-semibold">{course.title}</span>
        </nav>

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cover Image / Graphic */}
          <div className="lg:col-span-4">
            <div className="w-full aspect-square max-w-[360px] mx-auto lg:max-w-none rounded-[24px] bg-[#0F172A] overflow-hidden border border-[#E2E8F0] shadow-md flex items-center justify-center relative group">
              {course.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(course.coverImage).url()}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-[#0F172A] text-white font-serif text-8xl font-bold flex items-center justify-center select-none bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
                  {course.title.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Course Info & CTAs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Popular Badge */}
            {course.isPopular && (
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFEEE5] border border-[#FED7AA]/80 text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
                  POPULAR
                </span>
              </div>
            )}

            {/* Course Title & Description */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.15]">
                {course.title}
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#64748B] max-w-2xl leading-relaxed">
                {course.summary}
              </p>
            </div>

            {/* Meta Stats Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-[#64748B] pt-2">
              {course.level && (
                <div className="flex items-center gap-2">
                  <BarChartOutline size={16} className="text-[#94A3B8]" />
                  <span>{course.level}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <ClockOutline size={16} className="text-[#94A3B8]" />
                <span>{formattedTotalDuration}</span>
              </div>

              <div className="flex items-center gap-2">
                <DocumentOutline size={16} className="text-[#94A3B8]" />
                <span>{moduleCount} modules</span>
              </div>

              {course.studentCount != null && (
                <div className="flex items-center gap-2">
                  <UserOutline size={16} className="text-[#94A3B8]" />
                  <span>{formatStudentCount(course.studentCount)}</span>
                </div>
              )}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href={firstLessonSlug ? `/lessons/${firstLessonSlug}` : "#"}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-medium text-sm shadow-md shadow-[#EA580C]/15 transition-all cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRightIcon size={16} />
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 h-12 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F8FAFC] font-medium text-sm transition-all cursor-pointer"
              >
                <BookmarkOutline size={18} />
                <span>Bookmark</span>
              </button>
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL LEARN SECTION */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <section className="bg-[#FAFAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <h2 className="font-serif text-2xl font-bold text-[#0F172A] tracking-tight">
              What you&apos;ll learn
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.learningOutcomes.map((outcome: LearningOutcomeItem, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E2E8F0]/80 rounded-xl p-5 flex items-start gap-4 shadow-2xs hover:border-[#CBD5E1] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
                    {getOutcomeIcon(outcome.icon)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-sans font-semibold text-base text-[#0F172A]">
                      {outcome.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* COURSE CONTENT SECTION */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#E2E8F0]/60 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#0F172A] tracking-tight">
              Course Content
            </h2>
            <div className="text-xs sm:text-sm font-medium text-[#64748B]">
              {moduleCount} modules • {formattedTotalDuration}
            </div>
          </div>

          <CourseContentAccordion modules={modules} initialVisibleCount={6} />
        </section>
      </main>

      {/* FLOATING BOTTOM PROGRESS BANNER */}
      <FloatingProgressBanner
        firstLessonSlug={firstLessonSlug}
        progressPercent={35}
      />
    </div>
  );
}
