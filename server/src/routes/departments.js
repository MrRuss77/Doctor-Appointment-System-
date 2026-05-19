import express from "express";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import DepartmentIcon from "../models/DepartmentIcon.js";
import Doctor from "../models/Doctor.js";
import { sendSuccess } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import HttpError from "../utils/httpError.js";

const router = express.Router();

const saveDepartmentIcon = async (iconDataUrl, name) => {
  if (!iconDataUrl) {
    return null;
  }

  const match = String(iconDataUrl).match(/^data:(image\/png);base64,([A-Za-z0-9+/=]+)$/);

  if (!match) {
    throw new HttpError(400, "Department icon must be a PNG image.");
  }

  const [, mimeType, base64Data] = match;
  const iconBuffer = Buffer.from(base64Data, "base64");

  if (iconBuffer.length > 1024 * 1024) {
    throw new HttpError(400, "Department icon must be smaller than 1MB.");
  }

  const safeName = String(name || "department")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "department";

  return DepartmentIcon.create({
    mimeType,
    fileName: `${Date.now()}-${safeName}.png`,
    data: iconBuffer,
    size: iconBuffer.length
  });
};

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const departments = await Department.find().sort({ createdAt: -1 });

    const doctorCounts = await Doctor.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = Object.fromEntries(
      doctorCounts.map((item) => [String(item._id), item.count])
    );

    res.json(
      departments.map((department) => ({
        ...(department.toObject?.() || department),
        doctorCount: countMap[String(department._id)] || 0
      }))
    );
  })
);

router.get(
  "/icon-assets/:id",
  asyncHandler(async (req, res) => {
    const iconAsset = await DepartmentIcon.findById(req.params.id);

    if (!iconAsset) {
      throw new HttpError(404, "Department icon not found.");
    }

    res.setHeader("Content-Type", iconAsset.mimeType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(iconAsset.data);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
      throw new HttpError(404, "Department not found.");
    }

    res.json(department);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const iconAsset = await saveDepartmentIcon(req.body?.iconDataUrl, req.body?.name);
    const departmentPayload = {
      ...req.body,
      icon: iconAsset ? `/api/departments/icon-assets/${iconAsset._id}` : String(req.body?.icon || "").trim()
    };

    delete departmentPayload.iconDataUrl;

    let department;

    try {
      department = await Department.create(departmentPayload);
    } catch (error) {
      if (iconAsset) {
        await DepartmentIcon.deleteOne({ _id: iconAsset._id });
      }

      throw error;
    }

    sendSuccess(res, {
      status: 201,
      message: "Department created successfully.",
      data: department.toObject?.() || department
    });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const iconAsset = await saveDepartmentIcon(req.body?.iconDataUrl, req.body?.name);
    const updatePayload = {
      ...req.body,
      ...(iconAsset ? { icon: `/api/departments/icon-assets/${iconAsset._id}` } : {})
    };

    delete updatePayload.iconDataUrl;

    const department = await Department.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true
    });

    if (!department) {
      if (iconAsset) {
        await DepartmentIcon.deleteOne({ _id: iconAsset._id });
      }

      throw new HttpError(404, "Department not found.");
    }

    sendSuccess(res, {
      message: "Department updated successfully.",
      data: department.toObject?.() || department
    });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
      throw new HttpError(404, "Department not found.");
    }

    const [doctorCount, appointmentCount] = await Promise.all([
      Doctor.countDocuments({ department: department._id }),
      Appointment.countDocuments({
        department: department._id,
        status: { $in: ["pending", "confirmed"] }
      })
    ]);

    if (doctorCount > 0 || appointmentCount > 0) {
      throw new HttpError(
        409,
        "Department cannot be deleted while doctors or active appointments still belong to it."
      );
    }

    await Department.deleteOne({ _id: department._id });
    sendSuccess(res, { message: "Department deleted successfully." });
  })
);

export default router;
