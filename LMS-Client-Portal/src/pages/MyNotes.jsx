
import { useState } from "react";
import { NotebookPen, Save } from "lucide-react";

export default function MyNotes({
  courses = [],
  notes = {},
  setNotes = () => {},
}) {
  const lessons = courses.flatMap((course) =>
    (course.modules || []).flatMap((module) =>
      (module.lessons || []).map((lesson) => ({
        ...lesson,
        courseTitle: course.title,
        moduleTitle: module.title,
      }))
    )
  );

  const [selectedLessonId, setSelectedLessonId] = useState(
    lessons.length ? String(lessons[0].id) : ""
  );

  const selectedLesson = lessons.find(
    (lesson) => String(lesson.id) === selectedLessonId
  );

  const savedDraft = selectedLesson ? notes[selectedLesson.id] || "" : "";
  const [draft, setDraft] = useState(savedDraft);
  const [draftSource, setDraftSource] = useState({
    lessonId: selectedLessonId,
    value: savedDraft,
  });

  if (draftSource.lessonId !== selectedLessonId || draftSource.value !== savedDraft) {
    setDraftSource({ lessonId: selectedLessonId, value: savedDraft });
    setDraft(savedDraft);
  }

  function saveNote() {
    if (!selectedLesson) return;

    setNotes((previous) => ({
      ...previous,
      [selectedLesson.id]: draft,
    }));

    window.alert("Note saved.");
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR STUDY SPACE</span>
          <h1>My Notes</h1>
          <p>Write down important points while learning.</p>
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="empty-state">
          <NotebookPen size={38} />
          <h3>No lessons available</h3>
          <p>Notes can be added when courses contain lessons.</p>
        </div>
      ) : (
        <section className="notes-panel">
          <label htmlFor="note-lesson">Choose a lesson</label>

          <select
            id="note-lesson"
            className="form-control"
            value={selectedLessonId}
            onChange={(event) => {
              setSelectedLessonId(event.target.value);
            }}
          >
            {lessons.map((lesson) => (
              <option key={lesson.id} value={String(lesson.id)}>
                {lesson.courseTitle} — {lesson.title}
              </option>
            ))}
          </select>

          {selectedLesson && (
            <>
              <div className="notes-context">
                <span>{selectedLesson.moduleTitle || "Course lesson"}</span>
                <h2>{selectedLesson.title}</h2>
              </div>

              <label htmlFor="note-text">Your notes</label>

              <textarea
                id="note-text"
                className="form-control notes-textarea"
                rows={10}
                placeholder="Write your notes here..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />

              <button
                type="button"
                className="primary-button"
                onClick={saveNote}
              >
                <Save size={18} />
                Save note
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}
