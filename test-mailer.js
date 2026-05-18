import dotenv from "dotenv";
dotenv.config();
import { sendOTPEmail } from "./server/src/utils/mailer.js";

const run = async () => {
  try {
    await sendOTPEmail("np03cs4s250049@heraldcollege.edu.np", "123456");
    console.log("Success");
  } catch (e) {
    console.error("Error:", e);
  }
};
run();
