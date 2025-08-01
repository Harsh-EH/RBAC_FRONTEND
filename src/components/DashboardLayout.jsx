import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UpdateUserModal from "../components/UpdateUserModal";
import "../styles/sidebar.css";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("User");
  const [permissions, setPermissions] = useState([]); // ✅ JWT-based permissions
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded Token:", decoded);

        setUsername(decoded?.sub || "User");

        // ✅ Extract permissions (authorities array)
        const extractedPermissions = decoded?.authorities || [];
        console.log("✅ Extracted Permissions:", extractedPermissions);
        setPermissions(extractedPermissions);
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
        setUsername("User");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Dynamic department check
  const hasAccessTo = (section) => {
    const map = {
      users: "ADMIN",
      roles: "ROLE",
      students: "STUDENT",
      subjects: "SUBJECT",
    };

    const prefix = map[section];
    return permissions.some((perm) => perm.startsWith(`${prefix}_`));
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar bg-primary text-white p-3 ${collapsed ? "collapsed" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!collapsed && <h5 className="text-white fw-bold">RBAC Admin</h5>}
        </div>

        <button
          className="btn btn-outline-light w-100 mb-3"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "☰" : "Collapse"}
        </button>

        <nav className="d-flex flex-column gap-2">
          <NavLink to="/" end className="nav-btn btn btn-light text-start">
            🏠 <span className="nav-text">Dashboard</span>
          </NavLink>

          {hasAccessTo("users") && (
            <NavLink to="/users" className="nav-btn btn btn-light text-start">
              👥 <span className="nav-text">Users</span>
            </NavLink>
          )}

          {hasAccessTo("roles") && (
            <NavLink to="/roles" className="nav-btn btn btn-light text-start">
              🔐 <span className="nav-text">Roles</span>
            </NavLink>
          )}

          {hasAccessTo("students") && (
            <NavLink to="/students" className="nav-btn btn btn-light text-start">
              🎓 <span className="nav-text">Students</span>
            </NavLink>
          )}

          {hasAccessTo("subjects") && (
            <NavLink to="/subjects" className="nav-btn btn btn-light text-start">
              📘 <span className="nav-text">Subjects</span>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Topbar */}
        <div className="bg-primary text-white d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
          <span className="fw-semibold">Welcome, {username}</span>
          <div>
            <button
              className="btn btn-outline-light btn-sm me-2"
              onClick={() => setShowUpdateModal(true)}
            >
              Update
            </button>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {showUpdateModal && (
        <UpdateUserModal
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
