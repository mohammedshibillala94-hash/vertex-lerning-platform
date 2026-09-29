import type { StructureResolver } from "sanity/structure";

const KNOWN_DOC_TYPES = [
  "course",
  "lesson",
  "instructor",
  "category",
  "video",
];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Vertex Content")
    .items([
      S.documentTypeListItem("course").title("Courses"),
      S.documentTypeListItem("lesson").title("Lessons"),
      S.divider(),
      S.documentTypeListItem("instructor").title("Instructors"),
      S.documentTypeListItem("category").title("Categories"),
      S.divider(),
      S.documentTypeListItem("video").title("Video Transcripts & Chapters"),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        if (!id || KNOWN_DOC_TYPES.includes(id)) return false;
        const schemaType = context.schema.get(id);
        return schemaType?.type?.name === "document";
      }),
    ]);
