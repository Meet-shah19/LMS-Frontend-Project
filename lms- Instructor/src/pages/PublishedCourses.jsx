
import { useEffect, useState } from "react";
import { getCourses } from "../api";

export default function PublishedCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getCourses()
      .then((sharedCourses) => {
        if (mounted) {
          setCourses(sharedCourses.filter((course) =>
            ["approved", "published"].includes(String(course.status || "").toLowerCase()) ||
            course.isPublished === true
          ));
        }
      })
      .catch((loadError) => {
        if (mounted) setError(loadError.message);
      });

    return () => {
      mounted = false;
    };
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
      {error && <p role="alert">{error}</p>}

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