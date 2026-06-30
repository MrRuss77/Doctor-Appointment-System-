import React from "react";

function PaymentFailure({ onNavigate }) {
  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        maxWidth: "480px",
        width: "100%",
        padding: "40px 32px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>✕</div>
        <div style={{
          display: "inline-block",
          background: "#fee2e2",
          color: "#991b1b",
          fontWeight: "700",
          fontSize: "13px",
          padding: "4px 14px",
          borderRadius: "20px",
          marginBottom: "16px"
        }}>
          Payment Failed
        </div>
        <h2 style={{ marginBottom: "8px", color: "#111827" }}>Payment Unsuccessful</h2>
        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          Your payment could not be completed. No charge has been made. Please try booking again.
        </p>

        <button
          type="button"
          onClick={() => onNavigate("doctors")}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 28px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Try Again
        </button>

        <button
          type="button"
          onClick={() => onNavigate("home")}
          style={{
            background: "none",
            color: "#6b7280",
            border: "none",
            marginTop: "12px",
            cursor: "pointer",
            fontSize: "14px",
            width: "100%"
          }}
        >
          Go to Home
        </button>
      </div>
    </section>
  );
}

export default PaymentFailure;
