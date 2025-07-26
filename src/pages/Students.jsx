// import React, { useEffect, useState } from "react";
// import { Container, Card, Button, Table, Modal, Form } from "react-bootstrap";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [rollNo, setRollNo] = useState("");
//   const [name, setName] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("token");

//   const fetchStudents = async () => {
//     try {
//       const res = await axios.get("https://rbacapp-93834eb91813.herokuapp.com/students", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setStudents(res.data);
//     } catch (err) {
//       console.error("Failed to fetch students", err);
//       if (err?.response?.status === 403) setError("❌ Access Denied (STUDENT_READ)");
//     }
//   };

//   const handleCreateStudent = async () => {
//     if (!rollNo.trim() || !name.trim()) {
//       setError("❌ Roll number and name are required.");
//       return;
//     }

//     try {
//       await axios.post("https://rbacapp-93834eb91813.herokuapp.com/students", {
//         rollNo,
//         name
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       setMessage("✅ Student added successfully!");
//       setShowModal(false);
//       setRollNo("");
//       setName("");
//       fetchStudents();
//     } catch (err) {
//       console.error("Create student failed:", err);
//       if (err?.response?.status === 403) setError("❌ Access Denied (STUDENT_CREATE)");
//       else if (err?.response?.status === 409) setError("❌ Roll number already exists.");
//       else setError("❌ Failed to create student.");
//     }
//   };

//   const handleDeleteStudent = async (rollNoToDelete) => {
//     const confirm = window.confirm(`Are you sure you want to delete student with roll no: ${rollNoToDelete}?`);
//     if (!confirm) return;

//     try {
//       await axios.delete(`https://rbacapp-93834eb91813.herokuapp.com/students/${rollNoToDelete}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setMessage("✅ Student deleted successfully!");
//       fetchStudents();
//     } catch (err) {
//       console.error("Delete failed:", err);
//       if (err?.response?.status === 403) setError("❌ Access Denied (STUDENT_DELETE)");
//       else if (err?.response?.status === 404) setError("❌ Student not found.");
//       else setError("❌ Failed to delete student.");
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   return (
//     <Container fluid className="pt-4 px-4">
//       <Card className="shadow-sm rounded-4 p-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h4 className="fw-bold">Student Management</h4>
//           <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
//             ➕ Add Student
//           </Button>
//         </div>

//         {message && <div className="alert alert-success">{message}</div>}
//         {error && <div className="alert alert-danger">{error}</div>}

//         <div className="table-responsive">
//           <Table hover bordered className="align-middle text-center mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>Roll No.</th>
//                 <th>Student Name</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.length > 0 ? (
//                 students.map((student) => (
//                   <tr key={student.rollNo}>
//                     <td>{student.rollNo}</td>
//                     <td>{student.name}</td>
//                     <td>
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleDeleteStudent(student.rollNo)}
//                       >
//                         🗑️ Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-muted">
//                     No student records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>
//       </Card>

//       {/* Create Student Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Student</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Roll Number</Form.Label>
//             <Form.Control
//               value={rollNo}
//               onChange={(e) => setRollNo(e.target.value)}
//               placeholder="e.g., 2025CS001"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Student Name</Form.Label>
//             <Form.Control
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g., John Doe"
//             />
//           </Form.Group>

//           {error && <div className="text-danger">{error}</div>}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="success" onClick={handleCreateStudent}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default Students;



import React, { useEffect, useState } from "react";
import { Container, Card, Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://rbacapp-93834eb91813.herokuapp.com/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
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
        "https://rbacapp-93834eb91813.herokuapp.com/students",
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
      console.error("Create student failed:", err);
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
        `https://rbacapp-93834eb91813.herokuapp.com/students/${rollNoToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("✅ Student deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
      fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
      if (err?.response?.status === 403) setError("❌ Access Denied (STUDENT_DELETE)");
      else if (err?.response?.status === 404) setError("❌ Student not found.");
      else setError("❌ Failed to delete student.");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Container fluid className="pt-4 px-4">
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Student Management</h4>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            ➕ Add Student
          </Button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <Table hover bordered className="align-middle text-center mb-0">
            <thead className="table-light">
              <tr>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.rollNo}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.rollNo)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-muted">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
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
    </Container>
  );
};

export default Students;
