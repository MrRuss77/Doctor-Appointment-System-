import express from "express";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import HttpError from "../utils/httpError.js";

const router = express.Router();

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
    const department = await Department.create(req.body);
    res.status(201).json({
      ...(department.toObject?.() || department),
      message: "Department created successfully."
    });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!department) {
      throw new HttpError(404, "Department not found.");
    }

    res.json({
      ...(department.toObject?.() || department),
      message: "Department updated successfully."
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
    res.json({ message: "Department deleted successfully." });
  })
);

export default router;
