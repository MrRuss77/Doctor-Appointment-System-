import React from "react";

const iconWrapStyle = {
  width: "26px",
  height: "26px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px"
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

const OtpPanel = ({ onResendCode }) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <span style={iconWrapStyle}>🚑</span>
        <div style={{ width: "1px", height: "24px", background: "rgba(17, 24, 39, 0.2)" }} />
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 500 }}>Reset Password</h2>
      </div>

      <div style={{ marginTop: "26px", fontSize: "11px", color: "#374151" }}>Enter the OTP code</div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginTop: "10px" }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <input key={index} type="text" maxLength={1} style={otpInputStyle} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button type="button" style={primaryButtonStyle}>Enter</button>
      </div>

      <div style={{ textAlign: "center", marginTop: "12px", fontSize: "10px", color: "#4b5563" }}>
        <div>Didn't receive a code ?</div>
        <button type="button" style={{ ...linkButtonStyle, marginTop: "4px" }} onClick={onResendCode}>
          Resend code
        </button>
      </div>
    </div>
  );
};

export default OtpPanel;
