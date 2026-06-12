import { useNavigate } from "react-router-dom";

function QuizPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Page</h1>

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
