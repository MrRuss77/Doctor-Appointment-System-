import crypto from "crypto";
import express from "express";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { sendSuccess } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  ensureAppointmentFitsAvailability,
  ensureAppointmentRelations,
  ensureNoBookingConflict
} from "./appointments.js";
import { generateSignature, verifyEsewaPayment } from "../utils/esewa.js";
import HttpError from "../utils/httpError.js";

const router = express.Router();

const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
const SERVER_URL = (process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5001}`).replace(/\/$/, "");
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const ESEWA_PAYMENT_URL =
  process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

// POST /api/payments/initiate
// Validates booking, creates a Payment record, returns eSewa form params
router.post(
  "/initiate",
  asyncHandler(async (req, res) => {
    const { patientId, doctorId, departmentId, appointmentDate, bookingForm } = req.body;

    if (!patientId || !doctorId || !departmentId || !appointmentDate) {
      throw new HttpError(400, "patientId, doctorId, departmentId, and appointmentDate are required.");
    }

    const parsedDate = new Date(appointmentDate);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new HttpError(400, "Please provide a valid appointment date and time.");
    }

    const { doctorRecord } = await ensureAppointmentRelations({
      patient: patientId,
      doctor: doctorId,
      department: departmentId
    });

    ensureAppointmentFitsAvailability(doctorRecord, parsedDate);
    await ensureNoBookingConflict({ doctorId, appointmentDate: parsedDate });

    const amount = Number(doctorRecord.consultationFee || 0);
    if (amount <= 0) {
      throw new HttpError(400, "This doctor has no consultation fee — use the free booking flow.");
    }

    const transactionUuid = crypto.randomUUID();
    const totalAmount = amount;

    const payment = new Payment({
      transactionUuid,
      patientId,
      doctorId,
      amount,
      bookingSnapshot: {
        patientId,
        doctorId,
        departmentId,
        appointmentDate,
        bookingForm: bookingForm || {}
      }
    });
    await payment.save();

    const signature = generateSignature(totalAmount, transactionUuid, ESEWA_MERCHANT_CODE);

    sendSuccess(res, {
      status: 200,
      message: "Payment initiated.",
      data: {
        payment_url: ESEWA_PAYMENT_URL,
        amount: totalAmount,
        tax_amount: 0,
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: ESEWA_MERCHANT_CODE,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${SERVER_URL}/api/payments/esewa/success`,
        failure_url: `${SERVER_URL}/api/payments/esewa/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature
      }
    });
  })
);

// GET /api/payments/esewa/success
// eSewa redirects here after successful payment
router.get(
  "/esewa/success",
  asyncHandler(async (req, res) => {
    const rawData = req.query.data;

    if (!rawData) {
      return res.redirect(`${CLIENT_URL}?payment-failure=1`);
    }

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(rawData, "base64").toString("utf8"));
    } catch {
      return res.redirect(`${CLIENT_URL}?payment-failure=1`);
    }

    const { transaction_uuid, total_amount, ref_id, status } = decoded;

    if (status !== "COMPLETE") {
      await Payment.findOneAndUpdate({ transactionUuid: transaction_uuid }, { status: "failed" });
      return res.redirect(`${CLIENT_URL}?payment-failure=1`);
    }

    const payment = await Payment.findOne({ transactionUuid: transaction_uuid });

    if (!payment) {
      return res.redirect(`${CLIENT_URL}?payment-failure=1`);
    }

    // Idempotency: if already processed redirect to success
    if (payment.status === "success" && payment.appointmentId) {
      return res.redirect(`${CLIENT_URL}?payment-success=1&appointmentId=${payment.appointmentId}`);
    }

    if (payment.status !== "initiated") {
      return res.redirect(`${CLIENT_URL}?payment-failure=1`);
    }

    // Verify with eSewa
    try {
      const verification = await verifyEsewaPayment(ESEWA_MERCHANT_CODE, total_amount, transaction_uuid);
      if (verification.status !== "COMPLETE") {
        payment.status = "failed";
        await payment.save();
        return res.redirect(`${CLIENT_URL}?payment-failure=1`);
      }
    } catch {
      payment.status = "failed";
      await payment.save();
      return res.redirect(`${CLIENT_URL}?payment-failure=1`);
    }

    const { patientId, doctorId, departmentId, appointmentDate, bookingForm } =
      payment.bookingSnapshot;

    const parsedDate = new Date(appointmentDate);

    // Re-check slot conflict before creating appointment
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: parsedDate,
      status: { $in: ["pending", "confirmed"] }
    });

    if (conflict) {
      // Slot taken during payment window — flag for manual refund
      payment.status = "refunded";
      await payment.save();
      return res.redirect(`${CLIENT_URL}?payment-failure=1&reason=slot-taken`);
    }

    const reason = (bookingForm?.message || "").trim() || "General consultation";
    const notes = [
      `Requested by: ${bookingForm?.fullName || ""}`,
      `Phone: ${bookingForm?.phone || ""}`,
      `Email: ${bookingForm?.email || "not provided"}`,
      `Address: ${bookingForm?.address || ""}`,
      `Gender: ${bookingForm?.gender || ""}`,
      `Blood Group: ${bookingForm?.bloodGroup || "not provided"}`,
      `Age: ${bookingForm?.age || "not provided"}`
    ]
      .join(" | ")
      .slice(0, 500);

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      department: departmentId,
      appointmentDate: parsedDate,
      status: "pending",
      appointmentType: bookingForm?.appointmentType || "physical",
      reason,
      notes,
      paymentStatus: "paid",
      paymentId: payment._id,
      amountPaid: payment.amount
    });

    await appointment.save({ w: "majority" });

    payment.status = "success";
    payment.esewaRefId = ref_id || null;
    payment.appointmentId = appointment._id;
    await payment.save();

    return res.redirect(`${CLIENT_URL}?payment-success=1&appointmentId=${appointment._id}`);
  })
);

// GET /api/payments/esewa/failure
// eSewa redirects here on payment failure or cancellation
router.get(
  "/esewa/failure",
  asyncHandler(async (req, res) => {
    const rawData = req.query.data;

    if (rawData) {
      try {
        const decoded = JSON.parse(Buffer.from(rawData, "base64").toString("utf8"));
        const { transaction_uuid } = decoded;

        if (transaction_uuid) {
          await Payment.findOneAndUpdate(
            { transactionUuid: transaction_uuid, status: "initiated" },
            { status: "failed" }
          );
        }
      } catch {
        // ignore decode errors on failure path
      }
    }

    return res.redirect(`${CLIENT_URL}?payment-failure=1`);
  })
);

export default router;
