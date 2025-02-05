import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { sendOTP } from "../utils/nodemailer.js";
import crypto from "crypto";
import validator from "validator";
import jwt from "jsonwebtoken";

// Temporary storage for user data during registration
let tempUsers = {};

// User Registration
export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check All Fields Are Provided
    if (!email || !password || !confirmPassword || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate Email Format
    if (!validator.isEmail(lowerCaseEmail)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Validate Name Format (Only Alphabets, Minimum Length 3)
    const nameRegex = /^[a-zA-Z]{3,}[a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message:
          "Name must start with alphabets and be at least 3 characters long, and can contain spaces.",
      });
    }

    // Check If User Already Exists
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered.Please login" });
    }

    // Check Password and Confirm Password Match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    // Check Password Strength
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain 1 letter, 1 number, and 1 special character !@#$%^&*",
      });
    }

    // Hash The Password
    // ( Here 10 is saltRounds
    // Salt rounds bcrypt me hashing process ka complexity level hota hai.
    // Salt round batata hai hashing algorithm ko kitni baar repeat karna hai.
    // Jitna zyada salt round, utna hashing slow aur secure hoga.
    // Default: Usually 10 rounds recommended hote hain.)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomBytes(3).toString("hex");
    const otpExpiration = Date.now() + 60000; // OTP Expires In 1 Minute

    // Temporarily Store User Data
    tempUsers[lowerCaseEmail] = {
      name,
      email: lowerCaseEmail,
      password: hashedPassword,
      otp,
      otpExpiration,
    };

    res.status(202).json({
      message: "OTP sent to email. Please verify",
    });

    // Send OTP To Email
    await sendOTP(lowerCaseEmail, otp);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

// OTP Verification For User Registration
export const verifyRegisterationOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check If The User Exists In The Temporary Store
    const user = tempUsers[lowerCaseEmail];
    if (!user) {
      return res.status(400).json({
        message:
          "No registration request found or session has expired. Please register again",
      });
    }

    // Check If Email And OTP Are Provided
    if (!lowerCaseEmail || !otp) {
      return res
        .status(400)
        .json({ message: "Please enter the verification code" });
    }

    // Validate OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check If OTP Is Expired
    if (Date.now() > user.otpExpiration) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one" });
    }

    // Save The User In The Database After Successful Otp Verification
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    
    await newUser.save();
    // Remove The Temporary Data After Successful Registration
    delete tempUsers[lowerCaseEmail];

    return res.status(201).json({
      message: "OTP verified successfully! User registered",
    });
  } catch (error) {
    console.error("Error during OTP verification for registration:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

// Request A New OTP While Registration
export const requestRegistrationNewOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();
    // Check If User Exists In Tempusers (If Not, Request Should Be Rejected)
    const user = tempUsers[lowerCaseEmail];
    if (!user) {
      return res.status(400).json({
        message:
          "No registration request found or session has expired. Please register again",
      });
    }

    // Generate New OTP
    const newOtp = crypto.randomBytes(3).toString("hex");
    const newOtpExpiration = Date.now() + 60000;

    // Update Temporary User Data With New Otp And Expiration
    tempUsers[lowerCaseEmail].otp = newOtp;
    tempUsers[lowerCaseEmail].otpExpiration = newOtpExpiration;

    res.status(202).json({
      message: "New OTP sent to email. Please verify",
    });

    // Send the new OTP to email
    await sendOTP(lowerCaseEmail, newOtp);
  } catch (error) {
    console.error("Error during new OTP request for registration:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

// User Login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check If Email And Password Are Provided
    if (!lowerCaseEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Validate Email Format
    if (!validator.isEmail(lowerCaseEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find User By Email
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiry time
    );

    // Send success response with token
    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

const resetRequests = {}; // Temporary Storage For OTPs

// Send OTP For Forgot Password
export const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check Email Provided Or Not
    if (!email) {
      return res.status(400).json({ message: "Email field cannot be empty" });
    }

    // Validate Email Format
    if (!validator.isEmail(lowerCaseEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check If User Exists
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString("hex");

    // OTP Expiration Time
    const otpExpiration = Date.now() + 60000;

    // Store the OTP And Otp Expiration And Otpverified Flag In The ResetRequests Object
    resetRequests[lowerCaseEmail] = { otp, otpExpiration, otpVerified: false };

    // Send OTP To The User's Email
    res.status(202).json({
      message: "OTP sent to your email. Please verify to reset your password.",
    });

    // Send OTP to email
    await sendOTP(lowerCaseEmail, otp);
  } catch (error) {
    console.error("Error during forgot password OTP request:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later",
    });
  }
};

// Validate OTP For Forgot Password
export const verifyForgotPasswordOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email field cannot be empty",
      });
    }

    // Check If Email And OTP Are Provided
    if (!otp) {
      return res.status(400).json({ message: "Please enter the OTP" });
    }

    // Access The Stored OTP And Expiration Time OTP Verified Flag
    const resetRequest = resetRequests[lowerCaseEmail];

    // Check If The Email Exists In ResetRequests Or Not
    if (!resetRequests.hasOwnProperty(lowerCaseEmail)) {
      return res.status(400).json({
        message: "No reset request found for this email",
      });
    }

    // Validate OTP
    if (resetRequest.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check If OTP Is Expired Or Not
    if (Date.now() > resetRequest.otpExpiration) {
      resetRequests[lowerCaseEmail].otpVerified = false;
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // OTP Is Valid, Set OTP Verified Flag
    resetRequests[lowerCaseEmail].otpVerified = true;

    // If OTP Is Valid, Send Success Response
    res.status(200).json({
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Error during OTP verification for forget password:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};

// Resend OTP For Forget Password
export const resendOTPForForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check If Email Provided Or Not
    const resetRequest = resetRequests.hasOwnProperty(lowerCaseEmail);
    if (!resetRequest) {
      return res.status(400).json({
        message:
          "No reset request found for this email. Please request again with your email",
      });
    }

    // Generate a new OTP
    const newOtp = crypto.randomBytes(3).toString("hex");

    // OTP Expiration Time
    const newOtpExpiration = Date.now() + 60000;

    // Update The Reset Request with new OTP and expiration
    resetRequests[lowerCaseEmail] = {
      otp: newOtp,
      otpExpiration: newOtpExpiration,
    };

    // If Email Matches, Send Success Response
    if (resetRequest) {
      res.status(202).json({
        message: "New OTP sent to your email. Please verify",
      });
    }

    // Send the new OTP to the user's email
    await sendOTP(lowerCaseEmail, newOtp);
  } catch (error) {
    console.error("Error during resend OTP for forget password:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};

// Reset Password After OTP Verification
export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    // Convert Email To Lowercase
    const lowerCaseEmail = email?.toLowerCase();

    // Check If Email, New Password, And Confirm Password Are Provided
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate Email Format
    if (!validator.isEmail(lowerCaseEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check If The Email Exists In ResetRequests
    const resetRequest = resetRequests[lowerCaseEmail];
    if (!resetRequest) {
      return res.status(400).json({
        message: "No password reset request found for this email",
      });
    }

    // Check If OTP Is Verified Or Not
    if (!resetRequest.otpVerified) {
      return res.status(400).json({
        message: "OTP not verified. Please verify OTP first",
      });
    }

    // Check If New Password And Confirm Password Match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    // Check Password Strength
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain 1 letter, 1 number, and 1 special character !@#$%^&*",
      });
    }

    // Hash The New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update The User's Password In The Database
    await User.updateOne(
      { email: lowerCaseEmail },
      { password: hashedPassword }
    );

    delete resetRequests[lowerCaseEmail]; // Clear the reset request after success

    return res.status(200).json({
      message:
        "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};

// get user detail
export const getUserDetails = async (req, res) => {
  try {
    // Fetch User Data Using UserId From The Token
    const user = await User.findById(req.user.userId); 
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during getUserDetails:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later"
    });
  }
};
