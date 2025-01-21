import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./UserContext";
import { ThreeDots } from "react-loader-spinner"; // Importing loader
import "./ProtectedRoutes.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="loader-overlay">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="grey"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
