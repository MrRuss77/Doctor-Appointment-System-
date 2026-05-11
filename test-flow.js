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
  const server = app.listen(5003, async () => {
    try {
      console.log("1. Send OTP");
      let res = await fetch("http://localhost:5003/auth/send-otp", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: "np03cs4s250049@heraldcollege.edu.np" })
      });
      console.log(await res.json());

      // Get the OTP from DB to verify
      const otpRec = await OTP.findOne({ email: "np03cs4s250049@heraldcollege.edu.np" }).sort({createdAt:-1});
      console.log("OTP Record:", otpRec);
      // Wait, we can't unhash it. So we need to generate one manually or update the hash to something we know.
      const mockOtp = "123456";
      const { hashOTP } = await import("./server/src/utils/otp.js");
      otpRec.otpHash = hashOTP(mockOtp);
      await otpRec.save();

      console.log("2. Verify OTP");
      res = await fetch("http://localhost:5003/auth/verify-otp", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: "np03cs4s250049@heraldcollege.edu.np", otp: mockOtp })
      });
      console.log(await res.json());

      console.log("3. Reset Password");
      res = await fetch("http://localhost:5003/auth/reset-password", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: "np03cs4s250049@heraldcollege.edu.np", password: "newpassword123", confirmPassword: "newpassword123" })
      });
      console.log(await res.json());

      console.log("4. Send OTP again");
      res = await fetch("http://localhost:5003/auth/send-otp", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: "np03cs4s250049@heraldcollege.edu.np" })
      });
      const txt = await res.text();
      console.log("Text response:", txt);

    } catch (e) {
      console.error(e);
    } finally {
      server.close();
      mongoose.disconnect();
    }
  });
};
run();
