import React from "react";

const DoctorAppointmentsView = () => {
  const appointments = [
    { id: "APT-1001", patient: "Prasanna Raj Kunwar", date: "2024-05-10", time: "10:30 AM", status: "Confirmed" },
    { id: "APT-1002", patient: "Ansu Basnet", date: "2024-05-11", time: "02:00 PM", status: "Pending" },
    { id: "APT-1003", patient: "Mira Ghimire", date: "2024-05-12", time: "09:15 AM", status: "Cancelled" },
    { id: "APT-1004", patient: "Subashna Maskey", date: "2024-05-12", time: "11:45 AM", status: "Confirmed" },
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return '#10b981'; // Green
      case 'pending': return '#f59e0b'; // Orange/Yellow
      case 'cancelled': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div className="patients-view">
      <h2 className="doctor-view-title">My Appointments</h2>
      
      <div className="patients-table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td style={{ fontWeight: "500", color: "#6b7280" }}>{apt.id}</td>
                <td style={{ fontWeight: "600", color: "#1f2937" }}>{apt.patient}</td>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>
                  <span style={{ 
                    color: getStatusColor(apt.status),
                    background: `${getStatusColor(apt.status)}20`,
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}>
                    {apt.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-view" style={{ background: "#0ea5e9" }}>View</button>
                  {apt.status === "Pending" && (
                    <button className="btn-view" style={{ background: "#10b981", marginLeft: "8px" }}>Accept</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointmentsView;
