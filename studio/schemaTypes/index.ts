import { type SchemaTypeDefinition } from "sanity";

import { categoryType } from "./category";
import { courseType } from "./course";
import { instructorType } from "./instructor";
import { learningOutcomeType } from "./learningOutcome";
import { lessonType } from "./lesson";
import { lessonKeyPointType } from "./lessonKeyPoint";
import { lessonResourceType } from "./lessonResource";
import { moduleType } from "./module";
import { videoType } from "./video";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    categoryType,
    videoType,
    learningOutcomeType,
    lessonKeyPointType,
    lessonResourceType,
  ],
};
