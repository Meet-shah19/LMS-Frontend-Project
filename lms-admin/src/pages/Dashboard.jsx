function Dashboard({
  users,
  courses,
  categories,
  purchases = [],
  setPage,
}) {
  const students = users.filter(
    (user) => user.role.toLowerCase() === "student"
  ).length;

  const instructors = users.filter(
    (user) => user.role.toLowerCase() === "instructor"
  ).length;
  const pendingReview = courses.filter(
    (course) => course.status === "pending_review"
  ).length;
  const paidPurchases = purchases.filter((purchase) => purchase.status === "paid");
  const revenue = paidPurchases.reduce((total, purchase) => total + Number(purchase.amount || 0), 0);

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Overview of your learning management system"
      />

      <div className="stats-grid">
        <StatCard
          icon="♙"
          title="Total Users"
          value={users.length}
          text="Registered users"
        />

        <StatCard
          icon="🎓"
          title="Students"
          value={students}
          text="Active learners"
        />

        <StatCard
          icon="👨‍🏫"
          title="Instructors"
          value={instructors}
          text="Course instructors"
        />

        <StatCard
          icon="📚"
          title="Courses"
          value={courses.length}
          text="Total courses"
        />
        <StatCard
          icon="✓"
          title="Pending Review"
          value={pendingReview}
          text="Instructor submissions"
        />
        <StatCard
          icon="₹"
          title="Revenue"
          value={`₹${revenue.toLocaleString("en-IN")}`}
          text="Confirmed purchases"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h3>Recent Users</h3>
              <p>
                Recently added users
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                setPage("Users")
              }
            >
              View All →
            </button>
          </div>

          {users.length === 0 ? (
            <Empty
              icon="♙"
              title="No users yet"
              text="Add students or instructors from the Users page."
            />
          ) : (
            <div className="recent-list">
              {users
                .slice(-5)
                .reverse()
                .map((user) => (
                  <div
                    className="recent-item"
                    key={user.id}
                  >
                    <div className="user-avatar">
                      {user.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="recent-info">
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>

                    <Badge
                      text={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    />
                  </div>
                ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h3>Recent Courses</h3>
              <p>
                Courses added to the LMS
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                setPage("Courses")
              }
            >
              View All →
            </button>
          </div>

          {courses.length === 0 ? (
            <Empty
              icon="📚"
              title="No courses yet"
              text="Create your first course from the Courses page."
            />
          ) : (
            <div className="recent-list">
              {courses
                .slice(-5)
                .reverse()
                .map((course) => (
                  <div
                    className="recent-item"
                    key={course.id}
                  >
                    <div className="course-avatar">
                      📚
                    </div>

                    <div className="recent-info">
                      <strong>
                        {course.title}
                      </strong>

                      <span>
                        {course.instructor}
                      </span>
                    </div>

                    <Badge
                      text={course.status}
                    />
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>

      <section className="card quick-card">
        <div className="card-header">
          <div>
            <h3>Quick Overview</h3>
            <p>
              Current platform information
            </p>
          </div>
        </div>

        <div className="overview-grid">
          <Overview
            icon="✓"
            title="Review Queue"
            value={pendingReview}
            onClick={() => setPage("Review Queue")}
          />
          <Overview
            icon="♙"
            title="Users"
            value={users.length}
            onClick={() =>
              setPage("Users")
            }
          />

          <Overview
            icon="📚"
            title="Courses"
            value={courses.length}
            onClick={() =>
              setPage("Courses")
            }
          />

          <Overview
            icon="◫"
            title="Categories"
            value={categories.length}
            onClick={() =>
              setPage("Categories")
            }
          />
        </div>
      </section>
    </>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div className="page-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  text,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function Overview({
  icon,
  title,
  value,
  onClick,
}) {
  return (
    <button
      className="overview-card"
      onClick={onClick}
    >
      <div className="overview-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <b>→</b>
    </button>
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

export default Dashboard;