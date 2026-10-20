import { defineField, defineType } from "sanity";

export const agentContextType = defineType({
  name: "sanity.agentContext",
  title: "Agent Context",
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
      name: "groqFilter",
      title: "Content Filter (GROQ Expression)",
      type: "text",
      rows: 3,
      description: "A GROQ expression scoping which documents the agent can access (e.g. _type in ['course', 'lesson'] && !(_id in path('drafts.**')))",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "instructions",
      title: "Instructions (Pure Deltas)",
      type: "text",
      rows: 15,
      description: "Domain-specific guidance for the agent, injected into tool descriptions as custom instructions.",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
