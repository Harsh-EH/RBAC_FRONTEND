import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("lastRoute", "/");

    // 👇 Detect browser back (popstate)
    const handlePopState = () => {
      // console.log("[INFO] Back navigation detected from dashboard → logging out");

      // Delete token and force logout
      localStorage.removeItem("token");
      sessionStorage.removeItem("lastRoute");

      // ✅ Optional: Clear browser history
      navigate("/login", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <Container fluid className="pt-4 px-4">
      <div className="bg-white rounded-4 p-5 shadow-sm">
        <h1 className="display-5 fw-bold">Welcome to RBAC Admin Panel</h1>
        <p className="fs-5">
          Manage users, roles, students, and subjects with complete access control.
        </p>
        <hr />
        <p className="text-muted">Use the sidebar to navigate.</p>
      </div>
    </Container>
  );
};

export default Dashboard;
