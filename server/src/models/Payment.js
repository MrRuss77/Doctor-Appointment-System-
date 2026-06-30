import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transactionUuid: {
      type: String,
      unique: true,
      required: true
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    esewaRefId: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["initiated", "success", "failed", "refunded"],
      default: "initiated"
    },
    bookingSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
