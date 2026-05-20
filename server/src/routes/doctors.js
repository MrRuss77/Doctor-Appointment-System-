import express from "express";
import fs from "fs/promises";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import DoctorImage from "../models/DoctorImage.js";
import User from "../models/User.js";
import { doctorDefaultPassword } from "../data/catalog.js";
import { sendSuccess } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  filterFutureAvailabilitySlots,
  getNextAvailabilityText,
  hasOverlappingAvailabilitySlots,
  normalizeAvailabilitySlots,
  validateAvailabilitySlot
} from "../utils/availability.js";
import HttpError from "../utils/httpError.js";

const router = express.Router();
const routeDir = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.resolve(routeDir, "../../..");
const doctorUploadDir = path.join(projectRootDir, "public", "uploads", "doctors");
const allowedImageMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

const parseDoctorName = (fullName = "") => {
  const cleanName = String(fullName).replace(/^Dr\.\s*/i, "").trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || "Doctor",
    lastName: parts.slice(1).join(" ") || "User"
  };
};

const saveDoctorImage = async (imageDataUrl, fullName, session) => {
  if (!imageDataUrl) {
    return null;
  }

  const match = String(imageDataUrl).match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);

  if (!match) {
    throw new HttpError(400, "Doctor photo must be a JPG, PNG, or WebP image.");
  }

  const [, mimeType, base64Data] = match;
  const extension = allowedImageMimeTypes.get(mimeType);
  const imageBuffer = Buffer.from(base64Data, "base64");

  if (imageBuffer.length > 4 * 1024 * 1024) {
    throw new HttpError(400, "Doctor photo must be smaller than 4MB.");
  }

  const safeName = String(fullName || "doctor")
    .toLowerCase()
    .replace(/^dr\.\s*/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "doctor";
  const fileName = `${Date.now()}-${safeName}.${extension}`;

  const [savedImage] = await DoctorImage.create([{
    mimeType,
    fileName,
    data: imageBuffer,
    size: imageBuffer.length
  }], session ? { session } : {});

  return savedImage;
};

const deleteUploadedDoctorImage = async (imagePath) => {
  if (!imagePath || !String(imagePath).startsWith("/uploads/doctors/")) {
    return;
  }

  const fileName = path.basename(imagePath);

  try {
    await fs.unlink(path.join(doctorUploadDir, fileName));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const deleteDoctorPhotoAsset = async (assetId) => {
  if (!assetId) {
    return;
  }

  await DoctorImage.deleteOne({ _id: assetId });
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveDepartmentId = async ({ department, departmentName }, session) => {
  if (department) {
    return department;
  }

  if (!departmentName) {
    throw new HttpError(400, "Doctor department is required.");
  }

  const departmentRecord = await Department.findOne({
    name: new RegExp(`^${escapeRegex(String(departmentName).trim())}$`, "i")
  }).session(session || null);

  if (!departmentRecord) {
    throw new HttpError(400, "Selected department does not exist.");
  }

  return departmentRecord._id;
};

const buildDoctorPayload = async (body, session) => {
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const specialization = String(body.specialization || "").trim();

  if (!fullName || !email || !phone || !specialization) {
    throw new HttpError(400, "Name, email, phone, and specialization are required.");
  }

  const department = await resolveDepartmentId(body, session);
  const savedImage = await saveDoctorImage(body.imageDataUrl, fullName, session);

  return {
    fullName,
    email,
    phone,
    department,
    specialization,
    qualification: String(body.qualification || "").trim(),
    nmcNumber: String(body.nmcNumber || "").trim(),
    experienceYears: Number(body.experienceYears || 0),
    availabilityText: "No availability added yet",
    image: savedImage ? "" : String(body.image || "").trim(),
    photoAsset: savedImage?._id || undefined,
    consultationFee: Number(body.consultationFee || 0),
    isActive: body.isActive !== false
  };
};

const findOrCreateDoctorUser = async ({ fullName, email, phone, password, session }) => {
  const existingUser = await User.findOne({ email }).session(session || null);

  if (existingUser) {
    if (existingUser.role !== "doctor") {
      throw new HttpError(409, "A non-doctor user already exists with this email.");
    }

    const { firstName, lastName } = parseDoctorName(fullName);
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.phone = phone;
    await existingUser.save(session ? { session } : {});
    return {
      user: existingUser,
      wasCreated: false
    };
  }

  const [user] = await User.create([{
    ...parseDoctorName(fullName),
    email,
    phone,
    password: password || doctorDefaultPassword,
    role: "doctor"
  }], session ? { session } : {});

  return {
    user,
    wasCreated: true
  };
};

const buildDoctorImagePath = (doctor) =>
  doctor?.photoAsset ? `/api/doctors/${doctor._id}/photo` : doctor?.image || "";

const serializeDoctor = (doctorDocument) => {
  const doctor = doctorDocument.toObject ? doctorDocument.toObject() : doctorDocument;
  const availabilitySlots = filterFutureAvailabilitySlots(doctor.availabilitySlots || []);

  return {
    ...doctor,
    image: buildDoctorImagePath(doctor),
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
  "/:id/photo",
  asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).select("photoAsset image fullName");

    if (!doctor) {
      throw new HttpError(404, "Doctor not found.");
    }

    if (doctor.photoAsset) {
      const photoAsset = await DoctorImage.findById(doctor.photoAsset);

      if (!photoAsset) {
        throw new HttpError(404, "Doctor photo not found.");
      }

      res.setHeader("Content-Type", photoAsset.mimeType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(photoAsset.data);
      return;
    }

    if (doctor.image && String(doctor.image).startsWith("/uploads/doctors/")) {
      const fileName = path.basename(doctor.image);
      const filePath = path.join(doctorUploadDir, fileName);

      try {
        const fileBuffer = await fs.readFile(filePath);
        const extension = path.extname(fileName).toLowerCase();
        const mimeType =
          extension === ".png"
            ? "image/png"
            : extension === ".webp"
              ? "image/webp"
              : "image/jpeg";

        res.setHeader("Content-Type", mimeType);
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.send(fileBuffer);
        return;
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
    }

    throw new HttpError(404, "Doctor photo not found.");
  })
);

router.get(
  "/:id/availability",
  asyncHandler(async (req, res) => {
    const doctor = await findDoctorOrThrow(req.params.id);
    const availabilitySlots = filterFutureAvailabilitySlots(doctor.availabilitySlots || []);

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

    doctor.availabilitySlots = normalizeAvailabilitySlots(
      doctor.availabilitySlots
        .map((item) => item.toObject?.() || item)
        .filter((item) => String(item._id) !== String(req.params.slotId))
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
    const session = await mongoose.startSession();
    let createdDoctorId;
    let wasCreated = false;

    try {
      await session.withTransaction(async () => {
        const doctorPayload = await buildDoctorPayload(req.body || {}, session);
        const existingDoctor = await Doctor.findOne({ email: doctorPayload.email }).session(session);

        if (existingDoctor) {
          throw new HttpError(409, "A doctor already exists with this email.");
        }

        const doctorUser = await findOrCreateDoctorUser({
          ...doctorPayload,
          password: String(req.body?.password || "").trim(),
          session
        });

        wasCreated = doctorUser.wasCreated;

        const [doctor] = await Doctor.create([{
          ...doctorPayload,
          user: doctorUser.user._id
        }], { session });

        createdDoctorId = doctor._id;
      });
    } finally {
      await session.endSession();
    }

    const populatedDoctor = await Doctor.findById(createdDoctorId).populate("department").populate("user");
    const passwordMessage = req.body?.password
      ? "Doctor created successfully."
      : wasCreated
        ? `Doctor created successfully. Default password: ${doctorDefaultPassword}`
        : "Doctor created successfully and linked to the existing doctor login account.";

    sendSuccess(res, {
      status: 201,
      message: passwordMessage,
      data: serializeDoctor(populatedDoctor)
    });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const updatePayload = { ...req.body };
    delete updatePayload.availabilityText;

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updatePayload, {
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
    const session = await mongoose.startSession();
    let deletedDoctorImagePath = "";

    try {
      await session.withTransaction(async () => {
        const doctor = await Doctor.findById(req.params.id).session(session);

        if (!doctor) {
          throw new HttpError(404, "Doctor not found.");
        }

        const futureAppointments = await Appointment.countDocuments({
          doctor: doctor._id,
          status: { $in: ["pending", "confirmed"] }
        }).session(session);

        if (futureAppointments > 0) {
          throw new HttpError(
            409,
            "Doctor cannot be deleted because pending or confirmed appointments still exist. Please complete, cancel, or reassign those appointments first."
          );
        }

        deletedDoctorImagePath = doctor.image;

        await Doctor.deleteOne({ _id: doctor._id }).session(session);
        if (doctor.photoAsset) {
          await DoctorImage.deleteOne({ _id: doctor.photoAsset }).session(session);
        }

        if (doctor.user) {
          const linkedDoctorCount = await Doctor.countDocuments({ user: doctor.user }).session(session);

          // Keep the linked account only when another doctor profile still depends on it.
          if (linkedDoctorCount === 0) {
            await User.deleteOne({ _id: doctor.user, role: "doctor" }).session(session);
          }
        }
      });
    } finally {
      await session.endSession();
    }

    await deleteUploadedDoctorImage(deletedDoctorImagePath);

    sendSuccess(res, { message: "Doctor deleted successfully." });
  })
);

export default router;
