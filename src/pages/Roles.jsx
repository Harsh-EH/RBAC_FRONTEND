import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateRoleModal from "../components/CreateRoleModal"; // adjust path

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState("");
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [editedPermissions, setEditedPermissions] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const token = localStorage.getItem("token");

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
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [token]);

  const handleAddRole = async (e) => {
    e.preventDefault();
    setError("");

    const roleData = {
      name: roleName,
      permissions: permissions.split(",").map((p) => p.trim().toUpperCase()),
    };

    try {
      await axios.post(
        "https://rbacapp-93834eb91813.herokuapp.com/roles",
        roleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRoleName("");
      setPermissions("");
      fetchRoles();
    } catch (err) {
      console.error("Create Role Error:", err);
      setError("❌ Failed to create role. Try again.");
    }
  };

  const handleEditClick = (role) => {
    setCurrentRole(role);
    setEditedPermissions(role.permissions.join(", "));
    setShowEditModal(true);
  };

  const handleSavePermissions = async () => {
    try {
      if (!currentRole || !currentRole.name) {
        alert("❌ Invalid role selected.");
        return;
      }

      const updatedRole = {
        name: currentRole.name, // reuse the existing role name
        permissions: editedPermissions
          .split(",")
          .map((p) => p.trim().toUpperCase()),
      };

      await axios.post(
        "https://rbacapp-93834eb91813.herokuapp.com/roles",
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
      setEditedPermissions("");
      fetchRoles(); // Refresh the list
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Update failed");
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
                      onClick={() => {
                        setCurrentRole(role);
                        setEditedPermissions(role.permissions.join(", "));
                        setShowEditModal(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
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

    {/* ✅ Replace Bootstrap modal with React-based modal */}
    <CreateRoleModal
      show={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      onRoleCreated={fetchRoles}
    />

    {/* ✅ Edit Modal remains as is */}
    {showEditModal && currentRole && (
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
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
              <div className="mb-3">
                <label className="form-label">Permissions</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedPermissions}
                  onChange={(e) => setEditedPermissions(e.target.value)}
                  placeholder="e.g. USER_CREATE, USER_DELETE"
                />
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
}
  
export default Roles;
