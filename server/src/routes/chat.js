import express from "express";
import Groq from "groq-sdk";
import mongoose from "mongoose";
import ChatHistory from "../models/ChatHistory.js";
import User from "../models/User.js";

const router = express.Router();

const systemInstruction = `You are MediCare, the virtual assistant for this Doctor Appointment Booking System. You must stay within the context of this platform and related healthcare appointment support.

ABOUT THIS PLATFORM:
- Patients can search for doctors by department, availability, and profile details
- Patients can book appointments online and view their appointment history
- Doctors manage their own availability schedules and consultation fees in their panel
- The available departments are Anesthesiology, Dentistry, Physiatry, Gynecology, Cardiology, Neurology, Pediatrics, Orthopedics, and ENT (Ear, Nose & Throat)
- The platform is available 24/7 but doctors have specific working hours and available slots
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
- If the user asks about available doctors, guide them to use the search/filter feature on the platform
- Never make up specific doctor names, times, or prices
- If asked for topics outside this platform or healthcare appointment support, politely steer back to booking, departments, doctors, navigation, or care guidance available here
- Keep responses human and conversational, not robotic

USER CONTEXT:
{{USER_CONTEXT}}`;

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

    const filledInstruction = systemInstruction.replace(
      "{{USER_CONTEXT}}",
      userContext || "The user is a guest and has not logged in."
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
    const nextMessages = [...cleanMessages, { role: "assistant", content: reply }];
    const validUserId = getValidUserId(userId);

    if (validUserId && (await User.exists({ _id: validUserId }))) {
      await ChatHistory.findOneAndUpdate(
        { user: validUserId },
        { user: validUserId, messages: nextMessages.slice(-80) },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.json({ reply, messages: nextMessages });

  } catch (error) {
    console.error("Groq error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to get MediCare response."
    });
  }
});

export default router;
