import React, { useState } from "react";
import AvailabilityView from "../components/doctor/AvailabilityView";
import PatientsView from "../components/doctor/PatientsView";
import DoctorAppointmentsView from "../components/doctor/DoctorAppointmentsView";
import "../components/doctor/doctor.css";

const DoctorDashboard = ({ onLogout, onBack }) => {
  const [activeMenu, setActiveMenu] = useState("Availability");

  const renderContent = () => {
    switch (activeMenu) {
      case "Appointments":
        return <DoctorAppointmentsView />;
      case "Availability":
        return <AvailabilityView />;
      case "Patients":
        return <PatientsView />;
      default:
        return <AvailabilityView />;
    }
  };

  return (
    <div className="doctor-page">
      <aside className="doctor-sidebar">
        <div className="doctor-profile-sidebar">
          <h2>Doctor Panel</h2>
          <span className="name">Dr. Sarah Johnson</span>
          <span className="specialty">Cardiologist</span>
        </div>
        
        <nav className="doctor-nav-menu">
          <button 
            className={`doctor-nav-item ${activeMenu === "Appointments" ? "active" : ""}`}
            onClick={() => setActiveMenu("Appointments")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Appointments
          </button>

          <button 
            className={`doctor-nav-item ${activeMenu === "Availability" ? "active" : ""}`}
            onClick={() => setActiveMenu("Availability")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Availability
          </button>

          <button 
            className={`doctor-nav-item ${activeMenu === "Patients" ? "active" : ""}`}
            onClick={() => setActiveMenu("Patients")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            Patients
          </button>

          <button 
            className="doctor-nav-item doctor-logout"
            onClick={onLogout}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </nav>
      </aside>

      <main className="doctor-main-content">
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={onBack} 
            className="page-copy__back"
            aria-label="Go back"
            style={{ margin: 0 }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default DoctorDashboard;
