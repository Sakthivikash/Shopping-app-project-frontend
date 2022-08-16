import React, { useState } from "react";
import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
  useRemoveFromCartMutation,
} from "../../api";
import "./cart.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51LVJMlSBYoi60USZlNn2ifjWSfR75kjDdWmWQYBqNzXa3MMneYu760iqpa3s9E9z5zn2jsV75DNY3y89iZ8ZRNj200hjNY4mVy"
);

function Cart() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();

  const userCartObject = user.cart;
  let cart = products.filter((product) => userCartObject[product._id] != null);

  function handleDecrease(product) {
    const quantity = user.cart.count;
    if (quantity <= 0) return alert("Can't proceed");
    decreaseCart(product);
  }

  return (
    <Container style={{ minHeight: "90vh" }} className="cart-container">
      <Row>
        {cart.length > 0 && (
          <Col md={7}>
            <>
              <h1 className="pt-2 h3">Shopping Cart</h1>
              <Table responsive="sm" className="cart-table">
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr>
                      <td>&nbsp;</td>
                      <td>
                        {!isLoading && (
                          <i
                            className="fa fa-times"
                            style={{ marginRight: 10, cursor: "pointer" }}
                            onClick={() =>
                              removeFromCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                        )}
                        <img
                          src={item.images[0].url}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{item.price}</td>
                      <td>
                        <i
                          className="fa fa-minus-circle"
                          onClick={() =>
                            handleDecrease({
                              productId: item._id,
                              price: item.price,
                              userId: user._id,
                            })
                          }
                        ></i>
                        <span>{user.cart[item._id]}</span>
                        <i
                          className="fa fa-plus-circle"
                          onClick={() =>
                            increaseCart({
                              productId: item._id,
                              price: item.price,
                              userId: user._id,
                            })
                          }
                        ></i>
                      </td>
                      <td>{item.price * user.cart[item._id]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h4 className="pt-4">Total: ₹{user.cart.total}</h4>
              </div>
            </>
          </Col>
        )}
        <Col>
          {" "}
          <h1 className="pt-2 h3">Payment</h1>
          {cart.length == 0 ? (
            <Alert variant="info" className=" h5">
              Your cart is empty. Please add products to your cart 🛒
            </Alert>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
