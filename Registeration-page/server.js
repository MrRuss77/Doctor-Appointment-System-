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
  password: String
});

const User = mongoose.model("User", UserSchema);

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

// ===================== SERVER =====================
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});