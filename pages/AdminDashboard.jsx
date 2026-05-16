import React, { useState } from "react";
import DashboardView from "../components/admin/DashboardView";
import DepartmentsView from "../components/admin/DepartmentsView";
import ManageDoctorsView from "../components/admin/ManageDoctorsView";
import AppointmentsView from "../components/admin/AppointmentsView";
import "../components/admin/admin.css";

const AdminDashboard = ({ authUser, onLogout, onBack }) => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const adminName =
    `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim() ||
    authUser?.name ||
    "Admin User";

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardView />;
      case "Manage Doctors":
        return <ManageDoctorsView />;
      case "Departments":
        return <DepartmentsView />;
      case "Appointments":
        return <AppointmentsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="admin-dashboard-shell">
      <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-user">
            <span className="admin-sidebar-user__eyebrow">Administrator</span>
            <strong className="admin-sidebar-user__name">{adminName}</strong>
          </div>
          <p className="admin-sidebar-subtitle">Manage doctors, appointments, and day-to-day updates.</p>
        </div>
        
        <nav className="admin-nav-menu">
          <button 
            className={`admin-nav-item ${activeMenu === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveMenu("Dashboard")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </button>
          <button 
            className={`admin-nav-item ${activeMenu === "Manage Doctors" ? "active" : ""}`}
            onClick={() => setActiveMenu("Manage Doctors")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Manage Doctors
          </button>
          <button 
            className={`admin-nav-item ${activeMenu === "Departments" ? "active" : ""}`}
            onClick={() => setActiveMenu("Departments")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
            Departments
          </button>
          <button 
            className={`admin-nav-item ${activeMenu === "Appointments" ? "active" : ""}`}
            onClick={() => setActiveMenu("Appointments")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Appointments
          </button>
        </nav>
      </aside>

      <main className="admin-main-content">

        {renderContent()}
      </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
