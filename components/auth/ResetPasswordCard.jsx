import React, { useState } from "react";

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

const ResetPasswordCard = ({ onBackToLogin, onReset, onBack }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = () => {
    if (!email.trim() || !phone.trim() || !password.trim() || !verifyPassword.trim()) {
      setMessage("Please fill all fields.");
      return;
    }

    if (password !== verifyPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Reset form is ready.");
    onReset?.({
      email: email.trim(),
      phone: phone.trim(),
      password,
      verifyPassword
    });
  };

  return (
    <div className="auth-card__content">
      <div className="auth-card__header" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
        <span style={iconWrapStyle}>
          <BrandMark />
        </span>
        <div style={{ width: "1px", height: "24px", background: "rgba(17, 24, 39, 0.2)" }} />
        <h2 className="auth-card__title" style={{ margin: 0, fontSize: "20px", fontWeight: 500 }}>Reset Password</h2>
      </div>

      <label className="auth-card__label" style={labelStyle}>
        Email:
        <input
          className="auth-card__input"
          type="email"
          style={inputStyle}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setMessage("");
          }}
        />
      </label>

      <label className="auth-card__label" style={labelStyle}>
        Phone Number:
        <input
          className="auth-card__input"
          type="text"
          style={inputStyle}
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            setMessage("");
          }}
        />
      </label>

      <label className="auth-card__label" style={labelStyle}>
        Password:
        <input
          className="auth-card__input"
          type="password"
          style={inputStyle}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setMessage("");
          }}
        />
      </label>

      <label className="auth-card__label" style={labelStyle}>
        Verify Password:
        <input
          className="auth-card__input"
          type="password"
          style={inputStyle}
          value={verifyPassword}
          onChange={(event) => {
            setVerifyPassword(event.target.value);
            setMessage("");
          }}
        />
      </label>

      <div className="auth-card__actions" style={{ textAlign: "center", marginTop: "18px" }}>
        <button className="auth-card__button" type="button" style={primaryButtonStyle} onClick={handleReset}>
          Reset
        </button>
      </div>

      {message ? (
        <div style={{ marginTop: "10px", textAlign: "center", fontSize: "11px", color: "#1d4ed8" }}>
          {message}
        </div>
      ) : null}

      <div className="auth-card__footer" style={{ textAlign: "center", marginTop: "14px", fontSize: "11px", color: "#374151" }}>
        <div>Already have an account ?</div>
        <button className="auth-card__link" type="button" style={{ ...linkButtonStyle, marginTop: "4px" }} onClick={onBackToLogin}>
          Login
        </button>
        <div style={{ marginTop: "12px" }}>
          <button className="auth-card__link" type="button" style={linkButtonStyle} onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordCard;
