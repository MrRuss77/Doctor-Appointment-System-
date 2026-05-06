import React, { useState } from "react";
import "./login.css";

const AuthIcon = () => (
  <svg viewBox="0 0 64 64" className="auth-icon" fill="currentColor">
    <path d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"/>
  </svg>
);

const RegisterCard = ({ onRegister, onBackToLogin }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
    setMessage("");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const requiredFields = [
      form.fullName,
      form.email,
      form.phone,
      form.password,
      form.confirmPassword
    ];

    if (requiredFields.some((value) => !value.trim())) {
      setMessage("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const nameParts = form.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    onRegister?.({
      firstName,
      lastName,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password
    });
  };

  return (
    <div className="register-page">
      <div className="register-card auth-card">
        <div className="auth-header">
          <AuthIcon />
          <div className="auth-divider"></div>
          <h2 className="auth-title">Register</h2>
        </div>

        <form onSubmit={handleRegister}>
          <label>
            Full Name
            <input 
              type="text" 
              value={form.fullName} 
              onChange={(e) => updateField("fullName", e.target.value)} 
            />
          </label>

          <label>
            Email Address
            <input 
              type="email" 
              value={form.email} 
              onChange={(e) => updateField("email", e.target.value)} 
            />
          </label>

          <label>
            Phone Number
            <input 
              type="text" 
              value={form.phone} 
              onChange={(e) => updateField("phone", e.target.value)} 
            />
          </label>

          <label>
            Password
            <input 
              type="password" 
              value={form.password} 
              onChange={(e) => updateField("password", e.target.value)} 
            />
          </label>

          <label>
            Confirm Password
            <input 
              type="password" 
              value={form.confirmPassword} 
              onChange={(e) => updateField("confirmPassword", e.target.value)} 
            />
          </label>

          <button type="submit">Register</button>
        </form>

        {message && (
          <div style={{ marginTop: "16px", textAlign: "center", fontSize: "13px", color: "#ef4444" }}>
            {message}
          </div>
        )}

        <div className="login-link">
          Already have an account? <span onClick={onBackToLogin}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterCard;
