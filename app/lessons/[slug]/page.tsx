import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { getLessonBySlug } from "@/sanity/lib/fetch";
import {
  VertexLogo,
  BellOutline,
  BarChartOutline,
  ClockOutline,
  UserOutline,
  BookmarkOutline,
  ChevronRightOutline,
  ArrowLeftOutline,
  ArrowRightIcon,
} from "@/app/components/Icons";
import { LessonSidebar, ModuleSidebarItem, LessonSidebarItem } from "@/app/components/LessonSidebar";
import { LessonVideoPlayer } from "@/app/components/LessonVideoPlayer";
import { LessonContentTabs } from "@/app/components/LessonContentTabs";
import { formatDuration } from "@/app/utils";

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    start?: string;
    t?: string;
  }>;
}

function formatStudentCount(count: number = 0): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k students`;
  }
  return `${count} students`;
}

interface CourseRef {
  _id: string;
  title: string;
  slug: string;
  level?: string;
  studentCount?: number;
  modules?: ModuleSidebarItem[];
}

interface LessonData {
  _id: string;
  title: string;
  slug: string;
  videoUrl?: string;
  duration?: number;
  isFreePreview?: boolean;
  studentCount?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyPoints?: any[];
  proTip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources?: any[];
  course?: CourseRef;
}

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Extract start seconds if present (?start=60 or ?t=60)
  const startParam = resolvedSearchParams.start || resolvedSearchParams.t;
  const startSeconds = startParam ? parseInt(startParam, 10) : undefined;

  const lesson = (await getLessonBySlug(slug)) as unknown as LessonData | null;

  if (!lesson) {
    notFound();
  }

  const course = lesson.course;
  const modules: ModuleSidebarItem[] = course?.modules || [];

  // Find module index and lesson position
  let currentModuleIndex = 0;
  let lessonIndexInModule = 1;
  let currentModuleTitle = "";

  modules.forEach((mod, mIdx) => {
    const lIdx = mod.lessons?.findIndex((l) => l.slug === lesson.slug);
    if (lIdx !== undefined && lIdx >= 0) {
      currentModuleIndex = mIdx;
      lessonIndexInModule = lIdx + 1;
      currentModuleTitle = mod.title;
    }
  });

  // Flatten all lessons across modules to find Previous and Next lessons
  const flatLessons: (LessonSidebarItem & { moduleTitle: string })[] = [];
  modules.forEach((mod) => {
    (mod.lessons || []).forEach((l) => {
      flatLessons.push({
        ...l,
        moduleTitle: mod.title,
      });
    });
  });

  const currentFlatIndex = flatLessons.findIndex((l) => l.slug === lesson.slug);
  const prevLesson = currentFlatIndex > 0 ? flatLessons[currentFlatIndex - 1] : null;
  const nextLesson =
    currentFlatIndex >= 0 && currentFlatIndex < flatLessons.length - 1
      ? flatLessons[currentFlatIndex + 1]
      : null;

  const moduleDisplayLabel = `LESSON ${currentModuleIndex + 1}.${lessonIndexInModule}`;

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
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Course Sidebar Accordion */}
          <div className="lg:col-span-4">
            <LessonSidebar
              courseTitle={course?.title || "Course"}
              courseSlug={course?.slug || ""}
              modules={modules}
              currentLessonSlug={lesson.slug}
              progressPercent={35}
            />
          </div>

          {/* Right Column: Main Lesson View */}
          <div className="lg:col-span-8 space-y-8">
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#64748B]">
              <Link href="/courses" className="hover:text-[#0F172A] transition-colors">
                All Courses
              </Link>
              <ChevronRightOutline size={14} className="text-[#94A3B8]" />
              {course?.slug && (
                <>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="hover:text-[#0F172A] transition-colors truncate max-w-[200px]"
                  >
                    {course.title}
                  </Link>
                  <ChevronRightOutline size={14} className="text-[#94A3B8]" />
                </>
              )}
              {currentModuleTitle && (
                <>
                  <span className="text-[#64748B] truncate max-w-[180px]">
                    {currentModuleTitle}
                  </span>
                  <ChevronRightOutline size={14} className="text-[#94A3B8]" />
                </>
              )}
              <span className="text-[#0F172A] font-semibold truncate max-w-[200px]">
                {lesson.title}
              </span>
            </nav>

            {/* Lesson Tag Badge */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFEEE5] border border-[#FED7AA]/80 text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
                {moduleDisplayLabel}
              </span>
            </div>

            {/* Lesson Header Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 min-w-0 flex-1">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0F172A] tracking-tight leading-[1.15]">
                  {lesson.title}
                </h1>
                <p className="font-sans text-base text-[#64748B] leading-relaxed">
                  Learn how Next.js handles data fetching and caching in both Server and Client Components.
                </p>
              </div>

              <button
                type="button"
                className="p-3 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F8FAFC] transition-colors shadow-2xs shrink-0 cursor-pointer"
                aria-label="Bookmark lesson"
              >
                <BookmarkOutline size={20} />
              </button>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-[#64748B]">
              <div className="flex items-center gap-2">
                <ClockOutline size={16} className="text-[#94A3B8]" />
                <span>{formatDuration(lesson.duration || 0)}</span>
              </div>

              {course?.level && (
                <div className="flex items-center gap-2">
                  <BarChartOutline size={16} className="text-[#94A3B8]" />
                  <span>{course.level}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <UserOutline size={16} className="text-[#94A3B8]" />
                <span>{formatStudentCount(lesson.studentCount || course?.studentCount || 3426)}</span>
              </div>
            </div>

            {/* Video Player */}
            <LessonVideoPlayer
              videoUrl={lesson.videoUrl}
              title={lesson.title}
              startSeconds={startSeconds}
            />

            {/* Content Tabs (Overview, Key Points, Pro Tip, Resources) */}
            <LessonContentTabs
              notes={lesson.notes}
              keyPoints={lesson.keyPoints}
              proTip={lesson.proTip}
              resources={lesson.resources}
            />

            {/* Bottom Lesson Navigation Bar */}
            <footer className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevLesson ? (
                <Link
                  href={`/lessons/${prevLesson.slug}`}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-left flex items-center gap-3 transition-colors shadow-2xs group"
                >
                  <ArrowLeftOutline size={18} className="text-[#0F172A] group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <span className="block text-[11px] font-semibold text-[#64748B]">
                      Previous Lesson
                    </span>
                    <span className="font-sans font-semibold text-xs sm:text-sm text-[#0F172A]">
                      {prevLesson.title}
                    </span>
                    <span className="block text-[11px] text-[#94A3B8]">
                      {formatDuration(prevLesson.duration || 0)}
                    </span>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson && (
                <Link
                  href={`/lessons/${nextLesson.slug}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-md group"
                >
                  <div className="text-right">
                    <span className="block text-[11px] font-medium opacity-90">
                      Next Lesson
                    </span>
                    <span>{nextLesson.title}</span>
                  </div>
                  <ArrowRightIcon size={18} className="group-translate-x-1 transition-transform" />
                </Link>
              )}
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
