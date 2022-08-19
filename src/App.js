import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { useSelector, useDispatch } from "react-redux";
import NewProduct from "./pages/newProduct/NewProduct";
import SingleProduct from "./pages/singleProduct/SingleProduct";
import Category from "./pages/categoryPage/Category";
import ScrollTop from "./components/ScrollTop";
import Cart from "./pages/cartPage/Cart";
import Orders from "./pages/OrderPage/Orders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditProduct from "./pages/admin/EditProduct";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { addNotification } from "./features/userSlice";

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = io("ws://shoppe-b-end.herokuapp.com");
    socket.off("notification").on("notification", (msgObj, user_id) => {
      if (user_id === user._id) {
        dispatch(addNotification(msgObj));
      }
    });

    socket.off("new-order").on("new-order", (msgObj) => {
      if (user.isAdmin) {
        dispatch(addNotification(msgObj));
      }
    });
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollTop />
        <Navigation />
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          {user && (
            <>
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/category/:category" element={<Category />} />
              <Route path="/products/:id" element={<SingleProduct />} />
            </>
          )}
          {user && user.isAdmin && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/product/:id/edit" element={<EditProduct />} />
              <Route path="/new-product" element={<NewProduct />} />
            </>
          )}
        </Routes>
        <ToastContainer toastClassName="dark-toast" />
      </BrowserRouter>
    </div>
  );
}

export default App;
