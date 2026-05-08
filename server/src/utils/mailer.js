import nodemailer from "nodemailer";

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

export const sendOTPEmail = async (toEmail, otp) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"MediCare" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your MediCare OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f5f8ff; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px; border: 1px solid #dbe7ff;">
          <h2 style="margin: 0 0 12px; color: #10233d;">Your OTP code</h2>
          <p style="margin: 0 0 18px; color: #617694; line-height: 1.6;">
            Use this one-time code to verify your MediCare account. It expires in 10 minutes.
          </p>
          <div style="font-size: 32px; letter-spacing: 8px; font-weight: 700; color: #3468c8; background: #eef5ff; border-radius: 12px; padding: 16px; text-align: center;">
            ${otp}
          </div>
          <p style="margin: 18px 0 0; color: #617694; font-size: 13px; line-height: 1.6;">
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    `
  });
};
