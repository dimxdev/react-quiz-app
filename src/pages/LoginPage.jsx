import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangeData = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      return setError("Username is required");
    }

    if (!formData.password.trim()) {
      return setError("Password is required");
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", formData.username);

    console.log("Login success");
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">🧠 Quiz App</h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Welcome back! Please login to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChangeData}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChangeData}
              placeholder="Enter your password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
