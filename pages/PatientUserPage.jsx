import React, { useState } from "react";

function PatientUserPage({ authUser }) {
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointmentHistory, setAppointmentHistory] = useState([
      {
    id: "appt-1",
    doctor: "John Smith",
    reason: "Regular Checkup",
    date: "2026-04-08",
    time: "10:00 PM"
  },
  {
    id: "appt-2",
    doctor: "Subashna Maskey",
    reason: "Stomachache",
    date: "2026-04-08",
    time: "10:00 PM"
  }
  ]);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  const fullName = `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim();

  const patientInfo = {
    name: fullName || authUser?.name || "Patient User",
    phone: authUser?.phone || "Not provided",
    email: authUser?.email || "Not provided",
    age: authUser?.age || "Not provided",
    gender: authUser?.gender || "Not provided"
  };

  const getAppointmentDateTime = (appointment) => {
    if (appointment.date && appointment.time) {
      return `${appointment.date} at ${appointment.time}`;
    }

    return appointment.date || appointment.time || "Date and time not provided";
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
  };

  const handleCloseCancelPopup = () => {
    setAppointmentToCancel(null);
  };

  const handleConfirmCancelAppointment = async () => {
    if (!appointmentToCancel?.id) {
      return;
    }

    /*
      Backend connection later:

      try {
        const response = await fetch(`/api/appointments/${appointmentToCancel.id}/cancel`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to cancel appointment");
        }

        setAppointmentHistory((currentAppointments) =>
          currentAppointments.filter(
            (appointment) => appointment.id !== appointmentToCancel.id
          )
        );

        setAppointmentToCancel(null);
        setShowCancelSuccess(true);
      } catch (error) {
        console.error("Cancel appointment error:", error);
        alert("Unable to cancel appointment. Please try again.");
      }
    */

    setAppointmentHistory((currentAppointments) =>
      currentAppointments.filter(
        (appointment) => appointment.id !== appointmentToCancel.id
      )
    );

    setAppointmentToCancel(null);
    setShowCancelSuccess(true);
  };

  const handleCloseSuccessPopup = () => {
    setShowCancelSuccess(false);
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
                    <div className="patient-history-row__details">
                      <strong>{appointment.doctor}</strong>
                      <span>{appointment.reason || "Appointment"}</span>
                      <span className="patient-history-row__datetime">
                        {getAppointmentDateTime(appointment)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="patient-cancel-appointment-button"
                      onClick={() => handleCancelClick(appointment)}
                    >
                      <span className="patient-cancel-appointment-button__icon">×</span>
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

      {appointmentToCancel && (
        <div className="patient-cancel-modal-overlay" role="presentation">
          <div
            className="patient-cancel-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-appointment-title"
          >
            <div className="patient-cancel-modal__icon patient-cancel-modal__icon--warning">
              !
            </div>

            <h2 id="cancel-appointment-title" className="patient-cancel-modal__title">
              Cancel Appointment ?
            </h2>

            <p className="patient-cancel-modal__text">
              Are you sure you want to cancel this appointment?
            </p>

            <button
              type="button"
              className="patient-cancel-modal__button"
              onClick={handleConfirmCancelAppointment}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showCancelSuccess && (
        <div className="patient-cancel-modal-overlay" role="presentation">
          <div
            className="patient-cancel-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-success-title"
          >
            <div className="patient-cancel-modal__icon patient-cancel-modal__icon--success">
              ✓
            </div>

            <h2 id="cancel-success-title" className="patient-cancel-modal__title">
              Appointment Cancelled Successfully!
            </h2>

            <p className="patient-cancel-modal__text">
              Your appointment has been cancelled successfully.
            </p>

            <button
              type="button"
              className="patient-cancel-modal__button"
              onClick={handleCloseSuccessPopup}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default PatientUserPage;