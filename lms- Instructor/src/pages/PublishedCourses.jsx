
import { useEffect, useState } from "react";
import { getCourses } from "../utils/storage";

export default function PublishedCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = () => {
      setCourses(
        getCourses().filter(
          (course) =>
            course.status === "published" ||
            course.isPublished === true
        )
      );
    };

    loadCourses();
    window.addEventListener("coursesUpdated", loadCourses);

    return () =>
      window.removeEventListener("coursesUpdated", loadCourses);
  }, []);

  const openCourse = (course) => {
    const lessons = (course.modules || []).flatMap(
      (module) => module.lessons || []
    );

    alert(
      `${course.title}\n\n${lessons.length} lessons available`
    );
  };

  return (
    <main className="page-content">
      <h1>Published Courses</h1>
      <p>Open your published courses here.</p>

      {courses.length === 0 ? (
        <p>
          No published courses yet. Open My Courses and publish a course first.
        </p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description || "Start learning today."}</p>

              <button onClick={() => openCourse(course)}>
                Open Course
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}