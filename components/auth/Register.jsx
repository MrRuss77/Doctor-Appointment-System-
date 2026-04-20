// Importing React and useState hook for managing component state
import React, { useState } from "react";
// Importing CSS file for styling the Register component
import "./Register.css";

// Functional component for Register form, receives onBackToLogin as prop
const Register = ({ onBackToLogin }) => {
  // State variables for storing user input values
  const [firstName, setFirstName] = useState(""); // Stores first name
  const [lastName, setLastName] = useState(""); // Stores last name
  const [email, setEmail] = useState(""); // Stores email address
  const [phone, setPhone] = useState(""); // Stores phone number
  const [password, setPassword] = useState(""); // Stores password
  const [confirmPassword, setConfirmPassword] = useState(""); // Stores confirm password

  // Function to handle phone input formatting
  const handlePhoneInput = (value) => {
    // Remove all non-numeric characters
    let cleaned = value.replace(/\D/g, "");

    // Limit phone number to 10 digits
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }

    // Add dash after first 3 digits for formatting (e.g., 980-1234567)
    if (cleaned.length > 3) {
      cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    }

    return cleaned;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Sending POST request to backend API
      const response = await fetch("http://192.168.1.195:5001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Setting content type as JSON
        },
        // Converting user data into JSON format
        body: JSON.stringify({
          firstName: firstName.trim(), // Removing extra spaces
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(), // Converting email to lowercase
          phone: "+977 " + phone, // Adding country code
          password,
        }),
      });

      // Get response content type
      const contentType = response.headers.get("content-type") || "";
      let data;

      // Parse response based on content type
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Check if request was successful
      if (response.ok) {
        alert("Registered successfully");

        // Reset form fields after successful registration
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } else {
        // Handle error response
        const message =
          typeof data === "string"
            ? data
            : data.message || data.error || "Registration failed";

        alert(`Error ${response.status}: ${message}`);
      }
    } catch (error) {
      // Catch network or server errors
      alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <>
      <div className="container">
        {/* Form element with submit handler */}
        <form onSubmit={handleSubmit}>

          {/* Header section inside form */}
          <div className="form-header">
            <span className="logo">🚑</span> {/* Logo icon */}
            <div className="divider"></div> {/* Divider line */}
            <h2>Register</h2> {/* Form title */}
          </div>

          {/* First Name input field */}
          <input
            type="text"
            placeholder="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          {/* Last Name input field */}
          <input
            type="text"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          {/* Email input field */}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Phone number input field with formatting */}
          <input
            type="text"
            placeholder="Phone Number"
            required
            value={phone}
            onChange={(e) => setPhone(handlePhoneInput(e.target.value))}
          />

          {/* Password input field */}
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Confirm Password input field */}
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Submit button */}
          <button type="submit">Register</button>

          {/* Link to switch back to login form */}
          <div className="login-link">
            Already have an account?
            <span className="login-text" onClick={onBackToLogin}>
              Login
            </span>
          </div>

        </form>
      </div>

      {/* Footer section */}
      <div className="footer">© 2026 Doctris. All Rights Reserved.</div>
    </>
  );
};

// Exporting the Register component
export default Register;