import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Courses from "./pages/Courses.jsx";
import Categories from "./pages/Categories.jsx";
import Analytics from "./pages/Analytics.jsx";
import Profile from "./pages/Profile.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ReviewQueue from "./pages/ReviewQueue.jsx";
import Payments from "./pages/Payments.jsx";
import {
  createCourse as createSharedCourse,
  createUser as createSharedUser,
  createCategory as createSharedCategory,
  deleteCourse as deleteSharedCourse,
  deleteCategory as deleteSharedCategory,
  deleteUser as deleteSharedUser,
  clearToken,
  getCategories,
  getCourses,
  getReviewQueue,
  getPurchases,
  getAdminEnrollments,
  getMe,
  getUsers,
  updateMe,
  updateCourse as updateSharedCourse,
  reviewCourse as reviewSharedCourse,
  setCoursePublished as setSharedCoursePublished,
  grantCourseAccess as grantSharedCourseAccess,
  revokeCourseAccess as revokeSharedCourseAccess,
  updateUserStatus,
} from "./api.js";

function App() {
  const [page, setPage] = useState("Dashboard");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("lms_theme") === "dark";
  });

  const [admin, setAdmin] = useState(null);
  const [authChecked, setAuthChecked] = useState(() => !localStorage.getItem("lms_token"));
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [apiError, setApiError] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [refreshingPayments, setRefreshingPayments] = useState(false);

  const [categories, setCategories] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("lms_token");
    if (!token) return () => { mounted = false; };
    getMe()
      .then((user) => {
        if (user.role !== "admin") {
          clearToken();
          return;
        }
        if (mounted) setAdmin(user);
      })
      .catch((error) => {
        clearToken();
        if (mounted) setApiError(error.message);
      })
      .finally(() => {
        if (mounted) setAuthChecked(true);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!admin) return undefined;
    let mounted = true;
    async function loadSharedData() {
      try {
        const [savedUsers, savedCourses, savedCategories, pendingCourses, savedPurchases, savedEnrollments] = await Promise.all([
          getUsers(),
          getCourses(),
          getCategories(),
          getReviewQueue(),
          getPurchases(),
          getAdminEnrollments(),
        ]);
        if (!mounted) return;
        setUsers(savedUsers);
        setCourses(savedCourses);
        setCategories(savedCategories);
        setReviewQueue(pendingCourses);
        setPurchases(savedPurchases);
        setEnrollments(savedEnrollments);
      } catch (error) {
        if (mounted) setApiError(error.message);
      } finally {
        if (mounted) setLoadingData(false);
      }
    }
    loadSharedData();
    return () => {
      mounted = false;
    };
  }, [admin]);

  useEffect(() => {
    if (!admin || page !== "Payments") return undefined;
    let mounted = true;
    async function refreshPaymentData() {
      setRefreshingPayments(true);
      try {
        const [savedCourses, savedPurchases, savedEnrollments] = await Promise.all([
          getCourses(),
          getPurchases(),
          getAdminEnrollments(),
        ]);
        if (!mounted) return;
        setCourses(savedCourses);
        setPurchases(savedPurchases);
        setEnrollments(savedEnrollments);
        setApiError("");
      } catch (error) {
        if (mounted) setApiError(`Could not refresh payment and course data: ${error.message}`);
      } finally {
        if (mounted) setRefreshingPayments(false);
      }
    }
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshPaymentData();
    };
    void refreshPaymentData();
    const interval = window.setInterval(refreshPaymentData, 30000);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [admin, page]);

  /* SAVE THEME */

  useEffect(() => {
    localStorage.setItem(
      "lms_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* ADD USER */

  async function addUser(user) {
    try {
      const savedUser = await createSharedUser(user);
      setUsers((old) => [...old, savedUser]);
      setApiError("");
    } catch (error) {
      setApiError(error.message);
      throw error;
    }
  }

  /* DELETE USER */

  async function deleteUser(id) {
    try {
      await deleteSharedUser(id);
      setUsers((old) => old.filter((user) => user.id !== id));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  /* CHANGE USER STATUS */

  async function toggleUserStatus(id) {
    const user = users.find((item) => item.id === id);
    if (!user) return;
    const status = user.status === "Active" ? "Inactive" : "Active";
    try {
      const updated = await updateUserStatus(id, status);
      setUsers((old) => old.map((item) => item.id === id ? updated : item));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  /* ADD COURSE */

  async function addCourse(course) {
    try {
      const savedCourse = await createSharedCourse(course);
      setCourses((old) => [...old, savedCourse]);
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function editCourse(course) {
    const title = window.prompt("Course title", course.title);
    if (title === null) return;
    const description = window.prompt("Course description", course.description || "");
    if (description === null) return;
    const category = window.prompt("Course category", course.category || "Uncategorized");
    if (category === null) return;
    const level = window.prompt("Course level", course.level || "Beginner");
    if (level === null) return;
    const price = window.prompt("Price in INR", String(course.price ?? "0"));
    if (price === null) return;
    try {
      const saved = await updateSharedCourse({
        ...course,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        level: level.trim(),
        price,
      });
      setCourses((old) => old.map((item) => item.id === saved.id ? saved : item));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function setCoursePublished(courseId, published) {
    try {
      await setSharedCoursePublished(courseId, published);
      const savedCourses = await getCourses();
      setCourses(savedCourses);
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function reviewCourse(courseId, action, note) {
    try {
      await reviewSharedCourse(courseId, action, note);
      const [savedCourses, pendingCourses] = await Promise.all([getCourses(), getReviewQueue()]);
      setCourses(savedCourses);
      setReviewQueue(pendingCourses);
      setApiError("");
      return true;
    } catch (error) {
      setApiError(error.message);
      return false;
    }
  }

  async function grantCourseAccess(studentId, courseId) {
    try {
      const savedEnrollment = await grantSharedCourseAccess(studentId, courseId);
      setEnrollments((old) => [savedEnrollment, ...old.filter((item) => item.id !== savedEnrollment.id)]);
      setApiError("");
      return true;
    } catch (error) {
      setApiError(error.message);
      return false;
    }
  }

  async function revokeCourseAccess(enrollmentId) {
    if (!window.confirm("Revoke this student's course access?")) return;
    try {
      await revokeSharedCourseAccess(enrollmentId);
      setEnrollments((old) => old.map((item) => item.id === enrollmentId
        ? { ...item, accessStatus: "revoked" }
        : item));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  /* DELETE COURSE */

  async function deleteCourse(id) {
    try {
      await deleteSharedCourse(id);
      setCourses((old) => old.filter((course) => course.id !== id));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  /* ADD CATEGORY */

  async function addCategory(name) {
    try {
      const category = await createSharedCategory(name);
      setCategories((old) => [...old, category]);
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  /* DELETE CATEGORY */

  async function deleteCategory(id) {
    try {
      await deleteSharedCategory(id);
      setCategories((old) => old.filter((category) => category.id !== id));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function saveAdminProfile(profile) {
    try {
      const updated = await updateMe({ name: profile.name, email: profile.email });
      setAdmin(updated);
      setApiError("");
      return updated;
    } catch (error) {
      setApiError(error.message);
      throw error;
    }
  }

  function renderPage() {
    switch (page) {
      case "Dashboard":
        return (
          <Dashboard
            users={users}
            courses={courses}
            categories={categories}
            purchases={purchases}
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
            editCourse={editCourse}
            setCoursePublished={setCoursePublished}
          />
        );

      case "Review Queue":
        return <ReviewQueue courses={reviewQueue} onReview={reviewCourse} loading={loadingData} />;

      case "Payments":
        return (
          <Payments
            purchases={purchases}
            enrollments={enrollments}
            users={users}
            courses={courses}
            loading={loadingData || refreshingPayments}
            onGrantAccess={grantCourseAccess}
            onRevokeAccess={revokeCourseAccess}
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
            purchases={purchases}
          />
        );

      case "Profile":
        return (
          <Profile
            admin={admin}
            setAdmin={saveAdminProfile}
          />
        );

      default:
        return <Dashboard />;
    }
  }

  if (!authChecked) return <p role="status">Checking administrator session...</p>;
  if (!admin) return <AdminLogin onLogin={setAdmin} />;

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
          {apiError && (
            <div role="alert" style={{ color: "#b42318", marginBottom: 16 }}>
              {apiError}
            </div>
          )}
          {loadingData ? (
            <p role="status">Connecting to the shared LMS data...</p>
          ) : renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;