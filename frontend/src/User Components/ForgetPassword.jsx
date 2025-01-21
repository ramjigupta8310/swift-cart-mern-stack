import React, { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import UserContext from "../Context/UserContext";

const ForgetPassword = () => {
  const {
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetPassword,
    resendOTPForForgetPassword,
  } = useContext(UserContext);
  const navigate = useNavigate();

  const [isOtpSection, setIsOtpSection] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [isPasswordSection, setIsPasswordSection] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Email Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Send Forgot Password OTP Request To Backend
    const response = await sendForgotPasswordOTP(formData.email);

    // If Success Then Show OTP Section
    if (response.success) {
      setServerMessage(response.success);
      setErrorMessage("");
      setIsOtpSection(true);
    }
    // If Error Then Show Error Message
    if (response.error) {
      setErrorMessage(response.error);
    }
  };

  // Handle OTP Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Send Verify Forgot Password OTP Request To Backend
    const response = await verifyForgotPasswordOTP(formData.email, otp);

    // If Success Then Show OTP Section
    if (response.success) {
      setServerMessage(response.success);
      setErrorMessage("");
      setIsPasswordSection(true);
    }
    // If Error Then Show Error Message
    if (response.error) {
      setErrorMessage(response.error);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setTimer(60); // Reset timer

    // Send Resend OTP Request To Backend
    const response = await resendOTPForForgetPassword(formData.email);

    // If Success Then Show Show Success Message
    if (response.success) {
      setServerMessage(response.success);
      setErrorMessage("");
    }

    // If Error Then Show Error Message
    if (response.error) {
      setErrorMessage(response.error);
    }
  };

  // Handle Password Submit For Reset Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Send Reset Password Request To Backend
    const response = await resetPassword(
      formData.email,
      formData.newPassword,
      formData.confirmPassword
    );

    // If Success Then Show Success Message And Redirect To Login And Show Notification
    if (response.success) {
      setServerMessage(response.success);
      setErrorMessage("");
      setNotification(true);
      setTimeout(() => {
        setNotification(false);
        navigate("/login");
      }, 3000); // Redirect to login after 2 seconds
    }

    // If Error Then Show Error Message
    if (response.error) {
      setErrorMessage(response.error);
    }
  };

  // Timer For OTP Resend
  useEffect(() => {
    if (timer > 0 && isOtpSection) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isOtpSection]);

  // Format Time
  const formatTime = (timer) => {
    // Timer Ko Minutes Mein Convert Karo
    const minutes = Math.floor(timer / 60);

    // Timer Ko Seconds Mein Convert Karo
    const seconds = timer % 60;

    // 10 Se Kam Seconds Ke Liye 0 Add Karo
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <section
      className={`${styles.container} w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%] mx-auto border-2 border-[#ddd] rounded-lg px-4 py-6  mt-[24vh] md:mt-[13vh]`}
    >
      {/* Show Email Section First */}
      {!isOtpSection ? (
        <form onSubmit={handleSubmit}>
          <h1 className="text-center font-semibold text-xl mb-6">
            Reset Password
          </h1>

          {/* User Email Section */}
          <div className="mb-3">
            <label htmlFor="email" className="block font-semibold mb-1">
              Enter your email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              aria-required="true"
              onChange={handleInputChange}
              className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
            />
          </div>

          {/* Show Error Message If Some Error Occur */}
          {errorMessage && <p className="text-[red] text-sm">{errorMessage}</p>}

          {/* Submit Email Button */}
          <button className="py-2 text-base bg-[#007bff] text-white rounded-[4px] w-full mt-4">
            Continue
          </button>
        </form>
      ) : // Show OTP Section If Email Is Verified
      !isPasswordSection ? (
        <form onSubmit={handleOtpSubmit}>
          <h2 className="text-center font-semibold text-xl ">
            Enter verification code
          </h2>

          {/* Show Server Response Message After Email Varification */}
          {serverMessage && (
            <div className="text-center text-[green] mb-6">{serverMessage}</div>
          )}

          {/* Otp Section */}
          <div className="relative">
            <input
              type={showOtp ? "text" : "password"}
              placeholder="Enter OTP"
              value={otp}
              aria-required="true"
              onChange={(e) => setOtp(e.target.value)}
              className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
            />
            {/* Show Or Hide OTP  */}
            <span
              className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:text-[#555] transition-colors duration-200 ease-in-out"
              onClick={() => setShowOtp(!showOtp)}
              aria-label={showOtp ? "Hide OTP" : "Show OTP"}
            >
              {showOtp ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Show Error Message If Some Error Occur */}
          {errorMessage && <p className="text-[red] text-sm">{errorMessage}</p>}

          {/* Submit OTP Button */}
          <button className="py-2 text-base bg-[#007bff] text-white rounded-[4px] w-full mt-4">
            Submit code
          </button>

          {/* Resend OTP Section */}
          <div className="text-center mt-4">
            <div>
              {timer > 0 ? (
                <p>Resend OTP in: {formatTime(timer)}</p>
              ) : (
                <div className="">
                  <button
                    onClick={handleResendOtp}
                    className="hover:bg-transparent text-[blue] font-semibold"
                    disabled={timer > 0}
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        // Show Password Section If OTP Is Verified
        <form onSubmit={handlePasswordSubmit}>
          <h2 className="text-center font-semibold text-xl ">Reset Password</h2>

          {/* Show Server Message After OTP Varificaion */}
          {serverMessage && (
            <div className="text-center text-[green] mb-6">{serverMessage}</div>
          )}

          {/* New Password Section */}
          <div className="mb-3">
            <label htmlFor="password" className="block mb-1 font-semibold">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                aria-required="true"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
              />

              {/* Show Or Hide New Password */}
              <span
                className="toggle-password absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:text-[#555] transition-colors duration-200 ease-in-out"
                aria-label={
                  showPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* Confirm New Password Section */}
          <div className="mb-3">
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-semibold"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                aria-required="true"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="border-[1px] border-[#ccc] w-full rounded-[4px] text-base py-[0.2rem] px-[0.2rem]"
              />
              {/* Show Or Hide Confirm New Password */}
              <span
                className="toggle-password absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:text-[#555] transition-colors duration-200 ease-in-out"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {errorMessage && <p className="text-[red] text-sm">{errorMessage}</p>}

          <button className="py-2 text-base bg-[#007bff] text-white rounded-[4px] w-full mt-4">
            Reset Password
          </button>
        </form>
      )}
      {/* Custom Notification */}
      {notification && (
        <div
          className={`${styles.notification} fixed top-[30vh] md:top-[20vh] right-0 bg-[#4CAF50] text-white font-semibold p-2 px-2 rounded-tl-[4px] rounded-bl-[4px]`}
        >
          <p>{serverMessage}</p>
        </div>
      )}
    </section>
  );
};

export default ForgetPassword;
