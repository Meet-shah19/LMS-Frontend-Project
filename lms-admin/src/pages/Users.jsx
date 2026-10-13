import { useState } from "react";

function Users({
  users,
  addUser,
  deleteUser,
  toggleUserStatus,
}) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("Student");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter the user's name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter the user's email.");
      return;
    }

    addUser({
      name: name.trim(),
      email: email.trim(),
      role,
    });

    setName("");
    setEmail("");
    setRole("Student");
  }

  return (
    <>
      <PageTitle
        title="Users"
        subtitle="Manage students and instructors"
      />

      <section className="card">
        <div className="card-header">
          <div>
            <h3>Add New User</h3>
            <p>
              Enter real user information
            </p>
          </div>
        </div>

        <form
          className="form-grid"
          onSubmit={handleSubmit}
        >
          <Input
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Enter full name"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter email address"
          />

          <div className="input-group">
            <label>Role</label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              <option value="Student">
                Student
              </option>

              <option value="Instructor">
                Instructor
              </option>
            </select>
          </div>

          <div className="form-button">
            <button className="primary-button">
              + Add User
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>All Users</h3>
            <p>
              {users.length} users
            </p>
          </div>
        </div>

        {users.length === 0 ? (
          <Empty
            icon="♙"
            title="No users found"
            text="Users that you add will appear here."
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="table-user">
                        <div className="table-avatar">
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {user.name}
                        </strong>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <Badge
                        text={user.role}
                      />
                    </td>

                    <td>
                      <Badge
                        text={user.status}
                      />
                    </td>

                    <td>
                      <button
                        className="action-button"
                        onClick={() =>
                          toggleUserStatus(
                            user.id
                          )
                        }
                      >
                        {user.status ===
                        "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteUser(
                            user.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
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

export default Users;