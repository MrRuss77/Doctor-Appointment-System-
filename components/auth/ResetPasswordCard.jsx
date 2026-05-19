import React, { useEffect, useRef, useState } from "react";
import "./login.css";

const AuthIcon = () => (
  <svg viewBox="0 0 64 64" className="auth-icon" fill="currentColor">
    <path d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"/>
  </svg>
);

const ResetPasswordCard = ({
  step = "email",
  onBackToLogin,
  onSubmitEmail,
  onSubmitPasswords,
  resetEmailError = "",
  onDismissResetEmailError
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [message, setMessage] = useState("");
  const emailInputRef = useRef(null);
  const dismissButtonRef = useRef(null);

  const closeResetEmailError = () => {
    onDismissResetEmailError?.();
    window.requestAnimationFrame(() => {
      emailInputRef.current?.focus();
    });
  };

  useEffect(() => {
    if (!resetEmailError) {
      return undefined;
    }

    dismissButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeResetEmailError();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [resetEmailError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === "email") {
      if (!email.trim()) {
        setMessage("Please enter your email address.");
        return;
      }
      setMessage("");
      onSubmitEmail?.(email.trim());
    } else if (step === "password") {
      if (!password.trim() || !verifyPassword.trim()) {
        setMessage("Please fill both password fields.");
        return;
      }
      if (password !== verifyPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      if (password.trim().length < 6) {
        setMessage("Password must be at least 6 characters long.");
        return;
      }
      setMessage("");
      onSubmitPasswords?.({ password, verifyPassword });
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card auth-card">
        <div className="auth-header">
          <AuthIcon />
          <div className="auth-divider"></div>
          <h2 className="auth-title">Reset Password</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {step === "email" ? (
            <label>
              Email Address
              <input
                type="email"
                ref={emailInputRef}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                  onDismissResetEmailError?.();
                }}
              />
            </label>
          ) : (
            <>
              <label>
                New Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage("");
                  }}
                />
              </label>

              <label>
                Verify New Password
                <input
                  type="password"
                  value={verifyPassword}
                  onChange={(e) => {
                    setVerifyPassword(e.target.value);
                    setMessage("");
                  }}
                />
              </label>
            </>
          )}

          <button type="submit">{step === "email" ? "Send OTP" : "Reset Password"}</button>
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

      {resetEmailError ? (
        <div className="auth-error-dialog" role="presentation">
          <div
            className="auth-error-dialog__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-email-error-title"
          >
            <p className="auth-error-dialog__eyebrow">Password reset</p>
            <h2 id="reset-email-error-title">Invalid Email</h2>
            <p className="auth-error-dialog__text">{resetEmailError}</p>
            <div className="auth-error-dialog__actions">
              <button type="button" ref={dismissButtonRef} onClick={closeResetEmailError}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResetPasswordCard;
