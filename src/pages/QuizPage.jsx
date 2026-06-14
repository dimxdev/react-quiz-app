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
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);

  // Modal States
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingProgress, setPendingProgress] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("quizResults");
    localStorage.removeItem("quizProgress");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const fetchNewQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchQuestions();

      if (!data || data.length === 0) {
        setQuestions([]);
        return;
      }

      const formattedQuestions = data.map((question) => {
        const correctAnswer = decodeHtml(question.correct_answer);

        const incorrectAnswers = question.incorrect_answers.map((answer) =>
          decodeHtml(answer),
        );

        return {
          ...question,
          category: decodeHtml(question.category),
          question: decodeHtml(question.question),
          correct_answer: correctAnswer,
          incorrect_answers: incorrectAnswers,

          options: shuffleArray([correctAnswer, ...incorrectAnswers]),
        };
      });

      setQuestions(formattedQuestions);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSavedProgress = () => {
      const savedProgress = localStorage.getItem("quizProgress");

      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          setPendingProgress(parsed);
          setShowResumeModal(true);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse saved progress", e);
          localStorage.removeItem("quizProgress");
        }
      }
      fetchNewQuestions();
    };

    checkSavedProgress();
  }, []);

  const handleResumeConfirm = () => {
    if (pendingProgress) {
      setQuestions(pendingProgress.questions);
      setCurrentQuestionIndex(pendingProgress.currentQuestionIndex);
      setAnswers(pendingProgress.answers);
      setTimeLeft(pendingProgress.timeLeft);
    }
    setShowResumeModal(false);
    setPendingProgress(null);
  };

  const handleResumeDecline = () => {
    localStorage.removeItem("quizProgress");
    setShowResumeModal(false);
    setPendingProgress(null);
    fetchNewQuestions();
  };

  useEffect(() => {
    if (!questions.length || showResumeModal) return;

    const quizProgress = {
      questions,
      currentQuestionIndex,
      answers,
      timeLeft,
    };

    localStorage.setItem("quizProgress", JSON.stringify(quizProgress));
  }, [questions, currentQuestionIndex, answers, timeLeft, showResumeModal]);

  useEffect(() => {
    if (!questions.length || showResumeModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          const savedProgress = JSON.parse(
            localStorage.getItem("quizProgress") || "{}",
          );

          localStorage.setItem(
            "quizResults",
            JSON.stringify(savedProgress.answers || []),
          );

          localStorage.removeItem("quizProgress");
          navigate("/result");

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, navigate, showResumeModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium text-lg">Loading Questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Occurred</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length && !showResumeModal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-slate-400 text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Questions</h2>
          <p className="text-slate-600 mb-6">No questions are available at the moment. Please try again later.</p>
          <button
            onClick={fetchNewQuestions}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition cursor-pointer"
          >
            Fetch Questions
          </button>
        </div>
      </div>
    );
  }

  // Fallback while modal shows prior to question assignment
  const currentQuestion = questions[currentQuestionIndex] || { question: "", options: [] };
  const answerOptions = currentQuestion.options || [];

  const progressPercentage = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  const handleAnswer = (selectedAnswer) => {
    const newAnswer = {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect: selectedAnswer === currentQuestion.correct_answer,
    };

    setAnswers((prev) => [...prev, newAnswer]);

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      const finalAnswers = [...answers, newAnswer];
      localStorage.setItem("quizResults", JSON.stringify(finalAnswers));
      localStorage.removeItem("quizProgress");
      navigate("/result");
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6 flex flex-col justify-center py-8">
      <div className="max-w-3xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">🧠 Quiz App</h1>
            <p className="text-slate-500 text-sm sm:text-base break-words mt-0.5">
              Welcome, {localStorage.getItem("username")} 👋
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg transition text-center min-h-[44px] cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Quiz Card */}
        {questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8">
            <div className="flex justify-between items-center mb-4 gap-2">
              <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>

              <span className="text-sm sm:text-base font-bold text-indigo-600 whitespace-nowrap flex items-center gap-1">
                ⏱️ {formatTime(timeLeft)}
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-slate-500 mb-6">
              <span>Total: {questions.length}</span>
              <span>Answered: {answers.length}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 break-words leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="mt-6 grid gap-3">
              {answerOptions.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  className="w-full text-left p-4 min-h-[48px] border border-slate-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition break-words text-sm sm:text-base leading-relaxed cursor-pointer"
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resume Quiz Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Resume Previous Quiz?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              We found your saved progress. Would you like to resume where you left off?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResumeDecline}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-xl transition min-h-[44px] cursor-pointer text-sm"
              >
                Start Fresh
              </button>
              <button
                onClick={handleResumeConfirm}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition min-h-[44px] cursor-pointer text-sm"
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100">
            <div className="text-4xl mb-4">🚪</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Logout Quiz?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to logout? You will lose your current quiz progress.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-xl transition min-h-[44px] cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-100 hover:shadow-red-200 transition min-h-[44px] cursor-pointer text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
