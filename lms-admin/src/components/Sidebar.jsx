function Sidebar({
  page,
  setPage,
  sidebarOpen,
  setSidebarOpen,
}) {
  const items = [
    {
      name: "Dashboard",
      icon: "▦",
    },
    {
      name: "Users",
      icon: "♙",
    },
    {
      name: "Courses",
      icon: "▣",
    },
    {
      name: "Categories",
      icon: "◫",
    },
    {
      name: "Analytics",
      icon: "◒",
    },
  ];

  function navigate(name) {
    setPage(name);
    setSidebarOpen(false);
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={
          sidebarOpen
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="brand">
          <div className="brand-logo">
            L
          </div>

          <div>
            <h2>LMS</h2>
            <p>Admin Portal</p>
          </div>
        </div>

        <div className="menu-label">
          MAIN MENU
        </div>

        <nav>
          {items.map((item) => (
            <button
              key={item.name}
              className={
                page === item.name
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                navigate(item.name)
              }
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="menu-label settings-label">
          SETTINGS
        </div>

        <button
          className={
            page === "Profile"
              ? "sidebar-link active"
              : "sidebar-link"
          }
          onClick={() =>
            navigate("Profile")
          }
        >
          <span>⚙</span>
          Admin Profile
        </button>

        <div className="sidebar-footer">
          <div className="footer-admin">
            <div className="footer-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <small>Full Access</small>
            </div>
          </div>

          <div className="system-status">
            ● SYSTEM ACTIVE
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;