import React, { useEffect, useMemo, useState } from "react";

const weekdayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const formatDateInput = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const formatTimeInput = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const formatFeedbackDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const formatAppointmentMoment = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const emptyFeedbackDraft = {
  diagnosis: "",
  remarks: "",
  prescription: ""
};

export const AddAvailabilityModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "12:00"
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!form.day || !form.startTime || !form.endTime) {
      return;
    }

    onSave?.(form);
    onClose?.();
  };

  return (
    <div className="logout-dialog" role="presentation">
      <div className="logout-dialog__panel doctor-form-dialog" role="dialog" aria-modal="true">
        <div className="doctor-form-dialog__header">
          <div>
            <p className="logout-dialog__eyebrow">Doctor availability</p>
            <h2>Add Availability</h2>
          </div>
          <button type="button" className="doctor-form-dialog__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="doctor-form-dialog__fields">
          <label className="doctor-form-dialog__field">
            <span>Day</span>
            <select value={form.day} onChange={(event) => updateField("day", event.target.value)}>
              {weekdayOptions.map((weekday) => (
                <option key={weekday} value={weekday}>
                  {weekday}
                </option>
              ))}
            </select>
          </label>

          <label className="doctor-form-dialog__field">
            <span>Start Time</span>
            <input
              type="time"
              value={form.startTime}
              onChange={(event) => updateField("startTime", event.target.value)}
            />
          </label>

          <label className="doctor-form-dialog__field">
            <span>End Time</span>
            <input
              type="time"
              value={form.endTime}
              onChange={(event) => updateField("endTime", event.target.value)}
            />
          </label>
        </div>

        <div className="logout-dialog__actions">
          <button type="button" className="logout-dialog__cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="logout-dialog__confirm logout-dialog__confirm--neutral" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const RescheduleAppointmentModal = ({
  appointment,
  busy = false,
  errorMessage = "",
  onClose,
  onSave
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setDate(formatDateInput(appointment?.appointmentDate));
    setTime(formatTimeInput(appointment?.appointmentDate));
  }, [appointment?.appointmentDate, appointment?._id]);

  if (!appointment) {
    return null;
  }

  const patientName = `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`.trim() || "Patient";

  return (
    <div className="logout-dialog" role="presentation">
      <div className="logout-dialog__panel doctor-form-dialog" role="dialog" aria-modal="true">
        <div className="doctor-form-dialog__header">
          <div>
            <p className="logout-dialog__eyebrow">Appointment update</p>
            <h2>Reschedule Appointment</h2>
          </div>
          <button type="button" className="doctor-form-dialog__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="doctor-form-dialog__summary">
          <strong>Patient:</strong> {patientName}
        </div>

        <div className="doctor-form-dialog__fields doctor-form-dialog__fields--split">
          <label className="doctor-form-dialog__field">
            <span>New Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>

          <label className="doctor-form-dialog__field">
            <span>New Time</span>
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          </label>
        </div>

        {errorMessage ? <p className="logout-dialog__error">{errorMessage}</p> : null}

        <div className="logout-dialog__actions">
          <button type="button" className="logout-dialog__cancel" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className="logout-dialog__confirm logout-dialog__confirm--neutral"
            onClick={() => onSave?.({ date, time })}
            disabled={busy}
          >
            {busy ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const PatientDetailsModal = ({
  onClose,
  patient,
  onSaveFeedback,
  feedbackBusy = false,
  feedbackError = "",
  feedbackSuccess = "",
  initialAppointmentId = ""
}) => {
  const [activeFeedbackAppointmentId, setActiveFeedbackAppointmentId] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState(emptyFeedbackDraft);

  useEffect(() => {
    setActiveFeedbackAppointmentId("");
    setFeedbackDraft(emptyFeedbackDraft);
  }, [patient?.id, initialAppointmentId]);

  const historyItems = useMemo(
    () => (Array.isArray(patient?.history) ? patient.history : []),
    [patient?.history]
  );

  if (!patient) {
    return null;
  }

  const openFeedbackComposer = (appointmentId) => {
    setActiveFeedbackAppointmentId(String(appointmentId));
    setFeedbackDraft(emptyFeedbackDraft);
  };

  const handleSaveFeedback = async () => {
    if (!activeFeedbackAppointmentId || !onSaveFeedback) {
      return;
    }

    const didSave = await onSaveFeedback(activeFeedbackAppointmentId, feedbackDraft);

    if (didSave !== false) {
      setActiveFeedbackAppointmentId("");
      setFeedbackDraft(emptyFeedbackDraft);
    }
  };

  return (
    <div className="logout-dialog" role="presentation">
      <div className="logout-dialog__panel doctor-form-dialog doctor-form-dialog--wide" role="dialog" aria-modal="true">
        <div className="doctor-form-dialog__header">
          <div>
            <p className="logout-dialog__eyebrow">Patient record</p>
            <h2>Patient Details</h2>
          </div>
          <button type="button" className="doctor-form-dialog__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="doctor-patient-summary">
          <div>
            <span>Name</span>
            <strong>{patient.name}</strong>
          </div>
          <div>
            <span>Age</span>
            <strong>{patient.age}</strong>
          </div>
          <div>
            <span>Gender</span>
            <strong>{patient.gender}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>{patient.phone}</strong>
          </div>
          <div className="doctor-patient-summary__item doctor-patient-summary__item--email">
            <span>Email</span>
            <strong>{patient.email}</strong>
          </div>
          <div className="doctor-patient-summary__item doctor-patient-summary__item--blood">
            <span>Blood Group</span>
            <strong>{patient.bloodGroup}</strong>
          </div>
        </div>

        <div className="doctor-patient-history__header doctor-patient-history__header--actions">
          <h3>Visit History ({historyItems.length})</h3>
          {historyItems.length > 0 ? (
            <button
              type="button"
              className="doctor-card-action doctor-card-action--reschedule"
              onClick={() => openFeedbackComposer(initialAppointmentId || historyItems[0]?.appointmentId)}
            >
              + Add Feedback
            </button>
          ) : null}
        </div>

        {feedbackError ? <p className="logout-dialog__error">{feedbackError}</p> : null}
        {feedbackSuccess ? <p className="doctor-modal-success">{feedbackSuccess}</p> : null}

        <div className="doctor-patient-history">
          {historyItems.map((entry) => {
            const isComposerOpen = String(activeFeedbackAppointmentId) === String(entry.appointmentId);

            return (
              <article key={`${entry.appointmentId}-${entry.visitLabel}`} className="doctor-history-card">
                <div className="doctor-history-card__header">
                  <div>
                    <p>{formatAppointmentMoment(entry.appointmentDate)}</p>
                    <h4>{entry.visitLabel}</h4>
                  </div>
                  <span className={`doctor-status doctor-status--${entry.status}`}>
                    {entry.status}
                  </span>
                </div>

                <div className="doctor-history-card__meta">
                  <span><strong>Doctor:</strong> {entry.doctorName}</span>
                  <span><strong>Patient:</strong> {entry.patientName}</span>
                </div>

                <div className="doctor-history-card__section">
                  <span>Reason / Diagnosis</span>
                  <p>{entry.diagnosis}</p>
                </div>

                <div className="doctor-history-card__section">
                  <span>Appointment Notes</span>
                  <p>{entry.remarks}</p>
                </div>

                <div className="doctor-history-card__feedback-head">
                  <strong>Feedback Entries ({entry.feedbackEntries.length})</strong>
                </div>

                {entry.feedbackEntries.length > 0 ? (
                  <div className="doctor-history-feedback-list">
                    {entry.feedbackEntries.map((feedbackEntry) => (
                      <div key={feedbackEntry._id || feedbackEntry.createdAt} className="doctor-history-feedback-item">
                        <div className="doctor-history-feedback-item__meta">
                          <span>{formatFeedbackDate(feedbackEntry.createdAt)}</span>
                        </div>
                        <p><strong>Diagnosis:</strong> {feedbackEntry.diagnosis}</p>
                        <p><strong>Remarks:</strong> {feedbackEntry.remarks || "No remarks added."}</p>
                        <p><strong>Prescription:</strong> {feedbackEntry.prescription || "Prescription not added yet."}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="doctor-history-card__empty">No feedback has been added for this visit yet.</p>
                )}

                {isComposerOpen ? (
                  <div className="doctor-history-feedback-form">
                    <label className="doctor-form-dialog__field">
                      <span>Diagnosis</span>
                      <input
                        value={feedbackDraft.diagnosis}
                        onChange={(event) =>
                          setFeedbackDraft((current) => ({
                            ...current,
                            diagnosis: event.target.value
                          }))
                        }
                        placeholder="Enter diagnosis"
                      />
                    </label>

                    <label className="doctor-form-dialog__field">
                      <span>Remarks</span>
                      <textarea
                        rows="3"
                        value={feedbackDraft.remarks}
                        onChange={(event) =>
                          setFeedbackDraft((current) => ({
                            ...current,
                            remarks: event.target.value
                          }))
                        }
                        placeholder="Add clinical remarks or observations"
                      />
                    </label>

                    <label className="doctor-form-dialog__field">
                      <span>Prescription</span>
                      <textarea
                        rows="3"
                        value={feedbackDraft.prescription}
                        onChange={(event) =>
                          setFeedbackDraft((current) => ({
                            ...current,
                            prescription: event.target.value
                          }))
                        }
                        placeholder="Add medicine or treatment guidance"
                      />
                    </label>

                    <div className="doctor-history-feedback-form__actions">
                      <button
                        type="button"
                        className="logout-dialog__cancel"
                        onClick={() => {
                          setActiveFeedbackAppointmentId("");
                          setFeedbackDraft(emptyFeedbackDraft);
                        }}
                        disabled={feedbackBusy}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="logout-dialog__confirm logout-dialog__confirm--neutral"
                        onClick={handleSaveFeedback}
                        disabled={feedbackBusy}
                      >
                        {feedbackBusy ? "Saving..." : "Save Feedback"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
