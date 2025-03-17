import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import Navbar from "./Pages/Navbar";
import Men from "./Pages/Men";
import Women from "./Pages/Women";
import Home from "./Pages/Home";
import Kids from "./Pages/Kids";
import CategoryProduct from "./Pages/CategoryProduct";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Footer from "./Pages/Footer";
import SearchProduct from "./Pages/SearchProduct";
import UserRegister from "./Pages/UserRegister";
import UserLogin from "./Pages/UserLogin";
import ForgetPassword from "./Pages/ForgetPassword";
import ProtectedRoute from "./Context/ProtectedRoutes";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:cat" element={<CategoryProduct />} />
        <Route
          path="/category/:category/:tittle/:description/:id"
          element={<ProductDetails />}
        />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/search/:productName" element={<SearchProduct />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
