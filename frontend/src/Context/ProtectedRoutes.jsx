import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./UserContext";
import Loader from "../Components/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(UserContext);

  if (loading)  return <Loader/>
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
