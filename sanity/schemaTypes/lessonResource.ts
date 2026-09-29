import { defineField, defineType } from "sanity";

export const lessonResourceType = defineType({
  name: "lessonResource",
  title: "Lesson Resource",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Resource Type",
      type: "string",
      options: {
        list: [
          { title: "GitHub Repository", value: "github" },
          { title: "External Link / Docs", value: "link" },
          { title: "PDF Document", value: "pdf" },
          { title: "ZIP Code Archive", value: "zip" },
        ],
      },
      initialValue: "link",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
