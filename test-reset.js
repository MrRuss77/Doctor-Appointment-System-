import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./server/src/routes/auth.js";
import User from "./server/src/models/User.js";
import OTP from "./server/src/models/OTP.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use((err, req, res, next) => {
  console.error("ERROR CAUGHT IN MIDDLEWARE:", err);
  res.status(500).json({ message: "Internal server error." });
});

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const server = app.listen(5004, async () => {
    try {
      // 1. Create User
      const email = "testuser_reset@example.com";
      await User.deleteMany({ email });
      await User.create({
        firstName: "Test",
        lastName: "User",
        email: email,
        phone: "+1234567890",
        password: "oldpassword",
        role: "patient"
      });

      console.log("1. Send OTP");
      let res = await fetch("http://localhost:5004/auth/send-otp", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email })
      });
      console.log(await res.json());

      // 2. verify OTP (mock)
      const otpRec = await OTP.findOne({ email }).sort({createdAt:-1});
      const mockOtp = "123456";
      const { hashOTP } = await import("./server/src/utils/otp.js");
      otpRec.otpHash = hashOTP(mockOtp);
      await otpRec.save();

      console.log("2. Verify OTP");
      res = await fetch("http://localhost:5004/auth/verify-otp", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, otp: mockOtp })
      });
      console.log(await res.json());

      console.log("3. Reset Password");
      res = await fetch("http://localhost:5004/auth/reset-password", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password: "newpassword123", confirmPassword: "newpassword123" })
      });
      console.log(await res.json());

      console.log("4. Send OTP again (After change password)");
      res = await fetch("http://localhost:5004/auth/send-otp", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email })
      });
      console.log(await res.json());

    } catch (e) {
      console.error(e);
    } finally {
      server.close();
      mongoose.disconnect();
    }
  });
};
run();
