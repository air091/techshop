import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: user.email, password: user.password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      setSuccess(data.message);
      navigate("/");
    } catch (error) {
      console.error(`Login API ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginAPI();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <header>
            <h1>Login your Account</h1>
          </header>
          <form onSubmit={handleSubmit}>
            {error && <p className="bg-red-200">{error}</p>}
            {success && <p className="bg-green-200">{success}</p>}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                autoComplete="off"
                className="block border"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                autoComplete="off"
                className="block border"
              />
            </div>
            <button type="submit" className="border px-2 cursor-pointer">
              Log in
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
