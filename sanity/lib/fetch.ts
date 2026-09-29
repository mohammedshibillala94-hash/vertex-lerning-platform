import { serverClient } from "./client";
import {
  GET_ALL_COURSES_QUERY,
  GET_COURSE_BY_SLUG_QUERY,
  GET_LESSON_BY_SLUG_QUERY,
  GET_ALL_INSTRUCTORS_QUERY,
  GET_INSTRUCTOR_BY_SLUG_QUERY,
  GET_ALL_CATEGORIES_QUERY,
} from "./queries";

export async function getAllCourses() {
  return await serverClient.fetch(GET_ALL_COURSES_QUERY, {}, { next: { revalidate: 60 } });
}

export async function getCourseBySlug(slug: string) {
  return await serverClient.fetch(GET_COURSE_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
}

export async function getLessonBySlug(slug: string) {
  return await serverClient.fetch(GET_LESSON_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
}

export async function getAllInstructors() {
  return await serverClient.fetch(GET_ALL_INSTRUCTORS_QUERY, {}, { next: { revalidate: 300 } });
}

export async function getInstructorBySlug(slug: string) {
  return await serverClient.fetch(GET_INSTRUCTOR_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
}

export async function getAllCategories() {
  return await serverClient.fetch(GET_ALL_CATEGORIES_QUERY, {}, { next: { revalidate: 300 } });
}
