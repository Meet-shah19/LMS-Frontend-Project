import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Modal from "./components/Modal";

import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import QuizCenter from "./pages/QuizCenter";

import CourseEditor from "./features/CourseEditor";
import QuizBuilder from "./features/QuizBuilder.jsx";
import Login from "./components/Login.jsx";
import {
  clearToken,
  createCourse as createSharedCourse,
  deleteCourse as deleteSharedCourse,
  getCourses,
  getMe,
  submitCourseForReview,
  updateCourse,
} from "./api.js";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [notice, setNotice] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(() => !localStorage.getItem("lms_token"));

  useEffect(() => {
    let mounted = true;
    if (!localStorage.getItem("lms_token")) return () => { mounted = false; };
    getMe()
      .then((currentUser) => {
        if (currentUser.role !== "instructor") {
          clearToken();
          return;
        }
        if (mounted) setUser(currentUser);
      })
      .catch((error) => {
        clearToken();
        if (mounted) showNotice(`Session expired: ${error.message}`);
      })
      .finally(() => {
        if (mounted) setAuthChecked(true);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    let mounted = true;
    async function loadSharedCourses() {
      try {
        const savedCourses = await getCourses();
        if (mounted) setCourses(savedCourses);
      } catch (error) {
        if (mounted) showNotice(`Could not load shared courses: ${error.message}`);
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    }
    loadSharedCourses();
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function createCourse() {
    setEditingCourse(null);
    setModal("course");
  }

  function editCourse(course) {
    if (course.status === "pending_review") {
      showNotice("This course is locked until the admin completes its review.");
      return;
    }
    setEditingCourse(course);
    setModal("course");
  }

  async function saveCourse(course) {
    try {
      const exists = courses.some((item) => item.id === course.id);
      const savedCourse = exists
        ? await updateCourse(course)
        : await createSharedCourse(course);
      setCourses((previous) => exists
        ? previous.map((item) => item.id === savedCourse.id ? savedCourse : item)
        : [savedCourse, ...previous]);
      setModal(null);
      showNotice("Course saved successfully");
      return true;
    } catch (error) {
      showNotice(`Could not save course: ${error.message}`);
      return false;
    }
  }

  function deleteCourse(id) {
    const course = courses.find((item) => item.id === id);
    if (!course) return;

    if (window.confirm(`Delete "${course.title}" and its quizzes?`)) {
      deleteSharedCourse(id)
        .then(() => {
          setCourses((previous) => previous.filter((item) => item.id !== id));
          showNotice("Course deleted");
        })
        .catch((error) => showNotice(`Could not delete course: ${error.message}`));
    }
  }

  async function saveQuiz(quiz) {
    const course = courses.find((item) => item.id === quiz.courseId);
    if (!course) {
      showNotice("Could not save quiz: the selected course no longer exists.");
      return;
    }
    const updatedCourse = {
      ...course,
      quizzes: [...(course.quizzes || []), quiz],
    };
    try {
      const savedCourse = await updateCourse(updatedCourse);
      setCourses((previous) => previous.map((item) =>
        item.id === savedCourse.id ? savedCourse : item
      ));
      setModal(null);
      showNotice("Quiz saved successfully");
    } catch (error) {
      showNotice(`Could not save quiz: ${error.message}`);
    }
  }

  async function deleteQuiz(courseId, quizId) {
    if (!window.confirm("Delete this quiz?")) return;

    const course = courses.find((item) => item.id === courseId);
    if (!course) return;
    try {
      const savedCourse = await updateCourse({
        ...course,
        quizzes: (course.quizzes || []).filter((quiz) => quiz.id !== quizId),
      });
      setCourses((previous) => previous.map((item) =>
        item.id === savedCourse.id ? savedCourse : item
      ));
      showNotice("Quiz deleted");
    } catch (error) {
      showNotice(`Could not delete quiz: ${error.message}`);
    }
  }

  async function submitForReview(id) {
    try {
      const submittedCourse = await submitCourseForReview(id);
      setCourses((previous) => previous.map((course) =>
        course.id === submittedCourse.id ? submittedCourse : course
      ));
      showNotice("Course submitted for admin review");
    } catch (error) {
      showNotice(`Could not submit course: ${error.message}`);
    }
  }

  const pageTitles = {
    dashboard: "Dashboard",
    courses: "My Courses",
    quizzes: "Quiz Center"
  };

  if (!authChecked) return <p role="status">Checking instructor session...</p>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className={`app-shell ${collapsed ? "app-sidebar-collapsed" : ""}`}>
      <Sidebar
        page={page}
        setPage={setPage}
        onCreate={createCourse}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className="main-area">
        <Topbar search={search} setSearch={setSearch} dark={dark} setDark={setDark} />

        <div className="page-container">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{pageTitles[page]}</strong>
          </div>

          {loadingCourses && <p role="status">Connecting to shared courses...</p>}

          {page === "dashboard" && (
            <Dashboard
              courses={courses}
              onCreate={createCourse}
              onEdit={editCourse}
              onDelete={deleteCourse}
              onSubmitForReview={submitForReview}
              setPage={setPage}
            />
          )}

          {page === "courses" && (
            <MyCourses
              courses={courses}
              search={search}
              onCreate={createCourse}
              onEdit={editCourse}
              onDelete={deleteCourse}
              onSubmitForReview={submitForReview}
            />
          )}

          {page === "quizzes" && (
            <QuizCenter
              courses={courses.map((course) => ({
                ...course,
                canEdit: course.status !== "pending_review",
              }))}
              loadingCourses={loadingCourses}
              onCreate={() => setModal("quiz")}
              onCreateCourse={createCourse}
              onDelete={deleteQuiz}
            />
          )}
        </div>
      </main>

      {modal === "course" && (
        <Modal
          title={editingCourse ? "Edit course" : "Create a new course"}
          onClose={() => setModal(null)}
          wide
        >
          <CourseEditor
            key={editingCourse?.id || "new-course"}
            course={editingCourse}
            onSave={saveCourse}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal === "quiz" && (
        <Modal title="Quiz builder" onClose={() => setModal(null)} wide>
          <QuizBuilder
            courses={courses.filter((course) => course.status !== "pending_review")}
            onSave={saveQuiz}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {notice && (
        <div className="toast">
          <CheckCircle2 size={19} />
          {notice}
        </div>
      )}
    </div>
  );
} 