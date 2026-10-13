
import {
  BookOpen, Layers, ClipboardCheck, FileEdit, ArrowUpRight, Plus
} from "lucide-react";
import StatCard from "../components/StatCard";
import CourseCard from "../components/CourseCard";

export default function Dashboard({ courses, onCreate, onEdit, onDelete, setPage }) {
  const published = courses.filter((course) => course.status === "Published").length;
  const lessonCount = courses.reduce((total, course) => total + (course.lessons?.length || 0), 0);
  const quizCount = courses.reduce((total, course) => total + (course.quizzes?.length || 0), 0);

  return (
    <div className="page-content">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">INSTRUCTOR WORKSPACE</span>
          <h1>Welcome back, Instructor 👋</h1>
          <p>Manage your courses, prepare lessons, and create quizzes in one place.</p>
          <button className="button button-light" onClick={onCreate}>
            <Plus size={17} /> Create new course
          </button>
        </div>
        <div className="welcome-art"><BookOpen size={74} /></div>
      </section>

      <div className="section-heading">
        <div>
          <h2>Your overview</h2>
          <p>Here is what is happening in your workspace.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total courses" value={courses.length} note="All your courses" icon={BookOpen} color="stat-purple" />
        <StatCard title="Published" value={published} note="Available to learners" icon={ArrowUpRight} color="stat-green" />
        <StatCard title="Lessons" value={lessonCount} note="Across all courses" icon={Layers} color="stat-blue" />
        <StatCard title="Quizzes" value={quizCount} note="Created by you" icon={ClipboardCheck} color="stat-orange" />
      </div>

      <div className="section-heading section-heading-spaced">
        <div>
          <h2>Recently updated courses</h2>
          <p>Continue working on your course content.</p>
        </div>
        <button className="text-button" onClick={() => setPage("courses")}>
          View all courses <ArrowUpRight size={16} />
        </button>
      </div>

      {courses.length ? (
        <div className="course-grid">
          {courses.slice(0, 3).map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FileEdit size={34} />
          <h3>Your teaching workspace is ready</h3>
          <p>Create your first course to get started.</p>
          <button className="button button-primary" onClick={onCreate}>Create a course</button>
        </div>
      )}
    </div>
  );
}