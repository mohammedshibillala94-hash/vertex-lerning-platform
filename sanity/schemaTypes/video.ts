import { defineField, defineType } from "sanity";

export const videoType = defineType({
  name: "video",
  title: "Video Transcript & Chapters",
  type: "document",
  fields: [
    defineField({
      name: "videoId",
      title: "Video ID",
      type: "string",
      description: "Unique identifier derived from video URL",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "chapters",
      title: "Chapters (Table of Contents)",
      type: "array",
      of: [
        {
          type: "object",
          name: "chapter",
          fields: [
            defineField({
              name: "startSeconds",
              title: "Start Seconds",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label / Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              startSeconds: "startSeconds",
            },
            prepare({ title, startSeconds }) {
              const mins = Math.floor((startSeconds || 0) / 60);
              const secs = Math.floor((startSeconds || 0) % 60);
              const formattedTime = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
              return {
                title: `${formattedTime} - ${title}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "chunks",
      title: "Transcript Chunks",
      type: "array",
      of: [
        {
          type: "object",
          name: "chunk",
          fields: [
            defineField({
              name: "startSeconds",
              title: "Start Seconds",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "text",
              title: "Transcript Snippet",
              type: "text",
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "videoId",
      subtitle: "url",
    },
  },
});
