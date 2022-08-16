import React from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteProductMutation } from "../../api";

function ProductDashboard() {
  const user = useSelector((state) => state.user.user);
  const products = useSelector((state) => state.products);

  const [deletProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
  function handleDeleteProduct(id) {
    // logic here
    if (window.confirm("Are you sure?"))
      deletProduct({ product_id: id, user_id: user._id });
  }
  return (
    <Table striped bordered hover responsive>
      <thead
        style={{
          backgroundColor: "#03464d",
          color: "#F2F2F2",
          fontSize: "18px",
        }}
      >
        <tr>
          <th>Product</th>
          <th>Product Id</th>
          <th>Product Name</th>
          <th>Product Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody style={{ backgroundColor: "#9cd3d8" }}>
        {products.map((product) => (
          <tr>
            <td>
              <img
                src={product.images[0].url}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </td>
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td className="d-flex justify-content-around">
              <Button
                disabled={isLoading}
                onClick={() => handleDeleteProduct(product._id, user._di)}
              >
                Delete
              </Button>
              <Link
                to={`/product/${product._id}/edit`}
                className="btn btn-warning"
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ProductDashboard;
