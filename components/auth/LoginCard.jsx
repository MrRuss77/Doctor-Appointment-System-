import React, { useState } from "react";
import "./login.css";

const AuthIcon = () => (
  <svg viewBox="0 0 64 64" className="auth-icon" fill="currentColor">
    <path d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"/>
  </svg>
);

const LoginCard = ({ onLogin, onRegister, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin({ email, password });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card auth-card">

        <div className="auth-header">
          <AuthIcon />
          <div className="auth-divider"></div>
          <h2 className="auth-title">Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit">Login</button>
        </form>

        <a href="#" className="forgot" onClick={(e) => { e.preventDefault(); onForgotPassword?.(); }}>Forgot Password?</a>

        <p className="register">
          Don't have an account? <span onClick={onRegister} style={{ cursor: "pointer" }}>Register</span>
        </p>

      </div>
    </div>
  );
};

export default LoginCard;