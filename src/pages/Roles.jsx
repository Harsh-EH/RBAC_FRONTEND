import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateRoleModal from "../components/CreateRoleModal";
import { jwtDecode } from "jwt-decode";

const modules = ["STUDENT", "SUBJECT", "ROLE", "ADMIN"];
const actions = ["READ", "CREATE", "UPDATE", "DELETE"];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [editedMatrix, setEditedMatrix] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const perms = decoded?.authorities || [];
        setPermissions(perms);
        fetchRoles();
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, [token]);

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

  const hasPermission = (perm) => permissions.includes(perm);
  const canEdit = hasPermission("ROLE_UPDATE");
  const canDelete = hasPermission("ROLE_DELETE");
  const showActions = canEdit || canDelete;

  const buildMatrixFromPermissions = (permissions) => {
    const matrix = {};
    modules.forEach((mod) => {
      matrix[mod] = {};
      actions.forEach((act) => {
        matrix[mod][act] = false;
      });
    });
    permissions.forEach((perm) => {
      const [mod, act] = perm.split("_");
      if (matrix[mod]) matrix[mod][act] = true;
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
    if (!canEdit) return;
    setCurrentRole(role);
    setEditedMatrix(buildMatrixFromPermissions(role.permissions));
    setShowEditModal(true);
  };

  const handleSavePermissions = async () => {
    if (!currentRole || !currentRole.name) return;

    const updatedRole = {
      name: currentRole.name,
      permissions: flattenMatrixToPermissions(editedMatrix),
    };

    try {
      await axios.post("https://multiadminproj.onrender.com/roles", updatedRole, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("✅ Permissions updated!");
      setShowEditModal(false);
      setCurrentRole(null);
      fetchRoles();
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update role.");
    }
  };

  const handleDeleteRole = async (roleName) => {
    if (!canDelete) return;

    try {
      const res = await axios.get("https://multiadminproj.onrender.com/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersWithRole = res.data.filter((u) => u.role?.name === roleName);
      if (usersWithRole.length > 0) {
        alert(
          `❌ Cannot delete role "${roleName}" assigned to users:\n${usersWithRole
            .map((u) => u.username)
            .join(", ")}`
        );
        return;
      }

      const confirm = window.confirm(`Delete role "${roleName}"?`);
      if (!confirm) return;

      await axios.delete(`https://multiadminproj.onrender.com/roles/${roleName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Role deleted.");
      fetchRoles();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Failed to delete role.");
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
                {showActions && <th>Permissions</th>}
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role, idx) => (
                  <tr key={idx}>
                    <td>{role.name}</td>
                    <td>{new Date(role.updatedAt).toLocaleString()}</td>
                    {showActions && (
                      <td>
                        {canEdit && (
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Edit"
                            onClick={() => handleEditClick(role)}
                          >
                            ✏️
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDeleteRole(role.name)}
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showActions ? 3 : 2}>No roles found.</td>
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

      {/* Edit Role Modal */}
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
                        <th>Permission</th>
                        {actions.map((action) => (
                          <th key={action}>{action}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((mod) => (
                        <tr key={mod}>
                          <td>{mod}</td>
                          {actions.map((act) => (
                            <td key={act} className="text-center">
                              <input
                                type="checkbox"
                                checked={editedMatrix[mod]?.[act] || false}
                                onChange={() =>
                                  setEditedMatrix((prev) => ({
                                    ...prev,
                                    [mod]: {
                                      ...prev[mod],
                                      [act]: !prev[mod]?.[act],
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
                <button className="btn btn-success" onClick={handleSavePermissions}>
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
