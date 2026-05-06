import React, { useState } from "react";
import { AddAvailabilityModal } from "./DoctorModals";

const AvailabilityView = () => {
  const [showModal, setShowModal] = useState(false);
  const schedule = [
    {
      id: 1,
      day: "Monday",
      slots: [
        { time: "09:00 AM - 12:00 PM", status: "Available" },
        { time: "01:00 PM - 03:00 PM", status: "Available" }
      ]
    },
    {
      id: 2,
      day: "Tuesday",
      slots: [
        { time: "09:00 AM - 12:00 PM", status: "Available" },
        { time: "01:00 PM - 03:00 PM", status: "Available" }
      ]
    },
    {
      id: 3,
      day: "Wednesday",
      slots: [
        { time: "09:00 AM - 12:00 PM", status: "Available" },
        { time: "01:00 PM - 03:00 PM", status: "Available" }
      ]
    },
    {
      id: 4,
      day: "Thursday",
      slots: [
        { time: "09:00 AM - 12:00 PM", status: "Available" },
        { time: "01:00 PM - 03:00 PM", status: "Unavailable" }
      ]
    }
  ];

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
              <span className="availability-edit">Edit</span>
            </div>
            
            <div className="availability-slots">
              {day.slots.map((slot, idx) => (
                <div key={idx} className="availability-slot">
                  <span className="availability-time">{slot.time}</span>
                  <span className={`availability-pill ${slot.status.toLowerCase()}`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddAvailabilityModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AvailabilityView;
