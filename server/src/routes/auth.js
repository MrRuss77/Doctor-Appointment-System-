import express from "express";
import User from "../models/User.js";
import { isValidEmail, isValidPhone } from "../utils/validators.js";

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role
});

const normalizeEmail = (email = "") => email.toLowerCase().trim();
const normalizePhone = (phone = "") => phone.trim();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!isValidEmail(normalizeEmail(email))) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (String(password).trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, phone, password, confirmPassword } = req.body;

    if (!email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All reset fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!isValidEmail(normalizeEmail(email))) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (!isValidPhone(normalizePhone(phone))) {
      return res.status(400).json({ message: "Please provide a valid phone number." });
    }

    if (String(password).trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({
      email: normalizeEmail(email),
      phone: normalizePhone(phone)
    });

    if (!user) {
      return res.status(404).json({ message: "No user found with that email and phone number." });
    }

    user.password = password;
    user.resetOtp = "123456";
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.json({
      message: "Password reset request accepted.",
      otp: user.resetOtp
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    if (!isValidEmail(normalizeEmail(email))) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (!/^\d{6}$/.test(String(otp).trim())) {
      return res.status(400).json({ message: "OTP must be a 6-digit code." });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user || !user.resetOtp) {
      return res.status(404).json({ message: "No active OTP request found for that email." });
    }

    if (!user.resetOtpExpiresAt || user.resetOtpExpiresAt.getTime() < Date.now()) {
      user.resetOtp = null;
      user.resetOtpExpiresAt = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.resetOtp !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    user.resetOtp = null;
    user.resetOtpExpiresAt = null;
    await user.save();

    return res.json({
      message: "OTP verified successfully.",
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
