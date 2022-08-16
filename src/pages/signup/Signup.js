import React, { useState } from "react";
import "./signup.css";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSignupMutation } from "../../api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { error, isLoading, isError }] = useSignupMutation();

  function handleSubmit(e) {
    e.preventDefault();
    signup({ name, email, password });
  }
  return (
    <Container>
      <Row>
        <Col md={6} className="signup-form-container">
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1>Create an account</h1>
            {isError && <Alert variant="danger">{error.data}</Alert>}
            <Form.Group>
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="name"
                required
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mb-3" disabled={isLoading}>
              Signup
            </Button>
          </Form>
          <p>
            Already have an account? Please <Link to="/login">Login</Link>
          </p>
        </Col>

        <Col md={6} className="signup-image-container"></Col>
      </Row>
    </Container>
  );
}

export default Signup;
