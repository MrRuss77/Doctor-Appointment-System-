import express from "express";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import createCrudRouter from "../utils/createCrudRouter.js";
import authRouter from "./auth.js";
import chatRouter from "./chat.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "API is running." });
});

router.use("/auth", authRouter);
router.use("/chat", chatRouter);
router.use("/users", createCrudRouter(User));
router.use("/departments", createCrudRouter(Department));

router.get("/doctors/search", async (req, res, next) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      const doctors = await Doctor.find().populate("department").sort({ createdAt: -1 });
      return res.json(doctors);
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
      .sort({ fullName: 1 });

    return res.json(doctors);
  } catch (error) {
    return next(error);
  }
});

router.use("/doctors", createCrudRouter(Doctor, ["department"]));
router.use(
  "/appointments",
  createCrudRouter(Appointment, ["patient", "doctor", "department"])
);
router.use("/registrations", createCrudRouter(Registration, ["user"]));

export default router;
