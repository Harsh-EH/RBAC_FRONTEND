// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Login = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post("https://rbacapp-93834eb91813.herokuapp.com/auth/login", {
//         username,
//         password,
//       });

//       const token = response.data.token;
//       localStorage.setItem("token", token);

//       // Optional: Store user info (if included in token)
//       // const payload = JSON.parse(atob(token.split('.')[1]));
//       // localStorage.setItem("role", payload.role);

//       navigate("/"); // redirect to dashboard
//     } catch (err) {
//       console.error("Login failed:", err);
//       setError("❌ Invalid username or password.");
//     }
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
//       <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
//         <h3 className="mb-3 text-center text-primary fw-bold">RBAC Login</h3>

//         {error && <div className="alert alert-danger">{error}</div>}

//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label className="form-label">Username</label>
//             <input
//               type="text"
//               className="form-control"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               autoFocus
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button className="btn btn-primary w-100" type="submit">
//             🔐 Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
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
      const response = await axios.post(
        "https://rbacapp-93834eb91813.herokuapp.com/auth/login",
        {
          username: username.trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data?.token;

      if (!token) {
        throw new Error("❌ Token not received from server.");
      }

      localStorage.setItem("token", token);
      navigate("/"); // ✅ Redirect after login
    } catch (err) {
      console.error("Login failed:", err);

      if (err.response) {
        // Backend sent an error status
        if (err.response.status === 403) {
          setError("❌ Access Denied. Invalid credentials or insufficient permissions.");
        } else if (err.response.status === 400) {
          setError("❌ Bad Request. Ensure all fields are correct.");
        } else {
          setError(`❌ Server error (${err.response.status}): ${err.response.data?.message || "Unknown error"}`);
        }
      } else if (err.request) {
        // No response from backend
        setError("❌ No response from server. Possible CORS issue or server is down.");
      } else {
        // Something else failed before request was made
        setError("❌ Login error: " + err.message);
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-3 text-center text-primary fw-bold">🔐 RBAC Login</h3>

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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
