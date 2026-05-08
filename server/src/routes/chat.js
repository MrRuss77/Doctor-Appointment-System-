import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const systemInstruction = `You are MediCare, a friendly and professional AI health assistant for a medical platform.
Help users with general health questions, appointment guidance, and navigating the platform.
Always be empathetic, clear, and remind users to consult a real doctor for medical advice.`;

const getChatModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction
  });
};

const toGeminiMessage = (message) => ({
  role: message.role === "assistant" ? "model" : "user",
  parts: [{ text: message.content }]
});

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required." });
    }

    const cleanMessages = messages
      .filter((message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim()
      )
      .map((message) => ({
        role: message.role,
        content: message.content.trim()
      }));

    const lastMessage = cleanMessages[cleanMessages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return res.status(400).json({ message: "Last message must be from the user." });
    }

    const history = cleanMessages.slice(0, -1).map(toGeminiMessage);

    while (history[0]?.role === "model") {
      history.shift();
    }

    const model = getChatModel();
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);

    return res.json({ reply: result.response.text() });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to get MediCare response."
    });
  }
});

export default router;
