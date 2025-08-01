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
import { jwtDecode } from "jwt-decode";

// Group permissions like: "ADMIN: READ, CREATE", "ROLE: DELETE, UPDATE"
const formatGroupedPermissions = (permissions) => {
  const grouped = {};
  permissions.forEach((perm) => {
    const [module, action] = perm.split("_");
    if (!grouped[module]) grouped[module] = new Set();
    grouped[module].add(action);
  });
  return Object.entries(grouped)
    .map(
      ([module, actions]) =>
        `${module.charAt(0).toUpperCase() + module.slice(1).toLowerCase()}: ${Array.from(actions).join(", ")}`
    )
    .join("\n");
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const token = localStorage.getItem("token");

  // Decode permissions from JWT
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const perms = decoded?.authorities || [];
        setPermissions(perms);
        console.log("✅ ADMIN PERMISSIONS:", perms);
      } catch (err) {
        console.error("❌ Failed to decode token", err);
      }
    }
  }, [token]);

  const hasPermission = (perm) => permissions.includes(perm);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://multiadminproj.onrender.com/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("❌ You don't have the permission to view users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("https://multiadminproj.onrender.com/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleRoleChange = async (username, newRoleName) => {
    try {
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
      alert(`✅ Role for "${username}" updated to "${newRoleName}".`);
    } catch (err) {
      console.error("Role update failed:", err);
      if (err?.response?.status === 403) {
        alert("❌ Insufficient privileges.");
      } else {
        alert("❌ Role update failed.");
      }
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      );
      if (!confirmDelete) return;

      await axios.delete(
        `https://multiadminproj.onrender.com/users/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`✅ User "${username}" deleted successfully.`);
      fetchUsers();
    } catch (err) {
      console.error("User deletion failed:", err);
      if (err?.response?.status === 403) {
        alert("❌ Insufficient privileges.");
      } else {
        alert("❌ User deletion failed.");
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
          {hasPermission("ADMIN_CREATE") && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateUserModal(true)}
            >
              ➕ Add User
            </button>
          )}
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
                  <th>Email</th>
                  {hasPermission("ADMIN_UPDATE") && <th>Role</th>}
                  <th>Permissions</th>
                  {hasPermission("ADMIN_DELETE") && <th>Actions</th>}
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
                      <td>{user.email || "N/A"}</td>
                      {hasPermission("ADMIN_UPDATE") && (
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
                      )}
                      <td style={{ whiteSpace: "pre-line" }}>
                        {user.role?.permissions
                          ? formatGroupedPermissions(user.role.permissions)
                          : "None"}
                      </td>
                      {hasPermission("ADMIN_DELETE") && (
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteUser(user.username)}
                          >
                            🗑️ Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <CreateUserModal
        show={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={fetchUsers}
      />
    </Container>
  );
};

export default Users;

