import crypto from "crypto";

export const generateOTP = () => String(crypto.randomInt(100000, 1000000));

export const hashOTP = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");
