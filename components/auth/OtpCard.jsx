import React, { useRef, useState } from "react";
import "./login.css";

const AuthIcon = () => (
  <svg viewBox="0 0 64 64" className="auth-icon" fill="currentColor">
    <path d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"/>
  </svg>
);

const OtpCard = ({ onResendCode, onSubmitOtp }) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanValue;
    setOtpDigits(nextDigits);
    setMessage("");

    if (cleanValue && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join("");

    if (otpCode.length !== 6) {
      setMessage("Please enter the full 6-digit OTP.");
      return;
    }

    setMessage("");
    onSubmitOtp?.(otpCode);
  };

  return (
    <div className="otp-page">
      <div className="otp-card auth-card">
        <div className="auth-header">
          <AuthIcon />
          <div className="auth-divider"></div>
          <h2 className="auth-title">Reset Password</h2>
        </div>

        <div className="otp-subtitle">Enter the OTP code</div>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otpDigits[index]}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                style={{}}
              />
            ))}
          </div>

          <button type="submit">Enter</button>
        </form>

        {message && (
          <div style={{ marginTop: "16px", textAlign: "center", fontSize: "13px", color: "#ef4444" }}>
            {message}
          </div>
        )}

        <div className="login-link">
          <span onClick={onResendCode}>Resend OTP</span>
        </div>
      </div>
    </div>
  );
};

export default OtpCard;
