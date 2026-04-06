const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/doctorApp")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  attempts: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

// Temporary code storage
let codes = {};

// ===================== REGISTER =====================
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { phone }] });

    if (existing) {
      return res.status(400).send("User with this email or phone already exists");
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    return res.status(200).send("User Registered Successfully");

  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// ===================== LOGIN =====================
app.post("/login", async (req, res) => {
  try {
    const { userid, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: userid }, { phone: userid }]
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.attempts >= 5) {
      return res.status(403).send("Maximum login attempts exceeded. Use forgot password.");
    }

    if (user.password !== password) {
      user.attempts += 1;
      await user.save();

      return res.status(401).send(`Incorrect password! Attempts left: ${5 - user.attempts}`);
    }

    user.attempts = 0;
    await user.save();

    return res.status(200).send("Login successful!");

  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// ===================== FORGOT PASSWORD =====================
app.post("/forgot", async (req, res) => {
  try {
    const { userid, method } = req.body;

    const user = await User.findOne({
      $or: [{ email: userid }, { phone: userid }]
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    codes[userid] = code;

    return res.status(200).send(`Your ${method} code is: ${code}`);

  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// ===================== RESET PASSWORD =====================
app.post("/reset", async (req, res) => {
  try {
    const { userid, code, newPassword } = req.body;

    if (codes[userid] != code) {
      return res.status(400).send("Invalid code");
    }

    const user = await User.findOne({
      $or: [{ email: userid }, { phone: userid }]
    });

    user.password = newPassword;
    user.attempts = 0;

    await user.save();
    delete codes[userid];

    return res.status(200).send("Password reset successful!");

  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// ===================== SERVER =====================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});