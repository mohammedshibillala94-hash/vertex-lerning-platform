import { defineField, defineType } from "sanity";

export const instructorType = defineType({
  name: "instructor",
  title: "Instructor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "expertise",
      title: "Expertise",
      type: "array",
      of: [{ type: "string" }],
      description: "List of areas of expertise",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      expertise: "expertise",
      media: "photo",
    },
    prepare({ title, expertise, media }) {
      return {
        title,
        subtitle: Array.isArray(expertise)
          ? expertise.join(", ")
          : typeof expertise === "string"
          ? expertise
          : "",
        media,
      };
    },
  },
});
