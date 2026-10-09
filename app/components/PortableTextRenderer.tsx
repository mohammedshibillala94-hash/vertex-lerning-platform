"use client";

import React from "react";
import { PortableText, PortableTextComponents } from "next-sanity";

interface PortableTextRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-4">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans font-semibold text-base sm:text-lg text-[#0F172A] mt-4 mb-2">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#EA580C] pl-4 italic text-[#64748B] my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-[#64748B] mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-[#64748B] mb-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#0F172A]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || "#";
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#EA580C] hover:underline font-medium"
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <PortableText value={value} components={components} />
    </div>
  );
}
