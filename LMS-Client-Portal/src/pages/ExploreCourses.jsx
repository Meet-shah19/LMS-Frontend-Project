
import { useMemo, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function ExploreCourses({
  courses = [],
  progress = {},
  bookmarks = [],
  onOpenCourse = () => {},
  onToggleBookmark = () => {},
}) {
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const title = (course.title || "").toLowerCase();
      const description = (course.description || "").toLowerCase();

      return title.includes(query) || description.includes(query);
    });
  }, [courses, search]);

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">COURSE CATALOG</span>
          <h1>Explore courses</h1>
          <p>Discover courses and find your next learning opportunity.</p>
        </div>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="search"
          placeholder="Search courses..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search courses"
        />
      </div>

      <div className="section-heading">
        <h2>All courses ({filteredCourses.length})</h2>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={38} />
          <h3>{courses.length ? "No matching courses" : "No courses available"}</h3>
          <p>
            {courses.length
              ? "Try another search term."
              : "Courses will appear here when they are added."}
          </p>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progress}
              bookmarked={bookmarks.includes(course.id)}
              onOpen={onOpenCourse}
              onBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
