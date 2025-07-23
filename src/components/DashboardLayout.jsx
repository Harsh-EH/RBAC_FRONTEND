import React, { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import "../styles/sidebar.css"; // Make sure this file exists and has sidebar styles

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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
          <span className="fw-semibold">Welcome, Admin</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
        </div>

        {/* Dynamic Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
