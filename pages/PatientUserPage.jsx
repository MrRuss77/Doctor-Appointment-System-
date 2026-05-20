import React, { useEffect, useMemo, useState } from "react";
import { fetchAppointments, updateAppointment } from "../src/api/client";
import CustomStatusDropdown from "../components/admin/CustomStatusDropdown";
import ConfirmDialog from "../components/ConfirmDialog";

const formatAppointmentDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

function PatientUserPage({ authUser }) {
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [historyFeedback, setHistoryFeedback] = useState("");
  const [busyId, setBusyId] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);

  const fullName = `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim();
  const patientEmail = String(authUser?.email || "").trim().toLowerCase();

  const patientInfo = {
    name: fullName || authUser?.name || "Patient User",
    phone: authUser?.phone || "Not provided",
    email: authUser?.email || "Not provided",
    age: authUser?.age || "Not provided",
    gender: authUser?.gender || "Not provided"
  };

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const appointments = await fetchAppointments();

        if (!active) {
          return;
        }

        const matchedAppointments = appointments.filter((appointment) => {
          const appointmentEmail = String(appointment.patient?.email || "").trim().toLowerCase();
          const appointmentPatientId = String(appointment.patient?._id || appointment.patient || "");
          const authPatientId = String(authUser?._id || authUser?.id || "");

          if (patientEmail && appointmentEmail && patientEmail === appointmentEmail) {
            return true;
          }

          if (authPatientId && appointmentPatientId && authPatientId === appointmentPatientId) {
            return true;
          }

          return false;
        });

        setAppointmentHistory(
          matchedAppointments.sort(
            (left, right) => new Date(right.appointmentDate || 0) - new Date(left.appointmentDate || 0)
          )
        );
        setHistoryFeedback("");
      } catch (error) {
        if (active) {
          setHistoryFeedback(error.message);
          setAppointmentHistory([]);
        }
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, [authUser, patientEmail]);

  const refreshHistory = async () => {
    const appointments = await fetchAppointments();

    const matchedAppointments = appointments.filter((appointment) => {
      const appointmentEmail = String(appointment.patient?.email || "").trim().toLowerCase();
      const appointmentPatientId = String(appointment.patient?._id || appointment.patient || "");
      const authPatientId = String(authUser?._id || authUser?.id || "");

      if (patientEmail && appointmentEmail && patientEmail === appointmentEmail) {
        return true;
      }

      if (authPatientId && appointmentPatientId && authPatientId === appointmentPatientId) {
        return true;
      }

      return false;
    });

    setAppointmentHistory(
      matchedAppointments.sort(
        (left, right) => new Date(right.appointmentDate || 0) - new Date(left.appointmentDate || 0)
      )
    );
  };

  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") {
      return appointmentHistory;
    }

    return appointmentHistory.filter(
      (appointment) => String(appointment.status || "").toLowerCase() === historyFilter
    );
  }, [appointmentHistory, historyFilter]);

  const getStatusTone = (status) => String(status || "pending").toLowerCase();

  const closeCancelDialog = () => {
    if (busyId) {
      return;
    }

    setCancelTarget(null);
  };

  const handleCancelAppointment = async () => {
    const appointment = cancelTarget;

    if (!appointment?._id) {
      return;
    }

    setBusyId(appointment._id);
    setHistoryFeedback("");

    try {
      const response = await updateAppointment(appointment._id, {
        patient: appointment.patient?._id || appointment.patient,
        doctor: appointment.doctor?._id || appointment.doctor,
        department: appointment.department?._id || appointment.department,
        appointmentDate: appointment.appointmentDate,
        reason: appointment.reason,
        notes: appointment.notes,
        status: "cancelled",
        respondedByRole: "patient"
      });

      setHistoryFeedback(response.message || "Appointment cancelled successfully.");
      setCancelTarget(null);
      await refreshHistory();
    } catch (error) {
      setHistoryFeedback(error.message);
    } finally {
      setBusyId("");
    }
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
            {historyFeedback ? <p className="patient-history-feedback">{historyFeedback}</p> : null}

            <div className="patient-history-toolbar">
              <label className="patient-history-filter">
                <span>Status</span>
                <CustomStatusDropdown
                  value={historyFilter}
                  onChange={(val) => setHistoryFilter(val)}
                  options={[
                    { value: "all", label: "ALL" },
                    { value: "pending", label: "PENDING" },
                    { value: "confirmed", label: "CONFIRMED" },
                    { value: "cancelled", label: "CANCELLED" },
                    { value: "rejected", label: "REJECTED" },
                    { value: "completed", label: "COMPLETED" }
                  ]}
                  filterPending={false}
                />
              </label>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="patient-history-list">
                {filteredHistory.map((appointment, index) => (
                  <div key={appointment._id} className="patient-history-row">
                    <div>
                      <strong>{appointment.doctor?.fullName || "Doctor not assigned"}</strong>
                      <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                      <span>{`Visit #${filteredHistory.length - index}`}</span>
                      {Array.isArray(appointment.feedbackEntries) && appointment.feedbackEntries.length > 0 ? (
                        <span>
                          Latest Feedback:{" "}
                          {appointment.feedbackEntries[appointment.feedbackEntries.length - 1]?.diagnosis || "Added"}
                        </span>
                      ) : (
                        <span>No doctor feedback added yet.</span>
                      )}
                    </div>

                    <div
                      className={`patient-history-status patient-history-status--${getStatusTone(
                        appointment.status
                      )}`}
                    >
                      <span className="patient-status-badge" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                        {String(appointment.status || "pending")}
                      </span>
                    </div>

                    <div
                      className={`patient-history-status-note patient-history-status-note--${getStatusTone(
                        appointment.status
                      )}`}
                    >
                      Status: {String(appointment.status || "pending")}
                    </div>

                    {["pending", "confirmed"].includes(String(appointment.status || "").toLowerCase()) ? (
                      <button
                        type="button"
                        className="admin-btn-pill red"
                        onClick={() => {
                          setHistoryFeedback("");
                          setCancelTarget(appointment);
                        }}
                        disabled={busyId === appointment._id}
                      >
                        {busyId === appointment._id ? "Cancelling..." : "Cancel"}
                      </button>
                    ) : null}
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

      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        eyebrow="Appointment cancellation"
        title="Cancel this appointment?"
        message={`This will cancel your appointment with ${cancelTarget?.doctor?.fullName || "the selected doctor"} on ${
          cancelTarget ? formatAppointmentDate(cancelTarget.appointmentDate) : "the selected date"
        }. The doctor panel will show this appointment as cancelled.`}
        confirmLabel="Cancel Appointment"
        cancelLabel="Keep Appointment"
        confirmTone="danger"
        onCancel={closeCancelDialog}
        onConfirm={handleCancelAppointment}
        busy={busyId === cancelTarget?._id}
      />
    </section>
  );
}

export default PatientUserPage;
