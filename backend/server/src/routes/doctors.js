import express from "express";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import { sendSuccess } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getNextAvailabilityText,
  hasOverlappingAvailabilitySlots,
  normalizeAvailabilitySlots,
  validateAvailabilitySlot
} from "../utils/availability.js";
import HttpError from "../utils/httpError.js";

const router = express.Router();

const serializeDoctor = (doctorDocument) => {
  const doctor = doctorDocument.toObject ? doctorDocument.toObject() : doctorDocument;
  const availabilitySlots = normalizeAvailabilitySlots(doctor.availabilitySlots || []);

  return {
    ...doctor,
    availabilitySlots,
    availabilityText:
      availabilitySlots.length > 0
        ? getNextAvailabilityText(availabilitySlots)
        : doctor.availabilityText || "No availability added yet"
  };
};

const findDoctorOrThrow = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).populate("department").populate("user");

  if (!doctor) {
    throw new HttpError(404, "Doctor not found.");
  }

  return doctor;
};

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const query = String(req.query.q || "").trim();

    if (!query) {
      const doctors = await Doctor.find().populate("department").populate("user").sort({ createdAt: -1 });
      return res.json(doctors.map(serializeDoctor));
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchPattern = new RegExp(escapedQuery, "i");
    const matchingDepartments = await Department.find({ name: searchPattern }).select("_id");
    const departmentIds = matchingDepartments.map((department) => department._id);

    const doctors = await Doctor.find({
      $or: [
        { fullName: searchPattern },
        { specialization: searchPattern },
        { qualification: searchPattern },
        { availabilityText: searchPattern },
        ...(departmentIds.length > 0 ? [{ department: { $in: departmentIds } }] : [])
      ]
    })
      .populate("department")
      .populate("user")
      .sort({ fullName: 1 });

    return res.json(doctors.map(serializeDoctor));
  })
);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const doctors = await Doctor.find().populate("department").populate("user").sort({ createdAt: -1 });
    res.json(doctors.map(serializeDoctor));
  })
);

router.get(
  "/:id/availability",
  asyncHandler(async (req, res) => {
    const doctor = await findDoctorOrThrow(req.params.id);
    const availabilitySlots = normalizeAvailabilitySlots(doctor.availabilitySlots || []);

    res.json({
      success: true,
      doctorId: doctor._id,
      availabilityText:
        availabilitySlots.length > 0
          ? getNextAvailabilityText(availabilitySlots)
          : doctor.availabilityText || "No availability added yet",
      slots: availabilitySlots
    });
  })
);

router.post(
  "/:id/availability",
  asyncHandler(async (req, res) => {
    const doctor = await findDoctorOrThrow(req.params.id);
    const slot = req.body?.slot || req.body;
    const slotError = validateAvailabilitySlot(slot);

    if (slotError) {
      throw new HttpError(400, slotError);
    }

    const availabilitySlots = normalizeAvailabilitySlots([
      ...(doctor.availabilitySlots || []).map((item) => item.toObject?.() || item),
      slot
    ]);

    if (hasOverlappingAvailabilitySlots(availabilitySlots)) {
      throw new HttpError(400, "Availability slots cannot overlap on the same day.");
    }

    doctor.availabilitySlots = availabilitySlots;
    doctor.availabilityText = getNextAvailabilityText(availabilitySlots);
    await doctor.save();

    return sendSuccess(res, {
      status: 201,
      message: "Availability slot added successfully.",
      data: {
        doctorId: doctor._id,
        slots: doctor.availabilitySlots,
        availabilityText: doctor.availabilityText
      }
    });
  })
);

router.put(
  "/:id/availability",
  asyncHandler(async (req, res) => {
    const doctor = await findDoctorOrThrow(req.params.id);
    const incomingSlots = Array.isArray(req.body?.slots) ? req.body.slots : [];

    if (incomingSlots.length === 0) {
      throw new HttpError(400, "Please provide at least one availability slot.");
    }

    const validationErrors = incomingSlots
      .map((slot) => validateAvailabilitySlot(slot))
      .filter(Boolean);

    if (validationErrors.length > 0) {
      throw new HttpError(400, "Availability validation failed.", {
        errors: validationErrors
      });
    }

    const normalizedSlots = normalizeAvailabilitySlots(incomingSlots);

    if (hasOverlappingAvailabilitySlots(normalizedSlots)) {
      throw new HttpError(400, "Availability slots cannot overlap on the same day.");
    }

    doctor.availabilitySlots = normalizedSlots;
    doctor.availabilityText = getNextAvailabilityText(doctor.availabilitySlots);
    await doctor.save();

    return sendSuccess(res, {
      message: "Doctor availability updated successfully.",
      data: {
        doctorId: doctor._id,
        slots: doctor.availabilitySlots,
        availabilityText: doctor.availabilityText
      }
    });
  })
);

router.put(
  "/:id/availability/:slotId",
  asyncHandler(async (req, res) => {
    const doctor = await findDoctorOrThrow(req.params.id);
    const slotError = validateAvailabilitySlot(req.body);

    if (slotError) {
      throw new HttpError(400, slotError);
    }

    const slot = doctor.availabilitySlots.id(req.params.slotId);

    if (!slot) {
      throw new HttpError(404, "Availability slot not found.");
    }

    slot.date = req.body.date;
    slot.startTime = req.body.startTime;
    slot.endTime = req.body.endTime;
    slot.isAvailable = req.body.isAvailable !== false;
    slot.note = String(req.body.note || "").trim();

    const normalizedSlots = normalizeAvailabilitySlots(
      doctor.availabilitySlots.map((item) => item.toObject?.() || item)
    );

    if (hasOverlappingAvailabilitySlots(normalizedSlots)) {
      throw new HttpError(400, "Availability slots cannot overlap on the same day.");
    }

    doctor.availabilitySlots = normalizedSlots;
    doctor.availabilityText = getNextAvailabilityText(doctor.availabilitySlots);
    await doctor.save();

    return sendSuccess(res, {
      message: "Availability slot updated successfully.",
      data: {
        doctorId: doctor._id,
        slots: doctor.availabilitySlots,
        availabilityText: doctor.availabilityText
      }
    });
  })
);

router.delete(
  "/:id/availability/:slotId",
  asyncHandler(async (req, res) => {
    const doctor = await findDoctorOrThrow(req.params.id);
    const slot = doctor.availabilitySlots.id(req.params.slotId);

    if (!slot) {
      throw new HttpError(404, "Availability slot not found.");
    }

    slot.deleteOne();
    doctor.availabilitySlots = normalizeAvailabilitySlots(
      doctor.availabilitySlots.map((item) => item.toObject?.() || item)
    );
    doctor.availabilityText =
      doctor.availabilitySlots.length > 0
        ? getNextAvailabilityText(doctor.availabilitySlots)
        : "No availability added yet";
    await doctor.save();

    return sendSuccess(res, {
      message: "Availability slot deleted successfully.",
      data: {
        doctorId: doctor._id,
        slots: doctor.availabilitySlots,
        availabilityText: doctor.availabilityText
      }
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const doctor = await findDoctorOrThrow(req.params.id);
    res.json(serializeDoctor(doctor));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.create(req.body);
    const populatedDoctor = await Doctor.findById(doctor._id).populate("department").populate("user");
    sendSuccess(res, {
      status: 201,
      message: "Doctor created successfully.",
      data: serializeDoctor(populatedDoctor)
    });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("department").populate("user");

    if (!doctor) {
      throw new HttpError(404, "Doctor not found.");
    }

    res.json({
      ...serializeDoctor(doctor),
      success: true,
      message: "Doctor updated successfully."
    });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      throw new HttpError(404, "Doctor not found.");
    }

    const futureAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: { $in: ["pending", "confirmed"] }
    });

    if (futureAppointments > 0) {
      throw new HttpError(
        409,
        "Doctor cannot be deleted while pending or confirmed appointments still exist."
      );
    }

    await Doctor.deleteOne({ _id: doctor._id });

    sendSuccess(res, { message: "Doctor deleted successfully." });
  })
);

export default router;
