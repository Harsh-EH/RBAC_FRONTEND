import React from "react";
import { Container, Card, Button, Table } from "react-bootstrap";

const Students = () => {
  return (
    <Container fluid className="pt-4 px-4">
      <Card className="shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Student Management</h4>
          <Button variant="primary" size="sm">
            ➕ Add Student
          </Button>
        </div>

        <div className="table-responsive">
          <Table hover bordered className="align-middle text-center mb-0">
            <thead className="table-light">
              <tr>
                <th>Student Name</th>
                <th>Enrollment No.</th>
                <th>Course</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-muted">
                  No student records found.
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
};

export default Students;
