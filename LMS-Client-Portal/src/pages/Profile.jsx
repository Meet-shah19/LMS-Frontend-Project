
import { useEffect, useState } from "react";
import { UserRound, Save } from "lucide-react";

export default function Profile({
  profile = {},
  onSave = () => {},
}) {
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(profile.name || "");
    setEmail(profile.email || "");
  }, [profile.name, profile.email]);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail) {
      setMessage("Please enter your name and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    onSave({
      ...profile,
      name: cleanName,
      email: cleanEmail,
    });

    setMessage("Profile updated successfully.");
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ACCOUNT SETTINGS</span>
          <h1>My Profile</h1>
          <p>Manage your student profile information.</p>
        </div>
      </div>

      <section className="profile-panel">
        <div className="profile-header">
          <div className="profile-avatar">
            {(name || "S").charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{name || "Student"}</h2>
            <p>{email || "Add your email address"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-field">
            <label htmlFor="profile-name">Full name</label>
            <input
              id="profile-name"
              className="form-control"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="profile-email">Email address</label>
            <input
              id="profile-email"
              className="form-control"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" className="primary-button">
            <Save size={18} />
            Save profile
          </button>
        </form>
      </section>
    </div>
  );
}
