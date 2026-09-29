import { defineField, defineType } from "sanity";

export const moduleType = defineType({
  name: "module",
  title: "Module",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "lessons",
      title: "Lessons",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "lesson" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      summary: "summary",
      lessons: "lessons",
    },
    prepare({ title, summary, lessons }) {
      const count = Array.isArray(lessons) ? lessons.length : 0;
      return {
        title,
        subtitle: `${count} lesson${count === 1 ? "" : "s"} • ${summary || ""}`,
      };
    },
  },
});
