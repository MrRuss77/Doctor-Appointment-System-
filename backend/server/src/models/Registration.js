import mongoose from "mongoose";
import { isValidPhone } from "../utils/validators.js";

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for registration."]
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [5, "Registration number must be at least 5 characters long."]
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active"
    },
    emergencyContactName: {
      type: String,
      trim: true,
      maxlength: [120, "Emergency contact name cannot be longer than 120 characters."]
    },
    emergencyContactPhone: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || isValidPhone(value),
        message: "Please provide a valid emergency contact phone number."
      }
    }
  },
  {
    timestamps: true
  }
);

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
