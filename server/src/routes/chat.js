import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const systemInstruction = `You are MediCare, the AI health assistant for an online doctor appointment platform.

ABOUT THIS PLATFORM:
- Patients can search for doctors by specialty, location, and availability
- Patients can book, reschedule, and cancel appointments online
- Doctors available include general practitioners, cardiologists, pediatricians, dermatologists, and more
- Patients can view their appointment history and medical records on the platform
- The platform is available 24/7 but doctors have specific working hours
- For emergencies, always direct users to call emergency services or visit the nearest hospital

YOUR PERSONALITY AND RULES:
- Be warm, empathetic, and professional
- Give concise answers — short if the question is simple, detailed only when truly needed
- Never give long bullet-point lists unless the user specifically asks for them
- Never repeat yourself or add unnecessary disclaimers on every single message
- You can remind users to see a doctor once per conversation, not in every reply
- If the user tells you their name, remember it and use it naturally in conversation
- If the user describes symptoms, acknowledge them briefly and guide them to book an appointment
- If the user asks about available doctors, guide them to use the search/filter feature on the platform
- Never make up specific doctor names, times, or prices
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

router.post("/", async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required." });
    }

    const cleanMessages = messages
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
    return res.json({ reply });

  } catch (error) {
    console.error("Groq error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to get MediCare response."
    });
  }
});

export default router;
