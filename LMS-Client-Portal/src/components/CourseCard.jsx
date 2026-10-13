
import { Bookmark, BookOpen, PlayCircle } from "lucide-react";

export default function CourseCard({
  course,
  progress = {},
  bookmarked = false,
  onOpen = () => {},
  onBookmark = () => {},
}) {
  const modules = Array.isArray(course.modules) ? course.modules : [];

  const lessons = modules.flatMap((module) =>
    Array.isArray(module.lessons) ? module.lessons : []
  );

  const completed = lessons.filter(
    (lesson) => progress[lesson.id] === true
  ).length;

  const percentage = lessons.length
    ? Math.round((completed / lessons.length) * 100)
    : 0;

  return (
    <article className="course-card">
      <div className="course-card-cover">
        <BookOpen size={34} />

        <button
          type="button"
          className={`bookmark-button ${bookmarked ? "selected" : ""}`}
          onClick={() => onBookmark(course.id)}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark course"}
        >
          <Bookmark size={19} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="course-card-body">
        <span className="course-tag">ONLINE COURSE</span>
        <h3>{course.title || "Untitled course"}</h3>
        <p>{course.description || "Explore this course and start learning."}</p>

        <div className="course-card-meta">
          <span>{modules.length} modules</span>
          <span>{lessons.length} lessons</span>
        </div>

        <div className="progress-label">
          <span>Your progress</span>
          <strong>{percentage}%</strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <button
          type="button"
          className="primary-button course-open-button"
          onClick={() => onOpen(course)}
        >
          <PlayCircle size={18} />
          {percentage > 0 ? "Continue learning" : "Start learning"}
        </button>
      </div>
    </article>
  );
}
