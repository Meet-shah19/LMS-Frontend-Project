
import { useState } from "react";
import { Plus, Trash2, PlayCircle, FileText, Link as LinkIcon } from "lucide-react";

export default function LessonEditor({
  lessons = [],
  onChange,
  modules = [],
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [content, setContent] = useState("");
  const [module, setModule] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  function addLesson(event) {
    event?.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError("Enter a lesson title and content.");
      return;
    }
    if (type !== "text") {
      try {
        const url = new URL(content.trim());
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        setFormError("Enter a valid HTTP or HTTPS link for this lesson.");
        return;
      }
    }

    const updatedLesson = {
        id: editingId || crypto.randomUUID(),
        title: title.trim(),
        type,
        content: content.trim(),
        module,
        isFreeIntroduction: editingId
          ? Boolean(lessons.find((lesson) => lesson.id === editingId)?.isFreeIntroduction)
          : lessons.length === 0,
      };
    onChange(editingId
      ? lessons.map((lesson) => lesson.id === editingId ? updatedLesson : lesson)
      : [...lessons, updatedLesson]);

    setTitle("");
    setContent("");
    setType("video");
    setModule("");
    setEditingId(null);
    setFormError("");
  }

  function editLesson(lesson) {
    setEditingId(lesson.id);
    setTitle(lesson.title);
    setType(lesson.type);
    setContent(lesson.content);
    setModule(lesson.module || "");
    setFormError("");
  }

  function removeLesson(id) {
    onChange(lessons.filter((lesson) => lesson.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setContent("");
      setType("video");
      setModule("");
    }
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
                <small>{lesson.type.toUpperCase()}{lesson.module ? ` · ${lesson.module}` : ""} · {lesson.content.slice(0, 60)}</small>
                <label className="free-intro-choice">
                  <input
                    type="checkbox"
                    checked={Boolean(lesson.isFreeIntroduction)}
                    onChange={() => onChange(lessons.map((item) => ({
                      ...item,
                      isFreeIntroduction: item.id === lesson.id,
                    })))}
                  />
                  Free introduction lesson
                </label>
              </div>
              <button
                type="button"
                className="text-button"
                onClick={() => editLesson(lesson)}
              >
                Edit
              </button>
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

      <div
        className="lesson-add-form"
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
            event.preventDefault();
          }
        }}
      >
        <label>
          Lesson title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction" />
        </label>

        {modules.length > 0 && (
          <label>
            Module
            <select value={module} onChange={(event) => setModule(event.target.value)}>
              <option value="">Unassigned</option>
              {modules.map((name, index) => <option key={`${name}-${index}`}>{name}</option>)}
            </select>
          </label>
        )}

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
          />
          {type === "pdf" && (
            <small className="field-hint">Use a direct PDF URL. This demo stores the link, not an uploaded file.</small>
          )}
        </label>

        {formError && <p className="form-error" role="alert">{formError}</p>}
        <button className="button button-secondary" type="button" onClick={addLesson}>
          <Plus size={16} /> {editingId ? "Update lesson" : "Add lesson"}
        </button>
        {editingId && (
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setContent("");
              setType("video");
              setModule("");
              setFormError("");
            }}
          >
            Cancel edit
          </button>
        )}
      </div>
    </section>
  );
}