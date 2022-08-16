import React, { useEffect, useState } from "react";
import "./home.css";
import banner from "../../images/huge.jpg";
import saleBanner from "../../images/BigSale.jpg";
import { Link } from "react-router-dom";
import { Col, Row, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import categories from "./categories";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../../features/productSlice";
import ProductPreview from "../../components/productPreview/ProductPreview";

function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    axios.get("/products").then(({ data }) => dispatch(updateProducts(data)));
  }, []);

  const filterProducts = (cat) => {
    const productCat = products.filter((product) => product.category === cat);
    return productCat;
  };
  var phones = filterProducts("phones");
  var laptops = filterProducts("laptops");
  var technology = filterProducts("technology");
  if (isLoading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <img src={banner} className="home-banner" />
      <div className="featured-products-container container mt-4">
        <h1>Trending Mobiles</h1>
        <div className="d-flex justify-content-center flex-wrap">
          {phones.map((product) => (
            <ProductPreview {...product} />
          ))}
        </div>
        <div>
          <Link
            to="/category/phones"
            style={{
              textAlign: "right",
              display: "block",
              textDecoration: "none",
            }}
          >
            See more {">>"}
          </Link>
        </div>
      </div>
      {/* sale banner */}
      <div className="sale__banner--container mt-4">
        <img src={saleBanner} style={{ width: "100%" }} />
      </div>

      <div className="featured-products-container container mt-4">
        <h1>Laptops </h1>
        <div className="d-flex justify-content-center flex-wrap">
          {laptops.map((product) => (
            <ProductPreview {...product} />
          ))}
        </div>
        <div>
          <Link
            to="/category/laptops"
            style={{
              textAlign: "right",
              display: "block",
              textDecoration: "none",
            }}
          >
            See more {">>"}
          </Link>
        </div>
      </div>
      <div className="featured-products-container container mt-4">
        <h1>Technology Related Products</h1>
        <div className="d-flex justify-content-center flex-wrap">
          {technology.map((product) => (
            <ProductPreview {...product} />
          ))}
        </div>
        <div>
          <Link
            to="/category/technology"
            style={{
              textAlign: "right",
              display: "block",
              textDecoration: "none",
            }}
          >
            See more {">>"}
          </Link>
        </div>
      </div>
      <div className="recent-products-container container mt-4">
        <h1>Categories</h1>
        <Row>
          {categories.map((category) => (
            <LinkContainer
              to={`/category/${category.name.toLocaleLowerCase()}`}
            >
              <Col md={4}>
                <div
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`,
                    gap: "10px",
                  }}
                  className="category-tile"
                >
                  {category.name}
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
