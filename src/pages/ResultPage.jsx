import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const navigate = useNavigate();

  const TOTAL_QUESTIONS = 10;

  const [results] = useState(
    () => JSON.parse(localStorage.getItem("quizResults")) || []
  );

  const correctAnswers = results.filter((result) => result.isCorrect).length;
  const wrongAnswers = results.filter((result) => !result.isCorrect).length;
  const unanswered = TOTAL_QUESTIONS - results.length;
  const score = Math.round((correctAnswers / TOTAL_QUESTIONS) * 100);

  const getGrade = () => {
    if (score >= 90) return { label: "Excellent 🎯", color: "text-emerald-600" };
    if (score >= 70) return { label: "Good 👍", color: "text-indigo-600" };
    if (score >= 50) return { label: "Fair 😐", color: "text-amber-600" };
    return { label: "Try Again 💪", color: "text-red-500" };
  };

  const grade = getGrade();

  const handleRestart = () => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("quizProgress");
    navigate("/quiz");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center p-4 sm:p-6 py-10">
      <div className="w-full max-w-md md:max-w-5xl space-y-6">

        {/* ── Score Summary Card ── */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-slate-800">
              🎉 Quiz Finished!
            </h1>

            <div className="space-y-3">
              <div className="flex justify-between text-sm sm:text-base text-slate-600">
                <span>✅ Correct</span>
                <span className="font-semibold text-slate-800">{correctAnswers}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-slate-600">
                <span>❌ Wrong</span>
                <span className="font-semibold text-slate-800">{wrongAnswers}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-slate-600">
                <span>⏭️ Unanswered</span>
                <span className="font-semibold text-slate-800">{unanswered}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-slate-600">
                <span>📚 Total Questions</span>
                <span className="font-semibold text-slate-800">{TOTAL_QUESTIONS}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base sm:text-lg text-slate-800">
                <span>🏆 Score</span>
                <span className="text-indigo-600">{score}%</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-slate-600">
                <span>⭐ Grade</span>
                <span className={`font-semibold ${grade.color}`}>{grade.label}</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition cursor-pointer min-h-[48px]"
            >
              🔄 Restart Quiz
            </button>

            <button
              onClick={handleLogout}
              className="w-full mt-3 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 font-semibold py-3.5 rounded-xl border border-red-200 hover:border-red-300 transition cursor-pointer min-h-[48px]"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* ── Quiz Review Card ── */}
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-slate-100">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 border-t border-slate-200" />
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              📖 Quiz Review
            </h2>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Empty state */}
          {results.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm">No quiz results available.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`w-full md:w-[calc(33.333%-11px)] md:min-w-[260px] rounded-xl border p-4 shadow-sm ${result.isCorrect
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-red-200 bg-red-50"
                    }`}
                >
                  {/* Question header row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Question {index + 1}
                    </span>
                    {result.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        🟢 Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        🔴 Wrong
                      </span>
                    )}
                  </div>

                  {/* Question text */}
                  <p className="text-sm sm:text-base font-medium text-slate-800 break-words leading-relaxed mb-3">
                    {result.question}
                  </p>

                  {/* Your Answer */}
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                      Your Answer
                    </p>
                    <p className={`text-sm font-medium break-words ${result.isCorrect ? "text-emerald-700" : "text-red-600"
                      }`}>
                      {result.isCorrect ? "✅" : "❌"} {result.selectedAnswer}
                    </p>
                  </div>

                  {/* Correct Answer — always shown for wrong answers */}
                  {!result.isCorrect && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        Correct Answer
                      </p>
                      <p className="text-sm font-medium text-emerald-700 break-words">
                        ✅ {result.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ResultPage;