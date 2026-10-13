
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  GraduationCap,
  PlusCircle,
  PanelLeftClose
} from "lucide-react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "quizzes", label: "Quiz Center", icon: ClipboardList }
];

export default function Sidebar({ page, setPage, onCreate, collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-icon"><GraduationCap size={24} /></div>
        {!collapsed && (
          <div>
            <strong>LearnSpace</strong>
            <small>Instructor Studio</small>
          </div>
        )}
      </div>

      <div className="sidebar-label">{!collapsed && "WORKSPACE"}</div>

      <nav className="side-nav">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "active" : ""}`}
            onClick={() => setPage(id)}
            title={label}
          >
            <Icon size={19} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <button className="create-course-button" onClick={onCreate}>
        <PlusCircle size={19} />
        {!collapsed && <span>Create a course</span>}
      </button>

      <div className="sidebar-bottom">
        <div className="instructor-avatar">IN</div>
        {!collapsed && (
          <div className="instructor-info">
            <strong>Instructor</strong>
            <small>Course Creator</small>
          </div>
        )}
        <button
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle sidebar"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>
    </aside>
  );
}