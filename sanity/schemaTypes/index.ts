import { SchemaTypeDefinition } from "sanity";
import { categoryType } from "./category";
import { instructorType } from "./instructor";
import { learningOutcomeType } from "./learningOutcome";
import { moduleType } from "./module";
import { lessonKeyPointType } from "./lessonKeyPoint";
import { lessonResourceType } from "./lessonResource";
import { lessonType } from "./lesson";
import { courseType } from "./course";
import { videoType } from "./video";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    lessonKeyPointType,
    lessonResourceType,
    instructorType,
    categoryType,
    learningOutcomeType,
    videoType,
  ],
};
