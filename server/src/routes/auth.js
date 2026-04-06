import express from "express";
import User from "../models/User.js";

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

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

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      phone: phone.trim()
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

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !user.resetOtp) {
      return res.status(404).json({ message: "No active OTP request found for that email." });
    }

    if (!user.resetOtpExpiresAt || user.resetOtpExpiresAt.getTime() < Date.now()) {
      user.resetOtp = null;
      user.resetOtpExpiresAt = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.resetOtp !== otp.trim()) {
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
