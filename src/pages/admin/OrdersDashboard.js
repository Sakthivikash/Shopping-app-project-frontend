import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Modal,
  Table,
  Container,
  Row,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import Loading from "../../components/Loading";
import PaginationComponent from "../../components/Pagination";
import { logout } from "../../features/userSlice";
import { toast } from "react-toastify";

function OrdersDashboard() {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const products = useSelector((state) => state.products);
  const [orderToShow, setOrderToShow] = useState([]);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  function markShipped(orderId, ownerId) {
    axios
      .patch(`/orders/${orderId}/mark-shipped`, { ownerId })
      .then(({ data }) => setOrders(data))
      .catch((err) => {
        console.log(err);
      });
  }

  function showOrder(productsObj) {
    let productsToShow = products.filter((product) => productsObj[product._id]);
    console.log(productsToShow);
    productsToShow = productsToShow.map((product) => {
      console.log(product);
      const productCopy = { ...product };
      productCopy.count = productsObj[product._id];
      delete productCopy.description;

      return productCopy;
    });
    setShow(true);
    setOrderToShow(productsToShow);
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get("/orders", {
        headers: {
          token: user.token,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((err) => {
        setLoading(false);
        if (err.request.status === 403) {
          setTimeout(() => {
            dispatch(logout());
            navigate("/");
          }, 2500);
          toast.info(`${err.response.data}`, { theme: "colored" });
        }
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className="text-center pt-4">No orders yet</h1>;
  }

  function TableRow({ order }) {
    return (
      <tr style={{ backgroundColor: "#a8bfc6" }}>
        <td>{order._id}</td>
        <td>{order.owner?.name}</td>
        <td>{order.count}</td>
        <td>{order.total}</td>
        <td>{order.address}</td>
        <td>
          {order.status === "processing" ? (
            <Button
              size="sm"
              onClick={() => markShipped(order._id, order.owner?._id)}
            >
              Mark as shipped
            </Button>
          ) : (
            <Badge bg="success">Shipped</Badge>
          )}
        </td>
        <td>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => showOrder(order.products)}
          >
            View order <i className="fa fa-eye"></i>
          </span>
        </td>
      </tr>
    );
  }

  return (
    <>
      <Table responsive striped bordered hover>
        <thead
          style={{
            backgroundColor: "#018abd",
            fontSize: "18px",
            color: "white",
          }}
        >
          <tr>
            <th>Order ID</th>
            <th>Client Name</th>
            <th>Items</th>
            <th>Order Total</th>
            <th>Address</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <PaginationComponent data={orders} RenderComponent={TableRow} />
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        {orderToShow.map((order) => (
          <Container className="order-details__container d-flex justify-content-around py-2">
            <Row md={6} style={{ maxWidth: 150, height: 150 }}>
              <img
                src={order.images[0].url}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Row>
            <Row className="d-flex flex-column mt-2">
              <p>
                <b>Name:</b> {order.name}
              </p>
              <p>
                <b>Quantity:</b> {order.count}
              </p>
              <p>
                <b>Price:</b> {Number(order.price) * order.count}
              </p>
            </Row>
          </Container>
        ))}
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrdersDashboard;
