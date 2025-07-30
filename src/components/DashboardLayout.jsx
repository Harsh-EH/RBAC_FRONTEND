import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UpdateUserModal from "../components/UpdateUserModal";
import "../styles/sidebar.css"; // Sidebar styles

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("User");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded?.sub || "User"); // Use 'sub' field from JWT
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
          <NavLink to="/users" className="nav-btn btn btn-light text-start">
            👥 <span className="nav-text">Users</span>
          </NavLink>
          <NavLink to="/roles" className="nav-btn btn btn-light text-start">
            🔐 <span className="nav-text">Roles</span>
          </NavLink>
          <NavLink to="/students" className="nav-btn btn btn-light text-start">
            🎓 <span className="nav-text">Students</span>
          </NavLink>
          <NavLink to="/subjects" className="nav-btn btn btn-light text-start">
            📘 <span className="nav-text">Subjects</span>
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Top Navbar */}
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

        {/* Dynamic Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Update Modal */}
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



