import React from "react";
import {
  VertexLogo,
  BellOutline,
  BellFilled,
  SearchOutline,
  SearchFilled,
  PlayOutline,
  PlayFilled,
  DocumentOutline,
  DocumentFilled,
  BookmarkOutline,
  BookmarkFilled,
  BarChartOutline,
  BarChartFilled,
  ClockOutline,
  ClockFilled,
  UserOutline,
  UserFilled,
  ChevronRightOutline,
  ChevronRightFilled,
  LockIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  EyeIcon,
  GridIcon,
  TargetIcon,
  AccessibilityIcon,
  PlayCircleIcon,
} from "./components/Icons";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] p-4 sm:p-8 lg:p-12">
      <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10 lg:p-14 space-y-16">

        {/* HERO / HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-[#E2E8F0] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <VertexLogo size={36} />
              <span className="font-sans font-bold text-2xl tracking-tight text-[#0F172A]">
                Vertex
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
              Design System
            </h1>
            <p className="font-sans text-base text-[#64748B] leading-relaxed">
              A unified design language for Vertex learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.
            </p>
          </div>
          <div className="text-xs font-semibold tracking-widest text-[#64748B] uppercase bg-[#F1F5F9] px-4 py-2 rounded-full border border-[#CBD5E1]">
            VERSION 1.0 &bull; MAY 2025
          </div>
        </header>

        {/* 01 COLORS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">01</span>
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">COLORS</h2>
          </div>

          <div className="space-y-6">
            {/* Primary Colors */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#64748B]">Primary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#F97316] border border-[#F97316]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Primary 500</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#F97316</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FB923C] border border-[#FB923C]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Primary 400</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#FB923C</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FDBA74] border border-[#FDBA74]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Primary 300</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#FDBA74</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FED7AA] border border-[#FED7AA]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Primary 200</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#FED7AA</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FFEEE5] border border-[#FFEEE5]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Primary 100</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#FFEEE5</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Neutral Colors */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#64748B]">Neutral</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#0F172A] border border-[#0F172A]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Neutral 900</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#0F172A</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#334155] border border-[#334155]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Neutral 700</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#334155</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#64748B] border border-[#64748B]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Neutral 500</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#64748B</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#CBD5E1] border border-[#CBD5E1]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Neutral 300</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#CBD5E1</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#E2E8F0] border border-[#E2E8F0]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Neutral 200</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#E2E8F0</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#F1F5F9] border border-[#F1F5F9]/20 shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Neutral 100</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#F1F5F9</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">Neutral 50</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#FAFAFC</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">White</div>
                    <div className="text-[11px] font-mono text-[#64748B]">#FFFFFF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 & 03 TYPOGRAPHY & TYPE SCALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 02 TYPOGRAPHY */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">02</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">TYPOGRAPHY</h2>
            </div>
            <div className="bg-[#FAFAFC] p-6 rounded-2xl border border-[#E2E8F0] space-y-6">
              <div className="space-y-2">
                <div className="font-serif text-5xl font-bold text-[#0F172A]">Ag</div>
                <div>
                  <div className="font-sans font-bold text-base text-[#0F172A]">Playfair Display</div>
                  <div className="text-xs text-[#64748B]">Elegant &bull; Readable &bull; Timeless</div>
                </div>
              </div>
              <hr className="border-[#E2E8F0]" />
              <div className="space-y-2">
                <div className="font-sans text-5xl font-bold text-[#0F172A]">Ag</div>
                <div>
                  <div className="font-sans font-bold text-base text-[#0F172A]">Inter</div>
                  <div className="text-xs text-[#64748B]">Clean &bull; Modern &bull; Highly legible</div>
                </div>
              </div>
            </div>
          </section>

          {/* 03 TYPE SCALE */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">03</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">TYPE SCALE</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="py-2.5 font-semibold">Style</th>
                    <th className="py-2.5 font-semibold">Font</th>
                    <th className="py-2.5 font-semibold">Size / Line Height</th>
                    <th className="py-2.5 font-semibold">Weight</th>
                    <th className="py-2.5 font-semibold">Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  <tr>
                    <td className="py-3 font-serif text-lg font-bold text-[#0F172A]">Display 1</td>
                    <td className="py-3 text-[#64748B]">Playfair Display</td>
                    <td className="py-3 text-[#64748B]">48 / 56</td>
                    <td className="py-3 text-[#64748B]">Bold</td>
                    <td className="py-3 text-[#64748B]">Page titles</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-serif text-base font-bold text-[#0F172A]">Display 2</td>
                    <td className="py-3 text-[#64748B]">Playfair Display</td>
                    <td className="py-3 text-[#64748B]">36 / 44</td>
                    <td className="py-3 text-[#64748B]">Bold</td>
                    <td className="py-3 text-[#64748B]">Section titles</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-sm font-semibold text-[#0F172A]">Heading 1</td>
                    <td className="py-3 text-[#64748B]">Inter</td>
                    <td className="py-3 text-[#64748B]">28 / 36</td>
                    <td className="py-3 text-[#64748B]">Semi Bold</td>
                    <td className="py-3 text-[#64748B]">Card titles</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-sm font-semibold text-[#0F172A]">Heading 2</td>
                    <td className="py-3 text-[#64748B]">Inter</td>
                    <td className="py-3 text-[#64748B]">22 / 30</td>
                    <td className="py-3 text-[#64748B]">Semi Bold</td>
                    <td className="py-3 text-[#64748B]">Sub section</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-sm font-medium text-[#0F172A]">Heading 3</td>
                    <td className="py-3 text-[#64748B]">Inter</td>
                    <td className="py-3 text-[#64748B]">18 / 26</td>
                    <td className="py-3 text-[#64748B]">Medium</td>
                    <td className="py-3 text-[#64748B]">Small titles</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-xs font-normal text-[#0F172A]">Body Large</td>
                    <td className="py-3 text-[#64748B]">Inter</td>
                    <td className="py-3 text-[#64748B]">16 / 24</td>
                    <td className="py-3 text-[#64748B]">Regular</td>
                    <td className="py-3 text-[#64748B]">Body copy</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-xs font-normal text-[#0F172A]">Body</td>
                    <td className="py-3 text-[#64748B]">Inter</td>
                    <td className="py-3 text-[#64748B]">14 / 20</td>
                    <td className="py-3 text-[#64748B]">Regular</td>
                    <td className="py-3 text-[#64748B]">Supporting text</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-[11px] font-normal text-[#0F172A]">Small</td>
                    <td className="py-3 text-[#64748B]">Inter</td>
                    <td className="py-3 text-[#64748B]">12 / 16</td>
                    <td className="py-3 text-[#64748B]">Regular</td>
                    <td className="py-3 text-[#64748B]">Captions, meta</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 04 & 05 SPACING & RADIUS/SHADOWS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 04 SPACING SYSTEM */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">04</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">SPACING SYSTEM</h2>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-[#64748B]">Base unit: 4px</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 items-end">
                {[
                  { label: "4", rem: "0.25rem", size: "h-4 w-full" },
                  { label: "8", rem: "0.5rem", size: "h-6 w-full" },
                  { label: "12", rem: "0.75rem", size: "h-8 w-full" },
                  { label: "16", rem: "1rem", size: "h-10 w-full" },
                  { label: "24", rem: "1.5rem", size: "h-12 w-full" },
                  { label: "32", rem: "2rem", size: "h-14 w-full" },
                  { label: "40", rem: "2.5rem", size: "h-16 w-full" },
                  { label: "48", rem: "3rem", size: "h-18 w-full" },
                  { label: "64", rem: "4rem", size: "h-20 w-full" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                    <div className={`${item.size} bg-[#FFEEE5] border border-[#FED7AA] rounded-md`} />
                    <div className="text-xs font-bold text-[#0F172A]">{item.label}</div>
                    <div className="text-[10px] text-[#64748B]">{item.rem}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 05 RADIUS & SHADOWS */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">05</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">RADIUS &amp; SHADOWS</h2>
            </div>

            <div className="space-y-6">
              {/* Radius */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#64748B]">Radius</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { label: "4px", name: "(xs)", radius: "rounded-[4px]" },
                    { label: "8px", name: "(sm)", radius: "rounded-[8px]" },
                    { label: "12px", name: "(md)", radius: "rounded-[12px]" },
                    { label: "16px", name: "(lg)", radius: "rounded-[16px]" },
                    { label: "24px", name: "(xl)", radius: "rounded-[24px]" },
                    { label: "Full", name: "(circle)", radius: "rounded-full" },
                  ].map((r) => (
                    <div key={r.label} className="flex flex-col items-center gap-2 text-center">
                      <div className={`w-14 h-14 bg-white border border-[#CBD5E1] ${r.radius}`} />
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A]">{r.label}</div>
                        <div className="text-[10px] text-[#64748B]">{r.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shadows */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#64748B]">Shadows</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "Sm", spec: "0 1px 2px 0 rgba(15, 23, 42, 0.05)", shadow: "shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]" },
                    { name: "Md", spec: "0 4px 12px -2px rgba(15, 23, 42, 0.08)", shadow: "shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08)]" },
                    { name: "Lg", spec: "0 12px 24px -4px rgba(15, 23, 42, 0.10)", shadow: "shadow-[0_12px_24px_-4px_rgba(15,23,42,0.10)]" },
                    { name: "Xl", spec: "0 20px 40px -8px rgba(15, 23, 42, 0.12)", shadow: "shadow-[0_20px_40px_-8px_rgba(15,23,42,0.12)]" },
                  ].map((s) => (
                    <div key={s.name} className={`bg-white border border-[#E2E8F0] p-3 rounded-xl space-y-1 ${s.shadow}`}>
                      <div className="text-xs font-bold text-[#0F172A]">{s.name}</div>
                      <div className="text-[10px] font-mono text-[#64748B] break-all">{s.spec}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 06 ICONS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">06</span>
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">ICONS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 space-y-4">
              {/* Outline */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#64748B]">Outline Style</span>
                <div className="flex flex-wrap gap-4 p-4 bg-[#FAFAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A]">
                  <BellOutline />
                  <SearchOutline />
                  <PlayOutline />
                  <DocumentOutline />
                  <BookmarkOutline />
                  <BarChartOutline />
                  <ClockOutline />
                  <UserOutline />
                  <ChevronRightOutline />
                </div>
              </div>

              {/* Filled */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#64748B]">Filled Style</span>
                <div className="flex flex-wrap gap-4 p-4 bg-[#FAFAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A]">
                  <BellFilled />
                  <SearchFilled />
                  <PlayFilled />
                  <DocumentFilled />
                  <BookmarkFilled />
                  <BarChartFilled />
                  <ClockFilled />
                  <UserFilled />
                  <ChevronRightFilled />
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-[#FAFAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
              <span className="text-xs font-bold text-[#0F172A]">Icon Specs</span>
              <ul className="text-xs text-[#64748B] space-y-1 list-disc list-inside">
                <li>24x24px grid</li>
                <li>2px stroke width (outline)</li>
                <li>Rounded line caps</li>
                <li>Consistent optical balance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 07 BUTTONS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">07</span>
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">BUTTONS</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-9 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="py-2.5 font-semibold">Variant</th>
                    <th className="py-2.5 font-semibold">Primary</th>
                    <th className="py-2.5 font-semibold">Secondary</th>
                    <th className="py-2.5 font-semibold">Tertiary</th>
                    <th className="py-2.5 font-semibold">Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {/* Default */}
                  <tr>
                    <td className="py-4 font-semibold text-[#64748B]">Default</td>
                    <td className="py-4">
                      <button className="h-[44px] px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-medium text-xs shadow-sm transition-colors cursor-pointer">
                        Get Started
                      </button>
                    </td>
                    <td className="py-4">
                      <button className="h-[44px] px-4 rounded-xl bg-white border border-[#FED7AA] hover:bg-[#FFF7ED] text-[#F97316] font-medium text-xs shadow-sm transition-colors cursor-pointer">
                        Explore Courses
                      </button>
                    </td>
                    <td className="py-4">
                      <button className="h-[44px] px-4 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F172A] font-medium text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                        <span>View Lesson</span>
                        <ExternalLinkIcon size={14} className="text-[#64748B]" />
                      </button>
                    </td>
                    <td className="py-4">
                      <button className="h-[44px] px-3 text-[#F97316] hover:text-[#EA580C] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
                        <span>Watch Video</span>
                        <PlayCircleIcon size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* Hover */}
                  <tr>
                    <td className="py-4 font-semibold text-[#64748B]">Hover</td>
                    <td className="py-4">
                      <button className="h-[44px] px-4 rounded-xl bg-[#EA580C] text-white font-medium text-xs shadow-sm">
                        Get Started
                      </button>
                    </td>
                    <td className="py-4">
                      <button className="h-[44px] px-4 rounded-xl bg-[#FFF7ED] border border-[#F97316] text-[#F97316] font-medium text-xs shadow-sm">
                        Explore Courses
                      </button>
                    </td>
                    <td className="py-4">
                      <button className="h-[44px] px-4 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] font-medium text-xs flex items-center gap-2 shadow-sm">
                        <span>View Lesson</span>
                        <ExternalLinkIcon size={14} className="text-[#0F172A]" />
                      </button>
                    </td>
                    <td className="py-4">
                      <button className="h-[44px] px-3 text-[#EA580C] font-medium text-xs flex items-center gap-1.5">
                        <span>Watch Video</span>
                        <PlayCircleIcon size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* Disabled */}
                  <tr>
                    <td className="py-4 font-semibold text-[#64748B]">Disabled</td>
                    <td className="py-4">
                      <button disabled className="h-[44px] px-4 rounded-xl bg-[#FFEEE5] text-[#FDBA74] font-medium text-xs cursor-not-allowed">
                        Get Started
                      </button>
                    </td>
                    <td className="py-4">
                      <button disabled className="h-[44px] px-4 rounded-xl bg-white border border-[#FFEEE5] text-[#FDBA74] font-medium text-xs cursor-not-allowed">
                        Explore Courses
                      </button>
                    </td>
                    <td className="py-4">
                      <button disabled className="h-[44px] px-4 rounded-xl bg-white border border-[#F1F5F9] text-[#CBD5E1] font-medium text-xs flex items-center gap-2 cursor-not-allowed">
                        <span>View Lesson</span>
                        <ExternalLinkIcon size={14} className="text-[#CBD5E1]" />
                      </button>
                    </td>
                    <td className="py-4">
                      <button disabled className="h-[44px] px-3 text-[#FDBA74] font-medium text-xs flex items-center gap-1.5 cursor-not-allowed">
                        <span>Watch Video</span>
                        <PlayCircleIcon size={16} className="text-[#FDBA74]" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-3 bg-[#FAFAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
              <span className="text-xs font-bold text-[#0F172A]">Button Specs</span>
              <ul className="text-xs text-[#64748B] space-y-1 list-disc list-inside">
                <li>Height: 44px (default)</li>
                <li>Padding: 0 16px (lg), 0 12px (md)</li>
                <li>Radius: 12px</li>
                <li>Font: Inter Medium (14–16px)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 08 & 09 INPUTS & BADGES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 08 INPUTS */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">08</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">INPUTS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search / Text Input */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#64748B]">Search / Text Input</span>
                <div className="relative flex items-center">
                  <SearchOutline size={18} className="absolute left-3.5 text-[#64748B]" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full h-[44px] pl-10 pr-12 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#FB923C] focus:ring-1 focus:ring-[#FB923C] transition-colors"
                  />
                  <div className="absolute right-3 px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[10px] font-mono text-[#64748B]">
                    ⌘ K
                  </div>
                </div>
              </div>

              {/* Select */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#64748B]">Select</span>
                <div className="relative flex items-center">
                  <select className="w-full h-[44px] px-3.5 pr-10 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] appearance-none focus:outline-none focus:border-[#FB923C] focus:ring-1 focus:ring-[#FB923C] transition-colors cursor-pointer">
                    <option>Most Relevant</option>
                    <option>Newest First</option>
                    <option>Highest Rated</option>
                  </select>
                  <ChevronDownIcon size={18} className="absolute right-3.5 text-[#64748B] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="bg-[#FAFAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
              <span className="text-xs font-bold text-[#0F172A]">Field Specs</span>
              <ul className="text-xs text-[#64748B] grid grid-cols-2 sm:grid-cols-4 gap-2 list-disc list-inside">
                <li>Height: 44px</li>
                <li>Radius: 12px</li>
                <li>Border: 1px solid #E2E8F0</li>
                <li>Padding: 0 16px</li>
              </ul>
            </div>
          </section>

          {/* 09 BADGES / TAGS */}
          <section className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">09</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">BADGES / TAGS</h2>
            </div>

            <div className="flex flex-wrap gap-4 items-center p-4 bg-[#FAFAFC] border border-[#E2E8F0] rounded-xl">
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#64748B]">Video</div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFEEE5] text-[#F97316] font-bold text-[10px] tracking-wider uppercase">
                  VIDEO
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#64748B]">Lesson</div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#2563EB] font-bold text-[10px] tracking-wider uppercase">
                  LESSON
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#64748B]">Popular</div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFEEE5] text-[#F97316] font-bold text-[10px] tracking-wider uppercase">
                  POPULAR
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 10 & 11 STATUS & PROGRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 10 STATUS / INDICATORS */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">10</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">STATUS / INDICATORS</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] rounded-xl">
                <div className="w-5 h-5 rounded-full border-2 border-[#F97316] flex items-center justify-center text-[#F97316]" />
                <span className="text-xs font-medium text-[#0F172A]">In Progress</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] rounded-xl">
                <CheckCircleIcon size={20} className="text-[#22C55E]" />
                <span className="text-xs font-medium text-[#0F172A]">Completed</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] rounded-xl">
                <PlayCircleIcon size={20} className="text-[#F97316]" />
                <span className="text-xs font-medium text-[#0F172A]">Now Playing</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] rounded-xl">
                <LockIcon size={18} className="text-[#64748B]" />
                <span className="text-xs font-medium text-[#0F172A]">Locked</span>
              </div>
            </div>
          </section>

          {/* 11 PROGRESS BAR */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">11</span>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">PROGRESS BAR</h2>
            </div>

            <div className="space-y-2 p-4 bg-white border border-[#E2E8F0] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F97316] rounded-full" style={{ width: "35%" }} />
                </div>
                <span className="text-xs text-[#64748B] whitespace-nowrap">
                  <strong className="font-semibold text-[#0F172A]">35%</strong> complete
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 12 CARDS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">12</span>
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">CARDS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Course Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white font-bold text-lg">
                  N
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-[#0F172A] leading-snug">
                    Next.js for Production
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">
                    Build scalable, high-performance web applications with Next.js.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center gap-3 text-[11px] text-[#64748B]">
                <div className="flex items-center gap-1">
                  <BarChartOutline size={14} />
                  <span>Intermediate</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockOutline size={14} />
                  <span>18h 24m</span>
                </div>
                <div className="flex items-center gap-1">
                  <DocumentOutline size={14} />
                  <span>12 modules</span>
                </div>
              </div>
            </div>

            {/* Lesson Card (Video) */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block px-2 py-0.5 rounded-md bg-[#FFEEE5] text-[#F97316] font-bold text-[10px] tracking-wider uppercase">
                  VIDEO
                </span>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-[#0F172A] leading-snug">
                    Data Fetching in Server Components
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">
                    Learn how to fetch data on the server using async/await and Next.js best practices.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                <span className="text-[#64748B]">Lesson 5.1 &bull; 12:45</span>
                <button className="text-[#F97316] font-semibold hover:underline flex items-center gap-1">
                  <span>Watch from 12:45</span>
                </button>
              </div>
            </div>

            {/* Lesson Card (Lesson) */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#2563EB] font-bold text-[10px] tracking-wider uppercase">
                  LESSON
                </span>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-[#0F172A] leading-snug">
                    Data Fetching &amp; Caching
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">
                    Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                <span className="text-[#64748B]">Module 5</span>
                <button className="text-[#F97316] font-semibold hover:underline flex items-center gap-1">
                  <span>View lesson</span>
                  <ExternalLinkIcon size={12} />
                </button>
              </div>
            </div>

            {/* Resource Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[#0F172A]">
                  <DocumentOutline size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-[#0F172A] leading-snug">
                    Caching and Revalidation Guide
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">
                    Deep dive into Next.js caching strategies.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                <span className="text-[#64748B]">PDF &bull; 1.2 MB</span>
                <button className="text-[#F97316] hover:text-[#EA580C]">
                  <ExternalLinkIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 13 NAVIGATION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">13</span>
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">NAVIGATION</h2>
          </div>

          <div className="space-y-6 bg-[#FAFAFC] p-6 rounded-2xl border border-[#E2E8F0]">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-3">
                <VertexLogo size={24} />
                <span className="font-sans font-bold text-base text-[#0F172A]">Vertex</span>
              </div>
              <nav className="flex items-center gap-6 text-xs font-medium">
                <a href="#" className="text-[#F97316] font-semibold">Courses</a>
                <a href="#" className="text-[#64748B] hover:text-[#0F172A]">My Learning</a>
              </nav>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Breadcrumbs */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#64748B]">Breadcrumbs</span>
                <nav className="flex items-center gap-2 text-xs text-[#64748B]">
                  <a href="#" className="hover:text-[#0F172A]">All Courses</a>
                  <ChevronRightOutline size={14} />
                  <a href="#" className="hover:text-[#0F172A]">Next.js for Production</a>
                  <ChevronRightOutline size={14} />
                  <span className="text-[#0F172A] font-medium">Data Fetching &amp; Caching</span>
                </nav>
              </div>

              {/* Pagination */}
              <div className="space-y-2 md:text-right">
                <span className="text-[11px] font-semibold text-[#64748B]">Pagination</span>
                <div className="flex items-center md:justify-end gap-1.5">
                  <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9]">
                    <ChevronLeftIcon size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-[#F97316] bg-white text-[#F97316] font-bold text-xs flex items-center justify-center">
                    1
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-transparent hover:border-[#E2E8F0] bg-transparent text-[#64748B] text-xs flex items-center justify-center">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-transparent hover:border-[#E2E8F0] bg-transparent text-[#64748B] text-xs flex items-center justify-center">
                    3
                  </button>
                  <span className="px-1 text-xs text-[#64748B]">...</span>
                  <button className="w-8 h-8 rounded-lg border border-transparent hover:border-[#E2E8F0] bg-transparent text-[#64748B] text-xs flex items-center justify-center">
                    8
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9]">
                    <ChevronRightOutline size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14 PRINCIPLES */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">14</span>
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">PRINCIPLES</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAFAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shadow-sm">
                <EyeIcon size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-sm font-semibold text-[#0F172A]">Clarity First</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Every element should communicate clearly.
                </p>
              </div>
            </div>

            <div className="bg-[#FAFAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shadow-sm">
                <GridIcon size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-sm font-semibold text-[#0F172A]">Consistency</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Use components and patterns consistently across the platform.
                </p>
              </div>
            </div>

            <div className="bg-[#FAFAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shadow-sm">
                <TargetIcon size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-sm font-semibold text-[#0F172A]">Focus &amp; Calm</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Remove noise and help learners focus on what matters.
                </p>
              </div>
            </div>

            <div className="bg-[#FAFAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shadow-sm">
                <AccessibilityIcon size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-sm font-semibold text-[#0F172A]">Accessible</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Design with accessibility and inclusivity in mind.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
