import { defineQuery } from "next-sanity";

// Catalog Query: All courses with instructor and category details
export const GET_ALL_COURSES_QUERY = defineQuery(`
  *[_type == "course"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    isPopular,
    studentCount,
    instructor->{
      _id,
      name,
      "slug": slug.current,
      photo,
      expertise
    },
    category->{
      _id,
      title,
      "slug": slug.current
    },
    "moduleCount": count(modules),
    "totalLessons": count(modules[].lessons[])
  }
`);

// Detail Query: Single course by slug with full modules and referenced lessons
export const GET_COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    isPopular,
    studentCount,
    learningOutcomes[] {
      icon,
      title,
      description
    },
    instructor->{
      _id,
      name,
      "slug": slug.current,
      photo,
      expertise,
      bio
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      description
    },
    modules[] {
      title,
      summary,
      lessons[]->{
        _id,
        title,
        "slug": slug.current,
        videoUrl,
        duration,
        isFreePreview,
        studentCount
      }
    }
  }
`);

// Lesson Query: Lesson by slug with reverse parent course lookup
export const GET_LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    poster,
    duration,
    isFreePreview,
    studentCount,
    notes,
    keyPoints[] {
      title,
      description
    },
    proTip,
    resources[] {
      type,
      title,
      description,
      url
    },
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      "slug": slug.current,
      instructor->{
        _id,
        name,
        photo
      },
      modules[] {
        title,
        summary,
        lessons[]->{
          _id,
          title,
          "slug": slug.current,
          duration,
          isFreePreview
        }
      }
    }
  }
`);

// Instructors Query: All instructors
export const GET_ALL_INSTRUCTORS_QUERY = defineQuery(`
  *[_type == "instructor"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`);

// Instructor Detail Query: Single instructor with authored courses
export const GET_INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] {
      _id,
      title,
      "slug": slug.current,
      summary,
      coverImage,
      level,
      studentCount,
      category->{
        title
      }
    }
  }
`);

// Categories Query: All categories
export const GET_ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`);
