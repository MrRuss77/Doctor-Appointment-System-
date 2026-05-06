import express from "express";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import createCrudRouter from "../utils/createCrudRouter.js";
import authRouter from "./auth.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "API is running." });
});

router.use("/auth", authRouter);
router.use("/users", createCrudRouter(User));
router.use("/departments", createCrudRouter(Department));
router.use("/doctors", createCrudRouter(Doctor, ["department"]));
router.use(
  "/appointments",
  createCrudRouter(Appointment, ["patient", "doctor", "department"])
);
router.use("/registrations", createCrudRouter(Registration, ["user"]));

export default router;
