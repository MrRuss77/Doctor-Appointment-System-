import express from "express";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import createCrudRouter from "../utils/createCrudRouter.js";
import appointmentsRouter from "./appointments.js";
import authRouter from "./auth.js";
import chatRouter from "./chat.js";
import departmentsRouter from "./departments.js";
import doctorsRouter from "./doctors.js";
import paymentsRouter from "./payments.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "API is running." });
});

router.use("/auth", authRouter);
router.use("/chat", chatRouter);
router.use("/users", createCrudRouter(User));
router.use("/departments", departmentsRouter);
router.use("/doctors", doctorsRouter);
router.use("/appointments", appointmentsRouter);
router.use("/payments", paymentsRouter);
router.use("/registrations", createCrudRouter(Registration, ["user"]));

export default router;
