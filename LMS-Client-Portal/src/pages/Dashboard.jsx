
import {
  BookOpen,
  GraduationCap,
  CircleCheck,
  Clock,
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import StatCard from "../components/StatCard";

export default function Dashboard({
  courses = [],
  progress = {},
  bookmarks = [],
  profile = {},
  onOpenCourse = () => {},
  onToggleBookmark = () => {},
  setActivePage = () => {},
}) {
  const allCourses = Array.isArray(courses) ? courses : [];

  const allLessons = allCourses.flatMap((course) =>
    (course.modules || []).flatMap((module) => module.lessons || [])
  );

  const completedLessons = allLessons.filter(
    (lesson) => progress[lesson.id] === true
  ).length;

  const startedCourses = allCourses.filter((course) =>
    (course.modules || []).some((module) =>
      (module.lessons || []).some((lesson) => progress[lesson.id] === true)
    )
  ).length;

  const completedCourses = allCourses.filter((course) => {
    const lessons = (course.modules || []).flatMap(
      (module) => module.lessons || []
    );

    return (
      lessons.length > 0 &&
      lessons.every((lesson) => progress[lesson.id] === true)
    );
  }).length;

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">YOUR LEARNING JOURNEY</span>
          <h1>Welcome back, {profile.name || "Student"}!</h1>
          <p>Keep learning, keep growing, and reach your next goal.</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => setActivePage("Explore Courses")}
          >
            Explore courses
          </button>
        </div>

        <GraduationCap size={85} className="welcome-icon" />
      </section>

      <div className="stats-grid">
        <StatCard
          title="Available courses"
          value={allCourses.length}
          subtitle="Ready to explore"
          icon={BookOpen}
        />

        <StatCard
          title="Courses started"
          value={startedCourses}
          subtitle="Your learning activity"
          icon={Clock}
        />

        <StatCard
          title="Lessons completed"
          value={completedLessons}
          subtitle={`Out of ${allLessons.length} lessons`}
          icon={CircleCheck}
        />

        <StatCard
          title="Courses completed"
          value={completedCourses}
          subtitle="Keep up the progress"
          icon={GraduationCap}
        />
      </div>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Continue learning</h2>
            <p>Pick up where you left off.</p>
          </div>

          <button
            type="button"
            className="text-button"
            onClick={() => setActivePage("My Learning")}
          >
            View my learning
          </button>
        </div>

        {allCourses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={38} />
            <h3>No courses available yet</h3>
            <p>Courses will appear here when they are added to the portal.</p>
          </div>
        ) : (
          <div className="course-grid">
            {allCourses.slice(0, 3).map((course) => (
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
    </div>
  );
}
