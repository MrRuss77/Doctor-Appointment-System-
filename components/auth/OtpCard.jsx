import React from "react";

const BrandMark = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" style={{ width: "22px", height: "22px", color: "#111827" }}>
    <path
      d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"
      fill="currentColor"
    />
  </svg>
);

const iconWrapStyle = {
  width: "26px",
  height: "26px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#111827"
};

const otpInputStyle = {
  width: "22px",
  height: "22px",
  borderRadius: "8px",
  border: "1px solid rgba(17, 24, 39, 0.35)",
  background: "#f3f4f6",
  textAlign: "center",
  outline: "none"
};

const primaryButtonStyle = {
  minWidth: "70px",
  height: "28px",
  border: "none",
  borderRadius: "999px",
  background: "#3772df",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600
};

const linkButtonStyle = {
  border: "none",
  background: "transparent",
  padding: 0,
  color: "#1d4ed8",
  cursor: "pointer",
  fontSize: "11px"
};

const OtpCard = ({ onResendCode, onSubmitOtp }) => {
  return (
    <div className="auth-card__content">
      <div className="auth-card__header" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <span style={iconWrapStyle}>
          <BrandMark />
        </span>
        <div style={{ width: "1px", height: "24px", background: "rgba(17, 24, 39, 0.2)" }} />
        <h2 className="auth-card__title" style={{ margin: 0, fontSize: "20px", fontWeight: 500 }}>Reset Password</h2>
      </div>

      <div className="auth-card__label" style={{ marginTop: "26px", fontSize: "11px", color: "#374151" }}>Enter the OTP code</div>

      <div className="auth-card__otp-row" style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginTop: "10px" }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <input className="auth-card__otp-input" key={index} type="text" maxLength={1} style={otpInputStyle} />
        ))}
      </div>

      <div className="auth-card__actions" style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="auth-card__button" type="button" style={primaryButtonStyle} onClick={onSubmitOtp}>
          Enter
        </button>
      </div>

      <div className="auth-card__footer" style={{ textAlign: "center", marginTop: "12px", fontSize: "10px", color: "#4b5563" }}>
        <div>Didn't receive a code ?</div>
        <button className="auth-card__link" type="button" style={{ ...linkButtonStyle, marginTop: "4px" }} onClick={onResendCode}>
          Resend code
        </button>
      </div>
    </div>
  );
};

export default OtpCard;
