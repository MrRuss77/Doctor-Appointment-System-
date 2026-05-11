import express from "express";
import OTP from "../models/OTP.js";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/mailer.js";
import { generateOTP, hashOTP } from "../utils/otp.js";
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

const createAndSendOTP = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const otp = generateOTP();

  await OTP.deleteMany({ email: normalizedEmail });
  await OTP.create({
    email: normalizedEmail,
    otpHash: hashOTP(otp)
  });
  await sendOTPEmail(normalizedEmail, otp);
};

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
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All reset fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (String(password).trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "No user found with that email." });
    }

    const verifiedOtp = await OTP.findOne({
      email: normalizedEmail,
      used: true
    }).sort({ updatedAt: -1 });

    if (!verifiedOtp) {
      return res.status(400).json({ message: "No verified OTP found for this email. Please verify OTP first." });
    }

    user.password = password;
    user.resetOtp = null;
    user.resetOtpExpiresAt = null;
    await user.save();

    await OTP.deleteOne({ _id: verifiedOtp._id });

    return res.json({
      message: "Password reset successfully. You can now login."
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/send-otp", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    try {
      await createAndSendOTP(normalizedEmail);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ 
        message: "Failed to send OTP email. This might be due to email provider rate limits or configuration. Please try again later." 
      });
    }

    return res.json({
      message: "OTP sent successfully. Please check your email."
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

    const normalizedEmail = normalizeEmail(email);
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      used: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(404).json({ message: "No active OTP request found for that email." });
    }

    if (!otpRecord.expiresAt || otpRecord.expiresAt.getTime() < Date.now()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (otpRecord.otpHash !== hashOTP(String(otp).trim())) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({ email: normalizedEmail });

    return res.json({
      message: "OTP verified successfully.",
      user: user ? sanitizeUser(user) : null
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
