import React, { useState } from "react";

function PatientUserPage({ authUser }) {
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  const fullName = `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim();

  const patientInfo = {
    name: fullName || authUser?.name || "Patient User",
    phone: authUser?.phone || "Not provided",
    email: authUser?.email || "Not provided",
    age: authUser?.age || "Not provided",
    gender: authUser?.gender || "Not provided"
  };

  const handleCancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your appointment?"
    );

    if (!confirmCancel) {
      return;
    }

    /*
      Backend connection later:

      try {
        const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to cancel appointment");
        }

        setAppointmentHistory((currentAppointments) =>
          currentAppointments.filter((appointment) => appointment.id !== appointmentId)
        );
      } catch (error) {
        console.error("Cancel appointment error:", error);
        alert("Unable to cancel appointment. Please try again.");
      }
    */
  };

  return (
    <section className="patient-user-page">
      <article className="patient-user-card">
        <h2>Personal Information</h2>
        <div className="patient-user-divider" />

        <div className="patient-user-info-grid">
          <div className="patient-user-info-item">
            <strong>Name</strong>
            <span>{patientInfo.name}</span>
          </div>

          <div className="patient-user-info-item">
            <strong>Phone</strong>
            <span>{patientInfo.phone}</span>
          </div>

          <div className="patient-user-info-item">
            <strong>Email</strong>
            <span>{patientInfo.email}</span>
          </div>

          <div className="patient-user-info-item">
            <strong>Age</strong>
            <span>{patientInfo.age}</span>
          </div>

          <div className="patient-user-info-item">
            <strong>Gender</strong>
            <span>{patientInfo.gender}</span>
          </div>
        </div>
      </article>

      <article className="patient-history-card">
        <div className="patient-history-card__copy">
          <h2>Appointment History</h2>
          <p>
            {showAppointments
              ? "Your appointment history is shown below."
              : "Click the button to view your booked appointments."}
          </p>
        </div>

        <button
          type="button"
          className="patient-view-history-button"
          onClick={() => setShowAppointments((current) => !current)}
        >
          {showAppointments ? "Hide Appointments" : "View Appointments"}
        </button>

        {showAppointments && (
          <div className="patient-history-result">
            {appointmentHistory.length > 0 ? (
              <div className="patient-history-list">
                {appointmentHistory.map((appointment) => (
                  <div key={appointment.id} className="patient-history-row">
                    <div>
                      <strong>{appointment.doctor}</strong>
                      <span>{appointment.date}</span>
                    </div>

                    <button
                      type="button"
                      className="patient-cancel-appointment-button"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="patient-history-empty-box">
                <h3>No appointments found</h3>
                <p>You have not booked any appointments yet!!</p>
              </div>
            )}
          </div>
        )}
      </article>
    </section>
  );
}

export default PatientUserPage;