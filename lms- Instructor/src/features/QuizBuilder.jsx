
import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

const emptyQuestion = () => ({
  id: crypto.randomUUID(),
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0
});

export default function QuizBuilder({ courses, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [error, setError] = useState("");

  function updateQuestion(id, field, value) {
    setQuestions((previous) =>
      previous.map((q) => q.id === id ? { ...q, [field]: value } : q)
    );
  }

  function updateOption(questionId, index, value) {
    setQuestions((previous) =>
      previous.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((option, i) => i === index ? value : option) }
          : q
      )
    );
  }

  function submit(event) {
    event.preventDefault();

    if (!courseId) {
      setError("Create a course before adding a quiz.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a quiz title.");
      return;
    }

    const invalid = questions.some(
      (q) => !q.question.trim() || q.options.some((option) => !option.trim())
    );

    if (invalid) {
      setError("Complete every question and all four options.");
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      title: title.trim(),
      courseId,
      questions,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <form className="editor-form" onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <label className="full-field">
          Quiz title *
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. React Basics Quiz"
            required
          />
        </label>

        <label className="full-field">
          Course *
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
            {courses.length === 0 && <option value="">No courses available</option>}
            {courses.map((course) => (
              <option value={course.id} key={course.id}>{course.title}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="section-divider" />
      <div className="quiz-question-heading">
        <div>
          <h3>Questions</h3>
          <p className="field-hint">Add four choices and select the correct answer.</p>
        </div>
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => setQuestions([...questions, emptyQuestion()])}
        >
          <Plus size={16} /> Add question
        </button>
      </div>

      {questions.map((question, questionIndex) => (
        <div className="question-card" key={question.id}>
          <div className="question-card-heading">
            <strong>Question {questionIndex + 1}</strong>
            {questions.length > 1 && (
              <button
                type="button"
                className="icon-button danger-button"
                onClick={() => setQuestions(questions.filter((q) => q.id !== question.id))}
                aria-label="Remove question"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <label>
            Question text
            <input
              value={question.question}
              onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
              placeholder="Enter your question"
              required
            />
          </label>

          <div className="option-grid">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex}>
                <span className="option-label">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === optionIndex}
                    onChange={() => updateQuestion(question.id, "correctAnswer", optionIndex)}
                  />
                  Option {String.fromCharCode(65 + optionIndex)}
                  {question.correctAnswer === optionIndex && <em>Correct answer</em>}
                </span>
                <input
                  value={option}
                  onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                  placeholder={`Enter option ${optionIndex + 1}`}
                  required
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          <Save size={17} /> Save quiz
        </button>
      </div>
    </form>
  );
}