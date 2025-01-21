import { useEffect, useState } from "react";
import axios from "axios";
import UserContext from "./UserContext";

export const UserState = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://swift-cart-mern-stack.onrender.com/api";

  // login user
  const loginUser = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, formData);
      localStorage.setItem("token", response.data.token);

      const userResponse = await axios.get(`${BASE_URL}/user/details`, {
        headers: { Authorization: response.data.token },
      });

      setIsAuthenticated(true);
      setUser(userResponse.data.user);
      return { success: response?.data?.message };
    } catch (error) {
      return { error: error.response?.data?.message };
    }
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem("token"); // Token ko remove karna
    localStorage.removeItem("user"); // Token ko remove karna
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("token"); // LocalStorage se token fetch karna

    if (!token) {
      logoutUser(); // Agar token nahi hai, toh logout karna
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/user/verify-token`, {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        // Token valid, now fetch user data
        const userResponse = await axios.get(`${BASE_URL}/user/details`, {
          headers: { Authorization: token },
        });

        setIsAuthenticated(true);
        setLoading(false);
        setUser(userResponse.data.user); // Set the user from server
      } else {
        logoutUser();
      }
    } catch (error) {
      logoutUser();
    }
    // finally {
    //     setLoading(false); // Set loading to false once verification is done
    // }
  };

  // Verify token on page load
  useEffect(() => {
    verifyToken();
  }, []);

  // Detect changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      verifyToken(); // Verify token whenever localStorage changes
    };

    // Add event listener for storage change
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const registerUser = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/register`, formData);
      return { success: response?.data?.message };
    } catch (error) {
      return { error: error.response?.data?.message };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/verify-otp`, {
        email,
        otp,
      });
      return { success: response?.data?.message };
    } catch (error) {
      return { error: error.response?.data?.message };
    }
  };

  const resendOtp = async (email) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/request-registration-new-otp`,
        { email }
      );
      return { success: response?.data?.message };
    } catch (error) {
      return { error: error.response?.data?.message };
    }
  };

  // Forget password flow
  const sendForgotPasswordOTP = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/forget-password`, {
        email,
      });
      return { success: response?.data?.message };
    } catch (error) {
      return { error: error.response?.data?.message };
    }
  };

  const verifyForgotPasswordOTP = async (email, otp) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/verify-forget-password`,
        { email, otp }
      );
      return { success: response?.data?.message };
    } catch (error) {
      return { error: error.response?.data?.message };
    }
  };

  const resetPassword = async (email, newPassword, confirmPassword) => {
    console.log(
      "email: ",
      email,
      "newPassword: ",
      "newPassword: ",
      confirmPassword
    );
    try {
      const response = await axios.post(`${BASE_URL}/user/reset-password`, {
        email,
        newPassword,
        confirmPassword,
      });
      return { success: response?.data?.message };
    } catch (error) {
      console.log(error, "error");
      return { error: error.response?.data?.message };
    }
  };

  const resendOTPForForgetPassword = async (email) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/request-forget-password-new-otp`,
        { email }
      );
      return { success: response?.data?.message };
    } catch (error) {
      return { error: error.response?.data?.message };
    }
  };

  return (
    <UserContext.Provider
      value={{
        registerUser,
        verifyOtp,
        resendOtp,
        isAuthenticated,
        setIsAuthenticated,
        user,
        loginUser,
        logoutUser,
        sendForgotPasswordOTP,
        verifyForgotPasswordOTP,
        resetPassword,
        resendOTPForForgetPassword,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
