import React from "react";
import { Container } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container fluid className="pt-4 px-4">
      <div className="bg-white rounded-4 p-5 shadow-sm">
        <h1 className="display-5 fw-bold">Welcome to RBAC Admin Panel</h1>
        <p className="fs-5">Manage users, roles, students, and subjects with complete access control.</p>
        <hr />
        <p className="text-muted">Use the sidebar to navigate.</p>
      </div>
    </Container>
  );
};

export default Dashboard;
