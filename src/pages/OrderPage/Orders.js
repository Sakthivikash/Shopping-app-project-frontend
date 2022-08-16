import React, { useEffect, useState } from "react";
import {
  Badge,
  Container,
  Table,
  Row,
  Modal,
  Button,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import Loading from "../../components/Loading";
import { logout } from "../../features/userSlice";

function Orders() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderToShow, setOrderToShow] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const handleClose = () => setShow(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      .get(`/users/${user._id}/orders`, {
        headers: {
          token: user.token,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((e) => {
        setLoading(false);
        if (e.request.status === 403) {
          setError(true);
          setErrMsg(e.response.data);
        }
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  //if token is unvalid:
  if (error) {
    setTimeout(() => {
      dispatch(logout());
      navigate("/");
    }, 2500);
    return <Alert variant="danger">{errMsg}</Alert>;
  }
  if (orders.length === 0) {
    return <h1 className="text-center pt-3">No orders yet</h1>;
  }
  return (
    <Container>
      <h1 className="text-center">Your orders</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date Of Ordered</th>
            <th>Total</th>
            <th>Status</th>
            <th>Order Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr>
              <td>{order._id}</td>

              <td>{order.date}</td>

              <td>${order.total}</td>
              <td>
                <Badge
                  bg={`${order.status == "processing" ? "warning" : "success"}`}
                  text="white"
                >
                  {order.status}
                </Badge>
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
          ))}
        </tbody>
      </Table>

      {/* View order details */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#3f72af", color: "white" }}
        >
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        {orderToShow.map((order) => (
          <Container
            className="order-details__container d-flex justify-content-around py-2 gap-10"
            style={{ backgroundColor: "#dbe3ef" }}
          >
            <Row md={6} style={{ maxWidth: 150, height: 150 }}>
              <img
                src={order.images[0].url}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  padding: "5px",
                  borderRadius: "5px",
                }}
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
                <b>Price:</b> ₹{Number(order.price)}
              </p>
            </Row>
          </Container>
        ))}
        <Modal.Footer style={{ backgroundColor: "#dbe3ef" }}>
          {/* <span>Total: ₹{Number.(order.price) * order.count}</span> */}
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Orders;
