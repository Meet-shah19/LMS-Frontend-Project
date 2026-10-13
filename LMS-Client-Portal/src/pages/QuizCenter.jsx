
import { useState } from "react";
import { ClipboardList, CheckCircle, RotateCcw } from "lucide-react";

export default function QuizCenter({ quizzes = [] }) {
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const quiz = quizzes.find(
    (item) => String(item.id) === String(selectedQuizId)
  );

  function selectQuiz(id) {
    setSelectedQuizId(String(id));
    setAnswers({});
    setSubmitted(false);
  }

  function submitQuiz(event) {
    event.preventDefault();

    if (!quiz) return;

    const options = Array.isArray(quiz.options) ? quiz.options : [];

    if (
      options.length > 0 &&
      answers[quiz.id] === undefined
    ) {
      window.alert("Please select an answer before submitting.");
      return;
    }

    setSubmitted(true);
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  const options = quiz && Array.isArray(quiz.options) ? quiz.options : [];
  const correctAnswer = quiz?.correctAnswer;

  const isCorrect =
    quiz &&
    answers[quiz.id] !== undefined &&
    String(answers[quiz.id]) === String(correctAnswer);

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">TEST YOUR KNOWLEDGE</span>
          <h1>Quiz Center</h1>
          <p>Select a quiz from your available courses and submit your answer.</p>
        </div>
      </div>

      <section className="quiz-panel">
        <label htmlFor="quiz-select">Choose a quiz</label>

        <select
          id="quiz-select"
          className="form-control"
          value={selectedQuizId}
          onChange={(event) => selectQuiz(event.target.value)}
        >
          <option value="">Select a quiz...</option>

          {quizzes.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.title || "Untitled quiz"}
            </option>
          ))}
        </select>

        {quizzes.length === 0 && (
          <div className="empty-state">
            <ClipboardList size={38} />
            <h3>No quizzes available</h3>
            <p>Published quizzes will appear here when they are added by the instructor.</p>
          </div>
        )}

        {quiz && (
          <form onSubmit={submitQuiz} className="quiz-form">
            <h2>{quiz.title || "Quiz"}</h2>
            <p className="quiz-question">
              {quiz.question || "No question has been added to this quiz."}
            </p>

            {options.length === 0 ? (
              <p className="muted-text">
                This quiz does not have any answer options yet.
              </p>
            ) : (
              <div className="quiz-options">
                {options.map((option, index) => (
                  <label
                    className={`quiz-option ${
                      answers[quiz.id] === index ? "selected" : ""
                    }`}
                    key={`${quiz.id}-option-${index}`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${quiz.id}`}
                      value={index}
                      checked={answers[quiz.id] === index}
                      disabled={submitted}
                      onChange={() =>
                        setAnswers((previous) => ({
                          ...previous,
                          [quiz.id]: index,
                        }))
                      }
                    />

                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {submitted && (
              <div className="quiz-result" role="status">
                {isCorrect ? (
                  <p>
                    <CheckCircle size={18} /> Correct answer!
                  </p>
                ) : (
                  <p>
                    Your answer is incorrect. Review the question and try again.
                  </p>
                )}

                <p>
                  Correct answer:{" "}
                  {options[Number(correctAnswer)] ?? "Not configured"}
                </p>
              </div>
            )}

            <div className="quiz-actions">
              {!submitted ? (
                <button
                  type="submit"
                  className="primary-button"
                  disabled={options.length === 0}
                >
                  Submit answer
                </button>
              ) : (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetQuiz}
                >
                  <RotateCcw size={17} />
                  Try again
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
