import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

const UpdateSubjectModal = ({ show, onClose, subject, onUpdated }) => {
  const [originalCode, setOriginalCode] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (subject) {
      setOriginalCode(subject.code); // immutable reference
      setCode(subject.code); // editable value
      setName(subject.name);
    }
  }, [subject]);

  const handleUpdate = async () => {
    if (!code.trim()) {
      setError("❌ Subject code is required.");
      return;
    }

    try {
      if (code !== originalCode) {
        // Code changed → change-code API
        await axios.put(
          `https://multiadminproj.onrender.com/subjects/${originalCode}/change-code`,
          {
            code: code.trim(),
            name: name.trim() || undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Name changed only → standard update API
        await axios.put(
          `https://multiadminproj.onrender.com/subjects/${code}`,
          {
            name: name.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      onClose();
      onUpdated();
    } catch (err) {
      console.error("Subject update failed:", err);
      if (err?.response?.status === 403)
        setError("❌ Access Denied (SUBJECT_UPDATE)");
      else if (err?.response?.status === 409)
        setError("❌ Subject code already exists.");
      else setError("❌ Failed to update subject.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Subject</Modal.Title>
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
            placeholder="e.g., Computer Science"
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

export default UpdateSubjectModal;
