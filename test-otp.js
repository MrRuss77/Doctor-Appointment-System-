import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import OTP from "./server/src/models/OTP.js";
import { generateOTP, hashOTP } from "./server/src/utils/otp.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    
    const normalizedEmail = "np03cs4s250049@heraldcollege.edu.np";
    const otp = generateOTP();

    await OTP.deleteMany({ email: normalizedEmail });
    await OTP.create({
      email: normalizedEmail,
      otpHash: hashOTP(otp)
    });
    console.log("OTP created");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    mongoose.disconnect();
  }
};
run();
