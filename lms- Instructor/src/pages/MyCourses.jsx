
import { BookOpen, Plus, SearchX } from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function MyCourses({ courses, search, onCreate, onEdit, onDelete }) {
  const filtered = courses.filter((course) =>
    `${course.title} ${course.description} ${course.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">CONTENT MANAGEMENT</span>
          <h1>My Courses</h1>
          <p>Create, organize, and update your teaching content.</p>
        </div>
        <button className="button button-primary" onClick={onCreate}>
          <Plus size={17} /> Create course
        </button>
      </div>

      <div className="filter-summary">
        <span><BookOpen size={17} /> {filtered.length} courses</span>
        <span className="field-hint">Search using the search bar above.</span>
      </div>

      {filtered.length ? (
        <div className="course-grid">
          {filtered.map((course, index) => (
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
          <SearchX size={36} />
          <h3>No courses found</h3>
          <p>Try another search, or create a new course.</p>
          <button className="button button-primary" onClick={onCreate}>Create a course</button>
        </div>
      )}
    </div>
  );
}