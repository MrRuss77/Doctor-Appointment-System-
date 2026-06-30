import React, { useEffect, useState } from "react";
import { fetchAppointment } from "../src/api/client";

function PaymentSuccess({ appointmentId, onNavigate }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(Boolean(appointmentId));

  useEffect(() => {
    if (!appointmentId) return;

    fetchAppointment(appointmentId)
      .then((data) => setAppointment(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

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
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>✓</div>
        <div style={{
          display: "inline-block",
          background: "#dcfce7",
          color: "#166534",
          fontWeight: "700",
          fontSize: "13px",
          padding: "4px 14px",
          borderRadius: "20px",
          marginBottom: "16px"
        }}>
          Payment Successful
        </div>
        <h2 style={{ marginBottom: "8px", color: "#111827" }}>Appointment Booked!</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Your payment was received and your appointment request has been submitted. The doctor will confirm your slot shortly.
        </p>

        {loading ? (
          <p style={{ color: "#9ca3af" }}>Loading appointment details...</p>
        ) : appointment ? (
          <div style={{
            background: "#f9fafb",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left"
          }}>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Doctor</span>
              <div style={{ fontWeight: "600" }}>{appointment.doctor?.fullName || "—"}</div>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Date & Time</span>
              <div style={{ fontWeight: "600" }}>{formatDate(appointment.appointmentDate)}</div>
            </div>
            {appointment.amountPaid > 0 && (
              <div>
                <span style={{ color: "#6b7280", fontSize: "13px" }}>Amount Paid</span>
                <div style={{ fontWeight: "600", color: "#166534" }}>Rs. {Number(appointment.amountPaid).toLocaleString()}</div>
              </div>
            )}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => onNavigate("patient-profile")}
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
          View My Appointments
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

export default PaymentSuccess;
