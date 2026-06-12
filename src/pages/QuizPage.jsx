import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/triviaApi";
import { decodeHtml } from "../utils/decodeHtml";

function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            decodeHtml(answer)
          ),
        }));

        setQuestions(formattedQuestions);

        console.log(formattedQuestions);
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Page</h1>

      <p className="mb-4">
        Questions Loaded: {questions.length}
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

export default QuizPage;