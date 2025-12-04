import { useState } from "react";

const Register = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      setSuccess(data.message);
      setUser(data.user);
    } catch (error) {
      console.error(`Register API ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword !== user.password) {
      setError("Password do not match.");
      return;
    }

    await registerAPI();
    setUser({ email: "", password: "" });
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
            <h1>Register your Account</h1>
          </header>
          <form onSubmit={handleSubmit}>
            {error && <p className="bg-red-200">{error}</p>}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="off"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="border block"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="off"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="border block"
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                name="confirm-password"
                value={user.value}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block border"
              />
            </div>
            <button type="submit" className="block border px-2 cursor-pointer">
              Register
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
