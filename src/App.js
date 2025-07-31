// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Users from "./pages/Users";
// import Roles from "./pages/Roles";
// import Students from "./pages/Students";
// import Subjects from "./pages/Subjects";

// import DashboardLayout from "./components/DashboardLayout";

// // Mock auth check (replace with actual JWT logic)
// const isAuthenticated = () => {
//   return localStorage.getItem("token") !== null;
// };

// // Protected route wrapper
// const PrivateRoute = ({ children }) => {
//   return isAuthenticated() ? children : <Navigate to="/login" replace />;
// };



// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* Public Login Route */}
//         <Route path="/login" element={<Login />} />

//         {/* Protected Dashboard Routes */}
//         <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
//           <Route index element={<Dashboard />} />
//           <Route path="users" element={<Users />} />
//           <Route path="roles" element={<Roles />} />
//           <Route path="students" element={<Students />} />
//           <Route path="subjects" element={<Subjects />} />
//         </Route>

//         {/* Catch-all for unknown routes */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import DashboardLayout from "./components/DashboardLayout";

// ✅ Token auth check
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

// ✅ Protect private routes
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="students" element={<Students />} />
          <Route path="subjects" element={<Subjects />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
