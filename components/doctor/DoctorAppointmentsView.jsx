import React, { useEffect, useMemo, useState } from "react";
import { PatientDetailsModal } from "./DoctorModals";
import { fetchAppointments, updateAppointment } from "../../src/api/client";

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

const formatIsoDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toISOString().slice(0, 10);
};

const formatTimeInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "09:00";
  }

  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const normalizeName = (value = "") =>
  String(value)
    .replace(/^dr\.?\s*/i, "")
    .trim()
    .toLowerCase();

const buildFallbackAppointments = (authUser) => [
  {
    _id: "demo-appointment-1",
    patient: {
      firstName: "Demo",
      lastName: "Patient",
      email: "demo.patient@example.com",
      phone: "9800000001"
    },
    doctor: {
      fullName: [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") || authUser?.name || "Doctor",
      email: authUser?.email || ""
    },
    department: {
      name: authUser?.department || authUser?.specialization || "General"
    },
    appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    reason: "General consultation",
    notes: "Requested by: Demo Patient | Phone: 9800000001 | Email: demo.patient@example.com | Address: Kathmandu | Gender: other | Blood Group: O+ | Age: 24"
  }
];

const DoctorAppointmentsView = ({ authUser, doctorProfile }) => {
  const [appointments, setAppointments] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [busyId, setBusyId] = useState("");

  const loadAppointments = async () => {
    const filters = doctorProfile?._id ? { doctor: doctorProfile._id } : {};
    const data = await fetchAppointments(filters);
    setAppointments(data || []);
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

  const mappedPatientForModal = useMemo(() => {
    if (!selectedAppointment?.patient) {
      return null;
    }

    const patient = selectedAppointment.patient;
    const noteParts = String(selectedAppointment.notes || "")
      .split("|")
      .map((part) => part.trim());
    const getValue = (label) =>
      noteParts.find((part) => part.toLowerCase().startsWith(`${label.toLowerCase()}:`))
        ?.split(":")
        .slice(1)
        .join(":")
        .trim() || "";

    return {
      id: patient._id,
      name: `${patient.firstName || ""} ${patient.lastName || ""}`.trim(),
      age: getValue("Age") || "Not provided",
      gender: getValue("Gender") || patient.gender || "Not provided",
      bloodGroup: getValue("Blood Group") || "Not provided",
      phone: getValue("Phone") || patient.phone || "Not provided",
      email: patient.email || "Not provided"
    };
  }, [selectedAppointment]);

  const fallbackAppointments = useMemo(() => buildFallbackAppointments(authUser), [authUser]);

  const filteredAppointments = useMemo(() => {
    const doctorId = String(doctorProfile?._id || "");
    const authEmail = String(authUser?.email || "").trim().toLowerCase();
    const authFullName = normalizeName(
      [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") || authUser?.name || ""
    );

    const matches = appointments.filter((appointment) => {
      const appointmentDoctorId = String(appointment.doctor?._id || appointment.doctor || "");
      const doctorEmail = String(appointment.doctor?.email || "").trim().toLowerCase();
      const doctorName = normalizeName(appointment.doctor?.fullName || "");

      if (doctorId && appointmentDoctorId && doctorId === appointmentDoctorId) {
        return true;
      }

      if (authEmail && doctorEmail && authEmail === doctorEmail) {
        return true;
      }

      if (authFullName && doctorName && authFullName === doctorName) {
        return true;
      }

      return false;
    });

    return matches.length > 0 ? matches : fallbackAppointments;
  }, [appointments, authUser, doctorProfile?._id, fallbackAppointments]);

  const dashboardStats = useMemo(() => {
    const today = new Date();
    const isSameDay = (value) => {
      const date = new Date(value);
      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    };

    const upcomingCount = filteredAppointments.filter(
      (appointment) => String(appointment.status || "").toLowerCase() !== "cancelled"
    ).length;
    const completedCount = filteredAppointments.filter(
      (appointment) => String(appointment.status || "").toLowerCase() === "confirmed"
    ).length;
    const patientCount = new Set(
      filteredAppointments.map((appointment) => appointment.patient?._id || appointment.patient?.email || appointment._id)
    ).size;
    const todayCount = filteredAppointments.filter((appointment) => isSameDay(appointment.appointmentDate)).length;

    return [
      { label: "Appointments Today", value: todayCount, icon: "calendar" },
      { label: "Upcoming patients this week", value: upcomingCount, icon: "group" },
      { label: "Completed This Week", value: completedCount, icon: "done" },
      { label: "Total Patients", value: patientCount, icon: "patients" }
    ];
  }, [filteredAppointments]);

  const visibleAppointments = filteredAppointments.slice(0, 3);

  const handleStatusChange = async (appointment, nextStatus) => {
    setBusyId(appointment._id);
    setFeedback("");

    try {
      if (String(appointment._id).startsWith("demo-appointment-")) {
        setAppointments((current) =>
          current.length === 0
            ? [{ ...appointment, status: nextStatus }]
            : current.map((item) =>
                item._id === appointment._id ? { ...item, status: nextStatus } : item
              )
        );
        setFeedback("Demo appointment status updated in the view.");
        return;
      }

      const response = await updateAppointment(appointment._id, {
        patient: appointment.patient?._id || appointment.patient,
        doctor: appointment.doctor?._id || appointment.doctor,
        department: appointment.department?._id || appointment.department,
        appointmentDate: appointment.appointmentDate,
        reason: appointment.reason,
        notes: appointment.notes,
        status: nextStatus,
        respondedByRole: "doctor"
      });

      await loadAppointments();
      setFeedback(response.message || "Appointment status updated successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  const handleCancelAppointment = (appointment) => {
    handleStatusChange(appointment, "cancelled");
  };

  const handleRescheduleAppointment = async (appointment) => {
    const nextDate = window.prompt(
      "Enter new appointment date (YYYY-MM-DD)",
      formatIsoDate(appointment.appointmentDate)
    );
    if (!nextDate) {
      return;
    }

    const nextTime = window.prompt(
      "Enter new appointment time (HH:MM)",
      formatTimeInput(appointment.appointmentDate)
    );
    if (!nextTime) {
      return;
    }

    const updatedDate = new Date(`${nextDate}T${nextTime}:00`);
    if (Number.isNaN(updatedDate.getTime())) {
      setFeedback("Please enter a valid date and time.");
      return;
    }

    setBusyId(appointment._id);
    setFeedback("");

    try {
      if (String(appointment._id).startsWith("demo-appointment-")) {
        setAppointments((current) =>
          current.length === 0
            ? [{ ...appointment, appointmentDate: updatedDate.toISOString() }]
            : current.map((item) =>
                item._id === appointment._id
                  ? { ...item, appointmentDate: updatedDate.toISOString() }
                  : item
              )
        );
        setFeedback("Demo appointment rescheduled in the view.");
        return;
      }

      const response = await updateAppointment(appointment._id, {
        patient: appointment.patient?._id || appointment.patient,
        doctor: appointment.doctor?._id || appointment.doctor,
        department: appointment.department?._id || appointment.department,
        appointmentDate: updatedDate.toISOString(),
        reason: appointment.reason,
        notes: appointment.notes,
        status: appointment.status || "pending",
        respondedByRole: "doctor"
      });

      await loadAppointments();
      setFeedback(response.message || "Appointment rescheduled successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
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
                    <h4>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </h4>
                    <p>{appointment.reason || "General consultation"}</p>
                    <span>
                      {formatIsoDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                    </span>
                  </div>
                </div>

                <div className="doctor-appointment-card__actions">
                  <button
                    type="button"
                    className="doctor-card-action doctor-card-action--reschedule"
                    onClick={() => handleRescheduleAppointment(appointment)}
                    disabled={busyId === appointment._id}
                  >
                    <span className="doctor-card-action__icon" aria-hidden="true">+</span>
                    {busyId === appointment._id ? "Working..." : "Reschedule"}
                  </button>

                  <button
                    type="button"
                    className="doctor-card-action doctor-card-action--cancel"
                    onClick={() => handleCancelAppointment(appointment)}
                    disabled={busyId === appointment._id}
                  >
                    <span className="doctor-card-action__icon" aria-hidden="true">x</span>
                    {busyId === appointment._id ? "Working..." : "Cancel"}
                  </button>

                  <button
                    type="button"
                    className="doctor-card-action doctor-card-action--view"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="doctor-empty-cell">No appointments available.</div>
        )}
      </div>

      {mappedPatientForModal ? (
        <PatientDetailsModal patient={mappedPatientForModal} onClose={() => setSelectedAppointment(null)} />
      ) : null}
    </div>
  );
};

export default DoctorAppointmentsView;
