import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDatabase from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();