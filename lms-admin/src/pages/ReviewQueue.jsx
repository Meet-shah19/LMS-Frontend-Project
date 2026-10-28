import { useState } from "react";

const actions = [
  { id: "approve", label: "Approve", className: "review-approve" },
  { id: "request_changes", label: "Request changes", className: "review-changes" },
  { id: "reject", label: "Reject", className: "review-reject" },
];

export default function ReviewQueue({ courses, onReview, loading }) {
  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pendingCourses = courses.filter(
    (course) => course.status === "pending_review"
  );
  const selected = pendingCourses.find((course) => course.id === selectedId);

  async function review(action) {
    if (!selected) return;
    if (action !== "approve" && !note.trim()) {
      window.alert("Add a note explaining the requested changes or rejection.");
      return;
    }
    setBusy(true);
    try {
      const reviewed = await onReview(selected.id, action, note.trim());
      if (reviewed) {
        setSelectedId("");
        setNote("");
        setError("");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-review-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">COURSE GOVERNANCE</span>
          <h1>Course review queue</h1>
          <p>Review instructor submissions before they become available to students.</p>
        </div>
        <span className="admin-count-badge">{pendingCourses.length} awaiting review</span>
      </header>

      {loading && <p role="status">Refreshing course submissions...</p>}
      {!loading && pendingCourses.length === 0 ? (
        <div className="admin-empty-state">
          <span>✓</span>
          <h2>You’re all caught up</h2>
          <p>New courses submitted by instructors will appear here.</p>
        </div>
      ) : (
        <div className="admin-review-layout">
          <div className="admin-review-list">
            {pendingCourses.map((course) => (
              <button
                className={`admin-review-card ${selectedId === course.id ? "selected" : ""}`}
                key={course.id}
                onClick={() => {
                  setSelectedId(course.id);
                  setNote("");
                }}
              >
                <span className="admin-status-pill pending">Pending review</span>
                <strong>{course.title}</strong>
                <span>{course.instructor || "Instructor not assigned"} · {course.category}</span>
                <small>{course.lessons?.length || 0} lessons · ₹{course.price || 0}</small>
              </button>
            ))}
          </div>

          {selected ? (
            <article className="admin-review-detail">
              <span className="admin-eyebrow">SUBMISSION DETAILS</span>
              <h2>{selected.title}</h2>
              <p>{selected.description || "No course description provided."}</p>
              <dl>
                <div><dt>Instructor</dt><dd>{selected.instructor || "Not assigned"}</dd></div>
                <div><dt>Category</dt><dd>{selected.category || "Uncategorized"}</dd></div>
                <div><dt>Price</dt><dd>₹{selected.price || 0}</dd></div>
                <div><dt>Free introduction</dt><dd>{selected.lessons?.find((lesson) => lesson.isFreeIntroduction)?.title || "Not selected"}</dd></div>
              </dl>
              <h3>Lessons</h3>
              <ol className="admin-review-lessons">
                {(selected.lessons || []).map((lesson) => (
                  <li key={lesson.id}>
                    {lesson.title}
                    {lesson.isFreeIntroduction && <span>Free intro</span>}
                  </li>
                ))}
              </ol>
              <label className="admin-review-note">
                Review note
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="Explain what should change, or why this course is rejected."
                />
                <small>Required when requesting changes or rejecting. Approval note is optional.</small>
              </label>
              {error && <p className="admin-access-error" role="alert">{error}</p>}
              <div className="admin-review-actions">
                {actions.map(({ id, label, className }) => (
                  <button
                    key={id}
                    className={className}
                    disabled={busy}
                    onClick={() => review(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </article>
          ) : (
            <div className="admin-review-detail admin-review-placeholder">
              <span>←</span>
              <h2>Select a course to review</h2>
              <p>Course details and review actions will appear here.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
