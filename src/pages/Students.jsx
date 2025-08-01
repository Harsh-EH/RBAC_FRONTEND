import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UpdateStudentModal from "../components/UpdateStudentModal";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [permissions, setPermissions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const perms = decoded?.authorities || [];
        setPermissions(perms);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, [token]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://multiadminproj.onrender.com/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      if (err?.response?.status === 403) {
        setError("❌ Access Denied (STUDENT_READ)");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleCreateStudent = async () => {
    if (!rollNo.trim() || !name.trim()) {
      setError("❌ Roll number and name are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await axios.post(
        "https://multiadminproj.onrender.com/students",
        { rollNo, name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessage("✅ Student added successfully!");
      setTimeout(() => setMessage(""), 3000);
      setShowModal(false);
      setRollNo("");
      setName("");
      fetchStudents();
    } catch (err) {
      if (err?.response?.status === 403) setError("❌ Access Denied (STUDENT_CREATE)");
      else if (err?.response?.status === 409) setError("❌ Roll number already exists.");
      else setError("❌ Failed to create student.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteStudent = async (rollNoToDelete) => {
    const confirm = window.confirm(`Are you sure you want to delete student with roll no: ${rollNoToDelete}?`);
    if (!confirm) return;

    try {
      await axios.delete(
        `https://multiadminproj.onrender.com/students/${rollNoToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("✅ Student deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
      fetchStudents();
    } catch (err) {
      if (err?.response?.status === 403) setError("❌ Access Denied (STUDENT_DELETE)");
      else if (err?.response?.status === 404) setError("❌ Student not found.");
      else setError("❌ Failed to delete student.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowUpdateModal(true);
  };

  const can = (action) => permissions.includes(`STUDENT_${action}`);

  useEffect(() => {
    if (can("READ")) fetchStudents();
  }, [permissions]);

  return (
    <Container fluid className="pt-4 px-4">
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Student Management</h4>
          {can("CREATE") && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              ➕ Add Student
            </Button>
          )}
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {can("READ") ? (
          <div className="table-responsive">
            <Table hover bordered className="align-middle text-center mb-0">
              <thead className="table-light">
                <tr>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  {(can("UPDATE") || can("DELETE")) && <th style={{ width: 180 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.rollNo}>
                      <td>{student.rollNo}</td>
                      <td>{student.name}</td>
                      {(can("UPDATE") || can("DELETE")) && (
                        <td className="d-flex justify-content-center gap-2">
                          {can("UPDATE") && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              ✏️ Edit
                            </Button>
                          )}
                          {can("DELETE") && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.rollNo)}
                            >
                              🗑️ Delete
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={can("DELETE") || can("UPDATE") ? "3" : "2"} className="text-muted">
                      No student records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-muted text-center">🔒 No access to view student data.</div>
        )}
      </Card>

      {/* Add Student Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateStudent}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      {can("UPDATE") && selectedStudent && (
        <UpdateStudentModal
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          student={selectedStudent}
          onStudentUpdated={fetchStudents}
        />
      )}
    </Container>
  );
};

export default Students;
