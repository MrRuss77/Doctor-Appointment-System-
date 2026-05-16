import React, { useEffect, useState } from "react";
import AvailabilityView from "../components/doctor/AvailabilityView";
import PatientsView from "../components/doctor/PatientsView";
import DoctorAppointmentsView from "../components/doctor/DoctorAppointmentsView";
import { fetchDoctors } from "../src/api/client";
import "../components/doctor/doctor.css";

const fallbackDoctorIdentity = {
  name: "Doctor",
  specialty: "Specialist",
  availability: "Schedule not updated",
  image: ""
};

const getNextAvailableSlot = (slots = []) => {
  const nextSlot = slots
    .filter((slot) => slot?.isAvailable !== false && slot?.date && slot?.startTime)
    .map((slot) => {
      const dateTime = new Date(`${slot.date}T${slot.startTime}:00`);
      return {
        ...slot,
        dateTime
      };
    })
    .filter((slot) => !Number.isNaN(slot.dateTime.getTime()))
    .sort((first, second) => first.dateTime - second.dateTime)[0];

  if (!nextSlot) {
    return "";
  }

  return `Next slot: ${nextSlot.startTime} on ${nextSlot.date}`;
};

const DoctorDashboard = ({ authUser, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState("Appointments");
  const [doctorProfile, setDoctorProfile] = useState(null);
  const derivedDoctorName =
    [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") ||
    authUser?.name ||
    "";
  const doctorName = doctorProfile?.fullName || derivedDoctorName || fallbackDoctorIdentity.name;
  const normalizedAuthUserId = String(authUser?._id || authUser?.id || "");
  const normalizedDoctorName = doctorName.replace(/^Dr\.\s*/i, "").trim().toLowerCase();
  const normalizedDoctorEmail = authUser?.email?.trim().toLowerCase() || "";
  const doctorSpecialty =
    doctorProfile?.department?.name ||
    doctorProfile?.specialization ||
    authUser?.specialization ||
    authUser?.department?.name ||
    authUser?.department ||
    fallbackDoctorIdentity.specialty;
  const doctorAvailability =
    getNextAvailableSlot(doctorProfile?.availabilitySlots) ||
    doctorProfile?.availabilityText ||
    fallbackDoctorIdentity.availability;
  const doctorImage = doctorProfile?.image || fallbackDoctorIdentity.image;

  useEffect(() => {
    let isActive = true;

    const loadDoctorProfile = async () => {
      try {
        const doctors = await fetchDoctors();

        if (!isActive || !Array.isArray(doctors)) {
          return;
        }

        const matchedDoctor = doctors.find((doctor) => {
          const doctorUserId = String(doctor.user?._id || doctor.user || "");
          const doctorEmail = doctor.email?.trim().toLowerCase();
          const doctorFullName = doctor.fullName?.trim().toLowerCase();

          if (normalizedAuthUserId && doctorUserId) {
            return doctorUserId === normalizedAuthUserId;
          }

          if (normalizedDoctorEmail && doctorEmail) {
            return doctorEmail === normalizedDoctorEmail;
          }

          return doctorFullName === normalizedDoctorName;
        });

        if (matchedDoctor) {
          setDoctorProfile(matchedDoctor);
        }
      } catch (_error) {
        if (isActive) {
          setDoctorProfile(null);
        }
      }
    };

    loadDoctorProfile();

    return () => {
      isActive = false;
    };
  }, [normalizedAuthUserId, normalizedDoctorEmail, normalizedDoctorName]);

  const renderContent = () => {
    switch (activeMenu) {
      case "Appointments":
        return <DoctorAppointmentsView authUser={authUser} doctorProfile={doctorProfile} />;
      case "Availability":
        return <AvailabilityView authUser={authUser} doctorProfile={doctorProfile} />;
      case "Patients":
        return <PatientsView authUser={authUser} doctorProfile={doctorProfile} />;
      default:
        return <DoctorAppointmentsView authUser={authUser} doctorProfile={doctorProfile} />;
    }
  };

  return (
    <div className="admin-dashboard-shell">
      <div className="admin-page">
        <aside className="admin-sidebar">
          <div className="doctor-workspace-header">
            <span className="doctor-workspace-title">DOCTOR WORKSPACE</span>
            <h1 className="doctor-panel-title">Doctor Panel</h1>
          </div>

          <div className="doctor-profile-sidebar">
            <div className="doctor-profile-card">
              {doctorImage ? (
                <img
                  className="doctor-profile-card__image"
                  src={doctorImage}
                  alt={doctorName}
                />
              ) : (
                <div className="doctor-profile-card__image doctor-profile-card__image--placeholder" aria-hidden="true">
                  {doctorName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="doctor-profile-card__body">
                <span className="name">{doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}</span>
                <span className="specialty">{doctorSpecialty}</span>
                <span className="availability">{doctorAvailability}</span>
              </div>
            </div>
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
          </nav>
        </aside>

        <main className="admin-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
