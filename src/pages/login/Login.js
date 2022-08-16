import React, { useState } from "react";
import "./login.css";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isError, isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login({ email, password }).then((response) => console.log(response));
    navigate("/");
  }
  return (
    <Container>
      <Row>
        <Col md={6} className="login-form-container">
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1>Login</h1>
            {isError && <Alert variant="danger">{error.data}</Alert>}
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
              Login
            </Button>
          </Form>
          <p>
            Don't have an account? Please <Link to="/signup">Register</Link>
          </p>
        </Col>

        <Col md={6} className="login-image-container"></Col>
      </Row>
    </Container>
  );
}

export default Login;
