import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSessionManager from "../hooks/useSessionManager";

const Login = () => {
  useSessionManager(); // 🧠 Tracks nav and clears token if back nav

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://multiadminproj.onrender.com/auth/login",
        {
          username: username.trim(),
          password: password.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data?.token;
      if (!token) throw new Error("Token not received");

      localStorage.setItem("token", token);
      sessionStorage.setItem("lastRoute", "/"); // 👈 Store route to detect backward
      navigate("/"); // 🧭 Add to history stack
    } catch (err) {
      console.error("Login failed:", err);
      setError("❌ Login failed. Check credentials.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-primary fw-bold mb-3">🔐 RBAC Login</h3>

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
              placeholder="Enter username"
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
              placeholder="Enter password"
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
