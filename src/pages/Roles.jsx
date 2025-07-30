import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateRoleModal from "../components/CreateRoleModal";
import { jwtDecode } from "jwt-decode";

const modules = ["STUDENT", "SUBJECT", "ROLE", "ADMIN"];
const actions = ["READ", "CREATE", "UPDATE", "DELETE"];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [editedMatrix, setEditedMatrix] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (token) fetchRoles();
  }, [token]);

  const buildMatrixFromPermissions = (permissions) => {
    const matrix = {};

    modules.forEach((mod) => {
      matrix[mod] = {};
      actions.forEach((act) => {
        matrix[mod][act] = false; // default all to false
      });
    });

    permissions.forEach((perm) => {
      const [mod, act] = perm.split("_");
      if (matrix[mod] && matrix[mod][act] !== undefined) {
        matrix[mod][act] = true;
      }
    });

    return matrix;
  };

  const flattenMatrixToPermissions = (matrix) => {
    const result = [];
    Object.entries(matrix).forEach(([module, perms]) => {
      Object.entries(perms).forEach(([action, enabled]) => {
        if (enabled) result.push(`${module}_${action}`);
      });
    });
    return result;
  };

  const handleEditClick = (role) => {
    setCurrentRole(role);
    setEditedMatrix(buildMatrixFromPermissions(role.permissions));
    setShowEditModal(true);
  };

  const handleSavePermissions = async () => {
    if (!currentRole || !currentRole.name) {
      alert("❌ Invalid role selected.");
      return;
    }

    const updatedRole = {
      name: currentRole.name,
      permissions: flattenMatrixToPermissions(editedMatrix),
    };

    try {
      await axios.post(
        "https://multiadminproj.onrender.com/roles",
        updatedRole,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Permissions updated!");
      setShowEditModal(false);
      setCurrentRole(null);
      setEditedMatrix({});
      fetchRoles();
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Update failed");
    }
  };

  const handleDeleteRole = async (roleName) => {
    if (!token) {
      alert("❌ No authentication token found. Please log in again.");
      return;
    }

    let permissions = [];
    try {
      const decoded = jwtDecode(token);
      permissions = decoded?.authorities || [];
    } catch (err) {
      console.error("Token decode failed:", err);
      alert("❌ Invalid token. Please log in again.");
      return;
    }

    if (!permissions.includes("ROLE_DELETE")) {
      alert("❌ You do not have permission (ROLE_DELETE) to delete roles.");
      return;
    }

    try {
      const usersRes = await axios.get(
        `https://multiadminproj.onrender.com/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const usersUsingRole = usersRes.data
        .filter((user) => user.role?.name === roleName)
        .map((user) => user.username);

      if (usersUsingRole.length > 0) {
        alert(
          `❌ Cannot delete role "${roleName}". It is assigned to the following users:\n\n${usersUsingRole.join(
            ", "
          )}\n\nPlease reassign their roles before deletion.`
        );
        return;
      }
    } catch (userCheckErr) {
      console.error("User role check failed:", userCheckErr);
      alert("❌ Could not verify users using this role. Try again.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the role "${roleName}"? This action is irreversible.`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://multiadminproj.onrender.com/roles/${roleName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`✅ Role "${roleName}" deleted successfully.`);
      fetchRoles();
    } catch (err) {
      console.error("Delete Role Error:", err);
      if (err?.response?.status === 404) {
        alert("❌ Role not found.");
      } else {
        alert("❌ Failed to delete role due to a server error.");
      }
    }
  };

  return (
    <div className="container-fluid px-3">
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Role Management</h4>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Add Role
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover text-center">
            <thead className="table-light">
              <tr>
                <th>Role</th>
                <th>Updated At</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role, idx) => (
                  <tr key={idx}>
                    <td>{role.name}</td>
                    <td>{new Date(role.updatedAt).toLocaleString()}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit"
                        onClick={() => handleEditClick(role)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        onClick={() => handleDeleteRole(role.name)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No roles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateRoleModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoleCreated={fetchRoles}
      />

      {/* Edit Modal with checkbox matrix */}
      {showEditModal && currentRole && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow rounded-4">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Role: {currentRole.name}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-bold">Update Permissions</label>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Permission Name</th>
                        {actions.map((action) => (
                          <th key={action} className="text-center">
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => (
                        <tr key={module}>
                          <td>{module}</td>
                          {actions.map((action) => (
                            <td key={action} className="text-center">
                              <input
                                type="checkbox"
                                checked={
                                  editedMatrix[module]?.[action] || false
                                }
                                onChange={() =>
                                  setEditedMatrix((prev) => ({
                                    ...prev,
                                    [module]: {
                                      ...prev[module],
                                      [action]: !prev[module]?.[action],
                                    },
                                  }))
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSavePermissions}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
