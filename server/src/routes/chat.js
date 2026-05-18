import express from "express";
import Groq from "groq-sdk";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import ChatHistory from "../models/ChatHistory.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import {
  formatDateKey,
  formatTimeLabel,
  getNextAvailabilityText,
  isAppointmentWithinAvailability,
  normalizeAvailabilitySlots
} from "../utils/availability.js";

const router = express.Router();

const systemInstruction = `You are MediCare, the virtual assistant for this Doctor Appointment Booking System. You must stay within the context of this platform and related healthcare appointment support.

ABOUT THIS PLATFORM:
- Patients can search for doctors by department, availability, and profile details
- Patients can book appointments online and view their appointment history
- Doctors manage their own availability schedules and consultation fees in their panel
- The available departments are Anesthesiology, Dentistry, Physiatry, Gynecology, Cardiology, Neurology, Pediatrics, Orthopedics, and ENT (Ear, Nose & Throat)
- The platform is available 24/7 but doctors have specific working hours and available slots
- The clinic location is Naxal
- For emergencies, always direct users to call emergency services or visit the nearest hospital

YOUR PERSONALITY AND RULES:
- Be warm, empathetic, and professional
- Give concise answers — short if the question is simple, detailed only when truly needed
- Never give long bullet-point lists unless the user specifically asks for them
- Never introduce yourself as a large language model, generic AI assistant, or external chatbot
- Present yourself only as MediCare, the virtual assistant for this Doctor Appointment Booking System
- Never repeat yourself or add unnecessary disclaimers on every single message
- You can remind users to see a doctor once per conversation, not in every reply
- If the user tells you their name, remember it and use it naturally in conversation
- If the user describes symptoms, acknowledge them briefly and guide them to book an appointment
- Use the live website data provided below when answering about doctors, departments, availability, appointments, patients, or admin information
- If users ask for doctors, departments, platform features, or what you can do, answer directly from the live website context
- Never make up specific doctor names, times, prices, appointment counts, or patient details
- If asked for topics outside this platform or healthcare appointment support, politely steer back to booking, departments, doctors, navigation, or care guidance available here
- Keep responses human and conversational, not robotic

USER CONTEXT:
{{USER_CONTEXT}}

LIVE WEBSITE CONTEXT:
{{WEBSITE_CONTEXT}}`;

let groqInstance = null;
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in .env");
  }
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
};

const defaultMessage = {
  role: "assistant",
  content: "Hi! I'm MediCare, the virtual assistant for this Doctor Appointment Booking System. How can I help you today?"
};

const cleanChatMessages = (messages = []) =>
  messages
    .filter((m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim()
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim()
    }));

const getValidUserId = (value) => {
  const userId = String(value || "").trim();
  return mongoose.Types.ObjectId.isValid(userId) ? userId : "";
};

const escapeRegExp = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getUserDisplayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.email || "there";

const startOfDay = (date = new Date()) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const endOfDay = (date = new Date()) => {
  const nextDate = new Date(date);
  nextDate.setHours(23, 59, 59, 999);
  return nextDate;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));

const formatTimeFromDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const platformFeatures = [
  "Browse departments and doctors",
  "Filter doctors by department",
  "View doctor profiles, fees, and available slots",
  "Book appointment requests as a logged-in patient",
  "View patient appointment history and status",
  "Let doctors view appointments and manage availability slots",
  "Let admins manage doctors, departments, patients, and appointments",
  "OTP-based password reset",
  "Role-based patient, doctor, and admin dashboards"
];

const appointmentLine = (appointment) => {
  const patientName = getUserDisplayName(appointment.patient);
  const doctorName = appointment.doctor?.fullName || "Doctor not assigned";
  const status = appointment.status || "pending";
  const reason = appointment.reason || "General consultation";
  return `${formatDateLabel(appointment.appointmentDate)} at ${formatTimeFromDate(
    appointment.appointmentDate
  )} - ${patientName} with Dr. ${doctorName.replace(/^Dr\.\s*/i, "")} (${status}, ${reason})`;
};

const slotLine = (slot) => {
  const note = slot.note ? `, ${slot.note}` : "";
  return `${slot.date}: ${formatTimeLabel(slot.startTime)}-${formatTimeLabel(slot.endTime)}${
    slot.isAvailable === false ? " (unavailable)" : ""
  }${note}`;
};

const findDoctorForUser = async (user) => {
  if (!user) return null;

  const userId = String(user._id || "");
  const email = normalizeText(user.email);
  const fullName = normalizeText(getUserDisplayName(user).replace(/^Dr\.\s*/i, ""));

  return Doctor.findOne({
    $or: [
      { user: userId },
      ...(email ? [{ email }] : []),
      ...(fullName ? [{ fullName: new RegExp(`^\\s*(Dr\\.\\s*)?${escapeRegExp(fullName)}\\s*$`, "i") }] : [])
    ]
  })
    .populate("department")
    .populate("user");
};

const getCurrentUser = async (userId) => {
  const validUserId = getValidUserId(userId);
  if (!validUserId) return null;
  return User.findById(validUserId);
};

const buildWebsiteContext = async (user) => {
  const [departments, doctors, appointmentCount] = await Promise.all([
    Department.find().sort({ name: 1 }).lean(),
    Doctor.find().populate("department").sort({ fullName: 1 }).lean(),
    Appointment.countDocuments()
  ]);

  const doctorSummary = doctors.slice(0, 20).map((doctor) => {
    const slots = normalizeAvailabilitySlots(doctor.availabilitySlots || []);
    const availability = slots.length ? getNextAvailabilityText(slots) : doctor.availabilityText || "No availability added yet";
    return `Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")} (${doctor.department?.name || doctor.specialization}, fee ${doctor.consultationFee || 0}, ${availability})`;
  });

  return [
    "Clinic location: Naxal.",
    `Departments: ${departments.map((department) => department.name).join(", ") || "none listed"}.`,
    `Doctors: ${doctorSummary.join("; ") || "none listed"}.`,
    `Total appointments in the system: ${appointmentCount}.`,
    user ? `Logged-in role: ${user.role}.` : "Logged-in role: guest."
  ].join("\n");
};

const saveHistory = async ({ userId, messages }) => {
  const validUserId = getValidUserId(userId);

  if (validUserId && (await User.exists({ _id: validUserId }))) {
    await ChatHistory.findOneAndUpdate(
      { user: validUserId },
      { user: validUserId, messages: messages.slice(-80) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
};

const buildChatResponse = async ({ res, userId, cleanMessages, reply }) => {
  const nextMessages = [...cleanMessages, { role: "assistant", content: reply }];
  await saveHistory({ userId, messages: nextMessages });
  return res.json({ reply, messages: nextMessages });
};

const parseRequestedDate = (message) => {
  const text = normalizeText(message);
  const today = new Date();

  if (/\btoday\b/.test(text)) return startOfDay(today);
  if (/\btomorrow\b/.test(text)) return startOfDay(addDays(today, 1));

  const isoMatch = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (isoMatch) {
    const date = new Date(`${isoMatch[1]}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const slashMatch = text.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](20\d{2}))?\b/);
  if (slashMatch) {
    const year = slashMatch[3] || String(today.getFullYear());
    const month = slashMatch[1].padStart(2, "0");
    const day = slashMatch[2].padStart(2, "0");
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const requestedWeekday = weekdays.findIndex((day) => new RegExp(`\\b${day}\\b`).test(text));

  if (requestedWeekday >= 0) {
    const date = startOfDay(today);
    const daysUntil = (requestedWeekday - date.getDay() + 7) % 7 || 7;
    return addDays(date, daysUntil);
  }

  return null;
};

const parseRequestedTime = (message) => {
  const text = normalizeText(message);
  const match =
    text.match(/\b(?:at|around|time)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/) ||
    text.match(/\b(\d{1,2})(?::(\d{2}))\s*(am|pm)?\b/) ||
    text.match(/\b(\d{1,2})\s*(am|pm)\b/) ||
    text.match(/\b(?:today|tomorrow|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s+(\d{1,2})\b/);

  if (!match) return "";

  let hour = Number(match[1]);
  const minute = Number(match[2] || "0");
  const meridiem = match[3];

  if (hour > 23 || minute > 59) return "";
  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const parseReason = (message) => {
  const text = String(message || "").trim();
  const reasonMatch = text.match(/\b(?:for|because of|due to|reason is|reason:)\s+(.+)$/i);
  const reason = reasonMatch?.[1]?.replace(/\b(?:with|at|on|tomorrow|today)\b.*$/i, "").trim();
  return reason && reason.length >= 5 ? reason : "General consultation";
};

const findMentionedDepartment = (message, departments = []) => {
  const text = normalizeText(message);
  return departments.find((department) => {
    const name = normalizeText(department.name);
    if (!name) return false;

    if (name.length <= 3) {
      return new RegExp(`\\b${escapeRegExp(name)}\\b`, "i").test(text);
    }

    return text.includes(name);
  });
};

const findMentionedDoctor = (message, doctors = []) => {
  const text = normalizeText(message).replace(/\bdr\.\s*/g, "dr ");
  return doctors.find((doctor) => {
    const fullName = normalizeText(doctor.fullName).replace(/\bdr\.\s*/g, "dr ");
    const withoutPrefix = fullName.replace(/^dr\s+/, "");
    const lastName = withoutPrefix.split(/\s+/).pop();
    return text.includes(fullName) || text.includes(withoutPrefix) || (lastName && text.includes(`dr ${lastName}`));
  });
};

const isBookingIntent = (message) =>
  /\b(book|schedule|reserve|make)\b/i.test(message) && /\b(appointment|consultation|visit|slot)\b/i.test(message);

const isLocationIntent = (message) => /\b(location|address|where are you|where is|located)\b/i.test(message);

const isFeatureIntent = (message) =>
  /\b(features?|services?|what can you do|capabilities|functionality|things? (?:you|this|website|platform) can do)\b/i.test(
    message
  );

const describeDoctor = (doctor) => {
  const slots = normalizeAvailabilitySlots(doctor.availabilitySlots || []);
  const availability = slots.length
    ? getNextAvailabilityText(slots)
    : doctor.availabilityText || "No availability added yet";
  const fee = Number(doctor.consultationFee || 0);

  return `Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")} - ${
    doctor.department?.name || doctor.specialization
  }, ${doctor.specialization}, fee ${fee}, ${availability}`;
};

const handlePlatformData = async ({ message }) => {
  const text = normalizeText(message);
  const wantsFeatures = isFeatureIntent(message);
  const wantsDoctors =
    /\b(doctors?|specialists?|physicians?|consultants?)\b/.test(text) &&
    /\b(list|show|give|want|need|who|available|from|in|all|here)\b/.test(text);
  const wantsDepartments =
    /\bdepartments?\b/.test(text) && /\b(list|show|give|want|need|available|all|what)\b/.test(text);

  if (wantsFeatures) {
    return `Here are the main MediCare features:\n${platformFeatures.map((feature) => `- ${feature}`).join("\n")}`;
  }

  if (wantsDepartments) {
    const departments = await Department.find().sort({ name: 1 });
    return `Departments:\n${departments.map((department) => department.name).join("\n") || "No departments found."}`;
  }

  if (!wantsDoctors) return "";

  const departments = await Department.find().sort({ name: 1 });
  const requestedDepartment = findMentionedDepartment(message, departments);
  const filters = {};

  if (requestedDepartment) {
    filters.department = requestedDepartment._id;
  }

  const doctors = await Doctor.find(filters).populate("department").sort({ fullName: 1 });
  const label = requestedDepartment ? `${requestedDepartment.name} doctors` : "Doctors";

  if (doctors.length === 0) {
    return `No ${label.toLowerCase()} are listed right now.`;
  }

  return `${label}:\n${doctors.map(describeDoctor).join("\n")}`;
};

const handlePatientBooking = async ({ message, user, forceBooking = false }) => {
  if (!forceBooking && !isBookingIntent(message)) return "";

  if (!user || user.role !== "patient") {
    return "I can help book appointments for logged-in patients. Please log in as a patient first, then tell me the doctor or department, date, time, and reason.";
  }

  const [departments, doctors] = await Promise.all([
    Department.find().sort({ name: 1 }),
    Doctor.find().populate("department").sort({ fullName: 1 })
  ]);

  const requestedDepartment = findMentionedDepartment(message, departments);
  const requestedDoctor = findMentionedDoctor(message, doctors);
  const requestedDate = parseRequestedDate(message);
  const requestedTime = parseRequestedTime(message);

  const matchingDoctors = requestedDoctor
    ? [requestedDoctor]
    : doctors.filter((doctor) => String(doctor.department?._id || doctor.department) === String(requestedDepartment?._id));

  if (!requestedDoctor && !requestedDepartment) {
    const departmentNames = departments.map((department) => department.name).join(", ");
    return `I can book it here. Which department or doctor should I use? Available departments are ${departmentNames}.`;
  }

  if (matchingDoctors.length === 0) {
    return "I could not find an active doctor for that department yet. Please choose another department or doctor.";
  }

  const doctor = requestedDoctor || matchingDoctors[0];
  const slots = normalizeAvailabilitySlots(doctor.availabilitySlots || []).filter((slot) => slot.isAvailable !== false);
  const nextSlots = slots.slice(0, 5).map(slotLine).join("\n");

  if (!requestedDate || !requestedTime) {
    return `I found Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")}. Tell me the date and time you want, or pick one of these slots:\n${nextSlots || "No available slots are published yet."}`;
  }

  const dateKey = formatDateKey(requestedDate);
  const appointmentDate = new Date(`${dateKey}T${requestedTime}:00`);

  if (Number.isNaN(appointmentDate.getTime())) {
    return "Please send the date and time in a clear format, like 2026-05-20 at 10:30 AM.";
  }

  if (!isAppointmentWithinAvailability(appointmentDate, slots)) {
    return `That time is outside Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")}'s available slots. Available slots:\n${nextSlots || "No available slots are published yet."}`;
  }

  const conflict = await Appointment.findOne({
    doctor: doctor._id,
    appointmentDate,
    status: { $in: ["pending", "confirmed"] }
  });

  if (conflict) {
    return `That exact slot is already booked. Please choose another time from Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")}'s available slots:\n${nextSlots}`;
  }

  const appointment = await Appointment.create({
    patient: user._id,
    doctor: doctor._id,
    department: doctor.department?._id || doctor.department,
    appointmentDate,
    reason: parseReason(message),
    status: "pending"
  });

  await appointment.populate("patient doctor department");

  return `Done - I booked your appointment request with Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")} for ${formatDateLabel(
    appointment.appointmentDate
  )} at ${formatTimeFromDate(appointment.appointmentDate)}. Status: pending.`;
};

const handlePatientData = async ({ message, user }) => {
  if (!user || user.role !== "patient") return "";

  const wantsAppointments =
    /\b(my|mine|history|status|upcoming|booked|view|show|list)\b/i.test(message) &&
    /\b(appointment|appointments|booking|bookings)\b/i.test(message);

  if (!wantsAppointments) return "";

  const appointments = await Appointment.find({ patient: user._id })
    .populate("patient doctor department")
    .sort({ appointmentDate: 1, createdAt: -1 })
    .limit(12);

  if (appointments.length === 0) {
    return "You do not have any appointments booked yet.";
  }

  return `Your appointments:\n${appointments.map(appointmentLine).join("\n")}`;
};

const handleDoctorData = async ({ message, user }) => {
  if (!user || user.role !== "doctor") return "";

  const doctor = await findDoctorForUser(user);

  if (!doctor) {
    return "";
  }

  const wantsAppointments = /\b(appointment|appointments|schedule|patients?)\b/i.test(message);
  const wantsToday = /\btoday\b/i.test(message);
  const wantsSlots = /\b(slot|slots|availability|available|free time|free slots|working hours)\b/i.test(message);

  if (wantsSlots) {
    const slots = normalizeAvailabilitySlots(doctor.availabilitySlots || []);
    if (slots.length === 0) {
      return "You have not added any availability slots yet.";
    }
    return `Your availability slots are:\n${slots.map(slotLine).join("\n")}`;
  }

  if (wantsAppointments) {
    const filters = { doctor: doctor._id };
    if (wantsToday) {
      filters.appointmentDate = { $gte: startOfDay(), $lte: endOfDay() };
    }

    const appointments = await Appointment.find(filters)
      .populate("patient doctor department")
      .sort({ appointmentDate: 1 });

    if (appointments.length === 0) {
      return wantsToday ? "You do not have any appointments today." : "You do not have any appointments listed right now.";
    }

    const title = wantsToday ? "Your appointments today:" : "Your appointments:";
    return `${title}\n${appointments.slice(0, 12).map(appointmentLine).join("\n")}`;
  }

  return "";
};

const handleAdminData = async ({ message, user }) => {
  if (!user || user.role !== "admin") return "";

  const text = normalizeText(message);

  if (/\b(summary|dashboard|overview|stats|statistics|count|counts)\b/.test(text)) {
    const [doctorCount, patientCount, departmentCount, appointmentCount, pendingCount] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "patient" }),
      Department.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" })
    ]);

    return `Admin overview: ${doctorCount} doctors, ${patientCount} patients, ${departmentCount} departments, ${appointmentCount} appointments, and ${pendingCount} pending appointment requests.`;
  }

  if (/\bdepartments?\b/.test(text)) {
    const departments = await Department.find().sort({ name: 1 });
    return `Departments:\n${departments.map((department) => department.name).join("\n") || "No departments found."}`;
  }

  if (/\bdoctors?\b/.test(text)) {
    const doctors = await Doctor.find().populate("department").sort({ fullName: 1 });
    return `Doctors:\n${doctors
      .slice(0, 20)
      .map((doctor) => `Dr. ${doctor.fullName.replace(/^Dr\.\s*/i, "")} - ${doctor.department?.name || doctor.specialization}`)
      .join("\n") || "No doctors found."}`;
  }

  if (/\bpatients?|users?\b/.test(text)) {
    const patients = await User.find({ role: "patient" }).sort({ createdAt: -1 }).limit(20);
    return `Patients:\n${patients.map((patient) => `${getUserDisplayName(patient)} - ${patient.email}`).join("\n") || "No patients found."}`;
  }

  if (/\bappointments?\b/.test(text)) {
    const appointments = await Appointment.find()
      .populate("patient doctor department")
      .sort({ appointmentDate: 1, createdAt: -1 })
      .limit(20);

    return `Appointments:\n${appointments.map(appointmentLine).join("\n") || "No appointments found."}`;
  }

  return "";
};

const getSmartReply = async ({ message, user, cleanMessages = [] }) => {
  if (isLocationIntent(message)) {
    return "The clinic is located in Naxal.";
  }

  const recentUserMessage = cleanMessages
    .filter((item) => item.role === "user")
    .slice(-4)
    .map((item) => item.content)
    .join(". ");
  const platformReply = await handlePlatformData({ message: recentUserMessage || message });
  if (platformReply) return platformReply;

  const previousAssistantMessage = [...cleanMessages]
    .reverse()
    .find((item) => item.role === "assistant")?.content || "";
  const continuingBooking =
    user?.role === "patient" &&
    /\b(i can book|tell me the date and time|pick one of these slots|which department or doctor)\b/i.test(
      previousAssistantMessage
    );
  const bookingMessage = continuingBooking
    ? cleanMessages
        .filter((item) => item.role === "user")
        .slice(-6)
        .map((item) => item.content)
        .join(". ")
    : message;

  const patientReply = await handlePatientBooking({
    message: bookingMessage,
    user,
    forceBooking: continuingBooking
  });

  if (patientReply) return patientReply;

  const roleHandlers = [handlePatientData, handleDoctorData, handleAdminData];

  for (const handler of roleHandlers) {
    const reply = await handler({ message, user });
    if (reply) return reply;
  }

  return "";
};

router.get("/history", async (req, res, next) => {
  try {
    const userId = getValidUserId(req.query.userId);

    if (!userId) {
      return res.json({ messages: [defaultMessage] });
    }

    const history = await ChatHistory.findOne({ user: userId });
    return res.json({
      messages: history?.messages?.length ? history.messages : [defaultMessage]
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { messages, userContext, userId } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required." });
    }

    const cleanMessages = cleanChatMessages(messages);

    const lastMessage = cleanMessages[cleanMessages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return res.status(400).json({ message: "Last message must be from the user." });
    }

    const currentUser = await getCurrentUser(userId);
    const smartReply = await getSmartReply({
      message: lastMessage.content,
      user: currentUser,
      cleanMessages
    });

    if (smartReply) {
      return buildChatResponse({
        res,
        userId,
        cleanMessages,
        reply: smartReply
      });
    }

    const websiteContext = await buildWebsiteContext(currentUser);

    const filledInstruction = systemInstruction.replace(
      "{{USER_CONTEXT}}",
      userContext || "The user is a guest and has not logged in."
    ).replace(
      "{{WEBSITE_CONTEXT}}",
      websiteContext
    );

    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: filledInstruction },
        ...cleanMessages
      ]
    });

    const reply = response.choices[0].message.content;
    return buildChatResponse({
      res,
      userId,
      cleanMessages,
      reply
    });

  } catch (error) {
    console.error("Chat error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to get MediCare response."
    });
  }
});

export default router;
