
import { useEffect, useState } from "react";

function QuizCenter() {
  const [courses, setCourses] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function loadCourses() {
      try {
        const savedCourses = localStorage.getItem("meet_lms_courses");
        setCourses(savedCourses ? JSON.parse(savedCourses) : []);
      } catch (error) {
        console.error("Error loading courses:", error);
        setCourses([]);
      }
    }

    loadCourses();
    window.addEventListener("coursesUpdated", loadCourses);

    return () => {
      window.removeEventListener("coursesUpdated", loadCourses);
    };
  }, []);

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
      <main className="quiz-center">
        <h1>Quiz Center</h1>
        <p>Choose a quiz from your courses.</p>

        {quizzes.length === 0 ? (
          <div className="quiz-empty">
            <h2>No quizzes available</h2>
            <p>
              Create a quiz in Quiz Builder and save it to a course.
            </p>
          </div>
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div className="quiz-card" key={quiz.id}>
                <h3>{quiz.title || quiz.name || "Course Quiz"}</h3>
                <p>{quiz.courseTitle}</p>
                <p>{quiz.questions.length} questions</p>

                <button
                  type="button"
                  disabled={quiz.questions.length === 0}
                  onClick={() => startQuiz(quiz)}
                >
                  Start Quiz
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