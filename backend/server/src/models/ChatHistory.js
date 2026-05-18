import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Chat message cannot be longer than 2000 characters."]
    }
  },
  {
    _id: false,
    timestamps: true
  }
);

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    messages: {
      type: [chatMessageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;
