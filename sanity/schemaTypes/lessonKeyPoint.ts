import { defineField, defineType } from "sanity";

export const lessonKeyPointType = defineType({
  name: "lessonKeyPoint",
  title: "Lesson Key Point",
  type: "object",
  fields: [
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
  ],
});
