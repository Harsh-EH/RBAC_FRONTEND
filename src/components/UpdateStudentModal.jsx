import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

const UpdateStudentModal = ({ show, onClose, student, onStudentUpdated }) => {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (student) {
      setRollNo(student.rollNo);
      setName(student.name);
    }
  }, [student]);

  const handleUpdate = async () => {
    if (!rollNo.trim() || !name.trim()) {
      setError("❌ Both roll number and name are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await axios.put(
        `https://multiadminproj.onrender.com/students`,
        { rollNo, name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      onClose();
      onStudentUpdated();
    } catch (err) {
      console.error("Update failed:", err);
      if (err?.response?.status === 403) setError("❌ Access Denied (STUDENT_UPDATE)");
      else setError("❌ Failed to update student.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Roll Number</Form.Label>
          <Form.Control
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="e.g., 2025CS001"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Student Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., John Doe"
          />
        </Form.Group>
        {error && <div className="text-danger mt-2">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleUpdate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStudentModal;
