import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePageCategoriesProduct from "./Components/HomePageCategoriesProduct";
import "./App.css";
import ProductDetails from "./Components/ProductDetails";
import Men from "./Components/Men";
import Women from "./Components/Women";
import Kids from "./Components/Kids";
import Cart from "./Components/Cart";
import Footer from "./Components/Footer";
import SearchProduct from "./Components/SearchProduct";
import UserRegister from "./User Components/UserRegister";
import UserLogin from "./User Components/UserLogin";
import ForgetPassword from "./User Components/ForgetPassword";
import ProtectedRoute from "./Context/ProtectedRoutes";
import HomePageCategories from "./Components/HomePageCategories";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePageCategories />} />
        <Route path="/category/:cat" element={<HomePageCategoriesProduct />} />
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
