
import { BookOpen, Pencil, Trash2, Layers, PlayCircle } from "lucide-react";

const palettes = ["purple", "blue", "orange", "green"];

export default function CourseCard({ course, index, onEdit, onDelete }) {
  const lessonCount = course.lessons?.length || 0;
  const moduleCount = course.modules?.length || 0;

  return (
    <article className="course-card">
      <div className={`course-art ${palettes[index % palettes.length]}`}>
        <div className="course-art-orb" />
        <BookOpen size={42} />
        <span className="art-label">{course.category || "General"}</span>
      </div>

      <div className="course-card-body">
        <div className="course-meta">
          <span className="level-tag">{course.level || "Beginner"}</span>
          <span className={`status-tag ${course.status === "Published" ? "published" : ""}`}>
            {course.status || "Draft"}
          </span>
        </div>

        <h3>{course.title}</h3>
        <p className="course-description">{course.description || "No description added yet."}</p>

        <div className="course-counts">
          <span><Layers size={15} /> {moduleCount} modules</span>
          <span><PlayCircle size={15} /> {lessonCount} lessons</span>
        </div>

        <div className="course-card-footer">
          <button className="button button-secondary button-small" onClick={() => onEdit(course)}>
            <Pencil size={15} /> Edit
          </button>
          <button
            className="icon-button danger-button"
            onClick={() => onDelete(course.id)}
            title="Delete course"
            aria-label={`Delete ${course.title}`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}