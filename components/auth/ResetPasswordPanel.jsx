import React from "react";

const iconWrapStyle = {
  width: "26px",
  height: "26px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px"
};

const inputStyle = {
  width: "100%",
  height: "34px",
  border: "none",
  borderRadius: "999px",
  padding: "0 14px",
  background: "#fff",
  color: "#111827",
  outline: "none",
  marginTop: "8px"
};

const labelStyle = {
  display: "block",
  marginTop: "14px",
  fontSize: "11px",
  color: "#374151"
};

const primaryButtonStyle = {
  minWidth: "84px",
  height: "30px",
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

const ResetPasswordPanel = ({ onBackToLogin }) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
        <span style={iconWrapStyle}>🚑</span>
        <div style={{ width: "1px", height: "24px", background: "rgba(17, 24, 39, 0.2)" }} />
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 500 }}>Reset Password</h2>
      </div>

      <label style={labelStyle}>
        Email:
        <input type="email" style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Phone Number:
        <input type="text" style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Password:
        <input type="password" style={inputStyle} />
      </label>

      <label style={labelStyle}>
        Verify Password:
        <input type="password" style={inputStyle} />
      </label>

      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <button type="button" style={primaryButtonStyle}>Reset</button>
      </div>

      <div style={{ textAlign: "center", marginTop: "14px", fontSize: "11px", color: "#374151" }}>
        <div>Already have an account ?</div>
        <button type="button" style={{ ...linkButtonStyle, marginTop: "4px" }} onClick={onBackToLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPanel;
