// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const UpdateUserModal = ({ show, onClose }) => {
//   const [token, setToken] = useState("");
//   const [currentUsername, setCurrentUsername] = useState("");
//   const [newUsername, setNewUsername] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       try {
//         const decoded = jwtDecode(storedToken);
//         setCurrentUsername(decoded?.sub);
//         setNewUsername(decoded?.sub); // default username in input
//         setToken(storedToken);
//       } catch (error) {
//         setMessage("Invalid token. Please login again.");
//       }
//     } else {
//       setMessage("No token found. Please login.");
//     }
//   }, []);

//   const handleUpdate = async () => {
//     if (!newUsername || !newPassword) {
//       setMessage("❌ Username and password cannot be empty.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `https://rbacapp-93834eb91813.herokuapp.com/users/${currentUsername}`,
//         { username: newUsername, password: newPassword },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMessage("✅ Updated successfully! Please login again.");
//       localStorage.removeItem("token");

//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 1500);
//     } catch (err) {
//       console.error("Update failed:", err);
//       if (err.response?.status === 403) {
//         setMessage("❌ Forbidden: You don’t have permission to update.");
//       } else if (err.response?.status === 400) {
//         setMessage("❌ Bad Request: Invalid input.");
//       } else {
//         setMessage("❌ Update failed. Server error.");
//       }
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//       <div className="modal-dialog">
//         <div className="modal-content shadow">
//           <div className="modal-header bg-primary text-white">
//             <h5 className="modal-title">Update Your Credentials</h5>
//             <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
//           </div>

//           <div className="modal-body">
//             {message && <div className="alert alert-info">{message}</div>}

//             <div className="mb-3">
//               <label className="form-label">New Username</label>
//               <input
//                 className="form-control"
//                 value={newUsername}
//                 onChange={(e) => setNewUsername(e.target.value)}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">New Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>
//               Cancel
//             </button>
//             <button className="btn btn-success" onClick={handleUpdate}>
//               Update
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateUserModal;import React, { useState } from "react";import React, { useState } from "react";
import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UpdateUserModal = ({ show, onClose }) => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const currentUsername = decoded?.sub;

  // ✅ Hooks must be at the top level, outside conditions
  const [newUsername, setNewUsername] = useState(currentUsername || "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Must come after hooks
  if (!show) return null;

  const handleUpdate = async () => {
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "https://rbacapp-93834eb91813.herokuapp.com/auth/login",
        {
          username: newUsername,
          password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newToken = response.data.token;
      setMessage("✅ Updated successfully! Please login again.");
      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Update failed:", err);
      setError("❌ Failed to update. You may not have permission.");
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Update Username or Password</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label className="form-label">New Username</label>
              <input
                className="form-control"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
