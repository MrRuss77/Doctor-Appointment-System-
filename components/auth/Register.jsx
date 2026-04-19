import React, { useState } from "react";
import "./Register.css";

const Register = ({ onBackToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePhoneInput = (value) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }

    if (cleaned.length > 3) {
      cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    }

    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://10.24.9.81:5001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: "+977 " + phone,
          password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        alert("Registered successfully");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const message =
          typeof data === "string"
            ? data
            : data.message || data.error || "Registration failed";

        alert(`Error ${response.status}: ${message}`);
      }
    } catch (error) {
      alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>

          {/* Header inside box */}
          <div className="form-header">
            <span className="logo">🚑</span>
            <div className="divider"></div>
            <h2>Register</h2>
          </div>

          <input
            type="text"
            placeholder="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number"
            required
            value={phone}
            onChange={(e) => setPhone(handlePhoneInput(e.target.value))}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Register</button>

          {/* Login link (text style) */}
          <div className="login-link">
            Already have an account?
            <span className="login-text" onClick={onBackToLogin}>
              Login
            </span>
          </div>

        </form>
      </div>

      <div className="footer">© 2026 Doctris. All Rights Reserved.</div>
    </>
  );
};

export default Register;