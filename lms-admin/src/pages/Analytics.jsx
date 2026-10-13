function Analytics({
  users,
  courses,
  categories,
}) {
  const students = users.filter(
    (user) =>
      user.role === "Student"
  ).length;

  const instructors = users.filter(
    (user) =>
      user.role === "Instructor"
  ).length;

  const active = users.filter(
    (user) =>
      user.status === "Active"
  ).length;

  return (
    <>
      <PageTitle
        title="Analytics"
        subtitle="Live statistics from your LMS"
      />

      <div className="stats-grid">
        <Stat
          icon="♙"
          title="Total Users"
          value={users.length}
        />

        <Stat
          icon="🎓"
          title="Students"
          value={students}
        />

        <Stat
          icon="👨‍🏫"
          title="Instructors"
          value={instructors}
        />

        <Stat
          icon="●"
          title="Active Users"
          value={active}
        />
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">
            📚
          </div>

          <div>
            <span>Total Courses</span>
            <strong>
              {courses.length}
            </strong>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            ◫
          </div>

          <div>
            <span>Categories</span>
            <strong>
              {categories.length}
            </strong>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            ♙
          </div>

          <div>
            <span>Total Users</span>
            <strong>
              {users.length}
            </strong>
          </div>
        </div>
      </div>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>Platform Summary</h3>
            <p>
              Statistics are calculated from your actual data.
            </p>
          </div>
        </div>

        <div className="summary-list">
          <div>
            <span>Students</span>
            <strong>{students}</strong>
          </div>

          <div>
            <span>Instructors</span>
            <strong>
              {instructors}
            </strong>
          </div>

          <div>
            <span>Courses</span>
            <strong>
              {courses.length}
            </strong>
          </div>

          <div>
            <span>Categories</span>
            <strong>
              {categories.length}
            </strong>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({
  icon,
  title,
  value,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
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

export default Analytics;