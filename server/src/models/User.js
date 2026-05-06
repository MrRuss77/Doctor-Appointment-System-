import mongoose from "mongoose";
import { isValidEmail, isValidPhone } from "../utils/validators.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: isValidEmail,
        message: "Please provide a valid email address."
      }
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidPhone,
        message: "Please provide a valid phone number."
      }
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."]
    },
    role: {
      type: String,
      enum: ["patient", "admin", "doctor"],
      default: "patient"
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    address: {
      type: String,
      trim: true,
      maxlength: [250, "Address cannot be longer than 250 characters."]
    },
    resetOtp: {
      type: String,
      trim: true
    },
    resetOtpExpiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

userSchema.path("firstName").validate(
  (value) => value && value.trim().length >= 2,
  "First name must be at least 2 characters long."
);

userSchema.path("lastName").validate(
  (value) => value && value.trim().length >= 2,
  "Last name must be at least 2 characters long."
);

const User = mongoose.model("User", userSchema);

export default User;
