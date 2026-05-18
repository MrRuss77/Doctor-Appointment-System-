import React, { useEffect, useMemo, useState } from "react";
import {
  addDoctorAvailability,
  deleteDoctorAvailabilitySlot,
  fetchDoctorAvailability,
  updateDoctorAvailabilitySlot
} from "../../src/api/client";
import { AddAvailabilityModal } from "./DoctorModals";
import ConfirmDialog from "../ConfirmDialog";

const AvailabilityDropdown = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className={`admin-status-dropdown ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`} 
      onClick={() => !disabled && setIsOpen(!isOpen)} 
      style={{ minWidth: '120px', background: 'white' }}
    >
      <div className="custom-dropdown-trigger">
        {value}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {["Available", "Unavailable"].map((status) => (
            <div 
              key={status} 
              className={`custom-dropdown-item ${status === value ? "selected" : ""}`} 
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  onChange(status);
                  setIsOpen(false);
                }
              }}
            >
              {status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const getWeekdayLabel = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString(undefined, { weekday: "long" });
};

const getNextDateForWeekday = (weekdayName) => {
  const targetIndex = weekdayOrder.indexOf(weekdayName);
  const today = new Date();
  const currentIndex = (today.getDay() + 6) % 7;
  let offset = targetIndex - currentIndex;

  if (offset < 0) {
    offset += 7;
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + offset);

  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, "0");
  const day = String(nextDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTimeLabel = (timeValue) => {
  const [hours, minutes] = String(timeValue || "").split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeValue || "No time";
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${String(normalizedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const groupSlots = (slots = []) => {
  const grouped = slots.reduce((accumulator, slot) => {
    const weekday = getWeekdayLabel(slot.date);

    if (!accumulator.has(weekday)) {
      accumulator.set(weekday, []);
    }

    accumulator.get(weekday).push({
      ...slot,
      time: `${formatTimeLabel(slot.startTime)} - ${formatTimeLabel(slot.endTime)}`,
      status: slot.isAvailable === false ? "Unavailable" : "Available"
    });

    return accumulator;
  }, new Map());

  return Array.from(grouped.entries())
    .sort((left, right) => weekdayOrder.indexOf(left[0]) - weekdayOrder.indexOf(right[0]))
    .map(([day, daySlots]) => ({
      id: day,
      day,
      slots: daySlots.sort((first, second) => first.startTime.localeCompare(second.startTime))
    }));
};

const AvailabilityView = ({ doctorProfile }) => {
  const [showModal, setShowModal] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [editingDayId, setEditingDayId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState("");

  const doctorId = doctorProfile?._id || "";

  const loadAvailability = async () => {
    if (!doctorId) {
      setSchedule([]);
      return;
    }

    const response = await fetchDoctorAvailability(doctorId);
    setSchedule(groupSlots(response.slots || []));
  };

  useEffect(() => {
    loadAvailability().catch((error) => setFeedback(error.message));
  }, [doctorId]);

  const flattenedSlots = useMemo(
    () => schedule.flatMap((day) => day.slots.map((slot) => ({ ...slot, day: day.day }))),
    [schedule]
  );

  const addAvailabilitySlot = async ({ day, startTime, endTime }) => {
    if (!doctorId) {
      setFeedback("Doctor profile is not linked yet.");
      return;
    }

    setBusyId(`create-${day}`);
    setFeedback("");

    try {
      const response = await addDoctorAvailability(doctorId, {
        date: getNextDateForWeekday(day),
        startTime,
        endTime,
        isAvailable: true
      });

      setFeedback(response.message || "Availability added successfully.");
      await loadAvailability();
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  const handleStatusChange = async (slotId, nextStatus) => {
    if (!doctorId) {
      setFeedback("Doctor profile is not linked yet.");
      return;
    }

    const slot = flattenedSlots.find((item) => item._id === slotId || item.id === slotId);

    if (!slot) {
      setFeedback("Availability slot not found.");
      return;
    }

    setBusyId(slotId);
    setFeedback("");

    try {
      const response = await updateDoctorAvailabilitySlot(doctorId, slotId, {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: nextStatus === "Available",
        note: slot.note || ""
      });

      setFeedback(response.message || "Availability updated successfully.");
      await loadAvailability();
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  const closeDeleteDialog = () => {
    if (busyId) {
      return;
    }

    setDeleteTarget("");
  };

  const handleDeleteSlot = async () => {
    if (!doctorId) {
      setFeedback("Doctor profile is not linked yet.");
      return;
    }

    if (!deleteTarget) {
      return;
    }

    setBusyId(deleteTarget);
    setFeedback("");

    try {
      const response = await deleteDoctorAvailabilitySlot(doctorId, deleteTarget);
      setFeedback(response.message || "Availability removed successfully.");
      setDeleteTarget("");
      await loadAvailability();
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="availability-view">
      <div className="doctor-header-row" style={{ marginBottom: "24px" }}>
        <h2 className="doctor-view-title" style={{ marginBottom: 0 }}>Set Availability</h2>
        <button className="doctor-btn-primary" onClick={() => setShowModal(true)} disabled={!doctorId}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Availability
        </button>
      </div>

      {feedback ? <p className="doctor-feedback" style={{ display: "block" }}>{feedback}</p> : null}

      <div className="availability-grid">
        {schedule.length > 0 ? (
          schedule.map((day) => (
            <div key={day.id} className="availability-card">
              <div className="availability-card-header">
                <h3>{day.day}</h3>
                <button
                  type="button"
                  className="availability-edit-button"
                  onClick={() => setEditingDayId((current) => (current === day.id ? null : day.id))}
                >
                  {editingDayId === day.id ? "Done" : "Edit"}
                </button>
              </div>

              <div className="availability-slots">
                {day.slots.map((slot) => {
                  const slotId = slot._id || slot.id;
                  const isBusy = busyId === slotId;

                  return (
                    <div key={slotId} className="availability-slot">
                      <span className="availability-time">{slot.time}</span>
                      {editingDayId === day.id ? (
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <AvailabilityDropdown
                            value={slot.status}
                            onChange={(nextStatus) => handleStatusChange(slotId, nextStatus)}
                            disabled={isBusy}
                          />
                          <button
                            type="button"
                            className="doctor-card-action doctor-card-action--cancel"
                            onClick={() => setDeleteTarget(slotId)}
                            disabled={isBusy}
                          >
                            {isBusy ? "Working..." : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <span className={`availability-pill ${slot.status.toLowerCase()}`}>
                          {slot.status}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="doctor-empty-cell">No availability slots added yet.</div>
        )}
      </div>

      {showModal ? (
        <AddAvailabilityModal
          onClose={() => setShowModal(false)}
          onSave={addAvailabilitySlot}
          busy={Boolean(busyId)}
        />
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        eyebrow="Availability slot"
        title="Delete this slot?"
        message="This will remove the selected availability slot from the doctor's schedule."
        confirmLabel="Delete Slot"
        cancelLabel="Cancel"
        confirmTone="danger"
        onCancel={closeDeleteDialog}
        onConfirm={handleDeleteSlot}
        busy={busyId === deleteTarget}
      />
    </div>
  );
};

export default AvailabilityView;
