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

export const sendAppointmentConfirmationEmail = async (toEmail, { patientName, doctorName, dateLabel, appointmentType, meetLink }) => {
  const transporter = createTransporter();
  const isOnline = appointmentType === "online";

  const meetSection = isOnline && meetLink
    ? `<div style="margin: 20px 0; text-align: center;">
        <a href="${meetLink}" target="_blank"
           style="display: inline-block; background: #1a73e8; color: #fff; text-decoration: none;
                  font-weight: 700; padding: 14px 28px; border-radius: 10px; font-size: 15px;">
          Join Google Meet
        </a>
        <p style="margin: 10px 0 0; color: #617694; font-size: 13px;">${meetLink}</p>
      </div>`
    : `<p style="margin: 8px 0 0; color: #617694;">Location: Naxal Clinic (in-person visit)</p>`;

  const typeBadge = isOnline
    ? `<span style="background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 700;
                    padding: 3px 10px; border-radius: 20px; vertical-align: middle;">ONLINE</span>`
    : `<span style="background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700;
                    padding: 3px 10px; border-radius: 20px; vertical-align: middle;">IN-PERSON</span>`;

  await transporter.sendMail({
    from: `"MediCare" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your MediCare Appointment is Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f5f8ff; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px; border: 1px solid #dbe7ff;">
          <h2 style="margin: 0 0 6px; color: #10233d;">Appointment Confirmed</h2>
          <p style="margin: 0 0 18px; color: #617694;">Hi ${patientName}, your appointment has been confirmed.</p>

          <div style="background: #f8faff; border-radius: 10px; padding: 16px; margin-bottom: 18px;">
            <p style="margin: 0 0 6px; color: #10233d;"><strong>Doctor:</strong> ${doctorName}</p>
            <p style="margin: 0 0 6px; color: #10233d;"><strong>Date &amp; Time:</strong> ${dateLabel}</p>
            <p style="margin: 0; color: #10233d;"><strong>Type:</strong> ${typeBadge}</p>
          </div>

          ${meetSection}

          <p style="margin: 18px 0 0; color: #617694; font-size: 13px;">
            If you need to reschedule or cancel, please log in to your MediCare account.
          </p>
        </div>
      </div>
    `
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
