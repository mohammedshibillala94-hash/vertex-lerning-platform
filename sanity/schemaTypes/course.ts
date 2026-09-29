import { defineArrayMember, defineField, defineType } from "sanity";

export const courseType = defineType({
  name: "course",
  title: "Course",
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
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "level",
      title: "Skill Level",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "Beginner" },
          { title: "Intermediate", value: "Intermediate" },
          { title: "Advanced", value: "Advanced" },
          { title: "All Levels", value: "All Levels" },
        ],
      },
      initialValue: "Beginner",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isPopular",
      title: "Popular Course",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "studentCount",
      title: "Student Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "learningOutcomes",
      title: "Learning Outcomes",
      type: "array",
      of: [defineArrayMember({ type: "learningOutcome" })],
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: [{ type: "instructor" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      of: [defineArrayMember({ type: "module" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      instructor: "instructor.name",
      media: "coverImage",
    },
    prepare({ title, instructor, media }) {
      return {
        title,
        subtitle: instructor ? `By ${instructor}` : "No instructor assigned",
        media,
      };
    },
  },
});
