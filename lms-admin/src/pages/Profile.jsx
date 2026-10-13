import { useEffect, useState } from "react";

function Profile({
  admin,
  setAdmin,
}) {
  const [name, setName] =
    useState(admin.name);

  const [email, setEmail] =
    useState(admin.email);

  useEffect(() => {
    setName(admin.name);
    setEmail(admin.email);
  }, [admin]);

  function saveProfile(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Admin name is required.");
      return;
    }

    if (!email.trim()) {
      alert("Admin email is required.");
      return;
    }

    setAdmin({
      name: name.trim(),
      email: email.trim(),
    });

    alert(
      "Admin profile updated successfully!"
    );
  }

  const letter =
    name?.charAt(0)?.toUpperCase() || "A";

  return (
    <>
      <PageTitle
        title="Admin Profile"
        subtitle="Manage your administrator account"
      />

      <div className="profile-grid">
        <section className="profile-card">
          <div className="big-avatar">
            {letter}
          </div>

          <h2>
            {name || "Administrator"}
          </h2>

          <p>
            {email ||
              "admin@example.com"}
          </p>

          <span className="admin-badge">
            Administrator
          </span>

          <div className="profile-access">
            <span>Access Level</span>
            <strong>Full Access</strong>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h3>Personal Information</h3>
              <p>
                Update your admin information
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={saveProfile}
          >
            <div className="input-group">
              <label>Admin Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Admin Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>

            <button className="primary-button">
              Save Changes
            </button>
          </form>
        </section>
      </div>
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

export default Profile;