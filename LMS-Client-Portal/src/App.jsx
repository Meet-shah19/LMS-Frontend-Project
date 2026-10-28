import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard, Compass, BookOpen, ClipboardList,
  FileText, Award, UserRound, Search, Bookmark,
  PlayCircle, CheckCircle2, GraduationCap,
  ArrowRight, Menu, X, Clock3, LockKeyhole, ShoppingCart, Moon, Sun} from "lucide-react";
import {
  clearToken,
  createCheckout,
  enroll,
  getCertificates,
  getCourse,
  getCourses,
  getEnrollments,
  getMe,
  getNotes,
  getPaymentSuccess,
  login,
  saveNote as saveStudentNote,
  setToken,
  submitQuizAttempt,
  updateProfile,
  updateProgress,
} from "./api";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Explore Courses", icon: Compass },
  { name: "My Learning", icon: BookOpen },
  { name: "Quiz Center", icon: ClipboardList },
  { name: "My Notes", icon: FileText },
  { name: "Certificates", icon: Award },
  { name: "Profile", icon: UserRound },
];

export default function App() {
  const [page, setPage] = useState(() =>
    new URLSearchParams(window.location.search).has("session_id")
      ? "Payment success"
      : "Dashboard"
  );
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("lms_student_theme") === "dark" ? "dark" : "light"
  );
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [submittingQuizId, setSubmittingQuizId] = useState(null);
  const [user, setUser] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(() => !localStorage.getItem("lms_token"));

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [apiError, setApiError] = useState("");
  const [purchaseNotice, setPurchaseNotice] = useState(() =>
    new URLSearchParams(window.location.search).has("session_id")
      ? "Verifying your payment securely..."
      : ""
  );
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [enrollmentNotice, setEnrollmentNotice] = useState("");

  const refreshCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const sharedCourses = await getCourses();
      setCourses(filterPublishedCourses(sharedCourses));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lms_student_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) return undefined;
    let mounted = true;
    const syncCourses = async () => {
      try {
        const sharedCourses = await getCourses();
        let enrolledCourseDetails = [];
        let enrollmentSyncSucceeded = false;
        try {
          const savedEnrollments = await getEnrollments();
          enrollmentSyncSucceeded = true;
          enrolledCourseDetails = await Promise.all(savedEnrollments.map((item) =>
            getCourse(item.course.id)
          ));
          if (mounted) setEnrollments(savedEnrollments);
        } catch (error) {
          if (mounted) setApiError(error.message);
        }
        if (mounted) {
          const publishedCourses = filterPublishedCourses(sharedCourses);
          setCourses(publishedCourses.map((course) => {
            const details = enrolledCourseDetails.find((item) => item.id === course.id);
            return details ? normalizeCourse({ ...course, ...details }) : course;
          }));
          if (enrollmentSyncSucceeded) setApiError("");
        }
      } catch (error) {
        if (mounted) setApiError(error.message);
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    };
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") void syncCourses();
    };
    const interval = window.setInterval(syncCourses, 30000);
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);
    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [user]);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!user || !sessionId) return undefined;
    let active = true;
    let timeoutId;
    async function verifyPayment() {
      try {
        const payment = await getPaymentSuccess(sessionId);
        if (!active) return;
        const purchaseStatus = payment.purchase?.status;
        if (purchaseStatus === "paid" && payment.enrollmentConfirmed) {
          setPurchaseNotice("Payment confirmed. Your course is now available in My Learning.");
          const [savedEnrollments, savedCourses] = await Promise.all([getEnrollments(), getCourses()]);
          const enrolledCourses = await Promise.all(savedEnrollments.map((item) => getCourse(item.course.id)));
          setEnrollments(savedEnrollments);
          setCourses(filterPublishedCourses(savedCourses).map((course) => {
            const details = enrolledCourses.find((item) => item.id === course.id);
            return details ? normalizeCourse({ ...course, ...details }) : normalizeCourse(course);
          }));
          window.history.replaceState({}, "", window.location.pathname);
          return;
        }
        if (["failed", "refunded"].includes(purchaseStatus)) {
          setPurchaseNotice(`Payment ${purchaseStatus}. No course access was granted.`);
          window.history.replaceState({}, "", window.location.pathname);
          return;
        }
        setPurchaseNotice(payment.message || "Payment is being confirmed securely. This page will refresh automatically.");
        timeoutId = window.setTimeout(verifyPayment, 2500);
      } catch (error) {
        if (active) setApiError(error.message);
      }
    }

    void verifyPayment();
    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [user]);

  useEffect(() => {
    let mounted = true;
    if (!localStorage.getItem("lms_token")) return () => { mounted = false; };
    getMe()
      .then((currentUser) => {
        if (currentUser.role !== "student") {
          clearToken();
          return;
        }
        if (mounted) {
          setUser(currentUser);
          setStudentName(currentUser.name);
          setStudentEmail(currentUser.email);
        }
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
    if (!user) return undefined;
    let mounted = true;
    Promise.all([getEnrollments(), getNotes(), getCertificates()])
      .then(async ([savedEnrollments, savedNotes, savedCertificates]) => {
        if (!mounted) return;
        setEnrollments(savedEnrollments);
        setProgress(Object.fromEntries(savedEnrollments.flatMap((item) =>
          item.completedLessons.map((id) => [id, true])
        )));
        setNotes(Object.fromEntries(savedNotes.map((note) => [note.lessonId, note.content])));
        setCertificates(savedCertificates);
        const enrolledCourses = await Promise.all(savedEnrollments.map((item) =>
          getCourse(item.course.id)
        ));
        if (!mounted) return;
        setCourses((previous) => previous.map((course) => {
          const details = enrolledCourses.find((item) => item.id === course.id);
          return details ? normalizeCourse({ ...course, ...details }) : course;
        }));
      })
      .catch((error) => {
        if (mounted) setApiError(error.message);
      });
    return () => { mounted = false; };
  }, [user]);

  const allLessons = courses.flatMap((course) =>
    (course.modules || []).flatMap((module) =>
      (module.lessons || []).map((lesson) => ({
        ...lesson,
        courseId: course.id,
        courseTitle: course.title,
        moduleTitle: module.title,
      }))
    )
  );

  const quizzes = courses
    .filter((course) => enrollments.some(
      (item) => String(item.course.id) === String(course.id)
    ))
    .flatMap((course) => {
    const courseQuizzes = Array.isArray(course.quizzes)
      ? course.quizzes
      : course.quizzes
        ? [course.quizzes]
        : course.quiz
          ? [course.quiz]
          : [];

    return courseQuizzes.map((quiz, index) => ({
      ...quiz,
      id: `${course.id}-${quiz.id || index}`,
      sourceQuizId: quiz.id || String(index),
      courseId: course.id,
      courseTitle: course.title,
      questions: Array.isArray(quiz.questions) && quiz.questions.length
        ? quiz.questions
        : [quiz],
    }));
  });

  const completedLessons = allLessons.filter(
    (lesson) => progress[lesson.id]
  ).length;

  const progressPercent = allLessons.length
    ? Math.round((completedLessons / allLessons.length) * 100)
    : 0;

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function toggleBookmark(id) {
    setBookmarks((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : [...old, id]
    );
  }

  function toggleTheme() {
    setTheme((current) => current === "dark" ? "light" : "dark");
  }

  const ensureEnrollment = useCallback(async (courseId) => {
    if (enrollments.some((item) => String(item.course.id) === String(courseId))) return;
    try {
      const created = await enroll(courseId);
      setEnrollments((old) => [...old, created]);
    } catch (error) {
      if (!error.message.toLowerCase().includes("already enrolled")) throw error;
      setEnrollments(await getEnrollments());
    }
  }, [enrollments]);

  async function toggleComplete(id) {
    const lesson = allLessons.find((item) => String(item.id) === String(id));
    if (!lesson) {
      setApiError("That lesson is no longer available.");
      return;
    }
    try {
      await ensureEnrollment(lesson.courseId);
      const nextProgress = { ...progress, [id]: !progress[id] };
      const completedLessons = allLessons
        .filter((item) => String(item.courseId) === String(lesson.courseId) && nextProgress[item.id])
        .map((item) => String(item.id));
      const result = await updateProgress(lesson.courseId, completedLessons);
      setProgress((previous) => {
        const updated = { ...previous };
        for (const item of allLessons) {
          if (String(item.courseId) === String(lesson.courseId)) delete updated[item.id];
        }
        for (const lessonId of result.completedLessons) updated[lessonId] = true;
        return updated;
      });
      setCertificates(await getCertificates());
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function openCourse(course) {
    try {
      const details = await getCourse(course.id);
      const normalized = normalizeCourse(details);
      setActiveCourse(normalized);
      setCourses((previous) => previous.map((item) =>
        item.id === normalized.id ? { ...item, ...normalized } : item
      ));
      setActiveLesson(null);
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function startFreeCourse(course) {
    if (enrollments.some((item) => String(item.course.id) === String(course.id))) {
      await openCourse(course);
      return;
    }
    if (enrollingCourseId === course.id) return;
    setEnrollingCourseId(course.id);
    try {
      await enroll(course.id);
      setEnrollments(await getEnrollments());
      setEnrollmentNotice(`You are enrolled in "${course.title}".`);
      window.setTimeout(() => setEnrollmentNotice(""), 5000);
      await openCourse(course);
    } catch (error) {
      if (error.message.toLowerCase().includes("already enrolled")) {
        setEnrollments(await getEnrollments());
        setEnrollmentNotice(`You are already enrolled in "${course.title}".`);
        window.setTimeout(() => setEnrollmentNotice(""), 5000);
        await openCourse(course);
      } else {
        setApiError(error.message);
      }
    } finally {
      setEnrollingCourseId(null);
    }
  }

  async function buyCourse(course) {
    try {
      const checkout = await createCheckout(course.id);
      if (!checkout.checkoutUrl) throw new Error("The payment provider did not return a checkout URL.");
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    try {
      const savedUser = await updateProfile({ name: studentName.trim(), email: studentEmail.trim() });
      setUser(savedUser);
      setStudentName(savedUser.name);
      setStudentEmail(savedUser.email);
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  const submitQuiz = useCallback(async (quiz, timedOut = false) => {
    if (submittingQuizId) return;
    const answers = quiz.questions.map((question, index) => ({
      questionId: question.id || String(index),
      answer: quizAnswer[`${quiz.id}-${question.id || index}`] ?? null,
    }));
    if (!timedOut && answers.some(({ answer }) => answer === null)) {
      alert("Please answer every question first.");
      return;
    }

    setSubmittingQuizId(quiz.id);
    setActiveQuizId(null);
    try {
      await ensureEnrollment(quiz.courseId);
      const result = await submitQuizAttempt({
        courseId: quiz.courseId,
        quizId: quiz.sourceQuizId,
        answers,
      });
      const quizResult = { ...result, correct: result.score === result.total, timedOut };
      setQuizResults((old) => ({ ...old, [quiz.id]: quizResult }));
      setApiError("");
      if (!timedOut) {
        alert(
          quizResult.correct
            ? "Correct answer! Well done."
            : `You scored ${result.score} out of ${result.total}.`
        );
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmittingQuizId(null);
    }
  }, [ensureEnrollment, quizAnswer, submittingQuizId]);

  function startQuiz(quiz) {
    setQuizAnswer((previous) => {
      const next = { ...previous };
      quiz.questions.forEach((question, index) => {
        delete next[`${quiz.id}-${question.id || index}`];
      });
      return next;
    });
    setQuizResults((previous) => {
      const next = { ...previous };
      delete next[quiz.id];
      return next;
    });
    setRemainingSeconds((Number(quiz.timeLimitMinutes) || 10) * 60);
    setActiveQuizId(quiz.id);
  }

  useEffect(() => {
    if (!activeQuizId) return undefined;
    const timer = window.setInterval(() => {
      setRemainingSeconds((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeQuizId]);

  useEffect(() => {
    if (!activeQuizId || remainingSeconds > 0) return;
    const activeQuiz = quizzes.find((quiz) => quiz.id === activeQuizId);
    if (!activeQuiz) return;
    const timeout = window.setTimeout(() => void submitQuiz(activeQuiz, true), 0);
    return () => window.clearTimeout(timeout);
  }, [activeQuizId, remainingSeconds, quizzes, submitQuiz]);

  async function saveNote(id, content) {
    const lesson = allLessons.find((item) => String(item.id) === String(id));
    if (!lesson) {
      setApiError("That lesson is no longer available.");
      return;
    }
    try {
      await ensureEnrollment(lesson.courseId);
      await saveStudentNote({ courseId: lesson.courseId, lessonId: id, content });
      setNotes((old) => ({ ...old, [id]: content }));
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  }

  async function signIn(event) {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await login({ email: loginEmail.trim(), password: loginPassword });
      if (result.user.role !== "student") {
        setLoginError("This portal is for student accounts.");
        return;
      }
      setToken(result.token);
      await refreshCourses();
      setUser(result.user);
      setStudentName(result.user.name);
      setStudentEmail(result.user.email);
      setApiError("");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  }

  function signOut() {
    clearToken();
    setUser(null);
    setActiveQuizId(null);
    setRemainingSeconds(0);
    setProgress({});
    setNotes({});
    setCertificates([]);
    setEnrollments([]);
    setEnrollingCourseId(null);
    setBookmarks([]);
    setActiveCourse(null);
  }

  if (!authChecked) {
    return <main className="student-login-page" data-theme={theme}><p role="status">Checking student session...</p></main>;
  }

  if (!user) {
    return (
      <main className="student-login-page" data-theme={theme}>
        <button
          type="button"
          className="theme-toggle login-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-pressed={theme === "dark"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
        <form className="profile-form student-login-card" onSubmit={signIn}>
          <div className="profile-badge"><GraduationCap size={32} /></div>
          <span className="welcome-label">LEARNING MANAGEMENT SYSTEM</span>
          <h1>Student sign in</h1>
          <p>Sign in to access courses and save your learning progress.</p>
          <label>Email address<input type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} autoComplete="username" required /></label>
          <label>Password<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} autoComplete="current-password" required /></label>
          {loginError && <p className="student-login-error" role="alert">{loginError}</p>}
          <button className="primary-btn" type="submit" disabled={loginLoading}>
            {loginLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="client-app" data-theme={theme}>
      <aside className={`client-sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="client-brand">
          <div className="brand-mark"><GraduationCap size={25} /></div>
          <div>
            <strong>LearnSpace</strong>
            <small>Student portal</small>
          </div>
          <button className="mobile-close icon-btn" onClick={() => setMobileMenu(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="nav-caption">LEARNING</div>
        {navigation.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`client-nav ${page === name ? "selected" : ""}`}
            onClick={() => {
              setPage(name);
              setActiveCourse(null);
              setActiveLesson(null);
              setMobileMenu(false);
            }}
          >
            <Icon size={19} />
            <span>{name}</span>
          </button>
        ))}

        <div className="sidebar-help">
          <div className="help-icon"><GraduationCap size={22} /></div>
          <strong>Keep learning</strong>
          <p>Small steps today make a big difference tomorrow.</p>
        </div>

        <div className="client-user">
          <div className="user-avatar">
            {(studentName || "S").trim().charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <strong>{studentName || "Your profile"}</strong>
            <small>Student account</small>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <button className="client-overlay" onClick={() => setMobileMenu(false)} />
      )}

      <main className="client-main">
        <header className="client-topbar">
          <button className="icon-btn mobile-open" onClick={() => setMobileMenu(true)}>
            <Menu size={22} />
          </button>
          <div className="top-breadcrumb">Learning portal <span>/</span> {page}</div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
          <button className="top-profile" onClick={() => setPage("Profile")}>
            <div className="user-avatar small">
              {(studentName || "S").trim().charAt(0).toUpperCase()}
            </div>
            <span>{studentName || "Student"}</span>
          </button>
        </header>

        <div className="client-content">
          {apiError && <div className="api-error" role="alert">{apiError}</div>}
          {enrollmentNotice && <div className="enrollment-success" role="status">{enrollmentNotice}</div>}
          {page === "Payment success" && (
            <section className="payment-success-card" aria-live="polite">
              <div className="payment-success-icon"><CheckCircle2 size={36}/></div>
              <span className="welcome-label">SECURE CHECKOUT</span>
              <h1>Payment status</h1>
              <p>{purchaseNotice || "Your payment is being verified with the payment provider."}</p>
              <div className="payment-success-actions">
                <button className="primary-btn" onClick={() => setPage("My Learning")}>Go to My Learning</button>
                <button className="secondary-btn" onClick={() => setPage("Explore Courses")}>Browse courses</button>
              </div>
            </section>
          )}
          {loadingCourses && <p role="status">Loading shared courses...</p>}
          {page === "Dashboard" && (
            <>
              <div className="client-welcome">
                <div>
                  <span className="welcome-label">YOUR LEARNING JOURNEY</span>
                  <h1>Welcome back{studentName ? `, ${studentName}` : ""}.</h1>
                  <p>Continue learning at your own pace, one lesson at a time.</p>
                  <button className="light-button" onClick={() => setPage("Explore Courses")}>
                    Explore courses <ArrowRight size={17} />
                  </button>
                </div>
                <div className="welcome-graphic"><GraduationCap size={100} strokeWidth={1.1} /></div>
              </div>

              <div className="client-stats">
                <Stat icon={BookOpen} label="Available courses" value={courses.length} tone="violet" />
                <Stat icon={CheckCircle2} label="Lessons completed" value={completedLessons} tone="mint" />
                <Stat icon={Award} label="Overall progress" value={`${progressPercent}%`} tone="amber" />
                <Stat icon={Bookmark} label="Bookmarks" value={bookmarks.length} tone="blue" />
              </div>

              <div className="content-heading">
                <div><h2>Explore learning</h2><p>Courses available in your portal</p></div>
                <button className="link-btn" onClick={() => setPage("Explore Courses")}>View all <ArrowRight size={16}/></button>
              </div>

              {courses.length === 0 ? (
                <Empty icon={BookOpen} title="No courses available yet" text="Published courses will appear here from the instructor and admin portals." action="Refresh courses" onAction={refreshCourses} />
              ) : (
                <div className="client-course-grid">
                  {courses.slice(0, 3).map((course) => (
                    <CourseCard key={course.id} course={course} progress={progress}
                      bookmarked={bookmarks.includes(course.id)}
                      enrolled={enrollments.some((item) => String(item.course.id) === String(course.id))}
                      enrolling={String(enrollingCourseId) === String(course.id)}
                      onBookmark={() => toggleBookmark(course.id)}
                      onEnroll={() => startFreeCourse(course)}
                      onOpen={() => openCourse(course)} />
                  ))}
                </div>
              )}
            </>
          )}

          {page === "Explore Courses" && (
            <>
              <PageHeading title="Explore courses" subtitle="Find a course and start learning." />
              <div className="client-search"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses by name..." /></div>
              {filteredCourses.length === 0 ? (
                <Empty icon={Compass} title="No matching courses" text="Try another search, or check back when courses are added." action="Refresh courses" onAction={refreshCourses}/>
              ) : (
                <div className="client-course-grid">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} progress={progress}
                      bookmarked={bookmarks.includes(course.id)}
                      enrolled={enrollments.some((item) => String(item.course.id) === String(course.id))}
                      enrolling={String(enrollingCourseId) === String(course.id)}
                      onBookmark={() => toggleBookmark(course.id)}
                      onEnroll={() => startFreeCourse(course)}
                      onOpen={() => openCourse(course)} />
                  ))}
                </div>
              )}
            </>
          )}

          {page === "My Learning" && (
            <>
              <PageHeading title="My learning" subtitle="Track your lesson completion." />
              {enrollments.length === 0 ? <Empty icon={BookOpen} title="Your learning starts here" text="There are no courses in your learning list yet." action="Explore courses" onAction={() => setPage("Explore Courses")} /> :
                <div className="client-course-grid">{courses.filter((course) => enrollments.some((item) => String(item.course.id) === String(course.id))).map((course) => {
                  const lessons = (course.modules || []).flatMap((module) => module.lessons || []);
                  const done = lessons.filter((lesson) => progress[lesson.id]).length;
                  return <CourseCard key={course.id} course={course} progress={progress} completed={done} total={lessons.length} enrolled onOpen={() => openCourse(course)} />;
                })}</div>}
            </>
          )}

          {page === "Quiz Center" && (
            <>
              <div className="quiz-page-heading">
                <div className="quiz-page-art"><ClipboardList size={42}/></div>
                <div>
                  <span className="course-category">LEARN AND CHECK YOUR PROGRESS</span>
                  <h1>Quiz center</h1>
                  <p>Take a course quiz, keep an eye on the clock, and see how you did.</p>
                </div>
              </div>
              {quizzes.length === 0 ? <Empty icon={ClipboardList} title="No quizzes available" text="Published course quizzes will appear here." action="Refresh quizzes" onAction={refreshCourses} /> :
                <div className="quiz-grid">{quizzes.map((quiz) => (
                  <article className="quiz-card" key={quiz.id}>
                    <div className="quiz-card-top">
                      <div className="quiz-icon"><ClipboardList size={22}/></div>
                      <span className={`quiz-time-badge ${activeQuizId === quiz.id && remainingSeconds <= 60 ? "urgent" : ""}`}>
                        <Clock3 size={15}/>
                        {activeQuizId === quiz.id ? formatQuizTime(remainingSeconds) : `${quiz.timeLimitMinutes || 10} min`}
                      </span>
                    </div>
                    <h3>{quiz.title}</h3>
                    <p className="quiz-course-name">{quiz.courseTitle}</p>
                    {activeQuizId === quiz.id ? (
                      <div className="quiz-attempt">
                        <div className={`quiz-countdown ${remainingSeconds <= 60 ? "urgent" : ""}`}>
                          <Clock3 size={18}/>
                          <span>Time remaining</span>
                          <strong aria-live="polite">{formatQuizTime(remainingSeconds)}</strong>
                        </div>
                        <div className="quiz-progress-label">
                          <span>{quiz.questions.length} questions</span>
                          <span>{quiz.questions.filter((question, index) =>
                            quizAnswer[`${quiz.id}-${question.id || index}`] !== undefined
                          ).length} answered</span>
                        </div>
                        {quiz.questions.map((question, questionIndex) => {
                          const answerKey = `${quiz.id}-${question.id || questionIndex}`;
                          return (
                            <section className="quiz-question" key={answerKey}>
                              <span className="quiz-question-number">QUESTION {String(questionIndex + 1).padStart(2, "0")}</span>
                              <h4>{question.question || question.text}</h4>
                              <div className="quiz-options">
                                {(question.options || []).map((option, optionIndex) => (
                                  <label key={`${answerKey}-${optionIndex}`} className={`quiz-option ${quizAnswer[answerKey] === optionIndex ? "chosen" : ""}`}>
                                    <input
                                      type="radio"
                                      name={`quiz-${answerKey}`}
                                      checked={quizAnswer[answerKey] === optionIndex}
                                      onChange={() => setQuizAnswer((old) => ({ ...old, [answerKey]: optionIndex }))}
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            </section>
                          );
                        })}
                        <button
                          className="primary-btn full-width quiz-submit-button"
                          onClick={() => submitQuiz(quiz)}
                          disabled={submittingQuizId === quiz.id}
                        >
                          {submittingQuizId === quiz.id ? "Submitting..." : "Submit quiz"}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="quiz-meta-row">
                          <span>{quiz.questions.length} questions</span>
                          <span>{quiz.timeLimitMinutes || 10} minutes</span>
                        </div>
                        {quizResults[quiz.id] && (
                          <div className={`quiz-result-card ${quizResults[quiz.id].correct ? "success" : ""}`}>
                            <strong>Score: {quizResults[quiz.id].score} / {quizResults[quiz.id].total}</strong>
                            {quizResults[quiz.id].timedOut && <span>Time ran out; unanswered questions counted as incorrect.</span>}
                          </div>
                        )}
                        <button className="primary-btn full-width" onClick={() => startQuiz(quiz)}>
                          {quizResults[quiz.id] ? "Try again" : "Start quiz"} <ArrowRight size={16}/>
                        </button>
                      </>
                    )}
                  </article>
                ))}</div>}
            </>
          )}

          {page === "My Notes" && (
            <>
              <PageHeading title="My notes" subtitle="Notes you save inside lessons." />
              {Object.entries(notes).filter(([, value]) => value?.trim()).length === 0 ? <Empty icon={FileText} title="No saved notes yet" text="Open a course lesson and write your notes there." action="Explore courses" onAction={() => setPage("Explore Courses")} /> :
                <div className="note-grid">{Object.entries(notes).filter(([, value]) => value?.trim()).map(([id, value]) => {
                  const lesson = allLessons.find((item) => item.id === id);
                  return <article className="note-card" key={id}><FileText size={20}/><h3>{lesson?.title || "Lesson note"}</h3><p>{value}</p><small>{lesson?.courseTitle || "Course"}</small></article>;
                })}</div>}
            </>
          )}

          {page === "Certificates" && (
            <>
              <PageHeading title="Certificates" subtitle="Certificates unlock when every lesson in a course is complete." />
              {certificates.length === 0 ? <Empty icon={Award} title="No certificates yet" text="Complete all lessons in a course to unlock its certificate." action="Continue learning" onAction={() => setPage("My Learning")} /> :
                certificates.map((certificate) => <article className="certificate-card" key={certificate.id}><Award size={30}/><div><h3>{certificate.course?.title || "Completed course"}</h3><p>Completed by {studentName || "Student"}</p></div><button className="secondary-btn" onClick={() => window.print()}>Print certificate</button></article>)}
            </>
          )}

          {page === "Profile" && (
            <>
              <PageHeading title="My profile" subtitle="Update your student account details." />
              <form className="profile-form" onSubmit={saveProfile}>
                <div className="profile-badge"><UserRound size={32}/></div>
                <label>Full name<input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter your name" required /></label>
                <label>Email address<input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="you@example.com" /></label>
                <button className="primary-btn">Save profile</button>
                <p className="form-hint">Your profile is saved to your LMS account.</p>
              </form>
              <button className="secondary-btn" onClick={signOut}>Sign out</button>
            </>
          )}

          {activeCourse && (
            <CourseViewer
              key={`${activeCourse.id}-${activeLesson || "none"}`}
              course={activeCourse}
              hasAccess={Boolean(activeCourse.enrolled || activeCourse.access === "full") ||
                enrollments.some((item) => String(item.course.id) === String(activeCourse.id))}
              progress={progress}
              notes={notes}
              onClose={() => { setActiveCourse(null); setActiveLesson(null); }}
              onSelectLesson={setActiveLesson}
              activeLesson={activeLesson}
              onComplete={toggleComplete}
              onSaveNote={saveNote}
              onEnrollFree={() => startFreeCourse(activeCourse)}
              onBuy={() => buyCourse(activeCourse)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function normalizeCourse(course) {
  let modules = (Array.isArray(course.modules) ? course.modules : []).map(
    (module, index) => typeof module === "string"
      ? { id: `${course.id}-module-${index}`, title: module, lessons: [] }
      : { ...module, lessons: Array.isArray(module.lessons) ? module.lessons : [] }
  );
  const separateLessons = Array.isArray(course.lessons) ? course.lessons : [];

  if (modules.length === 0 && separateLessons.length > 0) {
    modules = [{
      id: `${course.id}-lessons`,
      title: "Lessons",
      lessons: [],
    }];
  }
  const includedLessonIds = new Set(
    modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
  );
  for (const lesson of separateLessons) {
    if (includedLessonIds.has(lesson.id)) continue;
    const target = modules.find((module) =>
      module.id === lesson.module || module.title === lesson.module
    ) || modules[0];
    if (target) target.lessons.push(lesson);
  }

  return { ...course, modules };
}

function formatQuizTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function filterPublishedCourses(courses) {
  return courses
    .filter((course) =>
      String(course.status || "").toLowerCase() === "published"
    )
    .map(normalizeCourse);
}

function Stat({ icon: Icon, label, value, tone }) {
  return <article className="client-stat"><div className={`client-stat-icon ${tone}`}><Icon size={21}/></div><div><span>{label}</span><strong>{value}</strong></div></article>;
}

function PageHeading({ title, subtitle }) {
  return <div className="content-heading page-title"><div><h1>{title}</h1><p>{subtitle}</p></div></div>;
}

function Empty({ icon: Icon, title, text, action, onAction }) {
  return <div className="client-empty"><div className="empty-symbol"><Icon size={28}/></div><h3>{title}</h3><p>{text}</p>{action && <button className="primary-btn" onClick={onAction}>{action} <ArrowRight size={16}/></button>}</div>;
}

function CourseCard({
  course,
  bookmarked,
  onBookmark,
  onOpen,
  onEnroll,
  enrolled = false,
  enrolling = false,
  completed,
  total,
  progress = {},
}) {
  const lessons = (course.modules || []).flatMap((module) => module.lessons || []);
  const isEnrolled = enrolled || Boolean(course.enrolled);
  const lessonTotal = total ?? lessons.length;
  const lessonDone = completed ?? lessons.filter((lesson) => progress[lesson.id]).length;
  const percent = lessonTotal ? Math.round(lessonDone / lessonTotal * 100) : 0;

  return <article className="client-course-card">
    <div className="course-art">{course.thumbnail ? <img className="course-thumbnail" src={course.thumbnail} alt="" /> : <div className="art-circle"><GraduationCap size={37}/></div>}{onBookmark && <button className={`save-course ${bookmarked ? "saved" : ""}`} onClick={onBookmark} aria-label="Bookmark course"><Bookmark size={19} fill={bookmarked ? "currentColor" : "none"}/></button>}</div>
    <div className="course-card-content">
      <span className="course-category">{course.category || "LEARNING COURSE"}</span>
      <h3>{course.title}</h3><p>{course.description || "Course details have not been added yet."}</p>
      {course.instructor && <p className="course-instructor">Instructor: {course.instructor}</p>}
      <div className="course-facts"><span><BookOpen size={15}/>{(course.modules || []).length} modules</span><span><PlayCircle size={15}/>{lessonTotal} lessons</span></div>
      <strong className="catalog-course-price">
        {Number(course.price) > 0 ? `₹${Number(course.price).toLocaleString("en-IN")}` : "Free"}
      </strong>
      {total !== undefined && <>
        <div className="progress-track"><span style={{width: `${percent}%`}}/></div>
        <small className="progress-caption">{percent}% complete</small>
      </>}
      <div className="course-card-actions">
        <button className="secondary-btn" onClick={onOpen}>
          {isEnrolled ? "Continue Learning" : "View Details"} <ArrowRight size={16}/>
        </button>
        {!isEnrolled && Number(course.price) === 0 && onEnroll && (
          <button className="primary-btn" onClick={onEnroll} disabled={enrolling}>
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        )}
      </div>
    </div>
  </article>;
}

function CourseViewer({
  course,
  hasAccess,
  onClose,
  onSelectLesson,
  activeLesson,
  progress,
  onComplete,
  notes,
  onSaveNote,
  onEnrollFree,
  onBuy,
}) {
  const lessons = (course.modules || []).flatMap((module) =>
    (module.lessons || []).map((lesson) => ({...lesson, moduleTitle: module.title}))
  );
  const lesson = lessons.find((item) => item.id === activeLesson);
  const isFreeIntro = Boolean(lesson?.isFreeIntroduction);
  const isLocked = lesson && !hasAccess && !isFreeIntro;
  const [noteDraft, setNoteDraft] = useState(() => lesson ? notes[lesson.id] || "" : "");

  return <div className="viewer-backdrop" role="presentation" onClick={onClose}>
    <section className="course-viewer" role="dialog" aria-modal="true" aria-label={course.title} onClick={(event) => event.stopPropagation()}>
      <div className="viewer-header">
        <div>
          <span className="course-category">COURSE DETAILS</span>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>{course.category || "Uncategorized"}{course.instructor ? ` · Instructor: ${course.instructor}` : ""}</p>
          <strong className="viewer-price">{Number(course.price) > 0 ? `₹${Number(course.price).toLocaleString("en-IN")}` : "Free course"}</strong>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close course details"><X size={22}/></button>
      </div>
      <div className="viewer-layout">
        <div className="lesson-list">
          <h3>Course lessons</h3>
          {lessons.length === 0 && <p className="muted">No lessons have been added yet.</p>}
          {lessons.map((item) => {
            const accessible = hasAccess || item.isFreeIntroduction;
            return (
              <button
                key={item.id}
                onClick={() => onSelectLesson(item.id)}
                className={`viewer-lesson ${activeLesson === item.id ? "current" : ""}`}
                aria-label={`${item.title}${accessible ? "" : " - Purchase to unlock"}`}
              >
                <span>
                  {!accessible ? <LockKeyhole size={17}/> : progress[item.id] ? <CheckCircle2 size={17}/> : <PlayCircle size={17}/>}
                </span>
                <div>{item.title}<small>{item.isFreeIntroduction ? "Free introduction" : item.moduleTitle}</small></div>
              </button>
            );
          })}
        </div>
        <div className="viewer-body">
          {!lesson ? (
            <div className="viewer-placeholder">
              <GraduationCap size={42}/>
              <h3>{course.title}</h3>
              <p>{course.description || "Choose the free introduction lesson to preview this course."}</p>
              {hasAccess && (
                <button
                  className="primary-btn"
                  onClick={() => lessons[0] && onSelectLesson(lessons[0].id)}
                  disabled={lessons.length === 0}
                >
                  {lessons.length ? "Continue Learning" : "Enrolled"}
                </button>
              )}
              {!hasAccess && Number(course.price) > 0 && (
                <button className="primary-btn" onClick={onBuy}><ShoppingCart size={16}/> Buy course</button>
              )}
              {!hasAccess && Number(course.price) === 0 && (
                <button className="primary-btn" onClick={onEnrollFree}>Enroll Now</button>
              )}
            </div>
          ) : isLocked ? (
            <div className="viewer-placeholder locked-lesson">
              <LockKeyhole size={38}/>
              <h3>Purchase to unlock</h3>
              <p>Buy this course to access this lesson, quizzes, notes, and progress tracking.</p>
              <button className="primary-btn" onClick={onBuy}><ShoppingCart size={16}/> Buy course · ₹{Number(course.price).toLocaleString("en-IN")}</button>
            </div>
          ) : (
            <>
              <span className="course-category">{isFreeIntro && !hasAccess ? "FREE INTRODUCTION" : lesson.type || "LESSON"}</span>
              <h2>{lesson.title}</h2>
              {lesson.type === "video" && lesson.content ? <div className="video-box"><iframe src={lesson.content.replace("watch?v=", "embed/")} title={lesson.title} allowFullScreen/></div> : lesson.type === "pdf" && lesson.content ? <a className="pdf-button" href={lesson.content} target="_blank" rel="noreferrer"><FileText size={18}/> Open PDF lesson</a> : <div className="lesson-content">{lesson.content || "No lesson content has been added."}</div>}
              {hasAccess ? (
                <>
                  <label className="note-label">My lesson notes<textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Write your notes here..."/></label>
                  <button className="secondary-btn" onClick={() => onSaveNote(lesson.id, noteDraft)}><FileText size={16}/> Save note</button>
                  <button className="primary-btn" onClick={() => onComplete(lesson.id)}>{progress[lesson.id] ? <><CheckCircle2 size={17}/> Completed — mark incomplete</> : <>Mark lesson complete <CheckCircle2 size={17}/></>}</button>
                </>
              ) : (
                <div className="free-preview-message">
                  <p>This is the free introduction. Enroll in the course to unlock the rest of the learning tools.</p>
                  {Number(course.price) === 0 && <button className="primary-btn" onClick={onEnrollFree}>Enroll Now</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  </div>;
}
