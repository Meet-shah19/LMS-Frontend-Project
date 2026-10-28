
import { useState } from "react";
import { Save } from "lucide-react";
import LessonEditor from "./LessonEditor";

function makeId() {
  return crypto.randomUUID();
}

function initialCourseForm(course) {
  return {
    title: course?.title || "",
    description: course?.description || "",
    thumbnail: course?.thumbnail || "",
    category: course?.category || "Development",
    level: course?.level || "Beginner",
    price: course?.price ?? "0",
    modules: course?.modules || [],
    lessons: course?.lessons || [],
    quizzes: course?.quizzes || []
  };
}

export default function CourseEditor({ course, onSave, onCancel }) {
  const [form, setForm] = useState(() => initialCourseForm(course));
  const [moduleName, setModuleName] = useState("");
  const [formError, setFormError] = useState("");
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [editingModuleName, setEditingModuleName] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function addModule() {
    if (!moduleName.trim()) return;
    update("modules", [...form.modules, moduleName.trim()]);
    setModuleName("");
  }

  function saveModule(index) {
    const oldName = form.modules[index];
    const newName = editingModuleName.trim();
    if (!newName) return;
    update("modules", form.modules.map((module, i) => i === index ? newName : module));
    update("lessons", form.lessons.map((lesson) =>
      lesson.module === oldName ? { ...lesson, module: newName } : lesson
    ));
    setEditingModuleIndex(null);
    setEditingModuleName("");
  }

  function removeModule(index) {
    const removedName = form.modules[index];
    update("modules", form.modules.filter((_, i) => i !== index));
    update("lessons", form.lessons.map((lesson) =>
      lesson.module === removedName ? { ...lesson, module: "" } : lesson
    ));
  }

  async function submit(event) {
    event.preventDefault();
    if (form.title.trim().length === 0 || form.description.trim().length === 0) {
      setFormError("Enter a course title and description.");
      return;
    }
    if (form.lessons.length > 0 &&
      form.lessons.filter((lesson) => lesson.isFreeIntroduction).length !== 1) {
      setFormError("Choose exactly one free introduction lesson before saving.");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      const saved = await onSave({
        ...form,
        id: course?.id || makeId(),
        title: form.title.trim(),
        description: form.description.trim(),
        thumbnail: form.thumbnail.trim(),
        price: form.price,
      });
      if (saved === false) setSaving(false);
    } catch (error) {
      setFormError(error.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="editor-form">
      {formError && <div className="form-error" role="alert">{formError}</div>}
      {course && (
        <div className="course-review-status">
          <strong>Course status: {String(course.status || "draft").replaceAll("_", " ")}</strong>
          {(course.reviewFeedback || course.reviewHistory?.at(-1)?.note) && (
            <p><b>Admin feedback:</b> {course.reviewFeedback || course.reviewHistory.at(-1).note}</p>
          )}
        </div>
      )}
      <div className="form-grid">
        <label className="full-field">
          Course title *
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Complete React Course"
            required
          />
        </label>

        <label className="full-field">
          Description *
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="What will students learn?"
            required
          />
        </label>

        <label className="full-field">
          Thumbnail image URL
          <input
            type="url"
            value={form.thumbnail}
            onChange={(e) => update("thumbnail", e.target.value)}
            placeholder="https://example.com/course-image.jpg"
          />
        </label>

        <label>
          Category
          <select value={form.category} onChange={(e) => update("category", e.target.value)}>
            <option>Development</option>
            <option>Design</option>
            <option>Business</option>
            <option>Marketing</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Level
          <select value={form.level} onChange={(e) => update("level", e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Price (INR)
          <input
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </label>
      </div>

      <div className="section-divider" />
      <section className="module-editor">
        <h3>Course modules</h3>
        <p className="field-hint">Add sections such as Introduction, Basics, and Projects.</p>

        <div
          className="module-add-form"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addModule();
            }
          }}
        >
          <input
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            placeholder="Enter module name"
            aria-label="Module name"
          />
          <button className="button button-secondary" type="button" onClick={addModule}>Add module</button>
        </div>

        {form.modules.length > 0 ? (
          <div className="module-list">
            {form.modules.map((module, index) => (
              <div className="module-row" key={`${module}-${index}`}>
                <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
                {editingModuleIndex === index ? (
                  <>
                    <input
                      value={editingModuleName}
                      onChange={(event) => setEditingModuleName(event.target.value)}
                      aria-label="Edit module name"
                    />
                    <button type="button" className="text-button" onClick={() => saveModule(index)}>Save</button>
                    <button type="button" className="text-button" onClick={() => setEditingModuleIndex(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{module}</span>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        setEditingModuleIndex(index);
                        setEditingModuleName(module);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => removeModule(index)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-inline">No modules added yet.</p>
        )}
      </section>

      <div className="section-divider" />
      <LessonEditor
        lessons={form.lessons}
        onChange={(lessons) => update("lessons", lessons)}
        modules={form.modules}
      />

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="button button-primary" disabled={saving}>
          <Save size={17} /> {saving ? "Saving..." : course ? "Update course" : "Save course"}
        </button>
      </div>
    </form>
  );
}