// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:{ type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiration: { type: Date },
}, { timestamps: true });

const User = mongoose.model('User', userSchema, "registered-user");
export default User;
