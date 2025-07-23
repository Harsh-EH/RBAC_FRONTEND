import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://rbacapp-93834eb91813.herokuapp.com/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Optional: Store user info (if included in token)
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // localStorage.setItem("role", payload.role);

      navigate("/"); // redirect to dashboard
    } catch (err) {
      console.error("Login failed:", err);
      setError("❌ Invalid username or password.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-3 text-center text-primary fw-bold">RBAC Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            🔐 Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
