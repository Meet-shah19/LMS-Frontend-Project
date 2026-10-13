
import { BookOpen, CircleCheck } from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function MyLearning({
  courses = [],
  progress = {},
  bookmarks = [],
  onOpenCourse = () => {},
  onToggleBookmark = () => {},
}) {
  const startedCourses = courses.filter((course) => {
    const lessons = (course.modules || []).flatMap(
      (module) => module.lessons || []
    );

    return lessons.some((lesson) => progress[lesson.id] === true);
  });

  const completedCourses = courses.filter((course) => {
    const lessons = (course.modules || []).flatMap(
      (module) => module.lessons || []
    );

    return (
      lessons.length > 0 &&
      lessons.every((lesson) => progress[lesson.id] === true)
    );
  });

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PROGRESS</span>
          <h1>My Learning</h1>
          <p>Track the courses you have started and completed.</p>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Courses started</span>
            <BookOpen size={21} />
          </div>
          <h2>{startedCourses.length}</h2>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Courses completed</span>
            <CircleCheck size={21} />
          </div>
          <h2>{completedCourses.length}</h2>
        </article>
      </div>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>In progress</h2>
            <p>Courses where you have completed at least one lesson.</p>
          </div>
        </div>

        {startedCourses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={38} />
            <h3>You haven't started a course yet</h3>
            <p>Open Explore Courses to choose a course and begin learning.</p>
          </div>
        ) : (
          <div className="course-grid">
            {startedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress}
                bookmarked={bookmarks.includes(course.id)}
                onOpen={onOpenCourse}
                onBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Completed courses</h2>
            <p>Courses for which every lesson is complete.</p>
          </div>
        </div>

        {completedCourses.length === 0 ? (
          <p className="muted-text">Your completed courses will appear here.</p>
        ) : (
          <div className="completed-course-list">
            {completedCourses.map((course) => (
              <div className="completed-course-item" key={course.id}>
                <CircleCheck size={22} />
                <div>
                  <strong>{course.title}</strong>
                  <p>All lessons completed</p>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onOpenCourse(course)}
                >
                  Review course
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
