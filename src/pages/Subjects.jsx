// import React from "react";
// import { Container, Card, Button, Table } from "react-bootstrap";

// const Subjects = () => {
//   return (
//     <Container fluid className="pt-4 px-4">
//       <Card className="shadow-sm rounded-4 p-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h4 className="fw-bold">Subject Management</h4>
//           <Button variant="primary" size="sm">
//             ➕ Add Subject
//           </Button>
//         </div>

//         <div className="table-responsive">
//           <Table hover bordered className="align-middle text-center mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>Subject Code</th>
//                 <th>Subject Name</th>
//                 <th>Department</th>
//                 <th>Semester</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td colSpan="5" className="text-muted">
//                   No subjects available yet.
//                 </td>
//               </tr>
//             </tbody>
//           </Table>
//         </div>
//       </Card>
//     </Container>
//   );
// };

// export default Subjects;



import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(
        "https://rbacapp-93834eb91813.herokuapp.com/subjects",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
      if (err?.response?.status === 403)
        setError("❌ Access Denied (SUBJECT_READ)");
    }
  };

  const handleCreateSubject = async () => {
    if (!code.trim() || !name.trim()) {
      setError("❌ Code and name are required.");
      return;
    }

    try {
      await axios.post(
        "https://rbacapp-93834eb91813.herokuapp.com/subjects",
        {
          code,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Subject added successfully!");
      setShowModal(false);
      setCode("");
      setName("");
      fetchSubjects();
    } catch (err) {
      console.error("Create subject failed:", err);
      if (err?.response?.status === 403)
        setError("❌ Access Denied (SUBJECT_CREATE)");
      else if (err?.response?.status === 409)
        setError("❌ Subject code already exists.");
      else setError("❌ Failed to create subject.");
    }
  };

  const handleDeleteSubject = async (codeToDelete) => {
    const confirm = window.confirm(
      `Are you sure you want to delete subject with code: ${codeToDelete}?`
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `https://rbacapp-93834eb91813.herokuapp.com/subjects/${codeToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Subject deleted successfully!");
      fetchSubjects();
    } catch (err) {
      console.error("Delete failed:", err);
      if (err?.response?.status === 403)
        setError("❌ Access Denied (SUBJECT_DELETE)");
      else if (err?.response?.status === 404)
        setError("❌ Subject not found.");
      else setError("❌ Failed to delete subject.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <Container fluid className="pt-4 px-4">
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Subject Management</h4>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            ➕ Add Subject
          </Button>
        </div>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="table-responsive">
          <Table hover bordered className="align-middle text-center mb-0">
            <thead className="table-light">
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <tr key={subject.code}>
                    <td>{subject.code}</td>
                    <td>{subject.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.code)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-muted">
                    No subjects available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Add Subject Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Subject Code</Form.Label>
            <Form.Control
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., CS101"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Introduction to Computer Science"
            />
          </Form.Group>

          {error && <div className="text-danger mt-2">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateSubject}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Subjects;
