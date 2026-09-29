import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Embed URL for YouTube, Vimeo, or Bunny stream provider player",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster / Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "duration",
      title: "Duration (seconds)",
      type: "number",
      description: "Video playback duration in seconds",
    }),
    defineField({
      name: "isFreePreview",
      title: "Free Preview",
      type: "boolean",
      description: "Label indicator for free preview access",
      initialValue: false,
    }),
    defineField({
      name: "studentCount",
      title: "Student Count",
      type: "number",
      description: "Display count for learners who completed or viewed this lesson",
      initialValue: 0,
    }),
    defineField({
      name: "notes",
      title: "Lesson Notes (Portable Text)",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "keyPoints",
      title: "Key Points",
      type: "array",
      of: [
        defineArrayMember({ type: "string" }),
        defineArrayMember({ type: "lessonKeyPoint" }),
      ],
      description: "In this lesson you will learn points",
    }),
    defineField({
      name: "proTip",
      title: "Pro Tip",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [defineArrayMember({ type: "lessonResource" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "videoUrl",
      media: "poster",
    },
  },
});
