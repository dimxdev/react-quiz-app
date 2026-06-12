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

  // FIX 1: tambah removeItem("quizProgress") saat logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("quizResults");
    localStorage.removeItem("quizProgress");

    navigate("/login");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const savedProgress = localStorage.getItem("quizProgress");

        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);

          const shouldResume = window.confirm("Resume previous quiz?");

          if (shouldResume) {
            setQuestions(parsed.questions);
            setCurrentQuestionIndex(parsed.currentQuestionIndex);
            setAnswers(parsed.answers);
            setTimeLeft(parsed.timeLeft);

            setLoading(false);
            return;
          }

          localStorage.removeItem("quizProgress");
        }

        setLoading(true);

        const data = await fetchQuestions();

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
      } catch (error) {
        console.error(error);
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  useEffect(() => {
    if (!questions.length) return;

    const quizProgress = {
      questions,
      currentQuestionIndex,
      answers,
      timeLeft,
    };

    localStorage.setItem("quizProgress", JSON.stringify(quizProgress));
  }, [questions, currentQuestionIndex, answers, timeLeft]);

  // FIX 5: hapus `answers` dari dependency array agar timer tidak restart tiap jawab
  useEffect(() => {
    if (!questions.length) return;

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
  }, [questions, navigate]); // <-- FIX 5: answers dihapus dari sini

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

  const currentQuestion = questions[currentQuestionIndex];
  const answerOptions = currentQuestion.options;

  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (selectedAnswer) => {
    const newAnswer = {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect: selectedAnswer === currentQuestion.correct_answer,
    };

    setAnswers((prev) => [...prev, newAnswer]);

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    // FIX 3: hapus quizProgress saat soal terakhir dijawab
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

        {/* Quiz Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>

            <span className="font-bold text-indigo-600">
              ⏱️ {formatTime(timeLeft)}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-sm text-slate-600 mb-6">
            <span>Total: {questions.length}</span>
            <span>Answered: {answers.length}</span>
          </div>

          <h2 className="text-xl font-semibold text-slate-800">
            {currentQuestion.question}
          </h2>

          <div className="mt-6 grid gap-3">
            {answerOptions.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
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
