import { useState } from "react";

function Categories({
  categories,
  addCategory,
  deleteCategory,
}) {
  const [name, setName] =
    useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name.");
      return;
    }

    const exists = categories.some(
      (category) =>
        category.name.toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (exists) {
      alert("Category already exists.");
      return;
    }

    addCategory(name.trim());
    setName("");
  }

  return (
    <>
      <PageTitle
        title="Categories"
        subtitle="Manage course categories"
      />

      <section className="card">
        <div className="card-header">
          <div>
            <h3>Add Category</h3>
            <p>
              Create a category for your courses
            </p>
          </div>
        </div>

        <form
          className="category-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <button className="primary-button">
            + Add Category
          </button>
        </form>
      </section>

      <section className="category-grid">
        {categories.length === 0 ? (
          <div className="card">
            <Empty
              icon="◫"
              title="No categories"
              text="Add your first course category."
            />
          </div>
        ) : (
          categories.map((category) => (
            <div
              className="category-card"
              key={category.id}
            >
              <div className="category-icon">
                ◫
              </div>

              <div className="category-info">
                <h3>
                  {category.name}
                </h3>

                <p>
                  Course category
                </p>
              </div>

              <button
                className="delete-button"
                onClick={() =>
                  deleteCategory(
                    category.id
                  )
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </>
  );
}

function PageTitle({
  title,
  subtitle,
}) {
  return (
    <div className="page-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function Empty({
  icon,
  title,
  text,
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        {icon}
      </div>

      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export default Categories;