import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Courses from "./pages/Courses.jsx";
import Categories from "./pages/Categories.jsx";
import Analytics from "./pages/Analytics.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  const [page, setPage] = useState("Dashboard");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("lms_theme") === "dark";
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("lms_admin");

    if (saved) {
      return JSON.parse(saved);
    }

    return {
      name: "Administrator",
      email: "admin@example.com",
    };
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("lms_users");

    return saved ? JSON.parse(saved) : [];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("lms_courses");

    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("lms_categories");

    return saved ? JSON.parse(saved) : [];
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* SAVE ADMIN */

  useEffect(() => {
    localStorage.setItem(
      "lms_admin",
      JSON.stringify(admin)
    );
  }, [admin]);

  /* SAVE USERS */

  useEffect(() => {
    localStorage.setItem(
      "lms_users",
      JSON.stringify(users)
    );
  }, [users]);

  /* SAVE COURSES */

  useEffect(() => {
    localStorage.setItem(
      "lms_courses",
      JSON.stringify(courses)
    );
  }, [courses]);

  /* SAVE CATEGORIES */

  useEffect(() => {
    localStorage.setItem(
      "lms_categories",
      JSON.stringify(categories)
    );
  }, [categories]);

  /* SAVE THEME */

  useEffect(() => {
    localStorage.setItem(
      "lms_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* ADD USER */

  function addUser(user) {
    setUsers((old) => [
      ...old,
      {
        id: Date.now(),
        ...user,
        status: "Active",
      },
    ]);
  }

  /* DELETE USER */

  function deleteUser(id) {
    setUsers((old) =>
      old.filter((user) => user.id !== id)
    );
  }

  /* CHANGE USER STATUS */

  function toggleUserStatus(id) {
    setUsers((old) =>
      old.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  }

  /* ADD COURSE */

  function addCourse(course) {
    setCourses((old) => [
      ...old,
      {
        id: Date.now(),
        ...course,
        status: "Approved",
      },
    ]);
  }

  /* DELETE COURSE */

  function deleteCourse(id) {
    setCourses((old) =>
      old.filter((course) => course.id !== id)
    );
  }

  /* ADD CATEGORY */

  function addCategory(name) {
    setCategories((old) => [
      ...old,
      {
        id: Date.now(),
        name,
      },
    ]);
  }

  /* DELETE CATEGORY */

  function deleteCategory(id) {
    setCategories((old) =>
      old.filter((category) => category.id !== id)
    );
  }

  function renderPage() {
    switch (page) {
      case "Dashboard":
        return (
          <Dashboard
            users={users}
            courses={courses}
            categories={categories}
            setPage={setPage}
          />
        );

      case "Users":
        return (
          <Users
            users={users}
            addUser={addUser}
            deleteUser={deleteUser}
            toggleUserStatus={toggleUserStatus}
          />
        );

      case "Courses":
        return (
          <Courses
            courses={courses}
            categories={categories}
            users={users}
            addCourse={addCourse}
            deleteCourse={deleteCourse}
          />
        );

      case "Categories":
        return (
          <Categories
            categories={categories}
            addCategory={addCategory}
            deleteCategory={deleteCategory}
          />
        );

      case "Analytics":
        return (
          <Analytics
            users={users}
            courses={courses}
            categories={categories}
          />
        );

      case "Profile":
        return (
          <Profile
            admin={admin}
            setAdmin={setAdmin}
          />
        );

      default:
        return <Dashboard />;
    }
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Sidebar
        page={page}
        setPage={setPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main">
        <Header
          admin={admin}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;