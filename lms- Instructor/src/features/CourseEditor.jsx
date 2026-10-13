
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import LessonEditor from "./LessonEditor";

function makeId() {
  return crypto.randomUUID();
}

export default function CourseEditor({ course, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Development",
    level: "Beginner",
    status: "Draft",
    modules: [],
    lessons: [],
    quizzes: []
  });

  const [moduleName, setModuleName] = useState("");

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "Development",
        level: course.level || "Beginner",
        status: course.status || "Draft",
        modules: course.modules || [],
        lessons: course.lessons || [],
        quizzes: course.quizzes || []
      });
    } else {
      setForm({
        title: "",
        description: "",
        category: "Development",
        level: "Beginner",
        status: "Draft",
        modules: [],
        lessons: [],
        quizzes: []
      });
    }
  }, [course]);

  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function addModule(event) {
    event.preventDefault();
    if (!moduleName.trim()) return;
    update("modules", [...form.modules, moduleName.trim()]);
    setModuleName("");
  }

  function removeModule(index) {
    update("modules", form.modules.filter((_, i) => i !== index));
  }

  function submit(event) {
    event.preventDefault();

    onSave({
      ...form,
      id: course?.id || makeId(),
      title: form.title.trim(),
      description: form.description.trim()
    });
  }

  return (
    <form onSubmit={submit} className="editor-form">
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
          Course status
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option>Draft</option>
            <option>Published</option>
          </select>
        </label>
      </div>

      <div className="section-divider" />
      <section className="module-editor">
        <h3>Course modules</h3>
        <p className="field-hint">Add sections such as Introduction, Basics, and Projects.</p>

        <form onSubmit={addModule} className="module-add-form">
          <input
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            placeholder="Enter module name"
            aria-label="Module name"
          />
          <button className="button button-secondary" type="submit">Add module</button>
        </form>

        {form.modules.length > 0 ? (
          <div className="module-list">
            {form.modules.map((module, index) => (
              <div className="module-row" key={`${module}-${index}`}>
                <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{module}</span>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => removeModule(index)}
                >
                  Remove
                </button>
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
      />

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          <Save size={17} /> Save course
        </button>
      </div>
    </form>
  );
}