
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  ClipboardList,
  NotebookPen,
  Award,
  UserRound,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Explore Courses", label: "Explore Courses", icon: Compass },
  { id: "My Learning", label: "My Learning", icon: BookOpen },
  { id: "Quiz Center", label: "Quiz Center", icon: ClipboardList },
  { id: "My Notes", label: "My Notes", icon: NotebookPen },
  { id: "Certificates", label: "Certificates", icon: Award },
  { id: "Profile", label: "Profile", icon: UserRound },
];

export default function Sidebar({
  activePage = "Dashboard",
  setActivePage = () => {},
  profile = {},
}) {
  const name = profile.name || "Student";
  const email = profile.email || "student@example.com";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={25} />
        </div>
        <div>
          <h2>LearnSpace</h2>
          <p>Student Portal</p>
        </div>
      </div>

      <p className="sidebar-label">MENU</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{name.charAt(0).toUpperCase()}</div>
        <div className="sidebar-user-info">
          <strong>{name}</strong>
          <span>{email}</span>
        </div>
      </div>
    </aside>
  );
}
