import React from "react";

const DashboardView = () => {
  const activities = [
    { id: 1, text: "John Smith - Dr. Suman Adhikari", time: "2026-04-08 at 10:00 PM", status: "Confirmed" },
    { id: 2, text: "John Smith - Dr. Suman Adhikari", time: "2026-04-08 at 10:00 PM", status: "Confirmed" },
    { id: 3, text: "John Smith - Dr. Suman Adhikari", time: "2026-04-08 at 10:00 PM", status: "Pending" },
  ];

  const doctorsOnDuty = [
    { id: 1, name: "Dr. Kiran Thapa", specialty: "Cardiology", room: "Room - 02" }
  ];

  return (
    <>
      <h2 className="admin-view-title">Dashboard Overview</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-info">
            <span>Total Doctors</span>
            <strong>24</strong>
          </div>
          <div className="stat-icon">👥</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Appointments Today</span>
            <strong>24</strong>
          </div>
          <div className="stat-icon">📅</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Departments</span>
            <strong>24</strong>
          </div>
          <div className="stat-icon">🏥</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Total Patients</span>
            <strong>24</strong>
          </div>
          <div className="stat-icon">🧑‍⚕️</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {activities.map((act) => (
            <div key={act.id} className="activity-item">
              <div className="activity-details">
                <strong>{act.text}</strong>
                <span>{act.time}</span>
              </div>
              <div className={`status-pill ${act.status.toLowerCase()}`}>
                {act.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Doctors on Duty</h3>
        <div className="activity-list">
          {doctorsOnDuty.map((doc) => (
            <div key={doc.id} className="activity-item">
              <div className="activity-details">
                <strong>{doc.name}</strong>
                <span>{doc.specialty}</span>
              </div>
              <div className="status-pill grey">
                {doc.room}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardView;
