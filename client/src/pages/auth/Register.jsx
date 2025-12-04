import { useState } from "react";

const Register = () => {
  const [user, setUser] = useState({ email: "", password: "" });
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
      console.log(data);
    } catch (error) {
      console.error(`Register API ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return <div>Register Page</div>;
};

export default Register;
