import mongoose from "mongoose";
import { hashPassword, isPasswordHash } from "../utils/password.js";
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

const removeSensitiveFields = (_document, returnedObject) => {
  delete returnedObject.password;
  delete returnedObject.resetOtp;
  delete returnedObject.resetOtpExpiresAt;
  return returnedObject;
};

userSchema.set("toJSON", { transform: removeSensitiveFields });
userSchema.set("toObject", { transform: removeSensitiveFields });

userSchema.path("firstName").validate(
  (value) => value && value.trim().length >= 2,
  "First name must be at least 2 characters long."
);

userSchema.path("lastName").validate(
  (value) => value && value.trim().length >= 2,
  "Last name must be at least 2 characters long."
);

userSchema.pre("save", function hashPasswordBeforeSave(next) {
  if (this.isModified("password") && this.password && !isPasswordHash(this.password)) {
    this.password = hashPassword(this.password);
  }

  next();
});

userSchema.pre("findOneAndUpdate", function hashPasswordBeforeUpdate(next) {
  const update = this.getUpdate() || {};
  const nextPassword = update.password || update.$set?.password;

  if (nextPassword && !isPasswordHash(nextPassword)) {
    const hashedPassword = hashPassword(nextPassword);

    if (update.password) {
      update.password = hashedPassword;
    }

    if (update.$set?.password) {
      update.$set.password = hashedPassword;
    }

    this.setUpdate(update);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
