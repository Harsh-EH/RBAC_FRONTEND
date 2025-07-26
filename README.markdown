# RBAC Role-Based Access Control App

This project implements a secure and scalable Role-Based Access Control (RBAC) system with fine-grained permission checks for all user and role operations.

## Features Implemented

### 1. Role Assignment (`Users.jsx`)
- ✅ Assign roles to users via a dropdown interface.
- ✅ Permission check: `ADMIN_UPDATE` enforced using JWT decoding.
- ✅ `PUT /users` Axios request payload:
  ```json
  {
    "role": {
      "name": "student",
      "permissions": ["STUDENT_READ", "STUDENT_UPDATE"]
    }
  }
  ```
- ✅ Robust error handling:
  - `403`: No permission.
  - `400`: Invalid role.
  - Network issues covered.
- ✅ Alert confirms success/failure.
- ✅ Temporary state tracks role update time.

### 2. Delete User (`Users.jsx`)
- ✅ Deletes user via `DELETE /users/{username}`.
- ✅ `ADMIN_DELETE` permission enforced.
- ✅ Error handling:
  - `403`: Insufficient permission.
  - `404`: User not found.
- ✅ Success/failure alert displayed.
- ✅ User list refreshes automatically.

### 3. Permission Display (UX)
- ✅ Permissions grouped by resource:
  ```
  STUDENT: READ, UPDATE
  ADMIN: CREATE
  ```
- ✅ Uses newline-based display for clarity.

### 4. Create User (`CreateUserModal.jsx`)
- ✅ Username, password, and role dropdown in modal.
- ✅ `ADMIN_CREATE` permission enforced.
- ✅ Payload example:
  ```json
  {
    "username": "vipul",
    "password": "vipul123",
    "role": {
      "name": "Intern",
      "permissions": []
    }
  }
  ```
- ✅ Backend automatically assigns permissions based on role.
- ✅ Error handling:
  - `403`: No permission.
  - `409`: Username already exists.

### 5. Delete Role (`Roles.jsx`)
- ✅ Roles deleted via: `DELETE /roles/{name}`.
- ✅ `ROLE_DELETE` permission enforced.
- ✅ Check before delete:
  - If role is assigned to users, it displays a warning listing those users.
- ✅ Prevents accidental deletion of active roles.

### 6. Create / Edit Role (Modal)
- ✅ Modal allows:
  - Role name input.
  - Selectable permissions.
- ✅ `POST /roles` endpoint used:
  ```json
  {
    "name": "ADMIN",
    "permissions": ["ADMIN_CREATE", "ADMIN_DELETE"]
  }
  ```
- ✅ Case-insensitive input normalized to UPPERCASE.

### 7. CORS & API Header Fixes
- ✅ Validated CORS issues with Postman.
- ✅ Correct headers used:
  ```
  Authorization: Bearer <token>
  ```
- ✅ Confirmed proper body formats in both frontend and backend.

### 8. Role Dropdown Autofill
- ✅ On fetching user list:
  - Role dropdown auto-selects the user's assigned role.
- ✅ Uses:
  ```jsx
  <Form.Select value={user.role?.name || ""} />
  ```

### 9. Updated Time Display
- ✅ `updatedTimes` state shows when a role was modified.
- ❌ Resets on page refresh (state only).
- ✅ Suggested Fix:
  - Store `updatedAt` in backend.
  - Return `updatedAt` timestamp with user object.
  - Use `user.updatedAt` instead.

## To-Do
- Implement persistent `updatedAt` timestamps from backend.
- Create user activity log feature.
- Add role-permission audit trail.

## Structure Overview
```
├── src/
│   ├── components/
│   │   ├── Users.jsx
│   │   ├── Roles.jsx
│   │   ├── CreateUserModal.jsx
│   │   ├── CreateRoleModal.jsx
│   └── ...
├── backend/
│   ├── routes/
│   ├── models/
│   └── controllers/
├── README.md
```

## Permission Schema
Permissions follow the convention: `RESOURCE_ACTION`
- Example: `STUDENT_READ`, `ADMIN_UPDATE`

## Security & Best Practices
- ✅ JWT-based permission checks.
- ✅ Enforced backend authorization.
- ✅ Clean frontend feedback for all operations.
- ✅ Normalized inputs to prevent inconsistencies.

## Admin Login Credentials
Use the following credentials to log in as an Admin:
- **Username**: admin
- **Password**: admin123

⚠️ **These are default credentials for demo purposes only. In production, secure admin access and rotate credentials regularly.**