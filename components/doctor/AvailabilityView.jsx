import React, { useState } from "react";
import { AddAvailabilityModal } from "./DoctorModals";

const initialSchedule = [
  {
    id: 1,
    day: "Monday",
    slots: [
      { id: "mon-1", time: "09:00 AM - 12:00 PM", status: "Available" },
      { id: "mon-2", time: "01:00 PM - 03:00 PM", status: "Available" }
    ]
  },
  {
    id: 2,
    day: "Tuesday",
    slots: [
      { id: "tue-1", time: "09:00 AM - 12:00 PM", status: "Available" },
      { id: "tue-2", time: "01:00 PM - 03:00 PM", status: "Available" }
    ]
  },
  {
    id: 3,
    day: "Wednesday",
    slots: [
      { id: "wed-1", time: "09:00 AM - 12:00 PM", status: "Available" },
      { id: "wed-2", time: "01:00 PM - 03:00 PM", status: "Available" }
    ]
  },
  {
    id: 4,
    day: "Thursday",
    slots: [
      { id: "thu-1", time: "09:00 AM - 12:00 PM", status: "Available" },
      { id: "thu-2", time: "01:00 PM - 03:00 PM", status: "Unavailable" }
    ]
  }
];

const AvailabilityView = () => {
  const [showModal, setShowModal] = useState(false);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [editingDayId, setEditingDayId] = useState(null);

  const addAvailabilitySlot = ({ day, startTime, endTime }) => {
    const timeLabel = `${startTime} - ${endTime}`;

    setSchedule((current) => {
      const existingDay = current.find((item) => item.day === day);

      if (existingDay) {
        return current.map((item) =>
          item.day === day
            ? {
                ...item,
                slots: [
                  ...item.slots,
                  {
                    id: `${day.toLowerCase()}-${Date.now()}`,
                    time: timeLabel,
                    status: "Available"
                  }
                ]
              }
            : item
        );
      }

      return [
        ...current,
        {
          id: Date.now(),
          day,
          slots: [
            {
              id: `${day.toLowerCase()}-${Date.now()}`,
              time: timeLabel,
              status: "Available"
            }
          ]
        }
      ];
    });
  };

  const handleStatusChange = (dayId, slotId, nextStatus) => {
    setSchedule((current) =>
      current.map((day) =>
        day.id === dayId
          ? {
              ...day,
              slots: day.slots.map((slot) =>
                slot.id === slotId ? { ...slot, status: nextStatus } : slot
              )
            }
          : day
      )
    );
  };

  return (
    <div className="availability-view">
      <div className="doctor-header-row">
        <h2 className="doctor-view-title" style={{ marginBottom: 0 }}>Set Availability</h2>
        <button className="doctor-btn-primary" onClick={() => setShowModal(true)}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Availability
        </button>
      </div>

      <div className="availability-grid">
        {schedule.map((day) => (
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
              {day.slots.map((slot) => (
                <div key={slot.id} className="availability-slot">
                  <span className="availability-time">{slot.time}</span>
                  {editingDayId === day.id ? (
                    <select
                      className="doctor-status-select"
                      value={slot.status}
                      onChange={(event) => handleStatusChange(day.id, slot.id, event.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  ) : (
                    <span className={`availability-pill ${slot.status.toLowerCase()}`}>
                      {slot.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddAvailabilityModal onClose={() => setShowModal(false)} onSave={addAvailabilitySlot} />}
    </div>
  );
};

export default AvailabilityView;
