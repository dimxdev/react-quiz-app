import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);

  const TOTAL_QUESTIONS = 10;

  useEffect(() => {
    const savedResults =
      JSON.parse(localStorage.getItem("quizResults")) || [];

    setResults(savedResults);
  }, []);

  const correctAnswers = results.filter(
    (result) => result.isCorrect
  ).length;

  const wrongAnswers = results.filter(
    (result) => !result.isCorrect
  ).length;

  const unanswered =
    TOTAL_QUESTIONS - results.length;

  const score = Math.round(
    (correctAnswers / TOTAL_QUESTIONS) * 100
  );

  const handleRestart = () => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("quizProgress");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          🎉 Quiz Finished!
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>✅ Correct</span>
            <span>{correctAnswers}</span>
          </div>

          <div className="flex justify-between">
            <span>❌ Wrong</span>
            <span>{wrongAnswers}</span>
          </div>

          <div className="flex justify-between">
            <span>⏭️ Unanswered</span>
            <span>{unanswered}</span>
          </div>

          <div className="flex justify-between">
            <span>📚 Total Questions</span>
            <span>{TOTAL_QUESTIONS}</span>
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>🏆 Score</span>
            <span>{score}%</span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
}

export default ResultPage;