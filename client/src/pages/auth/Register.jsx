import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      setSuccess(data.message);
      await loginAPI(formData.email, formData.password);
      setFormData({ email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error(`Register API ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loginAPI = async () => {
    await fetch("http://localhost:8000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.confirmPassword !== formData.password) {
      setError("Password do not match.");
      return;
    }
    await registerAPI();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            {success && <p className="bg-green-200">{success}</p>}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="off"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                className="border block"
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
