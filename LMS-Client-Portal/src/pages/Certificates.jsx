
import { Award, Printer } from "lucide-react";

export default function Certificates({
  courses = [],
  progress = {},
  profile = {},
}) {
  const completedCourses = courses.filter((course) => {
    const lessons = (course.modules || []).flatMap(
      (module) => module.lessons || []
    );

    return (
      lessons.length > 0 &&
      lessons.every((lesson) => progress[lesson.id] === true)
    );
  });

  function printCertificate(course) {
    window.alert(
      `Certificate for "${course.title}" will be prepared for printing.`
    );
    window.print();
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR ACHIEVEMENTS</span>
          <h1>Certificates</h1>
          <p>Celebrate the courses you have completed.</p>
        </div>
      </div>

      {completedCourses.length === 0 ? (
        <div className="empty-state">
          <Award size={42} />
          <h3>No certificates yet</h3>
          <p>Complete every lesson in a course to see it listed here.</p>
        </div>
      ) : (
        <div className="certificate-grid">
          {completedCourses.map((course) => (
            <article className="certificate-card" key={course.id}>
              <div className="certificate-icon">
                <Award size={36} />
              </div>

              <span className="course-tag">COURSE COMPLETED</span>
              <h2>{course.title}</h2>
              <p>
                Congratulations, {profile.name || "Student"}! You have
                completed all lessons in this course.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => printCertificate(course)}
              >
                <Printer size={18} />
                Print page
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
