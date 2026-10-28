import { useState } from "react";

export default function Payments({
  purchases,
  enrollments,
  users,
  courses,
  loading,
  onGrantAccess,
  onRevokeAccess,
}) {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const students = users.filter((user) => user.role === "student");
  const grantableCourses = courses.filter(isStudentVisibleCourse);
  const unpublishedCourses = courses.filter((course) => !isStudentVisibleCourse(course));
  const paidTotal = purchases
    .filter((purchase) => purchase.status === "paid")
    .reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);

  async function grant(event) {
    event.preventDefault();
    if (!studentId || !courseId) return;
    setBusy(true);
    try {
      const granted = await onGrantAccess(studentId, courseId);
      if (granted) {
        setStudentId("");
        setCourseId("");
        setError("");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-payments-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">COMMERCE & ACCESS</span>
          <h1>Payments and access</h1>
          <p>Review purchase records and manage account-based course access.</p>
        </div>
      </header>

      <div className="admin-payment-summary">
        <article><span>Recorded purchases</span><strong>{purchases.length}</strong></article>
        <article><span>Successful revenue</span><strong>₹{paidTotal.toLocaleString("en-IN")}</strong></article>
        <article><span>Paid orders</span><strong>{purchases.filter((item) => item.status === "paid").length}</strong></article>
      </div>

      <article className="admin-access-card">
        <div>
          <span className="admin-eyebrow">COMP ACCESS</span>
          <h2>Grant course access</h2>
          <p>Manual access is recorded by the server and does not create a payment.</p>
        </div>
        <form onSubmit={grant}>
          <label>
            Student
            <select value={studentId} onChange={(event) => setStudentId(event.target.value)} required>
              <option value="">Select a student</option>
              {students.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}
            </select>
          </label>
          <label>
            Course
            <select
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              required
              disabled={loading || !grantableCourses.length}
            >
              <option value="">
                {loading && !grantableCourses.length
                  ? "Refreshing courses..."
                  : grantableCourses.length
                    ? "Select a course"
                    : "No published courses available"}
              </option>
              {grantableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                  {course.category ? ` · ${course.category}` : ""}
                  {course.instructor ? ` · ${typeof course.instructor === "string" ? course.instructor : course.instructor.name}` : ""}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={busy || loading || !grantableCourses.length}>
            {busy ? "Granting..." : "Grant access"}
          </button>
        </form>
        {!grantableCourses.length && unpublishedCourses.length > 0 && (
          <p className="admin-access-hint">
            {unpublishedCourses.length} course{unpublishedCourses.length === 1 ? " is" : "s are"} not published yet.
            Submit instructor courses for review, then approve and publish them in Courses before granting access.
          </p>
        )}
        {!courses.length && (
          <p className="admin-access-hint">
            No courses are saved yet. Create one in the Instructor Portal and publish it to make it available here.
          </p>
        )}
        {error && <p className="admin-access-error" role="alert">{error}</p>}
      </article>

      <article className="admin-payment-table-card">
        <div className="admin-payment-table-heading">
          <div><h2>Purchase history</h2><p>Payments are confirmed only through verified provider webhooks.</p></div>
          {loading && <span role="status">Refreshing...</span>}
        </div>
        <div className="admin-table-scroll">
          <table>
            <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Provider</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.student?.name || purchase.studentName || "Student"}</td>
                  <td>{purchase.course?.title || purchase.courseTitle || "Course"}</td>
                  <td>₹{Number(purchase.amount || 0).toLocaleString("en-IN")}</td>
                  <td>{purchase.providerPaymentId || purchase.provider || "—"}</td>
                  <td><span className={`admin-status-pill ${purchase.status}`}>{purchase.status}</span></td>
                  <td>{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {!purchases.length && (
                <tr><td colSpan="6" className="admin-no-purchases">No purchases have been recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="admin-payment-table-card">
        <div className="admin-payment-table-heading">
          <div><h2>Course access</h2><p>Includes verified purchases and manual grants.</p></div>
        </div>
        <div className="admin-table-scroll">
          <table>
            <thead><tr><th>Student</th><th>Course</th><th>Granted</th><th>Access type</th><th>Status</th><th /></tr></thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>{enrollment.student?.name || "Student"}<small>{enrollment.student?.email}</small></td>
                  <td>{enrollment.course?.title || "Course"}</td>
                  <td>{enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : "—"}</td>
                  <td>{enrollment.accessSource || "legacy"}</td>
                  <td><span className={`admin-status-pill ${enrollment.accessStatus}`}>{enrollment.accessStatus || "active"}</span></td>
                  <td>{enrollment.accessStatus !== "revoked" && <button className="admin-revoke-button" onClick={() => onRevokeAccess(enrollment.id)}>Revoke</button>}</td>
                </tr>
              ))}
              {!enrollments.length && (
                <tr><td colSpan="6" className="admin-no-purchases">No course access records.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function isStudentVisibleCourse(course) {
  const status = String(course.status || "").toLowerCase();
  return status === "published" ||
    (course.hasPublishedVersion === true &&
      Boolean(course.publishedVersion) &&
      status !== "draft");
}
