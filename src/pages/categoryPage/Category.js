import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ProductPreview from "../../components/productPreview/ProductPreview";
import Loading from "../../components/Loading";
import "./category.css";
import { logout } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Category() {
  const { category } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/products/category/${category}`, { headers: { token: user.token } })
      .then(({ data }) => {
        setLoading(false);
        setProducts(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
        if (err.request.status === 403) {
          setError(true);
          setErrMsg(err.response.data);
        }
      });
  }, [category]);

  //if token is unvalid:
  if (error) {
    setTimeout(() => {
      dispatch(logout());
      navigate("/");
    }, 2500);
    return <Alert variant="danger">{errMsg}</Alert>;
  }
  if (loading) {
    <Loading />;
  }

  const productsSearch = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function ProductSearch({ _id, category, name, images }) {
    return (
      <ProductPreview
        _id={_id}
        category={category}
        name={name}
        images={images}
      />
    );
  }

  if (loading == true) {
    return <Loading />;
  }
  return (
    <div className="category-page-container">
      <div
        className={`pt-3 ${category}-banner-container category-banner-container`}
      >
        <h1 className="text-center">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
      </div>
      <div className="filters-container d-flex justify-content-center pt-4 pb-4">
        <input
          type="search"
          placeholder="Search"
          className="searchBox"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {productsSearch.length === 0 ? (
        <h1>No products to show</h1>
      ) : (
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <div className="d-flex justify-content-center align-items-center flex-wrap">
                {productsSearch.map((product) => (
                  <ProductPreview {...product} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default Category;
