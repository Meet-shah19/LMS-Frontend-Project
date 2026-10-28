
import { useState } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";

function QuizCenter({ courses, loadingCourses, onCreate, onCreateCourse, onDelete }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const quizzes = courses.flatMap((course) => {
    const savedQuizzes = Array.isArray(course.quizzes)
      ? course.quizzes
      : course.quizzes
        ? [course.quizzes]
        : course.quiz
          ? [course.quiz]
          : [];

    return savedQuizzes.map((quiz, index) => ({
      ...quiz,
      id: quiz.id ?? `${course.id}-${index}`,
      courseId: course.id,
      courseTitle: course.title || course.name || "Untitled Course",
      questions: Array.isArray(quiz.questions) ? quiz.questions : [],
    }));
  });

  function startQuiz(quiz) {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
  }

  function getOptions(question) {
    return (question.options || question.answers || []).map((option) =>
      typeof option === "string"
        ? option
        : option.text || option.label || option.option || ""
    );
  }

  function chooseAnswer(optionIndex) {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: optionIndex,
    }));
  }

  function getCorrectAnswerIndex(question) {
    const correct =
      question.correctAnswer ??
      question.correctOption ??
      question.answer;

    if (typeof correct === "number") return correct;

    if (typeof correct === "string") {
      const options = getOptions(question);
      const matchingIndex = options.indexOf(correct);

      if (matchingIndex !== -1) return matchingIndex;

      const letter = correct.trim().toUpperCase();

      if (/^[A-D]$/.test(letter)) {
        return letter.charCodeAt(0) - 65;
      }
    }

    return -1;
  }

  function calculateScore() {
    return selectedQuiz.questions.reduce((score, question, index) => {
      return getCorrectAnswerIndex(question) === answers[index]
        ? score + 1
        : score;
    }, 0);
  }

  if (!selectedQuiz) {
    return (
      <main>
        <div className="page-title-row">
          <div>
            <h1>Quiz Center</h1>
            <p>Create quizzes for your courses and manage existing ones.</p>
          </div>
          <button
            type="button"
            className="button button-primary"
            onClick={onCreate}
            disabled={loadingCourses || courses.length === 0}
          >
            <Plus size={17} /> Create a quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="empty-state">
            <h2>No quizzes available</h2>
            <p>
              {courses.length === 0
                ? "Create a course before building a quiz."
                : "Create a quiz, add questions, and save it to one of your courses."}
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={courses.length === 0 ? onCreateCourse : onCreate}
              disabled={loadingCourses}
            >
              <Plus size={17} /> {courses.length === 0 ? "Create a course first" : "Create your first quiz"}
            </button>
          </div>
        ) : (
          <div className="quiz-list">
            {quizzes.map((quiz) => (
              <div className="quiz-list-item" key={quiz.id}>
                <div className="quiz-list-icon"><ClipboardList size={19} /></div>
                <div className="quiz-list-copy">
                  <h3>{quiz.title || quiz.name || "Course Quiz"}</h3>
                  <p>{quiz.courseTitle} - {quiz.questions.length} questions - {quiz.timeLimitMinutes || 10} min</p>
                </div>

                <button
                  className="button button-secondary"
                  type="button"
                  disabled={quiz.questions.length === 0 || !courses.find((course) => course.id === quiz.courseId)?.canEdit}
                  title={!courses.find((course) => course.id === quiz.courseId)?.canEdit ? "Course is locked while pending review" : "Start quiz preview"}
                  onClick={() => startQuiz(quiz)}
                >
                  Start Quiz
                </button>
                <button
                  className="icon-button danger-button quiz-delete-button"
                  type="button"
                  aria-label={`Delete ${quiz.title || quiz.name || "quiz"}`}
                  title="Delete quiz"
                  disabled={!courses.find((course) => course.id === quiz.courseId)?.canEdit}
                  onClick={() => onDelete(quiz.courseId, quiz.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="quiz-center">
        <div className="quiz-panel">
          <h1>Quiz Completed!</h1>

          <h2>
            Your Score: {calculateScore()} / {selectedQuiz.questions.length}
          </h2>

          {selectedQuiz.questions.map((question, index) => {
            const options = getOptions(question);
            const correctIndex = getCorrectAnswerIndex(question);

            return (
              <div className="quiz-review" key={index}>
                <h3>
                  {index + 1}. {question.question || question.text}
                </h3>

                <p>
                  Your answer:{" "}
                  {answers[index] === undefined
                    ? "Not answered"
                    : options[answers[index]]}
                </p>

                <p>
                  Correct answer:{" "}
                  {correctIndex >= 0
                    ? options[correctIndex]
                    : "Not configured"}
                </p>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setSelectedQuiz(null);
              setAnswers({});
              setSubmitted(false);
              setCurrentQuestion(0);
            }}
          >
            Back to Quiz Center
          </button>
        </div>
      </main>
    );
  }

  const question = selectedQuiz.questions[currentQuestion];
  const options = getOptions(question);

  return (
    <main className="quiz-center">
      <div className="quiz-panel">
        <button
          type="button"
          onClick={() => setSelectedQuiz(null)}
        >
          ← Back to quizzes
        </button>

        <h1>{selectedQuiz.title || selectedQuiz.name || "Course Quiz"}</h1>

        <p>
          Question {currentQuestion + 1} of{" "}
          {selectedQuiz.questions.length}
        </p>

        <h2>{question.question || question.text || question.title}</h2>

        <div className="quiz-options">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={
                answers[currentQuestion] === index
                  ? "quiz-option selected"
                  : "quiz-option"
              }
              onClick={() => chooseAnswer(index)}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        <div className="quiz-navigation">
          <button
            type="button"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((previous) => previous - 1)}
          >
            Previous
          </button>

          {currentQuestion < selectedQuiz.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentQuestion((previous) => previous + 1)}
            >
              Next
            </button>
          ) : (
            <button type="button" onClick={() => setSubmitted(true)}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default QuizCenter;