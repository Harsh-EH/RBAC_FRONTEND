import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

const UpdateStudentModal = ({ show, onClose, student, onStudentUpdated }) => {
  const [rollNo, setRollNo] = useState("");
  const [originalRollNo, setOriginalRollNo] = useState("");
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (student) {
      setRollNo(student.rollNo);
      setOriginalRollNo(student.rollNo); // Store original roll no
      setName(student.name || "");
      setAttendance(student.attendance || ""); // optional
    }
  }, [student]);

  const handleUpdate = async () => {
    if (!rollNo.trim() || !name.trim()) {
      setError("❌ Roll number and name are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const data = {
      rollNo,
      name,
      attendance,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      if (rollNo === originalRollNo) {
        // ✅ Update student details only
        await axios.put(
          `https://multiadminproj.onrender.com/students/${originalRollNo}`,
          { name, attendance },
          { headers }
        );
      } else {
        // ✅ Roll number changed → use change-rollno endpoint
        await axios.put(
          `https://multiadminproj.onrender.com/students/${originalRollNo}/change-rollno`,
          data,
          { headers }
        );
      }

      onStudentUpdated(); // Refresh data
      onClose(); // Close modal
    } catch (err) {
      console.error("Update failed:", err);
      if (err?.response?.status === 403) {
        setError("❌ Access Denied (STUDENT_UPDATE)");
      } else if (err?.response?.status === 409) {
        setError("❌ Roll number already exists.");
      } else {
        setError("❌ Failed to update student.");
      }
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
            placeholder="e.g., Mohit Sharma"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Attendance</Form.Label>
          <Form.Control
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            placeholder="e.g., 23"
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
