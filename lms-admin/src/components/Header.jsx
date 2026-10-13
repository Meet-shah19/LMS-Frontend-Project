function Header({
  admin,
  darkMode,
  setDarkMode,
  setSidebarOpen,
}) {
  const letter =
    admin.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="header">
      <div className="header-title">
        <button
          className="mobile-button"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div>
          <h1>Admin Portal</h1>
          <p>
            Manage your learning platform
          </p>
        </div>
      </div>

      <div className="header-right">
        <button
          className="theme-button"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          {darkMode ? "☀ Light" : "☾ Dark"}
        </button>

        <div className="header-line" />

        <div className="header-admin">
          <div className="header-avatar">
            {letter}
          </div>

          <div>
            <strong>
              {admin.name || "Administrator"}
            </strong>

            <span>
              {admin.email ||
                "admin@example.com"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;