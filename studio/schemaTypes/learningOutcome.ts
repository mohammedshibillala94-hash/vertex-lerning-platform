import { defineField, defineType } from "sanity";

export const learningOutcomeType = defineType({
  name: "learningOutcome",
  title: "Learning Outcome",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Identifier for display icon (e.g., 'code', 'server', 'zap', 'shield')",
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
      type: "text",
      rows: 2,
    }),
  ],
});
