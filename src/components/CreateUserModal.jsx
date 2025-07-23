import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateUserModal = ({ show, onClose, onUserCreated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (show) {
      fetchRoles();
    }
  }, [show]);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(
        "https://rbacapp-93834eb91813.herokuapp.com/roles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setError("❌ Failed to load roles.");
    }
  };

  const handleCreateUser = async (e) => {
  e.preventDefault();
  setError("");

  // 🔍 Only send role name (not permissions)
  const role = roles.find((r) => r.name === selectedRole);
  if (!role) {
    setError("❌ Please select a valid role.");
    return;
  }

  const payload = {
    username,
    password,
    role: {
      name: role.name,
      permissions: [] // 👈 Required: Send empty array
    }
  };

  try {
    const res = await axios.post(
      "https://rbacapp-93834eb91813.herokuapp.com/users",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("✅ User created successfully!");
    setUsername("");
    setPassword("");
    setSelectedRole("");
    onUserCreated(); // Refresh user list
    onClose(); // Close modal
  } catch (err) {
    console.error("User creation failed:", err);
    if (err?.response?.status === 409) {
      setError("❌ Username already exists.");
    } else if (err?.response?.status === 403) {
      setError("❌ Insufficient permissions to create user.");
    } else {
      setError("❌ Failed to create user.");
    }
  }
};

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content shadow rounded-4">
          <form onSubmit={handleCreateUser}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Create New User</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
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

              <div className="mb-3">
                <label className="form-label">Select Role</label>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role, idx) => (
                    <option key={idx} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRole && (
                <div className="mb-2">
                  <strong>Permissions:</strong>
                  <ul className="mb-0">
                    {roles
                      .find((r) => r.name === selectedRole)
                      ?.permissions.map((perm, idx) => (
                        <li key={idx}>{perm}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Create User
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ✅ Final export name matches file name
export default CreateUserModal;

