import express from "express";
import authRoutes from "./server/src/routes/auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use((err, req, res, next) => {
  console.error("ERROR CAUGHT IN MIDDLEWARE:", err);
  res.status(500).json({ message: "Internal server error." });
});

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const server = app.listen(5002, async () => {
      try {
        const response = await fetch("http://localhost:5002/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "np03cs4s250049@heraldcollege.edu.np" })
        });
        const data = await response.json();
        console.log("Response:", data);
      } catch (e) {
        console.error("Fetch Error:", e);
      } finally {
        server.close();
        mongoose.disconnect();
      }
    });
  } catch(e) {
    console.error("Setup Error:", e);
  }
}
run();
