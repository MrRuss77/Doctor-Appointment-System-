import React, { useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Departments from "./Departments";
import LoginCard from "../components/auth/LoginCard";
import OtpCard from "../components/auth/OtpCard";
import ResetPasswordCard from "../components/auth/ResetPasswordCard";

const doctorData = [
  {
    name: "Dr. Taufiq Wani",
    field: "Anesthesiology",
    specialization: "Chief Consultant Anaesthesiologist",
    qualification: "MBBS, MD (Anaesthesia), Fellowship in Critical Care",
    availability: "Available for consultation today",
    image: "img/IMG_6482.jpg"
  },
  {
    name: "Dr. Arya Dev Rijal",
    field: "Cardiology",
    specialization: "Interventional Cardiologist and Heart Specialist",
    qualification: "MBBS, MD (Internal Medicine), DM Cardiology",
    availability: "Next slot: 4:30 PM",
    image: "img/IMG_6481.jpg"
  },
  {
    name: "Dr. Russ Karki",
    field: "Neurology",
    specialization: "Senior Consultant in Brain and Nerve Disorders",
    qualification: "MBBS, MD, Fellowship in Clinical Neurology",
    availability: "Available tomorrow morning",
    image: "img/IMG_6439.jpg"
  },
  {
    name: "Dr. Subashna Maskey",
    field: "Pediatrics",
    specialization: "Child Health Specialist and Neonatal Care Expert",
    qualification: "MBBS, MD Pediatrics, NICU Certification",
    availability: "Accepting new patients",
    image: "img/FullSizeRender.jpg"
  }
];

const pageContent = {
  home: {
    eyebrow: "Healthcare that feels approachable",
    title: "Hospital experiences built around trust and speed.",
    description:
      "This landing state is ready for hero content, quick actions, and featured services while keeping the same responsive shell."
  },
  doctors: {
    eyebrow: "Our Specialists",
    title: "Meet the doctors behind the care.",
    description:
      "Browse a clean, responsive doctor directory with clickable tabs and room to expand into booking or profile details."
  },
  departments: {
    eyebrow: "",
    title: "",
    description: ""
  },
  login: {
    eyebrow: "Secure Access",
    title: "Login",
    description:
      "Use the screens below for login, password reset, and OTP verification."
  }
};

const Doctors = ({ activePage }) => {
  const [loginView, setLoginView] = useState("login");
  const [authMessage, setAuthMessage] = useState("");
  const currentPage = pageContent[activePage] || pageContent.doctors;
  const showDoctors = activePage === "doctors";
  const showLogin = activePage === "login";
  const showDepartments = activePage === "departments";

  const clearStatus = () => {
    setAuthMessage("");
  };

  const loginCardBody = {
    login: (
      <LoginCard
        onForgotPassword={() => {
          clearStatus();
          setLoginView("reset");
        }}
        onRegister={() => {
          clearStatus();
          setAuthMessage("Register screen is not added yet. Use reset for now.");
          setLoginView("reset");
        }}
        onLogin={() => setAuthMessage("Login button clicked. Connect this to your backend when ready.")}
        onBack={() => {
          clearStatus();
          setLoginView("login");
        }}
      />
    ),
    reset: (
      <ResetPasswordCard
        onBackToLogin={() => {
          clearStatus();
          setLoginView("login");
        }}
        onReset={() => {
          setAuthMessage("Reset submitted. Please enter the OTP code.");
          setLoginView("otp");
        }}
        onBack={() => {
          clearStatus();
          setLoginView("login");
        }}
      />
    ),
    otp: (
      <OtpCard
        onResendCode={() => setAuthMessage("A new OTP code has been sent.")}
        onSubmitOtp={() => setAuthMessage("OTP submitted successfully.")}
        onBack={() => {
          clearStatus();
          setLoginView("reset");
        }}
      />
    )
  };

  return (
    <section className={`page-section ${showDepartments ? "departments-page" : ""}`}>
      <div
        className="page-copy"
        style={
          showLogin
            ? { paddingBottom: 0, maxWidth: "480px", margin: "0 auto", width: "100%", textAlign: "center" }
            : showDepartments
              ? { display: "none" }
              : undefined
        }
      >
        <p className="page-copy__eyebrow">{currentPage.eyebrow}</p>
        <h1>{currentPage.title}</h1>
        <p className="page-copy__description">{currentPage.description}</p>
      </div>

      {showDoctors ? (
        <div className="doctor-grid">
          {doctorData.map((doc) => (
            <DoctorCard key={doc.name} doctor={doc} />
          ))}
        </div>
      ) : showLogin ? (
        <div
          className="placeholder-panel auth-panel"
          style={{
            maxWidth: "480px",
            width: "100%",
            margin: "0 auto",
            background: "#dcdcdc",
            padding: "36px 30px",
            minHeight: loginView === "otp" ? "430px" : "560px"
          }}
        >
          {loginCardBody[loginView]}
          {authMessage ? (
            <p className="auth-card__message" style={{ margin: "16px 0 0", textAlign: "center", fontSize: "12px", color: "#1d4ed8" }}>
              {authMessage}
            </p>
          ) : null}
        </div>
      ) : showDepartments ? (
        <Departments />
      ) : (
        <div className="placeholder-panel">
          <h2>{currentPage.eyebrow}</h2>
          <p>
            This section is intentionally interactive already, so you can keep
            building page-by-page without reworking the navigation later.
          </p>
        </div>
      )}
    </section>
  );
};

export default Doctors;
