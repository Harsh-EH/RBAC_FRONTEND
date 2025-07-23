// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   Table,
//   Button,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import axios from "axios";
// import CreateUserModal from "../components/CreateUserModal";

// const Users = () => {
//   const [showCreateUserModal, setShowCreateUserModal] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showUserModal, setShowUserModal] = useState(false);

//   const fetchUsers = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "https://rbacapp-93834eb91813.herokuapp.com/users",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setUsers(response.data);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         setError(
//           "You don't have permission to view users (ADMIN_READ required)."
//         );
//       } else {
//         setError("Failed to fetch users.");
//       }
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <Container fluid className="pt-4 px-4">
//       <Card className="shadow-sm rounded-4 p-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h4 className="fw-bold">User Management</h4>
//           <button
//             className="btn btn-primary"
//             onClick={() => {
//               console.log("Opening Add User Modal...");
//               setShowCreateUserModal(true);
//             }}
//           >
//             ➕ Add User
//           </button>
//         </div>

//         {loading ? (
//           <div className="text-center py-4">
//             <Spinner animation="border" variant="primary" />
//           </div>
//         ) : error ? (
//           <Alert variant="danger">{error}</Alert>
//         ) : (
//           <div className="table-responsive">
//             <Table hover bordered className="align-middle text-center mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>Username</th>
//                   <th>Role</th>
//                   <th>Permissions</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="text-muted">
//                       No users found.
//                     </td>
//                   </tr>
//                 ) : (
//                   users.map((user, index) => (
//                     <tr key={index}>
//                       <td>{user.username}</td>
//                       <td>{user.role?.name || "N/A"}</td>
//                       <td>{user.role?.permissions?.join(", ") || "None"}</td>
//                       <td>
//                         <Button variant="danger" size="sm" disabled>
//                           🗑️ Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         )}
//       </Card>
//     </Container>
    
//   );
// };

// export default Users;


import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Table, Button } from "react-bootstrap";
import axios from "axios";
import CreateUserModal from "../components/CreateUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://rbacapp-93834eb91813.herokuapp.com/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("❌ Failed to load users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container fluid className="pt-4 px-4">
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">User Management</h4>
          <button
            className="btn btn-primary"
            onClick={() => {
              console.log("Opening Add User Modal...");
              setShowCreateUserModal(true);
            }}
          >
            ➕ Add User
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="table-responsive">
            <Table hover bordered className="align-middle text-center mb-0">
              <thead className="table-light">
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-muted">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.role?.name || "N/A"}</td>
                      <td>{user.role?.permissions?.join(", ") || "None"}</td>
                      <td>
                        <Button variant="danger" size="sm" disabled>
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* 🔽 Attach CreateUserModal here */}
      <CreateUserModal
        show={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={fetchUsers}
      />
    </Container>
  );
};

export default Users;
