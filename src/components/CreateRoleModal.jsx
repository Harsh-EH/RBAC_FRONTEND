import React, { useState } from "react";
import axios from "axios";

const departments = ["Admin", "Student", "Subject", "Role"];
const actions = ["READ", "UPDATE", "DELETE", "CREATE"];

const CreateRoleModal = ({ show, onClose, onRoleCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [permissionsMatrix, setPermissionsMatrix] = useState({});
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleDeptToggle = (dept) => {
    if (selectedDepts.includes(dept)) {
      const updated = selectedDepts.filter((d) => d !== dept);
      const newMatrix = { ...permissionsMatrix };
      delete newMatrix[dept];
      setPermissionsMatrix(newMatrix);
      setSelectedDepts(updated);
    } else {
      setSelectedDepts([...selectedDepts, dept]);
      setPermissionsMatrix({
        ...permissionsMatrix,
        [dept]: { READ: false, UPDATE: false, DELETE: false, CREATE: false },
      });
    }
  };

  const handlePermissionChange = (dept, action) => {
    setPermissionsMatrix({
      ...permissionsMatrix,
      [dept]: {
        ...permissionsMatrix[dept],
        [action]: !permissionsMatrix[dept][action],
      },
    });
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setError("");

    const permissionSet = new Set();

    Object.entries(permissionsMatrix).forEach(([dept, perms]) => {
      Object.entries(perms).forEach(([action, isChecked]) => {
        if (isChecked) {
          permissionSet.add(
            `${dept.toUpperCase().replace(/\s/g, "_")}_${action}`
          );
        }
      });
    });

    const finalPermissions = Array.from(permissionSet);

    const payload = {
      name: roleName,
      permissions: finalPermissions,
    };

    try {
      const res = await axios.post(
        "https://rbacapp-93834eb91813.herokuapp.com/roles",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Role created successfully!");
      setRoleName("");
      setSelectedDepts([]);
      setPermissionsMatrix({});
      onRoleCreated(); // Refresh roles table
      onClose();
    } catch (err) {
      console.error("Role creation failed:", err);
      setError("❌ Failed to create role. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow rounded-4">
          <form onSubmit={handleCreateRole}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Create Role</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Role Name Input */}
              <div className="mb-3">
                <label className="form-label">Role Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </div>

              {/* Department Multi-Select Dropdown */}
              <div className="mb-3">
                <label className="form-label">
                  Role Permissions for Department
                </label>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Select Departments
                  </button>

                  {isOpen && (
                    <div
                      className="dropdown-menu show p-2 shadow-sm border"
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        minWidth: "250px",
                      }}
                    >
                      {departments.map((dept, index) => (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedDepts.includes(dept)}
                            onChange={() => handleDeptToggle(dept)}
                            id={`dept-${index}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`dept-${index}`}
                          >
                            {dept}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Department Tags */}
              {selectedDepts.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Selected Departments</label>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedDepts.map((dept, idx) => (
                      <span
                        className="badge bg-secondary d-flex align-items-center gap-1"
                        key={idx}
                      >
                        {dept}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm"
                          onClick={() => handleDeptToggle(dept)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Role-Based Permission Matrix */}
              {selectedDepts.length > 0 && (
                <div>
                  <label className="form-label">Role-Based Permissions</label>
                  <table className="table table-bordered text-center">
                    <thead>
                      <tr>
                        <th>Department</th>
                        {actions.map((action, i) => (
                          <th key={i}>{action}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDepts.map((dept, i) => (
                        <tr key={i}>
                          <td>{dept}</td>
                          {actions.map((action, j) => (
                            <td key={j}>
                              <input
                                type="checkbox"
                                checked={
                                  permissionsMatrix[dept]?.[action] || false
                                }
                                onChange={() =>
                                  handlePermissionChange(dept, action)
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Create Role
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

export default CreateRoleModal;
