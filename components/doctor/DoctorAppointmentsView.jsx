import React, { useEffect, useMemo, useState } from "react";
import {
  addAppointmentFeedback,
  fetchAppointments,
  updateAppointment
} from "../../src/api/client";
import {
  PatientDetailsModal,
  RescheduleAppointmentModal
} from "./DoctorModals";
import { findPatientRecordForAppointment } from "./patientHistory";

const formatTime = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No time";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
};

const normalizeName = (value = "") =>
  String(value)
    .replace(/^dr\.?\s*/i, "")
    .trim()
    .toLowerCase();

const startOfWeek = (date) => {
  const nextDate = new Date(date);
  const weekdayIndex = (nextDate.getDay() + 6) % 7;
  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() - weekdayIndex);
  return nextDate;
};

const endOfWeek = (date) => {
  const nextDate = startOfWeek(date);
  nextDate.setDate(nextDate.getDate() + 7);
  return nextDate;
};

const DoctorAppointmentsView = ({ authUser, doctorProfile }) => {
  const [appointments, setAppointments] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleError, setRescheduleError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [modalFeedbackError, setModalFeedbackError] = useState("");
  const [modalFeedbackSuccess, setModalFeedbackSuccess] = useState("");

  const loadAppointments = async () => {
    const filters = doctorProfile?._id ? { doctor: doctorProfile._id } : {};
    const data = await fetchAppointments(filters);
    setAppointments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let active = true;

    loadAppointments().catch((error) => {
      if (active) {
        setFeedback(error.message);
      }
    });

    return () => {
      active = false;
    };
  }, [doctorProfile?._id]);

  const relevantAppointments = useMemo(() => {
    const doctorId = String(doctorProfile?._id || "");
    const authEmail = String(authUser?.email || "").trim().toLowerCase();
    const authFullName = normalizeName(
      [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") || authUser?.name || ""
    );

    return appointments.filter((appointment) => {
      const appointmentDoctorId = String(appointment.doctor?._id || appointment.doctor || "");
      const doctorEmail = String(appointment.doctor?.email || "").trim().toLowerCase();
      const doctorName = normalizeName(appointment.doctor?.fullName || "");

      if (doctorId && appointmentDoctorId && doctorId === appointmentDoctorId) {
        return true;
      }

      if (authEmail && doctorEmail && authEmail === doctorEmail) {
        return true;
      }

      return authFullName && doctorName && authFullName === doctorName;
    });
  }, [appointments, authUser, doctorProfile?._id]);

  const dashboardStats = useMemo(() => {
    const now = new Date();
    const todayKey = now.toDateString();
    const currentWeekStart = startOfWeek(now);
    const currentWeekEnd = endOfWeek(now);

    const appointmentsToday = relevantAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const status = String(appointment.status || "").toLowerCase();

      return (
        !Number.isNaN(appointmentDate.getTime()) &&
        appointmentDate.toDateString() === todayKey &&
        !["cancelled", "rejected"].includes(status)
      );
    }).length;

    const upcomingThisWeek = relevantAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const status = String(appointment.status || "").toLowerCase();

      return (
        !Number.isNaN(appointmentDate.getTime()) &&
        appointmentDate >= now &&
        appointmentDate >= currentWeekStart &&
        appointmentDate < currentWeekEnd &&
        ["pending", "confirmed"].includes(status)
      );
    }).length;

    const completedThisWeek = relevantAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const status = String(appointment.status || "").toLowerCase();

      return (
        !Number.isNaN(appointmentDate.getTime()) &&
        appointmentDate >= currentWeekStart &&
        appointmentDate < currentWeekEnd &&
        status === "completed"
      );
    }).length;

    const patientCount = new Set(
      relevantAppointments.map(
        (appointment) => appointment.patient?._id || appointment.patient?.email || appointment._id
      )
    ).size;

    return [
      { label: "Appointments Today", value: appointmentsToday, icon: "calendar" },
      { label: "Upcoming This Week", value: upcomingThisWeek, icon: "group" },
      { label: "Completed This Week", value: completedThisWeek, icon: "done" },
      { label: "Total Patients", value: patientCount, icon: "patients" }
    ];
  }, [relevantAppointments]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return relevantAppointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const status = String(appointment.status || "").toLowerCase();

        return (
          !Number.isNaN(appointmentDate.getTime()) &&
          appointmentDate > now &&
          ["pending", "confirmed"].includes(status)
        );
      })
      .sort((left, right) => new Date(left.appointmentDate) - new Date(right.appointmentDate));
  }, [relevantAppointments]);

  const visibleAppointments = upcomingAppointments.slice(0, 3);

  const selectedPatientRecord = useMemo(
    () => findPatientRecordForAppointment(relevantAppointments, selectedAppointmentId),
    [relevantAppointments, selectedAppointmentId]
  );

  const handleRescheduleSave = async ({ date, time }) => {
    if (!rescheduleTarget) {
      return;
    }

    if (!date) {
      setRescheduleError("Please choose a new appointment date.");
      return;
    }

    if (!time) {
      setRescheduleError("Please choose a new appointment time.");
      return;
    }

    const updatedDate = new Date(`${date}T${time}:00`);

    if (Number.isNaN(updatedDate.getTime())) {
      setRescheduleError("Please enter a valid appointment date and time.");
      return;
    }

    setBusyId(rescheduleTarget._id);
    setRescheduleError("");
    setFeedback("");

    try {
      const response = await updateAppointment(rescheduleTarget._id, {
        patient: rescheduleTarget.patient?._id || rescheduleTarget.patient,
        doctor: rescheduleTarget.doctor?._id || rescheduleTarget.doctor,
        department: rescheduleTarget.department?._id || rescheduleTarget.department,
        appointmentDate: updatedDate.toISOString(),
        reason: rescheduleTarget.reason,
        notes: rescheduleTarget.notes,
        status: "pending",
        respondedByRole: "doctor"
      });

      await loadAppointments();
      setFeedback(response.message || "Appointment rescheduled successfully.");
      setRescheduleTarget(null);
    } catch (error) {
      setRescheduleError(error.message);
    } finally {
      setBusyId("");
    }
  };

  const handleSaveFeedback = async (appointmentId, payload) => {
    setFeedbackBusy(true);
    setModalFeedbackError("");
    setModalFeedbackSuccess("");

    try {
      const response = await addAppointmentFeedback(appointmentId, {
        ...payload,
        createdByRole: "doctor"
      });

      await loadAppointments();
      setModalFeedbackSuccess(response.message || "Feedback added successfully.");
      return true;
    } catch (error) {
      setModalFeedbackError(error.message);
      return false;
    } finally {
      setFeedbackBusy(false);
    }
  };

  return (
    <div className="doctor-overview">
      <div className="doctor-section-head">
        <div>
          <h2 className="doctor-view-title">Dashboard Overview</h2>
        </div>
      </div>

      {feedback ? <p className="doctor-feedback" style={{ display: "block" }}>{feedback}</p> : null}

      <div className="doctor-overview-metrics">
        {dashboardStats.map((item) => (
          <article className="doctor-metric-card" key={item.label}>
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>
            <span className={`doctor-metric-card__icon doctor-metric-card__icon--${item.icon}`} aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="doctor-appointments-board doctor-appointments-board--dashboard">
        <h3>Upcoming Appointments</h3>

        {visibleAppointments.length > 0 ? (
          <div className="doctor-appointment-list">
            {visibleAppointments.map((appointment) => (
              <article className="doctor-appointment-card" key={appointment._id}>
                <div className="doctor-appointment-card__main">
                  <div className="doctor-appointment-card__patient">
                    <div className="doctor-appointment-card__header">
                      <h4>
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </h4>
                      <span className={`doctor-status doctor-status--${String(appointment.status || "pending").toLowerCase()}`}>
                        {String(appointment.status || "pending")}
                      </span>
                    </div>
                    <p>{appointment.reason || "General consultation"}</p>
                    <span>
                      {new Date(appointment.appointmentDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}{" "}
                      at {formatTime(appointment.appointmentDate)}
                    </span>
                  </div>
                </div>

                <div className="doctor-appointment-card__actions">
                  <button
                    type="button"
                    className="doctor-card-action doctor-card-action--reschedule"
                    onClick={() => {
                      setRescheduleTarget(appointment);
                      setRescheduleError("");
                    }}
                    disabled={busyId === appointment._id}
                  >
                    <span className="doctor-card-action__icon" aria-hidden="true">+</span>
                    {busyId === appointment._id ? "Working..." : "Reschedule"}
                  </button>

                  <button
                    type="button"
                    className="doctor-card-action doctor-card-action--view"
                    onClick={() => {
                      setSelectedAppointmentId(appointment._id);
                      setModalFeedbackError("");
                      setModalFeedbackSuccess("");
                    }}
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="doctor-empty-cell">No upcoming appointments available.</div>
        )}
      </div>

      {selectedPatientRecord ? (
        <PatientDetailsModal
          patient={selectedPatientRecord}
          initialAppointmentId={selectedAppointmentId}
          feedbackBusy={feedbackBusy}
          feedbackError={modalFeedbackError}
          feedbackSuccess={modalFeedbackSuccess}
          onSaveFeedback={handleSaveFeedback}
          onClose={() => {
            setSelectedAppointmentId("");
            setModalFeedbackError("");
            setModalFeedbackSuccess("");
          }}
        />
      ) : null}

      {rescheduleTarget ? (
        <RescheduleAppointmentModal
          appointment={rescheduleTarget}
          busy={busyId === rescheduleTarget._id}
          errorMessage={rescheduleError}
          onClose={() => {
            if (busyId !== rescheduleTarget._id) {
              setRescheduleTarget(null);
              setRescheduleError("");
            }
          }}
          onSave={handleRescheduleSave}
        />
      ) : null}
    </div>
  );
};

export default DoctorAppointmentsView;
