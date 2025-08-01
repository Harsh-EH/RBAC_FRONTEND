import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

const UpdateStudentModal = ({ show, onClose, student, onStudentUpdated }) => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (student) {
      setUsername(student.username || student.rollNo || "");
    }
  }, [student]);

  const handleUpdatePassword = async () => {
    if (!username.trim() || !newPassword.trim()) {
      setError("❌ Username and new password are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await axios.post(
        `https://multiadminproj.onrender.com/auth/login`,
        {
          username: String(username),
          password: String(newPassword)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setSuccess("✅ Password updated successfully.");
      setTimeout(() => {
        setSuccess("");
        onClose();
        onStudentUpdated();
      }, 2000);
    } catch (err) {
      console.error("Password update failed:", err);
      setError("❌ Failed to update password.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update User Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., harsh123"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </Form.Group>

        {error && <div className="text-danger mt-2">{error}</div>}
        {success && <div className="text-success mt-2">{success}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleUpdatePassword}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStudentModal;
