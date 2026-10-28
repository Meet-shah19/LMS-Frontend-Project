import { useState } from "react";

function Courses({
  courses,
  categories,
  users,
  addCourse,
  deleteCourse,
  editCourse,
  setCoursePublished,
}) {
  const instructors = users.filter(
    (user) => user.role.toLowerCase() === "instructor"
  );

  const [title, setTitle] =
    useState("");

  const [instructor, setInstructor] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [level, setLevel] =
    useState("Beginner");

  const [price, setPrice] =
    useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const visibleCourses = statusFilter === "all"
    ? courses
    : courses.filter((course) => String(course.status || "").toLowerCase() === statusFilter);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter course title.");
      return;
    }

    addCourse({
      title: title.trim(),
      instructor:
        instructor || "Not assigned",
      category:
        category || "Uncategorized",
      level,
      price: price || "0",
    });

    setTitle("");
    setInstructor("");
    setCategory("");
    setLevel("Beginner");
    setPrice("");
  }

  return (
    <>
      <PageTitle
        title="Courses"
        subtitle="Create and manage your LMS courses"
      />

      <section className="card">
        <div className="card-header">
          <div>
            <h3>Create New Course</h3>
            <p>
              Add course information below
            </p>
          </div>
        </div>

        <form
          className="form-grid"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label>Course Title</label>

            <input
              type="text"
              placeholder="Enter course title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>Instructor</label>

            <select
              value={instructor}
              onChange={(e) =>
                setInstructor(
                  e.target.value
                )
              }
            >
              <option value="">
                Select instructor
              </option>

              {instructors.map(
                (user) => (
                  <option
                    key={user.id}
                    value={user.name}
                  >
                    {user.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="input-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >
              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="input-group">
            <label>Level</label>

            <select
              value={level}
              onChange={(e) =>
                setLevel(e.target.value)
              }
            >
              <option>
                Beginner
              </option>

              <option>
                Intermediate
              </option>

              <option>
                Advanced
              </option>
            </select>
          </div>

          <div className="input-group">
            <label>Price (INR)</label>

            <input
              type="number"
              min="0"
              placeholder="Enter price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />
          </div>

          <div className="form-button">
            <button className="primary-button">
              + Create Course
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>All Courses</h3>
            <p>
              {visibleCourses.length} courses
            </p>
          </div>
          <label className="course-status-filter">
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending review</option>
              <option value="changes_requested">Changes requested</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>

        {visibleCourses.length === 0 ? (
          <Empty
            icon="📚"
            title="No courses yet"
            text="Create your first course above."
          />
        ) : (
          <div className="course-grid">
            {visibleCourses.map((course) => (
              <article className="course-card" key={course.id}>
                <div className="course-top">
                  <div className="course-icon">
                    📚
                  </div>

                  <Badge
                    text={String(course.status || "draft").replaceAll("_", " ")}
                  />
                </div>

                <span className="level">
                  {course.level}
                </span>

                <h3>{course.title}</h3>

                <p>
                  Instructor:{" "}
                  {course.instructor}
                </p>

                <p>
                  Category:{" "}
                  {course.category}
                </p>

                <div className="course-bottom">
                  <strong>
                    ₹{course.price}
                  </strong>

                  <button
                    className="edit-button"
                    onClick={() => editCourse(course)}
                  >
                    Edit
                  </button>
                  {String(course.status).toLowerCase() === "approved" && (
                    <button
                      className="publish-button"
                      onClick={() => setCoursePublished(course.id, true)}
                    >
                      Publish
                    </button>
                  )}
                  {String(course.status).toLowerCase() === "published" && (
                    <button
                      className="publish-button"
                      onClick={() => setCoursePublished(course.id, false)}
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteCourse(
                        course.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function PageTitle({
  title,
  subtitle,
}) {
  return (
    <div className="page-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="badge">
      {text}
    </span>
  );
}

function Empty({
  icon,
  title,
  text,
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        {icon}
      </div>

      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export default Courses;