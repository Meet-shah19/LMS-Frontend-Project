
import { useState } from "react";
import { Plus, Trash2, PlayCircle, FileText, Link as LinkIcon } from "lucide-react";

export default function LessonEditor({ lessons = [], onChange }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [content, setContent] = useState("");

  function addLesson(event) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onChange([
      ...lessons,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        type,
        content: content.trim()
      }
    ]);

    setTitle("");
    setContent("");
  }

  function removeLesson(id) {
    onChange(lessons.filter((lesson) => lesson.id !== id));
  }

  return (
    <section className="lesson-editor">
      <h3>Lesson content</h3>
      <p className="field-hint">Add a video link, PDF link, or text lesson to this course.</p>

      <div className="lesson-list">
        {lessons.map((lesson) => {
          const Icon = lesson.type === "video"
            ? PlayCircle
            : lesson.type === "pdf"
              ? FileText
              : LinkIcon;

          return (
            <div className="lesson-row" key={lesson.id}>
              <div className="lesson-type-icon"><Icon size={18} /></div>
              <div className="lesson-row-info">
                <strong>{lesson.title}</strong>
                <small>{lesson.type.toUpperCase()} · {lesson.content.slice(0, 60)}</small>
              </div>
              <button
                type="button"
                className="icon-button danger-button"
                onClick={() => removeLesson(lesson.id)}
                aria-label={`Remove ${lesson.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      <form onSubmit={addLesson} className="lesson-add-form">
        <label>
          Lesson title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction" required />
        </label>

        <label>
          Content type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="video">Video link</option>
            <option value="pdf">PDF link</option>
            <option value="text">Text lesson</option>
          </select>
        </label>

        <label className="full-field">
          {type === "video" ? "Video URL" : type === "pdf" ? "PDF URL" : "Lesson text"}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === "video"
                ? "https://www.youtube.com/watch?v=..."
                : type === "pdf"
                  ? "https://example.com/lesson.pdf"
                  : "Write your lesson content here..."
            }
            rows={3}
            required
          />
          {type === "pdf" && (
            <small className="field-hint">Use a direct PDF URL. This demo stores the link, not an uploaded file.</small>
          )}
        </label>

        <button className="button button-secondary" type="submit">
          <Plus size={16} /> Add lesson
        </button>
      </form>
    </section>
  );
}