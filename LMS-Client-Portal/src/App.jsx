import { useEffect, useState } from "react";
import {
  LayoutDashboard, Compass, BookOpen, ClipboardList,
  FileText, Award, UserRound, Search, Bookmark,
  PlayCircle, CheckCircle2, GraduationCap,
  ArrowRight, Menu, X} from "lucide-react";
import { loadData, saveData } from "./utils/storage";

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
  const [page, setPage] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [studentName, setStudentName] = useState(
    () => localStorage.getItem("lms-client-name") || ""
  );
  const [studentEmail, setStudentEmail] = useState(
    () => localStorage.getItem("lms-client-email") || ""
  );

  const [courses, setCourses] = useState(() => loadData("courses", []));
  const [quizzes, setQuizzes] = useState(() => loadData("quizzes", []));
  const [progress, setProgress] = useState(() => loadData("progress", {}));
  const [notes, setNotes] = useState(() => loadData("notes", {}));
  const [bookmarks, setBookmarks] = useState(() => loadData("bookmarks", []));

  useEffect(() => {
    saveData("progress", progress);
  }, [progress]);

  useEffect(() => {
    saveData("notes", notes);
  }, [notes]);

  useEffect(() => {
    saveData("bookmarks", bookmarks);
  }, [bookmarks]);

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

  function toggleComplete(id) {
    setProgress((old) => ({ ...old, [id]: !old[id] }));
  }

  function openCourse(course) {
    setActiveCourse(course);
    setActiveLesson(null);
  }

  function saveProfile(event) {
    event.preventDefault();
    localStorage.setItem("lms-client-name", studentName);
    localStorage.setItem("lms-client-email", studentEmail);
    alert("Profile saved on this browser.");
  }

  function submitQuiz(quiz) {
    const answer = quizAnswer[quiz.id];
    if (answer === undefined) {
      alert("Please select an answer first.");
      return;
    }

    const correct = Number(answer) === Number(quiz.correctAnswer);
    setQuizResults((old) => ({
      ...old,
      [quiz.id]: {
        answer: Number(answer),
        correct,
        submittedAt: new Date().toISOString(),
      },
    }));

    alert(
      correct
        ? "Correct answer! Well done."
        : `Not quite. Correct answer: ${
            quiz.options?.[quiz.correctAnswer] || "Not available"
          }`
    );
  }

  return (
    <div className="client-app">
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
          <button className="top-profile" onClick={() => setPage("Profile")}>
            <div className="user-avatar small">
              {(studentName || "S").trim().charAt(0).toUpperCase()}
            </div>
            <span>{studentName || "Student"}</span>
          </button>
        </header>

        <div className="client-content">
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
                <Empty icon={BookOpen} title="No courses available yet" text="Courses will appear here after they are added to the admin portal." action="Refresh courses" onAction={() => setCourses(loadData("courses", []))} />
              ) : (
                <div className="client-course-grid">
                  {courses.slice(0, 3).map((course) => (
                    <CourseCard key={course.id} course={course}
                      bookmarked={bookmarks.includes(course.id)}
                      onBookmark={() => toggleBookmark(course.id)}
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
                <Empty icon={Compass} title="No matching courses" text="Try another search, or check back when courses are added." action="Refresh courses" onAction={() => setCourses(loadData("courses", []))}/>
              ) : (
                <div className="client-course-grid">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course}
                      bookmarked={bookmarks.includes(course.id)}
                      onBookmark={() => toggleBookmark(course.id)}
                      onOpen={() => openCourse(course)} />
                  ))}
                </div>
              )}
            </>
          )}

          {page === "My Learning" && (
            <>
              <PageHeading title="My learning" subtitle="Track your lesson completion." />
              {courses.length === 0 ? <Empty icon={BookOpen} title="Your learning starts here" text="There are no courses in the portal yet." action="Explore courses" onAction={() => setPage("Explore Courses")} /> :
                <div className="client-course-grid">{courses.map((course) => {
                  const lessons = (course.modules || []).flatMap((module) => module.lessons || []);
                  const done = lessons.filter((lesson) => progress[lesson.id]).length;
                  return <CourseCard key={course.id} course={course} completed={done} total={lessons.length} onOpen={() => openCourse(course)} />;
                })}</div>}
            </>
          )}

          {page === "Quiz Center" && (
            <>
              <PageHeading title="Quiz center" subtitle="Test your knowledge with course quizzes." />
              {quizzes.length === 0 ? <Empty icon={ClipboardList} title="No quizzes available" text="Published quizzes will appear here when the admin creates them." action="Refresh quizzes" onAction={() => setQuizzes(loadData("quizzes", []))} /> :
                <div className="quiz-grid">{quizzes.map((quiz) => (
                  <article className="quiz-card" key={quiz.id}>
                    <div className="quiz-icon"><ClipboardList size={22}/></div>
                    <h3>{quiz.title}</h3>
                    <p>{quiz.question}</p>
                    <div className="quiz-options">
                      {(quiz.options || []).map((option, index) => (
                        <label key={`${quiz.id}-${index}`} className={`quiz-option ${Number(quizAnswer[quiz.id]) === index ? "chosen" : ""}`}>
                          <input type="radio" name={`quiz-${quiz.id}`} checked={Number(quizAnswer[quiz.id]) === index} onChange={() => setQuizAnswer((old) => ({...old, [quiz.id]: index}))}/>
                          {option}
                        </label>
                      ))}
                    </div>
                    {quizResults[quiz.id] && <p className={quizResults[quiz.id].correct ? "result-good" : "result-bad"}>{quizResults[quiz.id].correct ? "Correct answer!" : `Correct answer: ${quiz.options?.[quiz.correctAnswer] || ""}`}</p>}
                    <button className="primary-btn full-width" onClick={() => submitQuiz(quiz)}>Submit answer</button>
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
              {courses.filter((course) => {
                const lessons = (course.modules || []).flatMap((module) => module.lessons || []);
                return lessons.length > 0 && lessons.every((lesson) => progress[lesson.id]);
              }).length === 0 ? <Empty icon={Award} title="No certificates yet" text="Complete all lessons in a course to unlock its certificate." action="Continue learning" onAction={() => setPage("My Learning")} /> :
                courses.filter((course) => {
                  const lessons = (course.modules || []).flatMap((module) => module.lessons || []);
                  return lessons.length > 0 && lessons.every((lesson) => progress[lesson.id]);
                }).map((course) => <article className="certificate-card" key={course.id}><Award size={30}/><div><h3>{course.title}</h3><p>Completed by {studentName || "Student"}</p></div><button className="secondary-btn" onClick={() => window.print()}>Print certificate</button></article>)}
            </>
          )}

          {page === "Profile" && (
            <>
              <PageHeading title="My profile" subtitle="Update your student details on this browser." />
              <form className="profile-form" onSubmit={saveProfile}>
                <div className="profile-badge"><UserRound size={32}/></div>
                <label>Full name<input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter your name" required /></label>
                <label>Email address<input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="you@example.com" /></label>
                <button className="primary-btn">Save profile</button>
                <p className="form-hint">This demo stores profile details in this browser only.</p>
              </form>
            </>
          )}

          {activeCourse && (
            <CourseViewer course={activeCourse} progress={progress} notes={notes}
              onClose={() => { setActiveCourse(null); setActiveLesson(null); }}
              onSelectLesson={setActiveLesson}
              activeLesson={activeLesson}
              onComplete={toggleComplete}
              onSaveNote={(id, value) => setNotes((old) => ({...old, [id]: value}))} />
          )}
        </div>
      </main>
    </div>
  );
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

function CourseCard({ course, bookmarked, onBookmark, onOpen, completed, total }) {
  const lessons = (course.modules || []).flatMap((module) => module.lessons || []);
  const lessonTotal = total ?? lessons.length;
  const lessonDone = completed ?? lessons.filter((lesson) => loadData("progress", {})[lesson.id]).length;
  const percent = lessonTotal ? Math.round(lessonDone / lessonTotal * 100) : 0;

  return <article className="client-course-card">
    <div className="course-art"><div className="art-circle"><GraduationCap size={37}/></div>{onBookmark && <button className={`save-course ${bookmarked ? "saved" : ""}`} onClick={onBookmark} aria-label="Bookmark course"><Bookmark size={19} fill={bookmarked ? "currentColor" : "none"}/></button>}</div>
    <div className="course-card-content">
      <span className="course-category">LEARNING COURSE</span>
      <h3>{course.title}</h3><p>{course.description || "Course details have not been added yet."}</p>
      <div className="course-facts"><span><BookOpen size={15}/>{(course.modules || []).length} modules</span><span><PlayCircle size={15}/>{lessonTotal} lessons</span></div>
      {total !== undefined && <><div className="progress-track"><span style={{width: `${percent}%`}}/></div><small className="progress-caption">{percent}% complete</small></>}
      <button className="primary-btn full-width" onClick={onOpen}>{total !== undefined ? "Continue learning" : "Open course"} <ArrowRight size={16}/></button>
    </div>
  </article>;
}

function CourseViewer({ course, onClose, onSelectLesson, activeLesson, progress, onComplete, notes, onSaveNote }) {
  const lessons = (course.modules || []).flatMap((module) =>
    (module.lessons || []).map((lesson) => ({...lesson, moduleTitle: module.title}))
  );
  const lesson = lessons.find((item) => item.id === activeLesson);
  return <div className="viewer-backdrop" role="presentation" onClick={onClose}>
    <section className="course-viewer" role="dialog" aria-modal="true" aria-label={course.title} onClick={(event) => event.stopPropagation()}>
      <div className="viewer-header"><div><span className="course-category">COURSE CONTENT</span><h2>{course.title}</h2></div><button className="icon-btn" onClick={onClose}><X size={22}/></button></div>
      <div className="viewer-layout">
        <div className="lesson-list"><h3>Course lessons</h3>{lessons.length === 0 && <p className="muted">No lessons have been added yet.</p>}{lessons.map((item) => <button key={item.id} onClick={() => onSelectLesson(item.id)} className={`viewer-lesson ${activeLesson === item.id ? "current" : ""}`}><span>{progress[item.id] ? <CheckCircle2 size={17}/> : <PlayCircle size={17}/>}</span><div>{item.title}<small>{item.moduleTitle}</small></div></button>)}</div>
        <div className="viewer-body">{!lesson ? <div className="viewer-placeholder"><GraduationCap size={42}/><h3>Choose a lesson</h3><p>Select a lesson from the list to begin.</p></div> : <>
          <span className="course-category">{lesson.type || "LESSON"}</span><h2>{lesson.title}</h2>
          {lesson.type === "video" && lesson.content ? <div className="video-box"><iframe src={lesson.content.replace("watch?v=", "embed/")} title={lesson.title} allowFullScreen/></div> : lesson.type === "pdf" && lesson.content ? <a className="pdf-button" href={lesson.content} target="_blank" rel="noreferrer"><FileText size={18}/> Open PDF lesson</a> : <div className="lesson-content">{lesson.content || "No lesson content has been added."}</div>}
          <label className="note-label">My lesson notes<textarea value={notes[lesson.id] || ""} onChange={(event) => onSaveNote(lesson.id, event.target.value)} placeholder="Write your notes here..."/></label>
          <button className="primary-btn" onClick={() => onComplete(lesson.id)}>{progress[lesson.id] ? <><CheckCircle2 size={17}/> Completed — mark incomplete</> : <>Mark lesson complete <CheckCircle2 size={17}/></>}</button>
        </>}</div>
      </div>
    </section>
  </div>;
}
