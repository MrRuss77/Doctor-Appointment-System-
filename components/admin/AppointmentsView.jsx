import React from "react";

const AppointmentsView = () => {
  const appointments = [
    { id: "APT-1001", patient: "Prasanna Raj Kunwar", doctor: "Dr. Suman Adhikari", date: "2024-05-10", time: "10:30 AM", status: "confirmed" },
    { id: "APT-1002", patient: "Ansu Basnet", doctor: "Dr. Kiran Thapa", date: "2024-05-11", time: "02:00 PM", status: "pending" },
    { id: "APT-1003", patient: "Mira Ghimire", doctor: "Dr. Rajesh Sharma", date: "2024-05-12", time: "09:15 AM", status: "cancelled" },
    { id: "APT-1004", patient: "Subashna Maskey", doctor: "Dr. Aavash Shrestha", date: "2024-05-12", time: "11:45 AM", status: "confirmed" },
  ];

  const getStatusPill = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="status-pill confirmed">Confirmed</span>;
      case "pending":
        return <span className="status-pill pending">Pending</span>;
      case "cancelled":
        return <span className="status-pill grey" style={{ background: '#fca5a5', color: '#991b1b' }}>Cancelled</span>;
      default:
        return <span className="status-pill grey">{status}</span>;
    }
  };

  return (
    <div className="manage-appointments-view">
      <h2 className="admin-view-title">Appointments</h2>
      
      <div className="manage-list-card">
        <div className="manage-list-header">
          <div className="col-name font-bold">Patient Name</div>
          <div className="col-specialty font-bold">Doctor</div>
          <div className="col-patients font-bold">Date & Time</div>
          <div className="col-name font-bold">Status</div>
          <div className="col-actions text-right">
            <button className="admin-btn-pill blue">Export</button>
          </div>
        </div>
        
        <div className="manage-list-body">
          {appointments.map((apt) => (
            <div key={apt.id} className="manage-list-row">
              <div className="col-name">
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{apt.patient}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.id}</div>
              </div>
              <div className="col-specialty">{apt.doctor}</div>
              <div className="col-patients">
                <div>{apt.date}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{apt.time}</div>
              </div>
              <div className="col-name">
                {getStatusPill(apt.status)}
              </div>
              <div className="col-actions flex-end gap-10">
                {apt.status === "pending" && (
                  <button className="admin-btn-pill green">Approve</button>
                )}
                <button className="admin-btn-pill red">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsView;
