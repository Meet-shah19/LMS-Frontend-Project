
const STORAGE_KEY = "meet_lms_courses";

export function loadCourses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Could not load courses:", error);
    return [];
  }
}

export function saveCourses(courses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  window.dispatchEvent(new Event("coursesUpdated"));
}

// Keep these aliases for files using the alternative function names.
export const getCourses = loadCourses;

export function publishCourse(courseId) {
  const courses = loadCourses();

  const updatedCourses = courses.map((course) =>
    course.id === courseId
      ? { ...course, status: "published", isPublished: true }
      : course
  );

  saveCourses(updatedCourses);
  return updatedCourses;
}

export function deleteCourse(courseId) {
  const courses = loadCourses();
  saveCourses(courses.filter((course) => course.id !== courseId));
}

export function saveCourseQuiz(courseId, quiz) {
  const courses = loadCourses();

  const updatedCourses = courses.map((course) =>
    course.id === courseId
      ? { ...course, quiz }
      : course
  );

  saveCourses(updatedCourses);
  return updatedCourses;
}