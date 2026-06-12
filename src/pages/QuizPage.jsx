import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/triviaApi";
import { decodeHtml } from "../utils/decodeHtml";
import { shuffleArray } from "../utils/shuffle";

function QuizPage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    navigate("/login");
  };

  useEffect(() => {
    const getQuestions = async () => {
      try {
        setLoading(true);

        const data = await fetchQuestions();

        const formattedQuestions = data.map((question) => ({
          ...question,
          category: decodeHtml(question.category),
          question: decodeHtml(question.question),
          correct_answer: decodeHtml(question.correct_answer),
          incorrect_answers: question.incorrect_answers.map((answer) =>
            decodeHtml(answer),
          ),
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No questions available.
      </div>
    );
  }

  const answerOptions = shuffleArray([
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">🧠 Quiz App</h1>
            <p className="text-slate-500">
              Welcome, {localStorage.getItem("username")} 👋
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-slate-500 mb-2">Question 1</p>

          <h2 className="text-xl font-semibold text-slate-800">
            {currentQuestion.question}
          </h2>

          <div className="mt-6 grid gap-3">
            {answerOptions.map((answer, index) => (
              <button
                key={index}
                className="w-full text-left p-4 border border-slate-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition"
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
