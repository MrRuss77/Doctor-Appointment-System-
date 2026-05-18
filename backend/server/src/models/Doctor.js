import mongoose from "mongoose";
import {
  hasOverlappingAvailabilitySlots,
  isValidAvailabilityDate,
  isValidTime24
} from "../utils/availability.js";
import { isValidEmail, isValidPhone } from "../utils/validators.js";

const availabilitySlotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Availability date is required."],
      validate: {
        validator: isValidAvailabilityDate,
        message: "Availability date must use YYYY-MM-DD format."
      }
    },
    startTime: {
      type: String,
      required: [true, "Availability start time is required."],
      validate: {
        validator: isValidTime24,
        message: "Availability start time must use HH:mm format."
      }
    },
    endTime: {
      type: String,
      required: [true, "Availability end time is required."],
      validate: {
        validator: isValidTime24,
        message: "Availability end time must use HH:mm format."
      }
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: [120, "Availability note cannot be longer than 120 characters."]
    }
  },
  {
    _id: true
  }
);

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Doctor name is required."],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => !value || isValidEmail(value),
        message: "Please provide a valid doctor email address."
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || isValidPhone(value),
        message: "Please provide a valid doctor phone number."
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Doctor department is required."]
    },
    specialization: {
      type: String,
      required: [true, "Doctor specialization is required."],
      trim: true
    },
    qualification: {
      type: String,
      trim: true,
      maxlength: [200, "Qualification cannot be longer than 200 characters."]
    },
    experienceYears: {
      type: Number,
      min: [0, "Experience years cannot be negative."],
      default: 0
    },
    availabilityText: {
      type: String,
      trim: true,
      maxlength: [120, "Availability text cannot be longer than 120 characters."]
    },
    availabilitySlots: {
      type: [availabilitySlotSchema],
      default: []
    },
    image: {
      type: String,
      trim: true,
      maxlength: [300, "Image path cannot be longer than 300 characters."]
    },
    consultationFee: {
      type: Number,
      min: [0, "Consultation fee cannot be negative."],
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

doctorSchema.path("fullName").validate(
  (value) => value && value.trim().length >= 4,
  "Doctor name must be at least 4 characters long."
);

doctorSchema.path("specialization").validate(
  (value) => value && value.trim().length >= 5,
  "Doctor specialization must be at least 5 characters long."
);

doctorSchema.path("availabilitySlots").validate((slots = []) => {
  return slots.every((slot) => {
    const start = slot?.startTime;
    const end = slot?.endTime;

    if (!start || !end || !isValidTime24(start) || !isValidTime24(end)) {
      return false;
    }

    return start < end;
  });
}, "Each availability slot must have a valid time range.");

doctorSchema.path("availabilitySlots").validate(
  (slots = []) => !hasOverlappingAvailabilitySlots(slots),
  "Availability slots cannot overlap on the same day."
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
