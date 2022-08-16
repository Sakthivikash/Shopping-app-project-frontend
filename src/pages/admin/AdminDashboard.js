import React from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import ClientsDashboard from "./ClientsDashboard";
import OrdersDashboard from "./OrdersDashboard";
import ProductDashboard from "./ProductDashboard";

function AdminDashboard() {
  return (
    <Container>
      <Tab.Container defaultActiveKey="products">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="products">Products</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="clients">Clients</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="products">
                <ProductDashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <OrdersDashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="clients">
                <ClientsDashboard />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default AdminDashboard;
