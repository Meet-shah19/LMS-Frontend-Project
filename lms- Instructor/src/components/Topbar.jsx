
import { Bell, Search, Sun, Moon } from "lucide-react";

export default function Topbar({ search, setSearch, dark, setDark }) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your courses..."
          aria-label="Search courses"
        />
        <kbd>⌘ K</kbd>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-button"
          onClick={() => setDark(!dark)}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="icon-button notification-button" title="Notifications">
          <Bell size={19} />
          <span />
        </button>
        <div className="topbar-profile">
          <div className="instructor-avatar">IN</div>
          <div className="profile-copy">
            <strong>Instructor</strong>
            <small>Administrator</small>
          </div>
        </div>
      </div>
    </header>
  );
}