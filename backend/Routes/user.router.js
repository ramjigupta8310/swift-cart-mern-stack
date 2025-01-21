import express from 'express';
import {  getUserDetails, registerUser, requestRegistrationNewOTP, resendOTPForForgetPassword, resetPassword, sendForgotPasswordOTP, userLogin, verifyForgotPasswordOTP, verifyRegisterationOTP, } from '../Controller/user.controller.js';
import verifyTokenController from '../Middlewares/varify.user.middleware.js';
import authenticateUser from '../Middlewares/auth.Middleware.js';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// OTP Verification
router.post('/verify-otp', verifyRegisterationOTP);

// Request a new OTP for registration
router.post('/request-registration-new-otp', requestRegistrationNewOTP);

router.post('/login',userLogin)

// forget pass send otp 
router.post('/forget-password', sendForgotPasswordOTP);

// Varify reset pass otp
router.post('/verify-forget-password', verifyForgotPasswordOTP);

// reset password
router.post('/reset-password',resetPassword)

// request a new otp for reset password
router.post('/request-forget-password-new-otp', resendOTPForForgetPassword);

// varify token
router.get('/verify-token', verifyTokenController);

router.get('/details', authenticateUser, getUserDetails);

export default router;
