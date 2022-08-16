import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import {
  Container,
  Row,
  Col,
  Badge,
  Button,
  ButtonGroup,
  Form,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import "react-alice-carousel/lib/alice-carousel.css";
import SimilarProduct from "../../components/SimilarProduct";
import "./singleProduct.css";
import axios from "../../axios";
import { LinkContainer } from "react-router-bootstrap";
import { useAddToCartMutation } from "../../api";
import { toast } from "react-toastify";
import { logout } from "../../features/userSlice";

function SingleProduct() {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addToCart, { isSuccess }] = useAddToCartMutation();

  const handleDragStart = (e) => e.preventDefault();
  useEffect(() => {
    axios
      .get(`/products/${id}`, {
        headers: {
          token: user.token,
        },
      })
      .then(({ data }) => {
        setProduct(data.product);
        setSimilar(data.similar);
      })
      .catch((err) => {
        console.log(err);
        if (err.request.status === 403) {
          setError(true);
          setErrMsg(err.response.data);
        }
      });
  }, [id]);

  //if token is unvalid:
  if (error) {
    setTimeout(() => {
      dispatch(logout());
      navigate("/");
    }, 2500);
    return <Alert variant="danger">{errMsg}</Alert>;
  }
  if (!product) {
    return <Loading />;
  }

  const pictures = product.images.map((picture) => (
    <img
      className="product-carousel-image"
      src={picture.url}
      onDragStart={handleDragStart}
    />
  ));

  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
  };

  let similarProducts = [];
  if (similar) {
    similarProducts = similar.map((product, idx) => (
      <div className="item" data-value={idx}>
        <SimilarProduct {...product} />
      </div>
    ));
  }

  return (
    <Container pt={4} style={{ position: "relative" }}>
      <Row>
        <Col lg={6}>
          <AliceCarousel
            mouseTracking
            items={pictures}
            controlsStrategy="alternate"
          />
        </Col>
        <Col lg={6} className="pt-4">
          <h1>{product.name}</h1>
          <p>
            <Badge bg="primary">{product.category}</Badge>
          </p>
          <p className="product-price">₹{product.price}</p>
          <p style={{ textAlign: "justify" }} className="py-3">
            <strong>Description</strong>
            {product.description}
          </p>
          {user && !user.isAdmin && (
            <ButtonGroup style={{ width: "90%" }}>
              <Form.Select
                size="lg"
                style={{ width: "40%", borderRadius: "none" }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Select>
              <Button
                size="lg"
                onClick={() =>
                  addToCart({
                    userId: user._id,
                    productId: id,
                    price: product.price,
                    image: product.images[0].url,
                  })
                }
              >
                Add To Cart
              </Button>
            </ButtonGroup>
          )}
          {user && user.isAdmin && (
            <LinkContainer to={`/product/${product._id}/edit`}>
              <Button size="lg">Edit Product</Button>
            </LinkContainer>
          )}
          {isSuccess &&
            toast.success(`${product.name} is added to your cart`, {
              theme: "colored",
            })}
        </Col>
      </Row>
      <div className="my-4">
        <h2>Similar Products</h2>
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <AliceCarousel
            mouseTracking
            items={similarProducts}
            responsive={responsive}
            controlsStrategy="alternate"
          />
        </div>
      </div>
    </Container>
  );
}

export default SingleProduct;
