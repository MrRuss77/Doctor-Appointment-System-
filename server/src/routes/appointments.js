import express from "express";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  formatDateKey,
  formatTimeLabel,
  getNextAvailabilityText,
  isAppointmentWithinAvailability
} from "../utils/availability.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createMeetEvent, deleteMeetEvent } from "../utils/googleCalendar.js";
import HttpError from "../utils/httpError.js";
import { sendAppointmentConfirmationEmail } from "../utils/mailer.js";

const router = express.Router();

const populateAppointment = (query) =>
  query.read("primary").populate("patient").populate("doctor").populate("department");

const ensureAppointmentRelations = async ({ patient, doctor, department }) => {
  const [patientRecord, doctorRecord, departmentRecord] = await Promise.all([
    User.findById(patient),
    Doctor.findById(doctor),
    Department.findById(department)
  ]);

  if (!patientRecord) {
    throw new HttpError(404, "Patient record not found.");
  }

  if (!doctorRecord) {
    throw new HttpError(404, "Doctor record not found.");
  }

  if (!departmentRecord) {
    throw new HttpError(404, "Department record not found.");
  }

  if (String(doctorRecord.department) !== String(departmentRecord._id)) {
    throw new HttpError(400, "Selected doctor does not belong to the selected department.");
  }

  return { patientRecord, doctorRecord, departmentRecord };
};

const ensureAppointmentFitsAvailability = (doctorRecord, appointmentDate) => {
  if (appointmentDate <= new Date()) {
    throw new HttpError(400, "Please choose a future appointment date and time.");
  }

  const availabilitySlots = doctorRecord.availabilitySlots || [];

  if (availabilitySlots.length === 0) {
    throw new HttpError(
      400,
      "This doctor has not published any availability yet. Please choose another doctor or ask the doctor to add slots."
    );
  }

  if (!isAppointmentWithinAvailability(appointmentDate, availabilitySlots)) {
    throw new HttpError(
      400,
      `Selected appointment time is outside the doctor's availability. ${getNextAvailabilityText(availabilitySlots)}`
    );
  }
};

const ensureNoBookingConflict = async ({ appointmentId, doctorId, appointmentDate }) => {
  const existingAppointment = await Appointment.findOne({
    _id: { $ne: appointmentId },
    doctor: doctorId,
    appointmentDate,
    status: { $in: ["pending", "confirmed"] }
  });

  if (existingAppointment) {
    throw new HttpError(
      409,
      `This slot is already booked for ${formatDateKey(appointmentDate)} at ${formatTimeLabel(
        `${String(appointmentDate.getHours()).padStart(2, "0")}:${String(
          appointmentDate.getMinutes()
        ).padStart(2, "0")}`
      )}.`
    );
  }
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filters = {};

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.doctor) {
      filters.doctor = req.query.doctor;
    }

    if (req.query.patient) {
      filters.patient = req.query.patient;
    }

    const query = Appointment.find(filters).sort({ appointmentDate: 1, createdAt: -1 });
    const appointments = await populateAppointment(query);
    res.json(appointments);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const appointment = await populateAppointment(Appointment.findById(req.params.id));

    if (!appointment) {
      throw new HttpError(404, "Appointment not found.");
    }

    res.json(appointment);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.body.patient) {
      throw new HttpError(400, "Patient is required.");
    }

    if (!req.body.doctor) {
      throw new HttpError(400, "Doctor is required.");
    }

    if (!req.body.department) {
      throw new HttpError(400, "Department is required.");
    }

    if (!String(req.body.reason || "").trim()) {
      throw new HttpError(400, "Appointment reason is required.");
    }

    const appointmentDate = new Date(req.body.appointmentDate);

    if (Number.isNaN(appointmentDate.getTime())) {
      throw new HttpError(400, "Please provide a valid appointment date and time.");
    }

    const { doctorRecord } = await ensureAppointmentRelations(req.body);
    ensureAppointmentFitsAvailability(doctorRecord, appointmentDate);
    await ensureNoBookingConflict({
      doctorId: doctorRecord._id,
      appointmentDate
    });

    const appointment = new Appointment({
      ...req.body,
      appointmentDate,
      status: req.body.status || "pending"
    });
    await appointment.save({ w: "majority" });

    const populatedAppointment = await populateAppointment(Appointment.findById(appointment._id));

    sendSuccess(res, {
      status: 201,
      message: "Appointment request submitted successfully.",
      data: populatedAppointment.toObject?.() || populatedAppointment
    });
  })
);

router.put(
  "/:id/respond",
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new HttpError(404, "Appointment not found.");
    }

    const allowedStatuses = ["confirmed", "rejected", "cancelled", "completed"];

    if (!allowedStatuses.includes(req.body.status)) {
      throw new HttpError(
        400,
        "Status must be one of confirmed, rejected, cancelled, or completed."
      );
    }

    appointment.status = req.body.status;
    appointment.adminReply = String(req.body.adminReply || "").trim();
    appointment.respondedByRole = req.body.respondedByRole || "admin";
    appointment.respondedAt = new Date();

    if (req.body.status === "confirmed" && appointment.appointmentType === "online") {
      try {
        const populatedForMeet = await populateAppointment(Appointment.findById(appointment._id));
        const patientEmail = populatedForMeet?.patient?.email || "";
        const doctorEmail = populatedForMeet?.doctor?.email || "";
        const doctorName = populatedForMeet?.doctor?.fullName || "Doctor";
        const patientName = [
          populatedForMeet?.patient?.firstName,
          populatedForMeet?.patient?.lastName
        ].filter(Boolean).join(" ") || "Patient";

        const startISO = new Date(appointment.appointmentDate).toISOString();
        const endISO = new Date(new Date(appointment.appointmentDate).getTime() + 30 * 60 * 1000).toISOString();

        const { eventId, meetLink } = await createMeetEvent({
          title: `MediCare: ${patientName} with ${doctorName}`,
          description: appointment.reason || "Medical consultation",
          startISO,
          endISO,
          attendeeEmails: [patientEmail, doctorEmail]
        });

        appointment.meetLink = meetLink;
        appointment.calendarEventId = eventId;

        if (meetLink) {
          const dateLabel = new Date(appointment.appointmentDate).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
          });

          const emailPayload = {
            doctorName,
            patientName,
            dateLabel,
            appointmentType: "online",
            meetLink
          };

          await Promise.allSettled([
            sendAppointmentConfirmationEmail(patientEmail, emailPayload),
            sendAppointmentConfirmationEmail(doctorEmail, emailPayload)
          ]);
        }
      } catch (meetError) {
        console.error("Meet event creation failed:", meetError.message);
      }
    }

    if (["cancelled", "rejected"].includes(req.body.status) && appointment.calendarEventId) {
      await deleteMeetEvent(appointment.calendarEventId);
      appointment.meetLink = "";
      appointment.calendarEventId = "";
    }

    await appointment.save({ w: "majority" });

    const populatedAppointment = await populateAppointment(Appointment.findById(appointment._id));

    const statusMessageMap = {
      confirmed: "Appointment confirmed successfully.",
      rejected: "Appointment rejected successfully.",
      cancelled: "Appointment cancelled successfully.",
      completed: "Appointment marked as completed successfully."
    };

    sendSuccess(res, {
      message: statusMessageMap[appointment.status],
      data: populatedAppointment.toObject?.() || populatedAppointment
    });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new HttpError(404, "Appointment not found.");
    }

    if (!String(req.body.reason ?? appointment.reason ?? "").trim()) {
      throw new HttpError(400, "Appointment reason is required.");
    }

    const nextPatient = req.body.patient || appointment.patient;
    const nextDoctor = req.body.doctor || appointment.doctor;
    const nextDepartment = req.body.department || appointment.department;
    const nextAppointmentDate = req.body.appointmentDate
      ? new Date(req.body.appointmentDate)
      : appointment.appointmentDate;
    const previousAppointmentTime = appointment.appointmentDate?.toISOString?.() || "";
    const nextStatus = String(req.body.status || appointment.status || "").toLowerCase();
    const isCancelling = nextStatus === "cancelled";

    if (Number.isNaN(nextAppointmentDate.getTime())) {
      throw new HttpError(400, "Please provide a valid appointment date and time.");
    }

    if (!isCancelling) {
      const { doctorRecord } = await ensureAppointmentRelations({
        patient: nextPatient,
        doctor: nextDoctor,
        department: nextDepartment
      });

      ensureAppointmentFitsAvailability(doctorRecord, nextAppointmentDate);
      await ensureNoBookingConflict({
        appointmentId: appointment._id,
        doctorId: doctorRecord._id,
        appointmentDate: nextAppointmentDate
      });
    }

    Object.assign(appointment, {
      ...req.body,
      patient: nextPatient,
      doctor: nextDoctor,
      department: nextDepartment,
      appointmentDate: nextAppointmentDate
    });

    if (req.body.status && ["confirmed", "rejected", "cancelled", "completed"].includes(req.body.status)) {
      appointment.respondedAt = new Date();
      appointment.respondedByRole = req.body.respondedByRole || "admin";
    }

    await appointment.save({ w: "majority" });

    const populatedAppointment = await populateAppointment(Appointment.findById(appointment._id));
    const wasRescheduled = previousAppointmentTime !== nextAppointmentDate.toISOString();

    const normalizedStatus = String(appointment.status || "").toLowerCase();
    const message =
      normalizedStatus === "cancelled"
        ? "Appointment cancelled successfully."
        : wasRescheduled
          ? "Appointment rescheduled successfully."
        : "Appointment updated successfully.";

    sendSuccess(res, {
      message,
      data: populatedAppointment.toObject?.() || populatedAppointment
    });
  })
);

router.post(
  "/:id/feedback",
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new HttpError(404, "Appointment not found.");
    }

    const diagnosis = String(req.body?.diagnosis || "").trim();
    const remarks = String(req.body?.remarks || "").trim();
    const prescription = String(req.body?.prescription || "").trim();

    if (!diagnosis) {
      throw new HttpError(400, "Diagnosis is required.");
    }

    appointment.feedbackEntries.push({
      diagnosis,
      remarks,
      prescription,
      createdByRole: req.body?.createdByRole || "doctor"
    });

    await appointment.save({ w: "majority" });

    const populatedAppointment = await populateAppointment(Appointment.findById(appointment._id));

    sendSuccess(res, {
      status: 201,
      message: "Feedback added successfully.",
      data: populatedAppointment.toObject?.() || populatedAppointment
    });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      throw new HttpError(404, "Appointment not found.");
    }

    sendSuccess(res, { message: "Appointment deleted successfully." });
  })
);

export { ensureAppointmentRelations, ensureAppointmentFitsAvailability, ensureNoBookingConflict };
export default router;
