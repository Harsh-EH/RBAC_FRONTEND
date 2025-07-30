import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import axios from "axios";
import CreateUserModal from "../components/CreateUserModal";
import { jwtDecode } from "jwt-decode"; // Make sure to install this: npm install jwt-decode

const formatGroupedPermissions = (permissions) => {
  const grouped = {};

  permissions.forEach((perm) => {
    const [module, action] = perm.split("_");
    if (!grouped[module]) {
      grouped[module] = new Set(); // Avoid duplicates
    }
    grouped[module].add(action);
  });

  return Object.entries(grouped)
    .map(
      ([module, actions]) =>
        `${capitalize(module)}: ${Array.from(actions).join(", ")}`
    )
    .join("\n");
};

// Optional: Capitalize module name
const capitalize = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [updatedTimes, setUpdatedTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://multiadminproj.onrender.com/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("You Don't have the permission to view users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(
        "https://multiadminproj.onrender.com/roles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleRoleChange = async (username, newRoleName) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ No authentication token found. Please log in again.");
        return;
      }

      let permissions = [];
      try {
        const decoded = jwtDecode(token);
        permissions = decoded?.authorities || [];
      } catch (decodeErr) {
        console.error("Failed to decode token:", decodeErr);
        alert("❌ Invalid token. Please log in again.");
        return;
      }

      if (!permissions.includes("ADMIN_UPDATE")) {
        alert("❌ You do not have permission (ADMIN_UPDATE) to update roles.");
        return;
      }

      const user = users.find((u) => u.username === username);
      const role = roles.find((r) => r.name === newRoleName);

      if (!user || !role) {
        alert("❌ Invalid user or role selected.");
        return;
      }

      const payload = {
        name: role.name,
        permissions: role.permissions,
      };

      console.log("✅ Token being sent:", token);
      console.log("✅ Payload being sent:", payload);

      await axios.put(
        `https://multiadminproj.onrender.com/users/${username}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchUsers();
      setUpdatedTimes((prev) => ({
        ...prev,
        [username]: new Date().toLocaleString(),
      }));

      alert(
        `✅ Role for "${username}" successfully updated to "${newRoleName}".`
      );
    } catch (err) {
      console.error("Role update failed:", err);

      if (err?.response?.status === 403) {
        alert("❌ Server rejected the request: insufficient privileges.");
      } else if (err?.response?.status === 400) {
        alert("❌ Server rejected the request: invalid role data.");
      } else {
        alert("❌ Role update failed due to a network or server error.");
      }
    }
  };

  const handleDeleteUser = async (username) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("❌ No authentication token found. Please log in again.");
      return;
    }

    let permissions = [];
    try {
      const decoded = jwtDecode(token);
      permissions = decoded?.authorities || [];
    } catch (decodeErr) {
      console.error("Token decode failed:", decodeErr);
      alert("❌ Invalid token. Please log in again.");
      return;
    }

    if (!permissions.includes("ADMIN_DELETE")) {
      alert("❌ You do not have permission (ADMIN_DELETE) to delete users.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${username}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://multiadminproj.onrender.com/users/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`✅ User "${username}" deleted successfully.`);
      fetchUsers(); // Refresh users list
    } catch (err) {
      console.error("User deletion failed:", err);

      if (err?.response?.status === 403) {
        alert("❌ Server rejected the request: insufficient privileges.");
      } else if (err?.response?.status === 404) {
        alert("❌ User not found. It may have already been deleted.");
      } else {
        alert("❌ User deletion failed due to a server or network error.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <Container fluid className="pt-4 px-4">
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">User Management</h4>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateUserModal(true)}
          >
            ➕ Add User
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="table-responsive">
            <Table hover bordered className="align-middle text-center mb-0">
              <thead className="table-light">
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>

                      <td>
                        <Form.Select
                          size="sm"
                          value={user.role?.name || ""}
                          onChange={(e) =>
                            handleRoleChange(user.username, e.target.value)
                          }
                        >
                          {roles.map((role, idx) => (
                            <option key={idx} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>

                      <td style={{ whiteSpace: "pre-line" }}>
                        {user.role?.permissions
                          ? formatGroupedPermissions(user.role.permissions)
                          : "None"}
                      </td>

                      <td>{updatedTimes[user.username] || "N/A"}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.username)}
                        >
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <CreateUserModal
        show={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={fetchUsers}
      />
    </Container>
  );
};

export default Users;
