import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required."]
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required."]
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required."]
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required."],
      validate: {
        validator: (value) => value instanceof Date && !Number.isNaN(value.getTime()),
        message: "Please provide a valid appointment date."
      }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
      default: "pending"
    },
    reason: {
      type: String,
      trim: true,
      required: [true, "Appointment reason is required."],
      minlength: [5, "Appointment reason must be at least 5 characters long."],
      maxlength: [300, "Appointment reason cannot be longer than 300 characters."]
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Appointment notes cannot be longer than 500 characters."]
    },
    adminReply: {
      type: String,
      trim: true,
      maxlength: [300, "Admin reply cannot be longer than 300 characters."]
    },
    respondedByRole: {
      type: String,
      enum: ["admin", "doctor", "system"]
    },
    respondedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
