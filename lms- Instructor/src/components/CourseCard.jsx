
import { BookOpen, Pencil, Trash2, Layers, PlayCircle } from "lucide-react";

const palettes = ["purple", "blue", "orange", "green"];

export default function CourseCard({ course, index, onEdit, onDelete, onSubmitForReview }) {
  const lessonCount = course.lessons?.length || 0;
  const moduleCount = course.modules?.length || 0;
  const status = String(course.status || "draft").toLowerCase();
  const editable = status !== "pending_review";
  const reviewNote = course.reviewFeedback || course.reviewHistory?.at(-1)?.note;

  return (
    <article className="course-card">
      <div className={`course-art ${palettes[index % palettes.length]}`}>
        {course.thumbnail && <img className="course-thumbnail" src={course.thumbnail} alt="" />}
        <div className="course-art-orb" />
        {!course.thumbnail && <BookOpen size={42} />}
        <span className="art-label">{course.category || "General"}</span>
      </div>

      <div className="course-card-body">
        <div className="course-meta">
          <span className="level-tag">{course.level || "Beginner"}</span>
          <span className={`status-tag status-${status.replaceAll("_", "-")}`}>
            {status.replaceAll("_", " ")}
          </span>
        </div>

        <h3>{course.title}</h3>
        <p className="course-description">{course.description || "No description added yet."}</p>

        <div className="course-counts">
          <span><Layers size={15} /> {moduleCount} modules</span>
          <span><PlayCircle size={15} /> {lessonCount} lessons</span>
        </div>

        <div className="course-card-footer">
          <button
            className="button button-secondary button-small"
            onClick={() => onEdit(course)}
            disabled={!editable}
            title={!editable ? "Locked until the administrator reviews it" : "Edit course"}
          >
            <Pencil size={15} /> Edit
          </button>
          {["draft", "changes_requested", "rejected"].includes(status) && (
            <button
              className="button button-primary button-small"
              onClick={() => onSubmitForReview(course.id)}
              disabled={course.lessons?.filter((lesson) => lesson.isFreeIntroduction).length !== 1}
              title={course.lessons?.filter((lesson) => lesson.isFreeIntroduction).length !== 1 ? "Choose exactly one free introduction lesson before submitting" : "Submit for review"}
            >
              Submit for review
            </button>
          )}
          <button
            className="icon-button danger-button"
            onClick={() => onDelete(course.id)}
            title="Delete course"
            aria-label={`Delete ${course.title}`}
          >
            <Trash2 size={17} />
          </button>
        </div>
        {reviewNote && (
          <p className="course-review-note"><strong>Admin feedback:</strong> {reviewNote}</p>
        )}
      </div>
    </article>
  );
}