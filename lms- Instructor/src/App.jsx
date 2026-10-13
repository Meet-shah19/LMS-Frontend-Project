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
import { loadCourses, saveCourses } from "./utils/storage.js";

export default function App() {
  const [courses, setCourses] = useState(loadCourses);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

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
    setEditingCourse(course);
    setModal("course");
  }

  function saveCourse(course) {
    setCourses((previous) => {
      const exists = previous.some((item) => item.id === course.id);
      return exists
        ? previous.map((item) => item.id === course.id ? course : item)
        : [course, ...previous];
    });
    setModal(null);
    showNotice("Course saved successfully");
  }

  function deleteCourse(id) {
    const course = courses.find((item) => item.id === id);
    if (!course) return;

    if (window.confirm(`Delete "${course.title}" and its quizzes?`)) {
      setCourses((previous) => previous.filter((item) => item.id !== id));
      showNotice("Course deleted");
    }
  }

  function saveQuiz(quiz) {
    setCourses((previous) =>
      previous.map((course) =>
        course.id === quiz.courseId
          ? { ...course, quizzes: [...(course.quizzes || []), quiz] }
          : course
      )
    );
    setModal(null);
    showNotice("Quiz saved successfully");
  }

  function deleteQuiz(courseId, quizId) {
    if (!window.confirm("Delete this quiz?")) return;

    setCourses((previous) =>
      previous.map((course) =>
        course.id === courseId
          ? { ...course, quizzes: (course.quizzes || []).filter((quiz) => quiz.id !== quizId) }
          : course
      )
    );
    showNotice("Quiz deleted");
  }

  const pageTitles = {
    dashboard: "Dashboard",
    courses: "My Courses",
    quizzes: "Quiz Center"
  };

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

          {page === "dashboard" && (
            <Dashboard
              courses={courses}
              onCreate={createCourse}
              onEdit={editCourse}
              onDelete={deleteCourse}
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
            />
          )}

          {page === "quizzes" && (
            <QuizCenter
              courses={courses}
              onCreate={() => setModal("quiz")}
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
            courses={courses}
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